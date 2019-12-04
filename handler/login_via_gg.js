var passport = require('passport')

exports.loginViaGG = (req, res) => {
    passport.authenticate(
        "google",
        {
            session: false
        },
        (err, user, info) => {
            console.log(user)
            return res.status(200).json({
                code: 1,
                message: "OK"
            })
        })(req, res)
}