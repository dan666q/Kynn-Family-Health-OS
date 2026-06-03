// Multer file upload middleware placeholder
module.exports = {
  single: (fieldName) => {
    return (req, res, next) => {
      console.log(`[Upload Middleware] Mocking single file upload for field: ${fieldName}`);
      req.file = {
        originalname: 'prescription.pdf',
        mimetype: 'application/pdf',
        buffer: Buffer.from('mock-file-content'),
        size: 1024
      };
      next();
    };
  }
};
