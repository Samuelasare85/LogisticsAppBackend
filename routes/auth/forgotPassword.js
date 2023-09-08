const router = require('express').Router();
const prisma = require('../../middlewares/prisma');
const crypto = require('crypto');
const moment = require('moment');


router.patch('/:id', async(req, res) => {
    await prisma.user.findUnique({
        where: {
        id: req.params.id
        }
    })
    .then(async(user) => {
        const resetToken = createPasswordResetToken();
        await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                password_reset_token: crypto.createHash('sha256').update(resetToken).digest('hex'),
                password_reset_expires:  moment.utc(moment()).add(10, 'minutes')
            }
        })
        .then(() => res.json({
            status: 'success',
            resetToken: resetToken
        }))
        .catch(() => res.status(404).json({
            status: 'error',
            error: 'User does not exist'
        }));
    })
    .catch(() => res.status(404).json({
        status: 'error',
        error: 'User does not exist'
    }));
});

function createPasswordResetToken() {
    const resetToken = crypto.randomBytes(32).toString('hex');
    return resetToken;
  }

module.exports = router;
