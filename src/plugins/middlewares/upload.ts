import { Request, Response, NextFunction } from "express";
import multer from "multer";
import uuidv1 from "uuid/v1";

const avatar_prefix = "user_avatar_";

export default function UploadImage(
  req: Request,
  res: Response,
  next: NextFunction
) {
  var filename = avatar_prefix + uuidv1();
  var des = "../public/images/avatar/";
  var storage = multer.diskStorage({
    destination: (req: any, file: any, callback: any) => {
      callback(null, des);
    },
    filename: (req: any, file: any, callback: any) => {
      filename += file.originalname;
      // store uri to update database
      var uri = "images/avatar/" + filename;
      res.locals.uri = uri;
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
        return callback(null, false);
      }
      callback(null, true);
    }
  });

  upload.single("avatar")(req, res, err => {
    if (err) {
      console.log("[uploadImage][error]", err);
      var message;
      if (err === "Invalid file!") {
        message = err;
      }
      message = "Upload failed";
      return res.json({
        code: -1,
        message: message
      });
    }
    if (!req.file) {
      return res.json({
        code: -1,
        message: "Empty file"
      });
    }
  });
  next();
}
