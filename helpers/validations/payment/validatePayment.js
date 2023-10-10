const { object, boolean } = require('yup');


async function validatePayment(package_item) {
    let packageObject = object({
        payment_made: boolean()
      .required('Payment made is required'),
    });
    return await packageObject.validate(package_item);
  }

module.exports = {
    validatePayment
};