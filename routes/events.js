const express = require("express")
const router = express.Router()
const jwt = require("jsonwebtoken")

const secret = "SUPER SECRET"
const {Event, Question, sequelize} = require("../models")

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
    .route("/")
    .get(async(req, res) => {
        const events = await Event.findAll({include: [Question]})
        res.json(events)
    })
    .post(verifyToken, async(req, res) => {
        try {
            const foundEvent = await Event.findOne({
                where: {
                    id: req.body.id
                }
            })
            if (foundEvent) {
                res
                    .status(400)
                    .json({
                        error: {
                            message: 'Event ID already exists'
                        }
                    })
            } else {
                const newEvent = await Event.create({
                    id: req.body.id,
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
            }
        } catch (err) {
            res
                .status(400)
                .send({error: err.message})
        }
    })

router
    .route("/:id")
    .get(async(req, res) => {
        try {
            const events = await Event.findOne({
                where: {
                    id: req.params.id
                },
                include: [Question]
            })
            if (!events) 
                throw new Error('Event not found')
            res.json(events)
        } catch (err) {
            res
                .status(400)
                .send({error: err.message})
        }

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
    .delete(verifyToken, async(req, res) => {
        try {
            const event = await Event.destroy({
                where: {
                    id: req.params.id
                }
            })

            if (event) {
                res
                    .status(202)
                    .send({message: `Event ${req.params.id} has been deleted`})
            } else {
                throw new Error('Event not found')
            }
        } catch (e) {
            res
                .status(400)
                .send(e.message)
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

                /*
                socket
                    .broadcast
                    .emit('NewQuestionAdded', newQuestionWithEvent)*/
            })
            /*
            io.on('NewQuestionAdded', socket => {
                console.log("Broadcasting ... ")
                socket.on('NewQuestionAdded', (data) => {
                    console.log('Received ', data)
                })
                socket.emit('NewQuestionAdded', newQuestionWithEvent)
                socket
                    .broadcast
                    .emit('NewQuestionAdded', newQuestionWithEvent)
            }) */
        } catch (e) {
            res
                .status(400)
                .json({err: `Event with id = [${req.body.id}] does not exist.`})
        }
    })

router
    .route("/:id/questions/:qid")
    .get(async(req, res) => {
        try {
            const questions = await Question.findOne({
                where: {
                    id: req.params.qid
                },
                include: [Event]
            })

            if (!questions) 
                throw new Error('Question ID not found')
            res.json(questions)
        } catch (e) {
            res
                .status(400)
                .send(e.message)
        }

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