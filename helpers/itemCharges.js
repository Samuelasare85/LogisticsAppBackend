const NodeGeocoder = require('node-geocoder');
const prisma = require('../middlewares/prisma');
require('dotenv').config();

function calculateItemCharge(weight) {
    const itemCharge = 30;
    if (weight <= 1) {
        return itemCharge;
    }
    const remainingWeight = weight - 1;
    return itemCharge + remainingWeight;
}

function calculateTaxCharge(charge) {
    const tax = Math.ceil(charge * .1);
    return parseFloat(tax.toFixed(1));
}
function calculateDeliveryCharge(distance) {
    const charge = Math.ceil(distance * .5);
    return parseFloat(charge.toFixed(1));
}

async function locationDecoder(address, res) {
    
    try {
        const foundAddress = await prisma.addressDetails.findFirst({
            where: {
                rawAddress: address
            }
        });

        if (foundAddress) {
            return foundAddress;
        }
    
    /* eslint-disable no-undef */
    const options = {
        provider: 'google',
        // fetch: customFetchImplementation,
        apiKey: process.env.API_KEY, 
        formatter: null 
      };
    /* eslint-enable no-undef */
    const geocoder = NodeGeocoder(options);

    await geocoder.geocode(address)
    .then(async(result) => { 
        await prisma.addressDetails.create ({
            data : {
                rawAddress: address,
                formattedAddress: result[0]?.formattedAddress,
                latitude: result[0]?.latitude,
                longitude: result[0]?.longitude,
                streetNumber: parseInt(result[0]?.streetNumber),
                streetName: result[0]?.streetName,
                city: result[0]?.city,
                countryCode: result[0]?.countryCode,
                zipcode: result[0]?.zipcode
            }
        })
        .then((result) => {
            return result;
        })
        .catch((error) => res.status(404).json({
            status: 'error',
            error: error 
        }));
    })
    .catch(error => res.status(404).json({
        status: 'error',
        error: error
    }))}
    catch (error) {
    res.status(404).json({
        status: 'error',
        error: error
    });}
}

function degreesToRadians(degrees) {
	return (degrees * Math.PI) / 180;
}


function calculateDistance(lat1, lng1, lat2, lng2) {
	const earthRadius = 6371.0; // Earth's average radius in kilometers
	const dLat = degreesToRadians(lat2 - lat1);
	const dLng = degreesToRadians(lng2 - lng1);
	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(degreesToRadians(lat1)) *
			Math.cos(degreesToRadians(lat2)) *
			Math.sin(dLng / 2) *
			Math.sin(dLng / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	const distance = earthRadius * c;
	return distance;
}
  

module.exports = {
    calculateItemCharge,
    calculateTaxCharge, 
    locationDecoder,
    calculateDistance,
    calculateDeliveryCharge
};


