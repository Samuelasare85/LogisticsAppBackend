const router = require('express').Router();
const prisma = require('../../middlewares/prisma');
const { validateUpdate } = require('../../helpers/validations/auth/validateAuth');
const _ = require('lodash');
const { setRedisData, deleteRedisData } = require('../../redis/index');
const sendMail = require('../../utils/sendMail');

/* eslint-disable no-undef */
router.patch('/:id', async(req, res) => {
    try{
        await validateUpdate(req.body);
    } catch (error) {
        return res.status(400).json({
            status : 'error',
            error : error?.errors[0]
        });
    }
    try {
        const user_exists = await prisma.user.findUnique({
            where: {
                id: req.params.id
            }
        });

        if (!user_exists) {
            return res.status(400).json({
                status : 'error',
                error : 'User does not exist'
            });
        }
    } catch (error) {
        return res.status(400).json({
            status : 'error',
            error : 'User does not exist'
        });
    }


    const user = await prisma.user.findUnique({
        where : {
            email_address : req.body.email_address
        }
    });

    if (user) return res.status(404).json({
        status : 'error',
        error : 'User with this email address already exists'
        });

    await prisma.user.update({
        where: {
            id: req.params.id
        },
        data : {
            full_name: req.body.full_name ?? user.full_name,
            phone_number: req.body.phone_number ?? user.phone_number,
            email_address: req.body.email_address ?? user.email_address,
            profile_image: req.body.profile_image ?? user.profile_image
        }
    })
    .then(async(user) => {
        await setRedisData('user/' + user.id, _.pick(user, ['id', 'full_name','profile_image', 'phone_number', 
        'created_at', 'is_active', 'role']));

        await deleteRedisData('all-users');

        try {
            const details = {
                from: process.env.SOURCE_EMAIL,
                to: user.email_address,
                subject : 'User details update😉',
                full_name: user.full_name,
                instruction: 'Your details were successfully updated',
                emailFile: 'signUpTemplate.ejs'
            };
            sendMail(details);
        } catch (error) {
            return res.status(400).json(
                {
                    status: 'error',
                    error : error
                });
        }

        return res.json({
        status: 'success', 
        user: _.pick(user, ['id', 'full_name', 'profile_image',  'email_address', 'phone_number', 
    'created_at', 'is_active', 'role'])});
})
    .catch((error) => res.status(400).json(
        {
            status: 'error',
            error : error
        }
    ));

});

/* eslint-enable no-undef */

module.exports = router;