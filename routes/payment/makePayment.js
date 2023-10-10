const router = require('express').Router();
const prisma = require('../../middlewares/prisma');
const isAuthenticated = require('../../middlewares/auth');
const { validatePayment } = require('../../helpers/validations/payment/validatePayment');

router.put('/:id', isAuthenticated, async(req, res) => {
    try {
        await validatePayment(req.body); 
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
        error: 'Package does not exists, please try again'
    });
});

module.exports = router;