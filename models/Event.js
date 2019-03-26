module.exports = (sequelize, type) => {
    const Event = sequelize.define('event', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: type.STRING,
        speaker: type.STRING,
        startDate: type.STRING,
        endDate: type.STRING,
        venue: type.STRING
    }, {timestamps: false})

    Event.associate = models => {
        Event.hasMany(models.Question)
    }

    return Event
}