const multer = require("multer");

const MIME_TYPE_MAP = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({
  destination: (req, filename, cb) => {
    const isValid = MIME_TYPE_MAP[filename.mimetype];
    let error = new Error('Invalid Mime Type');
    if (isValid) {
      error = null;
    }
    cb(error, "images");
  },
  filename: (req, filename, cb) => {
    const name = filename.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[filename.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});

module.exports = multer({ storage: storage }).single('image');
