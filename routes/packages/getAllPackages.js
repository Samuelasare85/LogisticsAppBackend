const router = require('express').Router();
const prisma = require('../../middlewares/prisma');
const { getRedisData, setRedisData } = require('../../redis/index');
const isAuthenticated = require('../../middlewares/auth');


router.get('', isAuthenticated,  async(req, res) => {
    if (req.user.role === 'Admin') {
        const packages = await getRedisData('all-packages');
        if (packages) return res.json({
                status: 'success', 
                packages: packages});

        await prisma.package.findMany({
            cacheStrategy: {
                ttl: 60,
                swr: 10
            }
        })
        .then(async(packages) => {
            await setRedisData('all-packages', packages);
        
        return res.json({
            status: 'success',  
            packages: packages});
        })
        .catch((error) => {
            res.status(404).json({
                status : 'error',
                error : error
                });
        });
    }else {
        return res.status(400).json({
            status: 'error',
            error: 'Not authorized'
        });
    }
});

module.exports = router;