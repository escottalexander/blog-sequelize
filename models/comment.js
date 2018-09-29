'use strict';


const Sequelize = require('sequelize');

const {
    sequelize
} = require('../db/sequelize');


const Comment = sequelize.define('Grade', {
    content: {
        type: Sequelize.STRING,

    }

}, {

    tableName: 'comments',


    underscored: true,
    classMethods: {

        associate: function (models) {
            Comment.belongsTo(
                models.Author,

                {
                    foreignKey: {
                        allowNull: false
                    },
                    onDelete: 'CASCADE'
                }
            );
            Comment.belongsTo(
                models.Post,

                {
                    foreignKey: {
                        allowNull: false
                    },
                    onDelete: 'CASCADE'
                }
            );
        }
    },
    instanceMethods: {

        apiRepr: function () {
            return {
                id: this.id,
                content: this.content,
                createdAt: this.createdAt,
                authorId: this.authorId,
                postId: this.postId
            }
        }
    }
});


module.exports = {
    Comment
};