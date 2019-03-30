module.exports = {
    development: {
        username: "postgres",
        password: "postgres",
        database: "questions-api",
        options: {
            dialect: "postgres",
            logging: false
        }
    },
    test: {
        username: "postgres",
        password: "",
        database: "questions-api",
        options: {
            dialect: "sqlite",
            storage: ":memory:",
            logging: false
        }
    },
    production: {
        url: process.env.DATABASE_URL,
        options: {
            dialect: "postgres"
        }
    }
};