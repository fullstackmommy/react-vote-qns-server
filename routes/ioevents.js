const express = require("express")
const router = express.Router()
const jwt = require("jsonwebtoken")

const secret = "SUPER SECRET"
const {Event, Question, sequelize} = require("../models")

module.exports = function (io, app) {
    var routes = {};
    routes.index = function (req, res) {
        console.log("testing...")
        io
            .sockets
            .emit('payload');

    };
    return routes;

};
