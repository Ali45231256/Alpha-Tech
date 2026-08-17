

const cloudinary = require("../config/cloudinary");

exports.uploadImage = async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image selected",
      });
    }

    const result = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: "alphatech-products",
      }
    );

    res.json({
      success: true,
      imageUrl: result.secure_url,
    });

  } catch (error) {

    console.log("Cloudinary Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};