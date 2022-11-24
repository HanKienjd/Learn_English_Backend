const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

exports.decryptedData = (encryptedData) => {
  const privateKey = fs.readFileSync("/home/hankien/Dev/KMA/Learn_English_Backend/rsa_2048_private_key.pem", "utf8");
  const rsaPrivateKey = {
    key: privateKey,
    padding: crypto.constants.RSA_PKCS1_PADDING,
    passphrase: '',
  }
  const data = crypto.privateDecrypt(
 rsaPrivateKey,
    Buffer.from(encryptedData, 'base64')
  );
  return data.toString('utf8');
}
