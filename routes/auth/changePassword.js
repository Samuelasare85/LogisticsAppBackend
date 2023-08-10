const { validateChangePassword } = require('../../validations/auth/validateAuth');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const router = require('express').Router();

const prisma = new PrismaClient();

const saltRounds = 10;

router.patch('/:id', async(req, res) => {
    try {
        await validateChangePassword(req.body);
    }
    catch (error) {
        return res.status(400).json({
            status : 'error',
            error : error.errors[0]
        });
    }

    const user = await prisma.user.findUnique({
        where: {
        id: req.params.id
        }
    });

    if (!user) return res.status(404).json({
        status : 'error',
        error : 'User does not exist'
        });
    
    if (req.body.newPassword === req.body.oldPassword) return res.status(400).json({ 
        status:  'error',
        error: 'Old and new password cannot be the same'
        });

    const match = await bcrypt.compare(req.body.oldPassword, user.password);
    if (!match) return res.status(400).json({
        status : 'error',
        error : 'Invalid old password'
    });

    let password = '';

    await bcrypt
    .hash(req.body.newPassword, saltRounds)
    .then((hash) => (password = hash));

    await prisma.user.update({
        where: {
            id: req.params.id,
        },
        data: {
            password: password
        }
    })
    .then(() => res.json({
        status: 'success',
        message: 'Password updated successfully'
    }))
    .catch((error) => res.status(400).json(
        {
            status: 'error',
            error : error
        }
    ));
});

module.exports = router;