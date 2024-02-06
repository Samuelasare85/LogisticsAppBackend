const router = require('express').Router();
const isAuthenticated = require('../../middlewares/auth');
const { validateUpdatePackage } = require('../../helpers/validations/package/validatePackage');
const prisma = require('../../middlewares/prisma');
const { setRedisData, deleteRedisData } = require('../../redis');
const {calculateItemCharge, calculateTaxCharge, locationDecoder, calculateDistance, calculateDeliveryCharge} = require('../../helpers/itemCharges');
const scheduleDelivery = require('../../helpers/deliveryCheck');
const sendMail = require('../../utils/sendMail');
const dateConverter = require('../../helpers/dateParser');

/* eslint-disable no-undef */
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
        },
        cacheStrategy: {
            ttl: 60,
            swr: 10
        }
    });
    if (!trackExists) return res.status(400).json({
        status: 'error',
        error: 'Package does not exists, please try again'
    });
    
    const originAddress = await locationDecoder(req.body.origin_address ? req.body.origin_address : trackExists.origin_address);
    if(!originAddress.latitude && !originAddress.longitude) {
        return res.status(400).json({ 
            status: 'error',
            error : 'Origin address does not exist. Please try again.'
        });
    }

    const destinationAddress = await locationDecoder(req.body.destination_address ? req.body.destination_address : trackExists.destination_address);
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
        data : req.body,
        include : {
            user : true
        }
    })
    .then(async(package_created) => {
        package_created.package_total = package_created.items_charge + package_created.tax_charges + package_created.delivery_charges;
        await setRedisData('package/' + package_created.tracking_number, package_created);
        await deleteRedisData('all-packages');

        try {
            const details = {
                from: process.env.SOURCE_EMAIL,
                to: package_created.user.email_address,
                subject : 'Package update successful😉',
                full_name: package_created.user.full_name,
                instruction: 'Package updated successfully and your package details are below:',
                delivery_date:  dateConverter(package_created.delivery_date),
                items_charge: 'GH₵' + package_created.items_charge,
                tax_charges : 'GH₵' + package_created.tax_charges,
                delivery_charges: 'GH₵' + package_created.delivery_charges,
                total_charges: 'GH₵' + package_created.package_total,
                emailFile: 'packageTemplate.ejs'
            };
            sendMail(details);
            delete package_created.user;
        } catch (error) {
            return res.status(400).json({
                status: 'error',
                error : error   
            });
        }

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

/* eslint-enable no-undef */

module.exports = router; 