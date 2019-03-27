const express = require("express")
const router = express.Router()
const {Event, Question, sequelize} = require("../models")

router
    .route("/")
    .get(async(req, res) => {
        const events = await Event.findAll({include: [Question]})

        res.json(events)
    })
    .post(async(req, res) => {
        try {
            const newEvent = await Event.create({
                name: req.body.name,
                organizer: req.body.organizer,
                speaker: req.body.speaker,
                startDate: req.body.startDate,
                endDate: req.body.endDate,
                venue: req.body.venue
            })
            res
                .status(201)
                .json(newEvent)
        } catch (e) {
            res
                .status(400)
                .json(err)
        }
    })

router
    .route("/:id")
    .get(async(req, res) => {
        const events = await Event.findOne({
            where: {
                id: req.params.id
            },
            include: [Question]
        })

        res.json(events)
    })
    .put(async(req, res) => {
        try {
            const event = await Event.findOne({
                where: {
                    id: req.params.id
                },
                include: [Question]
            })

            await event.update({
                name: req.body.name,
                organizer: req.body.organizer,
                speaker: req.body.speaker,
                startDate: req.body.startDate,
                endDate: req.body.endDate,
                venue: req.body.venue
            })

            return res
                .status(202)
                .json(event)
        } catch (e) {
            res.sendStatus(400)
        }
    })
    .delete(async(req, res) => {
        try {
            const event = await Event.destroy({
                where: {
                    id: req.params.id
                }
            })

            if (event) {
                res.sendStatus(202)
            } else {
                res.sendStatus(400)
            }
        } catch (e) {
            res.sendStatus(400)
        }
    })

module.exports = router;