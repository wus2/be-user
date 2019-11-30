var multer = require("multer");
var models = require("../database/users");

module.exports = {
  uploadImage: (req, res, next) => {
    var uuid = "";
    var path = "/images/avatar/" + uuid;
    var storage = multer.diskStorage({
      destination: (req, file, callback) => {
        callback(null, "./public/images/avatar/");
      },
      filename: (req, file, callback) => {
        callback(null, uuid);
      }
    });

    var upload = multer({ storage });
    upload.array("image")(req, res, err => {
        if (err) {
            console.log("[uploadImage][error]", err)
            return res.status(400).json({
                code: -1,
                message: "Upload failed"
            })
        }

        var entity = {
            id: uuid,
            avatar: path
        }
        models.update(entity).then(data => {
            return res.status(200).json({
                code: 1,
                message: "OK"
            })
        }).catch(err => {
            return res.status(400).json({
                code: -1,
                message: "Update database failed"
            })
        })
    });
  }
};
