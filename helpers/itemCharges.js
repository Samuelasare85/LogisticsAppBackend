const NodeGeocoder = require('node-geocoder');
function calculateItemCharge(weight) {
    const result = Math.ceil(weight * 2);
    return parseFloat(result.toFixed(1));
}

function calculateTaxCharge(charge) {
    const tax = Math.ceil(charge * .1);
    return parseFloat(tax.toFixed(1));
}

async function locationDecoder() {
    /* eslint-disable no-undef */
    const options = {
        provider: 'google',
        // fetch: customFetchImplementation,
        apiKey: process.env.API_KEY, 
        formatter: null 
      };
    /* eslint-enable no-undef */

    const geocoder = NodeGeocoder(options);

// Using callback
    const res = await geocoder.geocode('29 champs elysée paris');
    return res;
}

  

module.exports = {
    calculateItemCharge,
    calculateTaxCharge, 
    locationDecoder
};


