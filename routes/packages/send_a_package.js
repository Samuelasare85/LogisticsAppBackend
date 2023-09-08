const router = require('express').Router();
const isAuthenticated = require('../../middlewares/auth');
const { validatePackage } = require('../../helpers/validations/package/validatePackage');
const prisma = require('../../middlewares/prisma');
const {calculateItemCharge, calculateTaxCharge} = require('../../helpers/itemCharges');
const { setRedisData } = require('../../redis');

router.post('', isAuthenticated , async(req, res) => {
    try {
        await validatePackage(req.body); 
    } catch(error) {
        return res.status(400).json({
            status : 'error',
            error : error.errors
        });
    }

    trackExists = await prisma.

    const dateString = req.body.delivery_date;
    const dateObject = new Date(dateString);

    if (isNaN(dateObject)) {
        return res.status(400).json({
            status: 'error',
            error: 'Invalid date format'
        });
    }

    req.body.delivery_date = dateObject;
    req.body.user_id = req.user.id;
    req.body.items_charge = calculateItemCharge(req.body.items_weight);
    req.body.tax_charges = calculateTaxCharge(req.body.items_charge);
    req.body.delivery_charges = 2;

    await prisma.package.create({
        data : req.body,
    })
    .then(async(pacakge) => {
        await setRedisData('package/' + pacakge.id, pacakge);

        return res.json({
        status: 'success',
        pacakge: pacakge
        });
    })
    .catch((error) => res.status(400).json({ 
        status: 'error',
        error : error
    }));
});

module.exports = router; 