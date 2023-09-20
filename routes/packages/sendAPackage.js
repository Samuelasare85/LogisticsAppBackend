const router = require('express').Router();
const isAuthenticated = require('../../middlewares/auth');
const { validatePackage } = require('../../helpers/validations/package/validatePackage');
const prisma = require('../../middlewares/prisma');
const {calculateItemCharge, calculateTaxCharge, locationDecoder, calculateDistance, calculateDeliveryCharge} = require('../../helpers/itemCharges');
const { setRedisData } = require('../../redis');
const scheduleDelivery = require('../../helpers/deliveryCheck');

router.post('', isAuthenticated , async(req, res) => {
    try {
        await validatePackage(req.body); 
    } catch(error) {
        return res.status(400).json({
            status : 'error',
            error : error?.errors[0]
        });
    }

    const trackExists = await prisma.package.findFirst({
        where : {
            tracking_number : req.body.tracking_number
        }
    });
    if (trackExists) return res.status(400).json({
        status: 'error',
        error: 'Tracking number already exists, rename and try again'
    });

    
    const originAddress = await locationDecoder(req.body.origin_address, res);
    const destinationAddress = await locationDecoder(req.body.destination_address, res);
    const distance = calculateDistance(originAddress.latitude, destinationAddress.latitude, originAddress.longitude, destinationAddress.longitude);
    const delivery_date = scheduleDelivery(req.body.delivery_date, req.body.delivery_type, distance, res);
    req.body.delivery_date = delivery_date;
    req.body.user_id = req.user.id;
    req.body.items_charge = calculateItemCharge(req.body.items_weight);
    req.body.tax_charges = calculateTaxCharge(req.body.items_charge);
    req.body.delivery_charges = calculateDeliveryCharge(distance);

    await prisma.package.create({
        data : req.body,
    })
    .then(async(package_created) => {
        package_created.package_total = package_created.items_charge + package_created.tax_charges + package_created.delivery_charges;
        await setRedisData('package/' + package_created.id, package_created);
        return res.json({
        status: 'success',
        package: package_created
        });
    })
    .catch((error) => res.status(400).json({ 
        status: 'error',
        error : error
    }));
});

module.exports = router; 