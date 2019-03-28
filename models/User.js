module.exports = (sequelize, type) => {
    const User = sequelize.define('user', {
        username: {
            type: type.STRING,
            primaryKey: true,
            unique: true
        },
        firstName: {
            type: type.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Please enter first name'
                }
            }
        },
        lastName: {
            type: type.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Please enter last name'
                }
            }
        },
        password: {
            type: type.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Please enter password'
                }
            }
        }
    }, {timestamps: true})

    return User
}
