const AWS = require('aws-sdk');
const fs = require('fs');

const uploadFile = (filePath) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, (err, data) => {
            if (err) {
                console.error(err, err.stack);
                reject();
            }

            console.log('Uploading file...');

            const base64data = new Buffer.from(data, 'binary');
                        
            const objectParams = {
                Bucket: process.env.S3_BUCKET_NAME,
                Key: filePath,
                Body: base64data
            };

            const uploadPromise = new AWS.S3({apiVersion: '2006-03-01'})
                .putObject(objectParams)
                .promise();

            uploadPromise.then(data => {
                console.log("Successfully uploaded data to " + process.env.S3_BUCKET_NAME + "/" + filePath);
                resolve();
            }).catch(err => {
                console.error(err, err.stack);
                reject();
            });
        });
    });
}

module.exports.uploadFile = uploadFile;