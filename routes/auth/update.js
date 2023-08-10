const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const { validateUpdate } = ('../../validations/auth/validateAuth');
const _ = require('lodash');

const prisma = new PrismaClient();

router.put('/:id', async(req, res) => {
    try{
        await validateUpdate(req.body);
    } catch (error) {
        return res.status(400).json({
            status : 'error',
            error : error
        });
    }

    let user = await prisma.user.findUnique({
        id: req.params.id
    });

    if (!user) return res.status(404).json({
        status : 'error',
        error : 'User does not exist'
    });

    user = await prisma.user.findUnique({
        where : {
            email_address : req.body.email_address
        }
    });

    if (!user) return res.status(404).json({
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
            email_address: req.body.email_address ?? user.email_address
        }
    })
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