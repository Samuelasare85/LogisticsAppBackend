const {AES, enc} = require('crypto-ts');
require('dotenv').config();
/* eslint-disable no-undef */
const CRYPTO_KEY = process.env.CRYPTO_KEY;
/* eslint-enable no-undef */

// encryption
function Encrypt(text) {
    return AES.encrypt(text, CRYPTO_KEY).toString();
}

// decryption
function Decrypt(text) {
    return AES.decrypt(text, CRYPTO_KEY).toString(enc.Utf8);
}


const encodeUrlPath = (id) => {
    return encodeURIComponent(Encrypt(id));
};

const decodeUrlPath = (encodedUrl) => {
    return Decrypt(decodeURIComponent(encodedUrl));
  };
  
module.exports = {
    encodeUrlPath,
    decodeUrlPath
};