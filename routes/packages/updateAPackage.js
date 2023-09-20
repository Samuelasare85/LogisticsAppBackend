const router = require('express').Router();
const isAuthenticated = require('../../middlewares/auth');
const { validateUpdatePackage } = require('../../helpers/validations/package/validatePackage');
const prisma = require('../../middlewares/prisma');
const { setRedisData } = require('../../redis');
const {calculateItemCharge, calculateTaxCharge, locationDecoder, calculateDistance, calculateDeliveryCharge} = require('../../helpers/itemCharges');
const scheduleDelivery = require('../../helpers/deliveryCheck');

router.patch('/:id', isAuthenticated , async(req, res) => {
    try {
        await validateUpdatePackage(req.body); 
    } catch(error) {
        return res.status(400).json({
            status : 'error',
            error : error?.errors[0]
        });
    }

    const trackExists = await prisma.package.findFirst({
        where : {
            tracking_number : req.params.id
        }
    });
    if (!trackExists) return res.status(400).json({
        status: 'error',
        error: 'Tracking number does not exists, please try again'
    });
    
    const originAddress = await locationDecoder(req.body.origin_address ? req.body.origin_address : trackExists.origin_address, res);
    if(!originAddress.latitude && !originAddress.longitude) {
        return res.status(400).json({ 
            status: 'error',
            error : 'Origin address does not exist. Please try again.'
        });
    }

    const destinationAddress = await locationDecoder(req.body.destination_address ? req.body.destination_address : trackExists.destination_address, res);
    if(!destinationAddress.latitude && !destinationAddress.longitude) {
        return res.status(400).json({ 
            status: 'error',
            error : 'Destination address does not exist. Please try again.'
        });
    }

    const distance = calculateDistance(originAddress?.latitude, destinationAddress?.latitude, originAddress?.longitude, destinationAddress?.longitude);
    const deliveryDateChange = req.body.delivery_date ? req.body.delivery_date : trackExists.delivery_date;
    const deliveryTypeChange = req.body.delivery_date ? req.body.delivery_type : trackExists.delivery_type;
    const delivery_date = scheduleDelivery(deliveryDateChange , deliveryTypeChange, distance, res);
    req.body.delivery_date = delivery_date;
    req.body.user_id = req.user.id;
    req.body.items_charge = calculateItemCharge(req.body.items_weight ? req.body.items_weight : trackExists.items_weight);
    req.body.tax_charges = calculateTaxCharge(req.body.items_charge ? req.body.items_charge : trackExists.items_charge);
    req.body.delivery_charges = calculateDeliveryCharge(distance);
    
    await prisma.package.update({
        where :{
            tracking_number: req.params.id,
        },
        data : req.body
    })
    .then(async(package_created) => {
        await setRedisData('package/' + package_created.id, package_created);

        return res.json({
        status: 'success',
        pacakge: package_created
        });
    })
    .catch((error) => res.status(400).json({ 
        status: 'error',
        error : error
    }));
});

module.exports = router; 