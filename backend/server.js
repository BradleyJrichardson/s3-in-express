const express = require('express');
const cors = require('cors');
const multer = require('multer');
const AWS = require('aws-sdk');
require('dotenv').config()

const app = new express();

// multer which handles image buffer object, adds req.file to endpoint
var storage = multer.memoryStorage()
const upload = multer({ storage: storage }).single('file');

app.use(cors())

// add s3 credentials using .env
let s3credentials = new AWS.S3({
  accessKeyId: process.env.ACCESSKEYID,
  secretAccessKey: process.env.SECRETACCESSKEY
});

app.post('/upload', upload, (req, res) => {
  // here you have access to req.file
  let fileParams = {
    Bucket: 'dogs-gentech-rails-app-harrison',
    Body: req.file.buffer,
    Key: 'something-unique-like-username' + req.file.originalname,
    ACL: 'public-read',
    ContentType: req.file.mimetype
    // for the key you should use string concatenation to create a unique filename key
  }
  // here you upload the file by passing in the fileParams object
  s3credentials.upload(fileParams, (err, data) => {
    if (err) {
      // handle the error
      res.send('you got an error')
    } else {
      // here you have access to the AWS url through data.Location
      // you could store this string in your database
      console.log(data.Location)
      res.send('all good')
    }
  })
})

app.listen(5000, () => console.log('running on port 5000'))