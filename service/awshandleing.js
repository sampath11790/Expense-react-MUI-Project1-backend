const AWS = require("aws-sdk");

AWS.config.update({
  accessKeyId: process.env.KEY_ID,
  secretAccessKey: process.env.ACCESS_KEY,
  region: "us-east-1",
});
function StoreFileAWS(data, id) {
  const s3bucket = new AWS.S3();

  const param = {
    Bucket: "expense1234",
    Key: `expensesingle${id}/${new Date()}.txt`,
    Body: data,
    ACL: "public-read",
  };
  // console.log(s3bucket);
  return new Promise((resolve, reject) => {
    s3bucket.upload(param, (err, response) => {
      if (!err) {
        // console.log(response);
        resolve(response);
      } else {
        // console.log(err);

        reject(err);
      }
    });
  });
  //   });
}

module.exports = StoreFileAWS;
