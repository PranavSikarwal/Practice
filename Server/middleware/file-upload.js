const multer = require("multer");
const {v4} = require('uuid');

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpg': 'jpg',
    'image/jpeg': 'jpeg'
};

const fileUpload = multer({
    limits: {
        fileSize: 100000
    },
    storage: multer.memoryStorage({
        destination: function(req, file, callback) {
         callback(null, "");
        },
    }),
    fileFilter: (req, file, cb)=>{
        const isValid = !!MIME_TYPE_MAP[file.mimetype];
        let error = isValid?null: new Error("Invalid mime type.");
        cb(error, isValid);
    }
});

module.exports = fileUpload;;