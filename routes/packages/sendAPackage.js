const router = require('express').Router();
const isAuthenticated = require('../../middlewares/auth');
const { validatePackage } = require('../../helpers/validations/package/validatePackage');
const prisma = require('../../middlewares/prisma');
const {calculateItemCharge, calculateTaxCharge, locationDecoder, calculateDistance, calculateDeliveryCharge} = require('../../helpers/itemCharges');
const { setRedisData, deleteRedisData } = require('../../redis');
const scheduleDelivery = require('../../helpers/deliveryCheck');
const sendMail = require('../../utils/sendMail');
const dateConverter = require('../../helpers/dateParser');

/* eslint-disable no-undef */
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

    try {
        const originAddress = await locationDecoder(req.body.origin_address);
        if(!originAddress.latitude && !originAddress.longitude) {
            return res.status(400).json({ 
                status: 'error',
                error : 'Origin address does not exist. Please try again.'
            });
        }

        const destinationAddress = await locationDecoder(req.body.destination_address);
        if(!destinationAddress.latitude && !destinationAddress.longitude) {
            return res.status(400).json({ 
                status: 'error',
                error : 'Destination address does not exist. Please try again.'
            });
        }

        const distance = calculateDistance(originAddress?.latitude, destinationAddress?.latitude, originAddress?.longitude, destinationAddress?.longitude);
        const delivery_date = scheduleDelivery(req.body.delivery_date, req.body.delivery_type, distance);
        req.body.delivery_date = delivery_date;
        req.body.user_id = req.user.id;
        req.body.items_charge = calculateItemCharge(req.body.items_weight);
        req.body.tax_charges = calculateTaxCharge(req.body.items_charge);
        req.body.delivery_charges = calculateDeliveryCharge(distance);

        const package_created = await prisma.package.create({
        data : req.body,
        include : {
            user : true
        }});
        package_created.package_total = package_created.items_charge + package_created.tax_charges + package_created.delivery_charges;
        await setRedisData('package/' + package_created.tracking_number, package_created);
        await deleteRedisData('all-packages');

        const details = {
            from: process.env.SOURCE_EMAIL,
            to: package_created.user.email_address,
            subject : 'Package creation successful😉',
            full_name: package_created.user.full_name,
            instruction: 'Package created successfully and your package details are below:',
            delivery_date: dateConverter(package_created.delivery_date),
            items_charge: 'GH₵' + package_created.items_charge,
            tax_charges : 'GH₵' + package_created.tax_charges,
            delivery_charges: 'GH₵' + package_created.delivery_charges,
            total_charges: 'GH₵' + package_created.package_total,
            emailFile: 'packageTemplate.ejs'
        };
        sendMail(details);
        delete package_created.user;
    
        return res.json({
            status: 'success',
            package: package_created
        });

    } catch (error) {
        return res.status(400).json({
            status: 'error',
            error : error   
        });
    }
});
/* eslint-enable no-undef */

module.exports = router; 