const { object, string } = require('yup');


async function validateSignUp(user) {
    let userObject = object({
      full_name: string()
      .min(5)
      .max(75)
      .trim()
      .required('Full Name is required'),
      phone_number: string()
      .min(10)
      .max(15)
      .required('Phone Number is required'),
      email_address: string()
        .min(5)
        .max(255)
        .required('Email Address is required')
        .trim()
        .lowercase()
        .email(),
      password: string()
        .min(5)
        .max(1024)
        .required('Password is required'),
    });
  
    return await userObject.validate(user);
  }

  async function validateLogin(user) {
    let userObject = object({
      email_address: string()
        .min(5)
        .max(255)
        .required('Email Address is required')
        .trim()
        .lowercase()
        .email(),
      password: string()
        .min(5)
        .max(1024)
        .required('Password is required'),
    });
  
    return await userObject.validate(user);
  }

  async function validateUpdate(user) {
    let userObject = object({
      full_name: string()
      .min(5)
      .max(75)
      .trim(),
      phone_number: string()
      .min(10)
      .max(15) ,
      email_address: string()
        .min(5)
        .max(255)
        .trim()
        .lowercase()
        .email()
    });
  
    return await userObject.validate(user);
  }

  async function validateChangePassword(user) {
    let userObject = object({
      oldPassword: string()
        .min(5)
        .max(1024)
        .required('Old Password is required'),
      newPassword: string()
        .min(5)
        .max(1024)
        .required('New Password is required'),
    });
  
    return await userObject.validate(user);
  }

  async function validatePassword(user) {
    let userObject = object({
      password: string()
        .min(5)
        .max(1024)
        .required('Password is required')
    });
  
    return await userObject.validate(user);
  }

module.exports = {
    validateSignUp,
    validateLogin,
    validateUpdate,
    validateChangePassword,
    validatePassword
};