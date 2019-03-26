const request = require("supertest")
const app = require("../../app")
const {sequelize} = require("../../models")
const createEventsAndQuestions = require('../../seed')

const route = (params = "") => {
    const path = "/api/v1/events";
    return `${path}/${params}`;
};

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

        test('Returns matching event based on event ID', () => {})
        test('Returns matching event based on event ID - no record found', () => {})
    })

    describe('[POST]', () => {
        test('Creates a new event', () => {
            return request(app)
                .post(route())
                .send({name: "My Heart Medications and I", speaker: "Rachel Tan", startDate: "12 Apr 2019", endDate: "12 Apr 2019", venue: "Singapore Heart Foundation Heart Wellness Centre"})
                .expect(201)
                .then(res => {
                    const event = res.body
                    expect(event.name).toEqual("My Heart Medications and I")
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
                .send({id: 2, name: "Ikebana 101"})
                .expect(202)
                .then(res => {
                    const event = res.body
                    expect(event.id).toEqual(3)
                    expect(event.name).toEqual("Ikebana 101")
                    expect(event.speaker).toEqual("Kazumi Ishikawa")
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