const router = require('express').Router();
const bcrypt = require('bcrypt');
const prisma = require('../../middlewares/prisma');
const sendMail = require('../../utils/sendMail');
const _ = require('lodash');
const moment = require('moment');
const { validateSignUp } = require('../../helpers/validations/auth/validateAuth');
const { setRedisData, deleteRedisData } = require('../../redis/index');
require('dotenv').config();

/* eslint-disable no-undef */
const saltRounds = parseInt(process.env.SALT_ROUNDS);


router.post('', async (req, res) => {
    try {
        await validateSignUp(req.body);
    } catch (error) {
        return res.status(400).json({
            status : 'error',
            error : error?.errors[0]
        });
    }
    
    let user = await prisma.user.findUnique({
        where: {
            'email_address': req.body.email_address,
        },
        cacheStrategy: {
            ttl: 60,
            swr: 10
        }
    });
    if (user) return res.status(409).json({
        status : 'error',
        error : 'User already exists. Please try again.'
        });

    let password = '';

    await bcrypt
    .hash(req.body.password, saltRounds)
    .then((hash) => (password = hash));
    
    try {
        const user = await prisma.user.create({
            data: {
                full_name: req.body.full_name,
                email_address: req.body.email_address,
                phone_number: req.body.phone_number,
                password: password,
                created_at: moment.utc(moment()).toISOString(),
            },
        });
    
        await setRedisData('user/' + user.id, _.pick(user, ['id', 'email_address', 'full_name', 'phone_number', 'created_at', 'is_active', 'role']));
        await deleteRedisData('all-users');
    
        const details = {
            from: process.env.SOURCE_EMAIL,
            to: user.email_address,
            subject: 'Welcome to Redi Express😉',
            full_name: user.full_name,
            instruction: 'We are excited to welcome you as a new user of our Logistics App. You have taken the first step towards streamlining your logistics management.',
            emailFile: 'signUpTemplate.ejs',
        };
        
        await sendMail(details);
    
        return res.json({
            status: 'success',
            user: _.pick(user, ['id', 'full_name', 'email_address', 'phone_number', 'created_at', 'is_active', 'role']),
        });
    } catch (error) {
    
        return res.status(400).json({
            status: 'error',
            error: error
        });
    }
        
});
/* eslint-enable no-undef */

module.exports = router;