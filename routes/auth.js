const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
const {User} = require("../models")
const secret = "SUPER SECRET"

verifyToken = async(req, res, next) => {
    if (!req.headers.authorization) 
        return res.status(403).send({error: "Unauthorized access!"})
    try {
        const token = req
            .headers
            .authorization
            .split('Bearer ')[1]

        const payload = await jwt.verify(token, secret)
        if (payload) 
            return next()
    } catch (err) {
        res
            .status(403)
            .send({error: err.message})
    }
}

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

            res.cookie("token", token, {
                httpOnly: true,
                expire: new Date() + 9999
            })

            return res.json({token, username: user.username})
        } catch (err) {
            res
                .status(401)
                .send({error: err.message})
        }
    })

router
    .route('/auth/signout')
    .get(async(req, res) => {
        res.clearCookie("token")
        return res
            .status('200')
            .json({message: "signed out"})
    })

router
    .route('/register')
    .post(verifyToken, async(req, res) => {
        try {
            const foundUser = await User.findOne({
                where: {
                    username: req.body.username
                }
            })
            if (foundUser) {
                res
                    .status(400)
                    .send({error: "Username is already taken!"})

            } else {
                const hashPassword = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
                const newUser = await User.create({username: req.body.username, firstName: req.body.firstName, lastName: req.body.lastName, password: hashPassword})
                res.sendStatus(204)
            }
        } catch (err) {
            res
                .status(400)
                .json(err)
        }
    })

router
    .route('/authenticate')
    .get(async(req, res) => {
        try {
            const {username, password} = req.body
            const user = await User.findOne({username})

            if (!user) {
                throw new Error('You are not authorized!')
            }

            const match = await bcrypt.compareSync(password, user.password)
            if (!match) {
                throw new Error('You are not authorized!')
            }

            const userData = {
                username
            }

            const expiresIn24hour = {
                expiresIn: '24h'
            }

            const token = await jwt.sign(userData, secret, expiresIn24hour)

            return res
                .status(200)
                .json({token})
        } catch (err) {
            res
                .status(401)
                .send(err.message)
        }
    })
    .post(async(req, res) => {
        if (!req.headers.authorization) {
            res.sendStatus(401)
        }
        const token = req
            .headers
            .authorization
            .split('Bearer ')[1]
        const userData = await jwt.verify(token, secret)
        return res
            .status(200)
            .json(userData)
    })
module.exports = router;