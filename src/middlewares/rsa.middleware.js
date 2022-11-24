const crypto = require("crypto");

export const decryptedData= (encryptedData) => {
  const data = crypto.privateDecrypt(
    {
      key: process.env.PRIVATE_KEY,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    }, 
    encryptedData
  );
  return data;
}
