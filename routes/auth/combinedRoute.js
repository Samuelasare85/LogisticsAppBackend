const express = require('express');
const signup = require('./signup');
const login = require('./login');
const update = require('./update');
const changePassword = require('./changePassword');
const forgotPassword = require('./forgotPassword');
const resetPassword = require('./resetPassword');

const auth = express();

auth.use('/signup', signup);
auth.use('/login', login);
auth.use('/update', update);
auth.use('/change-password', changePassword);
auth.use('/forgot-password', forgotPassword);
auth.use('/reset-password', resetPassword);

module.exports = auth;
