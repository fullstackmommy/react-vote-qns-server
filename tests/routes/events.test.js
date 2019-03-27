const request = require("supertest")
const app = require("../../app")
const {sequelize} = require("../../models")
const createEventsAndQuestions = require('../../seed')

const route = (params = "") => {
    const path = "/api/v1/events";
    return `${path}/${params}`;
};

const questionRoute = (eventId, params = "") => {
    const path = `/api/v1/events/${eventId}/questions`;
    return `${path}/${params}`;
}

beforeAll(async() => {
    await sequelize.sync({force: true})
    await createEventsAndQuestions()
})

afterAll(async() => {
    await sequelize.close()
})

describe('Events', () => {
    describe('[GET]', () => {
        const verifyEvents = (res, expected) => {
            const events = res.body
            events.forEach((event, index) => {
                expect(event.name).toEqual(expected[index].name)
                expect(event.organizer).toEqual(expected[index].organizer)
                expect(event.speaker).toEqual(expected[index].speaker)
                expect(event.startDate).toEqual(expected[index].startDate)
                expect(event.endDate).toEqual(expected[index].endDate)
                expect(event.venue).toEqual(expected[index].venue)
            })
        }

        test('Returns all events', () => {
            const expectedEvents = [
                {
                    id: 1,
                    name: "SJADES 2018 Scientific Talk",
                    organizer: "Lee Kong Chian Natural History Museum",
                    speaker: "Iffah Binte Iesa",
                    startDate: "16 Mar 2019",
                    endDate: "16 Mar 2019",
                    venue: "Lee Kong Chian Natural History Museum",
                    questions: [
                        {
                            description: "How did you select the specimens?",
                            vote: 5
                        }, {
                            description: "How did you prepare the specimens?",
                            vote: 10
                        }, {
                            description: "Why the specimens don't turn mouldy over time?",
                            vote: 20
                        }, {
                            description: "How did you handle the garbage collected in the trawlers?",
                            vote: 25
                        }
                    ]
                }, {
                    id: 2,
                    name: "Translocation and inspiration: Javanese Batik in Europe and Africa",
                    organizer: "The Peranakan Museum Singapore",
                    speaker: "Dr Maria Wronska-Friend",
                    startDate: "2 Mar 2019",
                    endDate: "2 Mar 2019",
                    venue: "The Peranakan Museum Singapore",
                    questions: {
                        description: "How to identify industrially produced batik design?",
                        vote: 10
                    }
                }, {
                    id: 3,
                    name: "Ikebana",
                    organizer: "Yamano Florist & Ikebana School",
                    speaker: "Kazumi Ishikawa",
                    startDate: "21 Mar 2019",
                    endDate: "21 Mar 2019",
                    venue: "Shangri-la Hotel Singapore",
                    questions: {
                        description: "Is Ikebana an evolving art?",
                        vote: 15
                    }
                }
            ]

            return request(app)
                .get(route())
                .expect("content-type", /json/)
                .expect(200)
                .expect(res => verifyEvents(res, expectedEvents))
        })

        test('Returns matching event based on event ID', () => {
            const id = "1"
            const expectedEvents = [
                {
                    id: 1,
                    name: "SJADES 2018 Scientific Talk",
                    organizer: "Lee Kong Chian Natural History Museum",
                    speaker: "Iffah Binte Iesa",
                    startDate: "16 Mar 2019",
                    endDate: "16 Mar 2019",
                    venue: "Lee Kong Chian Natural History Museum",
                    questions: [
                        {
                            description: "How did you select the specimens?",
                            vote: 5
                        }, {
                            description: "How did you prepare the specimens?",
                            vote: 10
                        }, {
                            description: "Why the specimens don't turn mouldy over time?",
                            vote: 20
                        }, {
                            description: "How did you handle the garbage collected in the trawlers?",
                            vote: 25
                        }
                    ]
                }
            ]
            return request(app)
                .get(route(id))
                .expect("content-type", /json/)
                .expect(200)
                .then(res => {
                    const event = res.body
                    expect(event.name).toEqual("SJADES 2018 Scientific Talk")
                    expect(event.organizer).toEqual("Lee Kong Chian Natural History Museum")
                    expect(event.speaker).toEqual("Iffah Binte Iesa")
                    expect(event.startDate).toEqual("16 Mar 2019")
                    expect(event.endDate).toEqual("16 Mar 2019")
                    expect(event.venue).toEqual("Lee Kong Chian Natural History Museum")
                    expect(event.questions.length).toBe(4)
                })
        })
        test('Returns matching event based on event ID - no record found', () => {})
    })

    describe('[POST]', () => {
        test('Creates a new event', () => {
            return request(app)
                .post(route())
                .send({
                    name: "My Heart Medications and I",
                    organizer: "Singapore Heart Foundation",
                    speaker: "Rachel Tan",
                    startDate: "12 Apr 2019",
                    endDate: "12 Apr 2019",
                    venue: "Singapore Heart Foundation Heart Wellness Centre"
                })
                .expect(201)
                .then(res => {
                    const event = res.body
                    expect(event.name).toEqual("My Heart Medications and I")
                    expect(event.organizer).toEqual("Singapore Heart Foundation")
                    expect(event.speaker).toEqual("Rachel Tan")
                    expect(event.startDate).toEqual("12 Apr 2019")
                    expect(event.endDate).toEqual("12 Apr 2019")
                    expect(event.venue).toEqual("Singapore Heart Foundation Heart Wellness Centre")
                })
        })
    })
    describe('[PUT]', () => {
        test('Updates an event', () => {
            const id = "3"
            return request(app)
                .put(route(id))
                .send({id: 2, name: "Ikebana 101", speaker: "Megumi Ishikawa"})
                .expect(202)
                .then(res => {
                    const event = res.body
                    expect(event.id).toEqual(3)
                    expect(event.name).toEqual("Ikebana 101")
                    expect(event.organizer).toEqual("Yamano Florist & Ikebana School")
                    expect(event.speaker).toEqual("Megumi Ishikawa")
                    expect(event.startDate).toEqual("21 Mar 2019")
                    expect(event.endDate).toEqual("21 Mar 2019")
                    expect(event.venue).toEqual("Shangri-la Hotel Singapore")
                })
        })
        test('Updates an event - record not found', (done) => {
            const id = "1000"
            return request(app)
                .put(route(id))
                .send({id: 1000, name: "Introduction to Bitcoin"})
                .expect(400, done)
        })
    })
    describe('[DELETE]', () => {
        test('Deletes an event', () => {
            const id = "3"
            return request(app)
                .delete(route(id))
                .expect(202)
        })
        test('Deletes an event - record not found', (done) => {
            const id = "1000"
            request(app)
                .delete(route(id))
                .expect(400, done)
        })
    })
})

describe('Questions', () => {
    describe('[GET]', () => {
        const verifyQuestions = (res, expected) => {
            const questions = res.body
            questions.forEach((question, index) => {
                expect(question.description).toEqual(expected[index].description)
                expect(question.vote).toEqual(expected[index].vote)
                expect(question.eventId).toEqual(expected[index].eventId)
                expect(question.event.name).toEqual(expected[index].event.name)
            })
        }

        test('Returns all questions in an event', () => {
            const id = "1"
            const expectedQuestions = [
                {
                    id: 1,
                    description: "How did you select the specimens?",
                    answer: null,
                    vote: 5,
                    eventId: 1,
                    event: {
                        id: 1,
                        name: "SJADES 2018 Scientific Talk",
                        organizer: "Lee Kong Chian Natural History Museum",
                        speaker: "Iffah Binte Iesa",
                        startDate: "16 Mar 2019",
                        endDate: "16 Mar 2019",
                        venue: "Lee Kong Chian Natural History Museum"
                    }
                }, {
                    id: 2,
                    description: "How did you prepare the specimens?",
                    answer: null,
                    vote: 10,
                    eventId: 1,
                    event: {
                        id: 1,
                        name: "SJADES 2018 Scientific Talk",
                        organizer: "Lee Kong Chian Natural History Museum",
                        speaker: "Iffah Binte Iesa",
                        startDate: "16 Mar 2019",
                        endDate: "16 Mar 2019",
                        venue: "Lee Kong Chian Natural History Museum"
                    }
                }, {
                    id: 3,
                    description: "Why the specimens don't turn mouldy over time?",
                    answer: null,
                    vote: 20,
                    eventId: 1,
                    event: {
                        id: 1,
                        name: "SJADES 2018 Scientific Talk",
                        organizer: "Lee Kong Chian Natural History Museum",
                        speaker: "Iffah Binte Iesa",
                        startDate: "16 Mar 2019",
                        endDate: "16 Mar 2019",
                        venue: "Lee Kong Chian Natural History Museum"
                    }
                }, {
                    id: 4,
                    description: "How did you handle the garbage collected in the trawlers?",
                    answer: null,
                    vote: 25,
                    eventId: 1,
                    event: {
                        id: 1,
                        name: "SJADES 2018 Scientific Talk",
                        organizer: "Lee Kong Chian Natural History Museum",
                        speaker: "Iffah Binte Iesa",
                        startDate: "16 Mar 2019",
                        endDate: "16 Mar 2019",
                        venue: "Lee Kong Chian Natural History Museum"
                    }
                }
            ]
            return request(app)
                .get(questionRoute(id, ''))
                .expect("content-type", /json/)
                .expect(200)
                .expect(res => verifyQuestions(res, expectedQuestions))
        })

        test('No question returned when event ID is invalid', () => {
            const id = "100"
            return request(app)
                .get(questionRoute(id, ''))
                .expect("content-type", /json/)
                .expect(200)
                .then(res => {
                    const event = res.body
                    expect(event).toHaveLength(0)
                })
        })

        test('Get the question based on question ID', () => {
            const id = "1"
            const questionId = "1"
            const expectedQuestions = [
                {
                    id: 1,
                    description: "How did you select the specimens?",
                    answer: null,
                    vote: 5,
                    eventId: 1,
                    event: {
                        id: 1,
                        name: "SJADES 2018 Scientific Talk",
                        organizer: "Lee Kong Chian Natural History Museum",
                        speaker: "Iffah Binte Iesa",
                        startDate: "16 Mar 2019",
                        endDate: "16 Mar 2019",
                        venue: "Lee Kong Chian Natural History Museum"
                    }
                }
            ]

            return request(app)
                .get(questionRoute(id, questionId))
                .expect("content-type", /json/)
                .expect(200)
                .then(res => {
                    const question = res.body
                    expect(question.description).toEqual("How did you select the specimens?")
                    expect(question.vote).toBe(5)
                    expect(question.event.name).toEqual("SJADES 2018 Scientific Talk")
                })
        })

        test('Get the question based on question ID: no record found', () => {
            const id = "1"
            const questionId = "100"
            return request(app)
                .get(questionRoute(id, questionId))
                .expect("content-type", /json/)
                .expect(200)
                .then(res => {
                    const question = res.body
                    expect(question).toBeNull()
                })
        })
    })

    describe('[POST]', () => {
        test('Creates a new question', () => {
            const id = "1"
            return request(app)
                .post(questionRoute(id, ''))
                .send({description: "How to keep the specimens while onboard?", eventId: id})
                .expect(201)
                .then(res => {
                    const question = res.body
                    expect(question.description).toEqual("How to keep the specimens while onboard?")
                    expect(question.event.name).toEqual("SJADES 2018 Scientific Talk")
                });
        })
    })

    describe('[PUT]', () => {
        test('Updates a question description based on question ID', () => {
            const id = "1"
            const qid = "2"
            return request(app)
                .put(questionRoute(id, qid))
                .send({description: "How did you prepare the specimens onboard?"})
                .expect(202)
                .then(res => {
                    const question = res.body
                    expect(question.id).toEqual(2)
                    expect(question.description).toEqual("How did you prepare the specimens onboard?")
                    expect(question.event.name).toEqual("SJADES 2018 Scientific Talk")
                })
        })

        test('Updates a question - vote based on question ID', () => {
            const id = "1"
            const qid = "2"
            return request(app)
                .put(questionRoute(id, qid))
                .send({vote: 100})
                .expect(202)
                .then(res => {
                    const question = res.body
                    expect(question.id).toEqual(2)
                    expect(question.description).toEqual("How did you prepare the specimens onboard?")
                    expect(question.vote).toEqual(100)
                    expect(question.event.name).toEqual("SJADES 2018 Scientific Talk")
                })
        })

        test('Fails to update a question: record not found', (done) => {
            const id = "1"
            const qid = "1000"
            return request(app)
                .put(questionRoute(id, qid))
                .send({description: "How did you prepare the specimens onboard?", vote: 100})
                .expect(400, done)
        })
    })

    describe('[DELETE]', () => {
        test('Deletes a question based on ID', () => {
            const id = "1"
            const qid = "1"
            return request(app)
                .delete(questionRoute(id, qid))
                .expect(202)
        })
        test('Fails to delete a question- record not found', (done) => {
            const id = "1"
            const qid = "1000"
            request(app)
                .delete(questionRoute(id, qid))
                .expect(400, done)
        })
    })
})