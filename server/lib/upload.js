const multer = require("multer");
const multerS3 = require("multer-s3");
const path = require("path");
const { s3 } = require("./s3");

const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.R2_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      const uniqueName = `${Date.now()}-${file.originalname}`;
      cb(null, uniqueName);
    },
  }),
  fileFilter: (req, file, cb) => {
    const isCatalog = file.fieldname === 'catalogs';
    const allowedImageExts = /jpeg|jpg|png|webp|jfif|svg/;
    const allowedDocExts = /pdf|i|doc|docx|xls|xlsx|txt/; // Added 'i' and others for catalogs
    
    const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
    const isImageExt = allowedImageExts.test(ext);
    const isDocExt = allowedDocExts.test(ext);
    
    const isImageMime = file.mimetype.startsWith('image/') || file.mimetype === 'application/octet-stream';
    const isDocMime = file.mimetype === 'application/pdf' || file.mimetype === 'application/octet-stream' || file.mimetype.includes('office') || file.mimetype.includes('document');

    if ((isImageExt && isImageMime) || (isDocExt && isDocMime) || (isCatalog && (isDocExt || isImageExt))) {
        return cb(null, true);
    } else {
        console.error(`Rejected file: ${file.originalname} (Field: ${file.fieldname}, MIME: ${file.mimetype})`);
        cb(new Error(`Error: File type not supported for ${file.fieldname}! ${file.originalname} (${file.mimetype}).`));
    }
  },
});

module.exports = { upload };
