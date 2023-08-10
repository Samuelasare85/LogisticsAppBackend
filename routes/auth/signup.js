const router = require('express').Router();
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const _ = require('lodash');
const moment = require('moment');
const { validateSignUp } = require('../../validations/auth/validateAuth');
require('dotenv').config();

const prisma = new PrismaClient();

/* eslint-disable no-undef */
const saltRounds = parseInt(process.env.SALT_ROUNDS);
/* eslint-enable no-undef */

router.post('', async (req, res) => {
    try {
        await validateSignUp(req.body);
    } catch (error) {
        return res.status(400).json({
            status : 'error',
            error : error.errors[0]
        });
    }

    let user = await prisma.user.findUnique({
        where: {
            'email_address': req.body.email_address,
        },
    });
    if (user) return res.status(409).json({
        status : 'error',
        error : 'User already exists'
        });

    let password = '';

    await bcrypt
    .hash(req.body.password, saltRounds)
    .then((hash) => (password = hash));

    await prisma.user.create({
        data : {
            full_name: req.body.full_name,
            email_address: req.body.email_address,
            phone_number: req.body.phone_number,
            password: password,
            created_at: moment.utc(moment()).toISOString(),
        }})
        .then((user) => res.json({
            status: 'success', 
            user: _.pick(user, ['id', 'full_name', 'phone_number', 
        'created_at', 'is_active', 'role'])}))
        .catch((error) => res.status(400).json(
            {
                status: 'error',
                error : error
            }
        ));
});

module.exports = router;