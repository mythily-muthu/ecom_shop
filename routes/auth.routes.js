const router = require("express").Router();
const CryptoJS = require("crypto-js");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// register
router.post("/register", async (req, res) => {
    try {

        let encryptedPassword = cryptoJs.AES.encrypt(req.body.password, process.env.PASS_SEC).toString();

        console.log("body:", req.body)
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: encryptedPassword,
        });

        console.log("new User:", newUser)
        // save register user
        let registeredUser = await newUser.save();
        res.status(201).json(registeredUser);

    } catch (err) {
        res.status(500).json(err.message);

    }
});



// login
router.post("/login", async (req, res) => {
    try {
        const { username } = req.body;

        const user = await User.findOne({ username: username });
        console.log("user:", user);

        if (!user) {
            return res.status(401).json("Wrong User Name");
        }

        // decrypt user password;
        let decryptedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC).toString(CryptoJS.enc.Utf8); // orginal password like fewafeawfe to mythu123
        console.log('decryptedPassword', decryptedPassword)
        if (req.body.password !== decryptedPassword) {
            return res.status(401).json("Wrong Password");
        }

        // all ok then generate token;
        const accessToken = jwt.sign(
            {
                id: user._id,
                isAdmin: user.isAdmin,
            },
            process.env.JWT_SEC,
            { expiresIn: "1d" }
        );

        console.log("token:", accessToken) // dynamic string with  1day duration valid
        const { password, ...others } = user._doc;
        console.log("other:", others)
        return res.status(200).json({ ...others, accessToken });
    } catch (err) {
        res.status(500).json(err.message);
    }
})

module.exports = router;
