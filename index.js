const AWS = require('aws-sdk');
const config = require('./config.json');
const crypto = require('crypto');
const pki = require('node-forge').pki;
const rsa = require('node-rsa');

AWS.config.update({ region: config.REGION })
var s3 = new AWS.S3();
var docClient = new AWS.DynamoDB.DocumentClient({ region: config.REGION });

module.exports.handler = async (event) => {

  // Getting the certificate file from the S3 bucket
  const certificateObject = await s3.getObject({
    Bucket: config.S3_BUCKET,
    Key: config.KEY
  }).promise();

  const certificateStr = Buffer.from(certificateObject.Body).toString('utf8');

  // Extracting the public key
  const publicKeyObject = crypto.createPublicKey({ key: certificateStr, format: 'pem' });
  const publicKey = publicKeyObject.export({ format: 'pem', type: 'pkcs1' });


  // Extracting the commonName
  const commonName = pki.certificateFromPem(certificateStr).subject.attributes.find(elt => { return elt.shortName == 'CN' }).value;


  // Generating a private key using RSA
  const key = new rsa().generateKeyPair();
  var privateKey = key.exportKey("private");


  // Signing the publicKey extracted with the privateKey generated
  const signature = crypto.sign("sha256", Buffer.from(publicKey), {
    key: privateKey,
    padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
  });

  // Writing the encrypted content to DynamoDB
  var itemParams = {
    TableName: config.TABLE,
    Item: {
      "commonName": commonName,
      "signature": Buffer.from(signature).toString('utf8')
    }
  };

  try {
    await docClient.put(itemParams).promise();
  } catch (err) {
    console.error(err)
  }
  return;

};