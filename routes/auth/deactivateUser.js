const router = require('express').Router();
const isAuthenticated = require('../../middlewares/auth');
const prisma = require('../../middlewares/prisma');
require('dotenv').config();

router.patch('/:id', isAuthenticated, async (req, res) => {
    if (req.user.role === 'Admin') {
        const user = await prisma.user.findUnique({
            where : {
                id : req.params.id
            },
            cacheStrategy: {
                ttl: 60,
                swr: 10
            }
        });

        if (user.is_active === false ){
            return res.json({
                status : 'success',
                message : 'User is already deactivated'
            });
        }

        await prisma.user.update({
            where : {
                id : req.params.id
            },
            data : {
                is_active: false
            }
        })
        .then(() => {
            return res.json({
                status : 'success',
                message : 'User deactivated successfully'
            });
        })
        .catch(() => {
            return res.status(404).json({ 
                status : 'error',
                error : 'User does not exist'
            });
        });
    } else {
        return res.status(400).json({
            status: 'error',
            error: 'Not authorized'
        });
    }
});

module.exports = router;