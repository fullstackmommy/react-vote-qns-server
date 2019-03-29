const app = require('./app')
const {sequelize} = require("./models")
const {createEventsAndQuestions} = require('./seed')
const port = process.env.PORT || 8080
const eraseDatabaseOnSync = true

sequelize
    .sync({force: eraseDatabaseOnSync})
    .then(() => {
        if (eraseDatabaseOnSync) {
            createEventsAndQuestions()
        }
        app.listen(port, () => {
            if (process.env.NODE_ENV === "production") {
                console.log(`Server is running on Heroku with port number ${port}`);
            } else {
                console.log(`Server is running on http://localhost:${port}`)
            }
        })
    })
