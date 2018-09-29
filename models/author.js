'use strict';

const Sequelize = require('sequelize');
const {
    sequelize
} = require('../db/sequelize');

const Author = sequelize.define('Author', {
    userName: {
        type: Sequelize.TEXT,
        field: 'user_name',
        allowNull: false

    },
    firstName: {
        type: Sequelize.TEXT,

        field: 'first_name'
    },
    lastName: {
        type: Sequelize.TEXT,

        field: 'last_name'
    },
}, {

    tableName: 'authors',

    underscored: true,
    getterMethods: {

    },
    classMethods: {

        associate: function (models) {
            Author.hasMany(
                models.Comment, {
                    as: 'comments',

                    foreignKey: {
                        allowNull: false
                    },

                    onDelete: 'CASCADE'
                });
            Author.hasMany(
                models.Post, {
                    as: 'posts',

                    foreignKey: {
                        allowNull: false
                    }
                });
        }
    },
    instanceMethods: {

        apiRepr: function () {
            return {
                id: this.id,
                userName: this.userName,
                firstName: this.firstName,
                lastName: this.lastName
            };
        }
    }
});


module.exports = {
    Author
};