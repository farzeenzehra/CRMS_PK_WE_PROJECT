const formidable = require('formidable');
const fetch = require('node-fetch');
const fs = require('fs');
const getToken = require('../authToken');
const FormData = require('form-data');
const { BlobServiceClient } = require('@azure/storage-blob');
const config = require('../config.json')
const con = require('../connection/connection')
const logsController = require('./logsController')

function getForm(req, res) {
    const username = req.session.username;
    const firstname = req.session.firstname;
    const lastname = req.session.lastname;
    const post = req.session.post;
    // res.render('detect-face-form');
    res.render('face-recog-form', { username: username, firstname: firstname, lastname: lastname, post: post });
}

function processForm(req, res, next) {

    const username = req.session.username;
    const recievedForm = new formidable.IncomingForm();
    recievedForm.parse(req, function (err, fields, files) {
        const formToSend = new FormData();
        const unknownImage = fs.createReadStream(files.unknownImage.path);
        formToSend.append('file', unknownImage);
        let sql = `CALL GetApiKey('${username}')`;
        con.query(sql, function (err, result, fields) {
            if (err) throw err;
            const apiKey = result[0][0].ApiKey
            formToSend.append('apiKey', apiKey);
            headers = {
                Authorization: `Bearer ${getToken(req)}`
            };
            // 'http://localhost:5000/api/extract_features'
            fetch(config.ApiUrl, { method: 'POST', body: formToSend, headers: headers })
                .then(function (res) {
                    return res.json();
                })
                // .then(function (json) {
                //     console.log(json);
                //     return json
                // })
                .then(api_res_json => {
                    // console.log(api_res_json); 
                    res.render('face-recog-results', { results: api_res_json });
                });
        });
        logsController.logFaceDetection(files.unknownImage.path, username, "detected the face with id: ", null, null);
    });

}
// function uploadToAzure(blob,blobname) {
//     console.log('Azure Blob storage v12 - JavaScript quickstart sample');

//     const blobServiceClient = BlobServiceClient.fromConnectionString(config.CONNECTION_STRING);
//     const containerName = "portaldatacontainer";
//     const containerClient = blobServiceClient.getContainerClient(containerName);
//     const blockBlobClient = containerClient.getBlockBlobClient(blobname);
//     // Upload data to the blob
//     var respo = blockBlobClient.uploadStream(blob);
//     console.log("Blob was uploaded successfully.", respo);
// }


module.exports.getForm = getForm;
module.exports.processForm = processForm;