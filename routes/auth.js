const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
const {User} = require("../models")
const secret = "SUPER SECRET"

router
    .route('/auth/signin')
    .post(async(req, res) => {
        try {
            const {username, password} = req.body
            const user = await User.findOne({
                where: {
                    username: req.body.username
                }
            })

            if (!user) {
                throw new Error('User not found')
            }

            const match = await bcrypt.compareSync(password, user.password)
            if (!match) {
                throw new Error('Invalid password!')
            }

            const userData = {
                username
            }

            const expiresIn24hour = {
                expiresIn: '24h'
            }

            const token = await jwt.sign(userData, secret, expiresIn24hour)

            res.cookie("t", token, {
                expire: new Date() + 9999
            })

            return res.json({token, username: user.username})
        } catch (err) {
            res
                .status(401)
                .send(err.message)
        }
    })

router
    .route('/auth/signout')
    .get(async(req, res) => {
        res.clearCookie("t")
        return res
            .status('200')
            .json({message: "signed out"})
    })

module.exports = router;