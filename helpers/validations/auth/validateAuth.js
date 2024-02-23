const { object, string } = require('yup');
const htmlSanitizer = require('../../../middlewares/sanitizeHtml');


async function validateSignUp(user) {
  let userObject = object({
    full_name: string()
      .min(2)
      .max(75)
      .trim()
      .required('Full Name is required')
      .transform((_, originalValue) => htmlSanitizer(originalValue)),
    phone_number: string()
      .min(10)
      .max(15)
      .required('Phone Number is required')
      .transform((_, originalValue) => htmlSanitizer(originalValue)),
    email_address: string()
      .min(5)
      .max(255)
      .required('Email Address is required')
      .trim()
      .lowercase()
      .email()
      .transform((_, originalValue) => htmlSanitizer(originalValue)),
    password: string()
      .min(5)
      .max(1024)
      .required('Password is required')
      .transform((_, originalValue) => htmlSanitizer(originalValue))
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
        .email()
        .transform((_, originalValue) => htmlSanitizer(originalValue)),
      password: string()
        .min(5)
        .max(1024)
        .required('Password is required')
        .transform((_, originalValue) => htmlSanitizer(originalValue)),
    });
  
    return await userObject.validate(user);
  }

  async function validateUpdate(user) {
    let userObject = object({
      full_name: string()
      .min(5)
      .max(75)
      .trim()
      .transform((_, originalValue) => htmlSanitizer(originalValue)),
      phone_number: string()
      .min(10)
      .max(15)
      .transform((_, originalValue) => htmlSanitizer(originalValue)),
      email_address: string()
        .min(5)
        .max(255)
        .trim()
        .lowercase()
        .email()
        .transform((_, originalValue) => htmlSanitizer(originalValue))
    });
  
    return await userObject.validate(user);
  }

  async function validateChangePassword(user) {
    let userObject = object({
      oldPassword: string()
        .min(5)
        .max(1024)
        .required('Old Password is required')
        .transform((_, originalValue) => htmlSanitizer(originalValue)),
      newPassword: string()
        .min(5)
        .max(1024)
        .required('New Password is required')
        .transform((_, originalValue) => htmlSanitizer(originalValue))
    });
  
    return await userObject.validate(user);
  }

  async function validatePassword(user) {
    let userObject = object({
      password: string()
        .min(5)
        .max(1024)
        .required('Password is required')
        .transform((_, originalValue) => htmlSanitizer(originalValue))
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