const { object, string, number } = require('yup');


async function validatePackage(package_item) {
    let packageObject = object({
      origin_address: string()
      .max(75)
      .trim()
      .required('Origin address is required'),
      origin_state: string()
      .trim()
      .required('Origin state is required'),
      origin_phone_number: string()
      .min(10)
      .max(15),
      destination_address: string()
      .max(75)
      .trim()
      .required('Destination address is required'),
      destination_state: string()
      .trim()
      .required('Destination state is required'),
      destination_phone_number: string()
      .min(10)
      .max(15),
      items: string()
      .trim()
      .required('Items are required'),
      items_weight: number()
      .required('Items weight is required'),
      items_worth: number()
      .required('Items worth is required'),
      delivery_type: string()
      .trim()
      .required('Delivery type is required'),
      delivery_date: string()
      .trim()
      .required('Delivery type is required')
    });
  
    return await packageObject.validate(package_item);
}

module.exports = {
    validatePackage
};

