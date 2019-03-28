module.exports = (sequelize, type) => {
    const Event = sequelize.define('event', {
        id: {
            type: type.STRING,
            primaryKey: true,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Please enter event ID'
                }
            }
        },
        name: type.STRING,
        organizer: type.STRING,
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