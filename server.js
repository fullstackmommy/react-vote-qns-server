const server = require('./app')
const {sequelize} = require("./models")
const {createEventsAndQuestions, createUsers} = require('./seed')
const port = process.env.PORT || 8080
const eraseDatabaseOnSync = true
const {MAIL_API_KEY2} = require('./sendgrid')

// using SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(MAIL_API_KEY2);

sequelize
    .sync({force: eraseDatabaseOnSync})
    .then(() => {
        if (eraseDatabaseOnSync) {
            createEventsAndQuestions()
        }
        server.listen(port, () => {
            if (process.env.NODE_ENV === "production") {
                console.log(`Server is running on Heroku with port number ${port}`);
            } else {
                console.log(`Server is running on http://localhost:${port}`)
                const msg = {
                    to: 'nicole.budiman@gmail.com',
                    from: 'nicole.budiman@gmail.com',
                    subject: 'Project Assignment',
                    text: 'Sending an email to assign you to a new project'
                };
                sgMail.send(msg);
            }
        })
    })
