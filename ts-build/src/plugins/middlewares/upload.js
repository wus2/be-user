"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var multer_1 = __importDefault(require("multer"));
var v1_1 = __importDefault(require("uuid/v1"));
var avatar_prefix = "user_avatar_";
function UploadImage(req, res, next) {
    var filename = avatar_prefix + v1_1.default();
    var des = "./public/images/avatar";
    var storage = multer_1.default.diskStorage({
        destination: function (req, file, callback) {
            callback(null, des);
        },
        filename: function (req, file, callback) {
            filename += file.originalname;
            // store uri to update database
            var uri = "images/avatar/" + filename;
            res.locals.uri = uri;
            callback(null, filename);
        }
    });
    var upload = multer_1.default({
        storage: storage,
        fileFilter: function (req, file, callback) {
            if (file.mimetype !== "image/png" &&
                file.mimetype !== "image/jpeg" &&
                file.mimetype !== "image/jpg" &&
                file.mimetype !== "image/bmp") {
                return callback(null, false);
            }
            callback(null, true);
        }
    });
    upload.single("avatar")(req, res, function (err) {
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
exports.default = UploadImage;
