const { validateLogin } = require('../../helpers/validations/auth/validateAuth');
const prisma = require('../../middlewares/prisma');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const router = require('express').Router();
const jwt = require('jsonwebtoken');


router.post('', async (req, res) => {
    try{
        await validateLogin(req.body);
    } catch(error) {
        return res.status(400).json({
            status : 'error',
            error : error.errors[0]
        });
    }

    let user = await prisma.user.findUnique({
        where : {
            email_address : req.body.email_address
        }
    });

    if (!user) return res.status(404).json({
        status : 'error',
        error : 'User does not exist'
        });

    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) return res.status(400).json({
        status : 'error',
        error : 'Invalid credentials'
    });

    /* eslint-disable no-undef */
    const token = jwt.sign({
        id: user.id,
        role: user.role
    },
    process.env.JWT_SECRET,
    {expiresIn: process.env.JWT_EXPIRATION * 60* 1000} // 4 HOURS
    );

    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: process.env.JWT_EXPIRATION * 60* 1000
      });
     /* eslint-enable no-undef */

    return res.json({
        status: 'success',
        token: token,
        user: _.pick(user, ['id', 'full_name', 'phone_number', 
        'created_at', 'is_active', 'role'])
    });
});

module.exports = router;