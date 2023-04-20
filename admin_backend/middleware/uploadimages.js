const multer = require("multer");
const path = require("path");

//configuration of multer
const storage = multer.diskStorage({
destination: function (req, file, cb) {
cb(null, "upload");
},
filename: function (req, file, cb) {
const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
cb(null, Date().now + path.extname(file.originalname));
},
});

const upload = multer({ storage: storage });
module.exports = upload;