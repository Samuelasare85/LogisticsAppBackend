const router = require('express').Router();
const prisma = require('../../middlewares/prisma');
const _ = require('lodash');
const { getRedisData, setRedisData } = require('../../redis/index');
const isAuthenticated = require('../../middlewares/auth');


router.get('/:id', isAuthenticated,  async(req, res) => {
    let user = await getRedisData('user/' + req.params.id);
    if (user) return res.json({
            status: 'success', 
            user: _.pick(user, ['id', 'email_address', 'full_name', 'phone_number', 
        'created_at', 'is_active', 'role'])});

    await prisma.user.findUnique({
        where: {
            'id': req.params.id
        },
        cacheStrategy: {
            ttl: 60,
            swr: 10
        }
    })
    .then(async(user) => {
        await setRedisData('user/' + req.params.id, _.pick(user, ['id','email_address', 'full_name', 'phone_number', 
    'created_at', 'is_active', 'role']));
    
    return res.json({
        status: 'success',  
        user: _.pick(user, ['id','email_address', 'full_name', 'phone_number', 
    'created_at', 'is_active', 'role'])});
    })
    .catch(() => {
        res.status(404).json({
            status : 'error',
            error : 'User does not exist'
            });
    });
    
});

module.exports = router;