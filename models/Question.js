module.exports = (sequelize, type) => {
    const Question = sequelize.define('question', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        description: type.STRING,
        answer: type.STRING,
        vote: type.INTEGER
    }, {timestamps: false})

    Question.associate = models => {
        Question.belongsTo(models.Event)
    }

    return Question
}
