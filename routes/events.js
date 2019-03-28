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
                res.json({message: 'Deleted'})
                res.sendStatus(202)
            } else {
                res.json({message: 'Unable to find the question'})
                res.sendStatus(400)
            }
        } catch (e) {
            res.sendStatus(400)
        }
    })

router
    .route("/:id/questions")
    .get(async(req, res) => {
        try {
            const questions = await Question.findAll({
                where: {
                    eventId: req.params.id
                },
                include: [Event]
            })
            res.json(questions)
        } catch (e) {
            res.sendStatus(400)
        }
    })
    .post(async(req, res) => {
        try {
            await sequelize.transaction(async t => {
                const [foundEvent] = await Event.findOrCreate({
                    where: {
                        id: req.params.id
                    },
                    transaction: t
                })
                const newQuestion = await Question.create({
                    description: req.body.description,
                    vote: 1
                }, {transaction: t})
                await newQuestion.setEvent(foundEvent, {transaction: t})
                const newQuestionWithEvent = await Question.findOne({
                    where: {
                        id: newQuestion.id
                    },
                    include: [Event],
                    transaction: t
                })
                res
                    .status(201)
                    .json(newQuestionWithEvent)
            })
        } catch (e) {
            res
                .status(400)
                .json({err: `Event with id = [${req.body.id}] does not exist.`})
        }
    })

router
    .route("/:id/questions/:qid")
    .get(async(req, res) => {
        const questions = await Question.findOne({
            where: {
                id: req.params.qid
            },
            include: [Event]
        })
        res.json(questions)
    })
    .put(async(req, res) => {
        try {
            const question = await Question.findOne({
                where: {
                    id: req.params.qid
                },
                include: [Event]
            })

            await question.update({description: req.body.description, vote: req.body.vote})

            return res
                .status(202)
                .json(question)
        } catch (e) {
            res.sendStatus(400)
        }
    })
    .delete(async(req, res) => {
        try {
            const question = await Question.destroy({
                where: {
                    id: req.params.qid
                }
            })

            if (question) {
                res.sendStatus(202)
            } else {
                res.sendStatus(400)
            }
        } catch (e) {
            res.sendStatus(400)
        }
    })
module.exports = router;