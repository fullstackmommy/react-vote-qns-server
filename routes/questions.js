const express = require("express")
const router = express.Router()
const {Event, Question, sequelize} = require('../models')

router
  .route("/")
  .get(async(req, res) => {
    const questions = await Question.findAll({include: [Event]})
    res.json(questions)
  })
  .post(async(req, res) => {
    try {
      await sequelize.transaction(async t => {
        const [foundEvent] = await Event.findOrCreate({
          where: {
            name: req.body.event
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
        .json({err: `Event with name = [${req.body.event}] does not exist.`})
    }
  })

router
  .route("/:id")
  .get(async(req, res) => {
    const questions = await Question.findOne({
      where: {
        id: req.params.id
      },
      include: [Event]
    })
    res.json(questions)
  })
  .put(async(req, res) => {
    try {
      const question = await Question.findOne({
        where: {
          id: req.params.id
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
          id: req.params.id
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