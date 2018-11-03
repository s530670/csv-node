const Movie = require('../model/movie.js');
const csv = require('csvtojson'),
    async = require("async");


/**
 * File Upload file 
 */
var fileUpload = function (req, res, next) {
    if (req && (!req.files || !req.files.file || req.files.file.size == 0)) {
        return res.status(500).json({ message: "Please provide proper file." })
    }
    csv()
        .fromFile(req.files.file.path)
        .then((jsonObj) => {
            console.log(jsonObj.length)
            req.body.fileData = jsonObj;
            if (jsonObj.length) {
                next()
            } else {
                res.status(200).json({ data: [] });
            }
            //
        })


};
module.exports.fileUpload = fileUpload;


var saveToDatabase = function (req, res) {
    async.each(req.body.fileData, function (record, callback) {
        var movie = new Movie(record);

        movie.save(function (err) {
            if (err) {
                callback({ message: err });
            } else {
                callback();
            }
        });
    }, function (err) {
        // if any of the file processing produced an error, err would equal that error
        res.json({ message: "Record entered successfully" })
    });
};
module.exports.saveToDatabase = saveToDatabase;
