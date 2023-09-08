const crypto = require('crypto');

function Encrypt(text) {
  const CRYPTO_KEY = 'snipersnevermisstheirtarget12345';
  const nonce = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(CRYPTO_KEY, 'utf8'), nonce);
  let ciphertext = cipher.update(text, 'utf8', 'base64');
  ciphertext += cipher.final('base64');
  const tag = cipher.getAuthTag().toString('base64');
  const encryptedBuffer = Buffer.concat([nonce, Buffer.from(ciphertext, 'base64'), Buffer.from(tag, 'base64')]);
  return encryptedBuffer.toString('base64');
}

function Decrypt(text) {
  const ciphertext = Buffer.from(text, 'base64');
  const nonce = ciphertext.slice(0, 12);
  const CRYPTO_KEY = 'snipersnevermisstheirtarget12345';
  const decipher = crypto.createDecipheriv('aes-256-gcm', Buffer.from(CRYPTO_KEY, 'utf8'), nonce);
  decipher.setAuthTag(Buffer.from(ciphertext.slice(-16), 'base64'));
  const decrypted = decipher.update(ciphertext.slice(12, -16).toString('base64'), 'base64', 'utf8');
  return decrypted + decipher.final('utf8');
}

// Example usage
// const plaintext = "Hello, world!";
// const encrypted = Encrypt(plaintext);
// console.log("Encrypted:", encrypted);
const decrypted = Decrypt("p+TyLKt+WrtRUO2WDs0pkNefR6u+uArmw1TzajloaFjCnckasIXHFl8=");
console.log("Decrypted:", decrypted);


function encodeURIComponentCustom(uriComponent) {
    if (typeof uriComponent === 'string' || typeof uriComponent === 'number' || typeof uriComponent === 'boolean') {
      return encodeURIComponent(uriComponent.toString());
    } else {
      throw new Error("Invalid input. Only string, number, or boolean allowed.");
    }
  }
  
