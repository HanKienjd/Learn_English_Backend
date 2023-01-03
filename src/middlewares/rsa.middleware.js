const crypto = require("crypto");
const fs = require("fs");

exports.decryptedData = (encryptedData) => {
  const privateKey = fs.readFileSync("private.pem", { encoding: "utf8" });
  try {
    const data = crypto.privateDecrypt(
      {
        key: privateKey.toString(),
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: "sha256",
      }, 
      encryptedData
    );
    return data.toString('utf8');
  } catch (error) {
    console.error("DECRYPTED DATA ERROR: ", error);
  }
}



