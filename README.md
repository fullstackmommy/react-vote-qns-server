# AskNow - API

Sometimes things need to be asked, and you don’t want to be the one to say them out loud. Or simply, you may not remember that burning question anymore by the time the Q&A session begins.

This API provides the resources for a react app which aims to make it simple for audience, especially the quiet type, to ask questions any time during a presentation. As questions appear onscreen, the audience may upvote the one they like. Other than as a feedback on general questions from the audience, this ranking feature gives insights to the speaker/moderator about which (most burning) questions they should spend time discussing during the Q&A session.

Another potential use is for collecting questions and identify popular questions prior to the event. This enables the speaker to tailor the content or structure of his/her upcoming presentation based on what the audience wants/needs.

Basic features included in this version:

1. Allow audience to post questions anonymously
2. The best questions rise to the top of the list, and the rest fall to the bottom.
3. Allow admin/moderator to create and delete an event code
4. Gamification:

Potential features to be added:

1. Allow admin/moderator to delete any obnoxious question
2. Allow search questions by keywords

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

###Installation

Here are the steps to download a local copy of the app

1. Fork the repo
2. \$ git clone ....
3. \$ npm install

## Deployment

Use heroku to deploy:
https://asknow-api.herokuapp.com/

## Built With

### Prerequisites

Library used:

1. sequelize
2. pg
3. express
4. nodemon
5. jest
6. supertest
7. sqlite3
8. cross-env
9. cors
10. jsonwebtoken
11. bcrypt@3.0.2
12. socket.io

## Running the tests

\$ npm run test:watch

### Break down into end to end tests

Events
[GET]
√ Returns all events
√ Returns matching event based on event ID
√ Returns matching event based on event ID - no record found
[POST]
√ Creates a new event - deny access when no token is given
√ Creates a new event - deny access when token is invalid
√ Fails to create an event if the event ID is already used
√ Creates a new event
[PUT]
√ Updates an event
√ Updates an event - record not found
[DELETE]
√ Deletes an event
√ Deletes an event - record not found
Questions
[GET]
√ Returns all questions in an event
√ No question returned when event ID is invalid
√ Get the question based on question ID
√ Get the question based on question ID: no record found
[POST]
√ Creates a new question
[PUT]
√ Updates a question description based on question ID
√ Updates a question - vote based on question ID
√ Fails to update a question: record not found
[DELETE]
√ Deletes a question based on ID
√ Fails to delete a question- record not found

App
√ should return with status code 200

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags).

## Authors

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

- Hat tip to anyone whose code was used
- Inspiration
- etc
