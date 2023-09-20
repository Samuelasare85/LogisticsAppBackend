const express = require('express');
const signup = require('./auth/signup');
const login = require('./auth/login');
const update = require('./auth/update');
const changePassword = require('./auth/changePassword');
const forgotPassword = require('./auth/forgotPassword');
const resetPassword = require('./auth/resetPassword');
const getaUser = require('./auth/getaUser');
const getAllUsers = require('./auth/getAllUsers');
const sendAPackage = require('./packages/sendAPackage');
const updateAPackage = require('./packages/updateAPackage');

const auth = express();
const send_package = express();

auth.use('/signup', signup);
auth.use('/login', login);
auth.use('/update', update);
auth.use('/change-password', changePassword);
auth.use('/forgot-password', forgotPassword);
auth.use('/reset-password', resetPassword);
auth.use('/get-a-user', getaUser);
auth.use('/get-all-users', getAllUsers);

send_package.use('/send-package', sendAPackage);
send_package.use('/update-package', updateAPackage);

module.exports = {
    auth, 
    send_package
};
