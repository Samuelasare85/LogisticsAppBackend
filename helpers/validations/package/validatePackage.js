const { object, string, number } = require('yup');
const htmlSanitizer = require('../../../middlewares/sanitizeHtml');

async function validatePackage(package_item) {
    let packageObject = object({
      origin_address: string()
      .max(75)
      .trim()
      .transform((_, originalValue) => htmlSanitizer(originalValue))
      .required('Origin address is required'),
      origin_state: string()
      .trim()
      .transform((_, originalValue) => htmlSanitizer(originalValue))
      .required('Origin state is required'),
      origin_phone_number: string()
      .min(10)
      .max(15)
      .transform((_, originalValue) => htmlSanitizer(originalValue)),
      destination_address: string()
      .max(75)
      .trim()
      .transform((_, originalValue) => htmlSanitizer(originalValue))
      .required('Destination address is required'),
      destination_state: string()
      .trim()
      .transform((_, originalValue) => htmlSanitizer(originalValue))
      .required('Destination state is required'),
      destination_phone_number: string()
      .min(10)
      .transform((_, originalValue) => htmlSanitizer(originalValue))
      .max(15),
      items: string()
      .trim()
      .transform((_, originalValue) => htmlSanitizer(originalValue))
      .required('Items are required'),
      items_weight: number()
      .required('Items weight is required'),
      items_worth: number()
      .required('Items worth is required'),
      delivery_type: string()
      .transform((_, originalValue) => htmlSanitizer(originalValue))
      .trim()
      .required('Delivery type is required'),
      delivery_date: string()
      .transform((_, originalValue) => htmlSanitizer(originalValue))
      .trim()
      .required('Delivery date is required'),
      tracking_number: string()
      .trim()
       .min(16)
       .transform((_, originalValue) => htmlSanitizer(originalValue))
       .max(50)
      .required('Tracking number is required')
    });
    return await packageObject.validate(package_item);
  }


async function validateUpdatePackage(package_item) {
    let packageObject = object({
      origin_address: string()
      .max(75)
      .transform((_, originalValue) => htmlSanitizer(originalValue))
      .trim(),
      origin_state: string()
      .transform((_, originalValue) => htmlSanitizer(originalValue))
      .trim(),
      origin_phone_number: string()
      .transform((_, originalValue) => htmlSanitizer(originalValue))
      .min(10)
      .max(15),
      destination_address: string()
      .transform((_, originalValue) => htmlSanitizer(originalValue))
      .max(75)
      .trim(),
      destination_state: string()
      .transform((_, originalValue) => htmlSanitizer(originalValue))
      .trim(),
      destination_phone_number: string()
      .transform((_, originalValue) => htmlSanitizer(originalValue))
      .min(10)
      .max(15),
      items: string()
      .transform((_, originalValue) => htmlSanitizer(originalValue))
      .trim(),
      items_weight: number(),
      items_worth: number(),
      delivery_type: string()
      .transform((_, originalValue) => htmlSanitizer(originalValue))
      .trim(),
      delivery_date: string()
      .transform((_, originalValue) => htmlSanitizer(originalValue))
      .trim()
    });
    return await packageObject.validate(package_item);
}

module.exports = {
    validatePackage,
    validateUpdatePackage
};