const router = require('express').Router();
const prisma = require('../../middlewares/prisma');
const _ = require('lodash');
const { getRedisData, setRedisData } = require('../../redis/index');
const isAuthenticated = require('../../middlewares/auth');


router.get('', isAuthenticated,  async(req, res) => {
    if (req.user.role === 'Admin') {
        let users = await getRedisData('all-users');
        if (users) return res.json({
                status: 'success', 
                users: users
            });

        await prisma.user.findMany()
        .then(async(users) => {
            await setRedisData('all-users', users.map(user => _.pick(user, ['id', 'full_name', 'phone_number', 
        'created_at', 'is_active', 'role'])));
        
        return res.json({
            status: 'success',  
            users: users.map(user =>_.pick(user, ['id', 'full_name', 'phone_number', 
        'created_at', 'is_active', 'role']))});

        })
        .catch(() => {
            res.status(404).json({
                status : 'error',
                error : 'User does not exist'
            });
        });
    } else {
        return res.status(400).json({
            status: 'error',
            error: 'Cannot perform this action'
        });
    }
});

module.exports = router;