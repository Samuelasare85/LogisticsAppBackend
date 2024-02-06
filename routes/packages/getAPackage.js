const router = require('express').Router();
const prisma = require('../../middlewares/prisma');
const { getRedisData, setRedisData } = require('../../redis/index');
const isAuthenticated = require('../../middlewares/auth');


router.get('/:id', isAuthenticated,  async(req, res) => {
    const package_exist = await getRedisData('package/' + req.params.id);
    if (package_exist) return res.json({
            status: 'success', 
            package: package_exist});

    await prisma.package.findFirst({
        where : {
            tracking_number : req.params.id
        },
        cacheStrategy: {
            ttl: 60,
            swr: 10
        }
    })
    .then(async(package_exist) => {
        await setRedisData('package/' + req.params.id, package_exist);
    
    return res.json({
        status: 'success',  
        package: package_exist});
    })
    .catch(() => {
        res.status(404).json({
            status : 'error',
            error : 'Package does not exist'
            });
    });
    
});

module.exports = router;