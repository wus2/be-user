var multer = require("multer");
var uuidv1 = require("uuid/v1");

const avatar_prefix = "user_avatar_";

module.exports = {
  uploadImage: (req, res) => {
    var filename = avatar_prefix + uuidv1();
    var des = "./public/images/avatar/";
    var storage = multer.diskStorage({
      destination: (req, file, callback) => {
        callback(null, des);
      },
      filename: (req, file, callback) => {
        filename += file.originalname;
        callback(null, filename);
      }
    });
    var upload = multer({
      storage: storage,
      fileFilter: function(req, file, callback) {
        if (
          file.mimetype !== "image/png" &&
          file.mimetype !== "image/jpeg" &&
          file.mimetype !== "image/jpg" &&
          file.mimetype !== "image/bmp"
        ) {
          return callback(null, false, new Error("Invalid file!"));
        }
        callback(null, true);
      }
    });
    
    upload.single("avatar")(req, res, err => {
      if (err) {
        console.log("[uploadImage][error]", err);
        var message
        if (err === "Invalid file!") {
          message = err
        }
        message = "Upload failed"
        return res.status(400).json({
          code: -1,
          message: message
        });
      }
      if (!req.file) {
        return res.status(400).json({
          code: -1,
          message: "Empty file"
        });
      }
    });
    // store uri to update database
    var uri = "/images/avatar/" + filename;
    res.locals.uri = uri;
  }
};
