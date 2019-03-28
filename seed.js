const {Event, Question} = require('./models')

const createEventsAndQuestions = async() => {
    await Event.create({
        id: "SJADES2018",
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
    }, {include: [Question]})
    await Event.create({
        id: "PM032019",
        name: "Translocation and inspiration: Javanese Batik in Europe and Africa",
        organizer: "The Peranakan Museum Singapore",
        speaker: "Dr Maria Wronska-Friend",
        startDate: "2 Mar 2019",
        endDate: "2 Mar 2019",
        venue: "The Peranakan Museum Singapore",
        questions: [
            {
                description: "How to identify industrially produced batik design?",
                vote: 10
            }
        ]
    }, {include: [Question]})
    await Event.create({
        id: "IK032019",
        name: "Ikebana",
        organizer: "Yamano Florist & Ikebana School",
        speaker: "Kazumi Ishikawa",
        startDate: "21 Mar 2019",
        endDate: "21 Mar 2019",
        venue: "Shangri-la Hotel Singapore",
        questions: [
            {
                description: "Is Ikebana an evolving art?",
                vote: 15
            }
        ]
    }, {include: [Question]})

}

module.exports = createEventsAndQuestions
