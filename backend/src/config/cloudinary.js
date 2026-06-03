// Cloudinary cloud storage configuration
module.exports = {
  uploader: {
    upload: async (filePath) => {
      console.log(`[Kynn Cloudinary] Uploading ${filePath} (Mock/Placeholder)...`);
      return { url: 'https://res.cloudinary.com/demo/image/upload/sample.jpg' };
    }
  }
};
