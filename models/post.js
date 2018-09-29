'use strict';


const Sequelize = require('sequelize');

const {
    sequelize
} = require('../db/sequelize');


const Post = sequelize.define('Post', {
    title: {
        type: Sequelize.STRING,


    },
    content: {
        type: Sequelize.STRING
    }
}, {

    tableName: 'posts',


    underscored: true,
    getterMethods: {

    },
    classMethods: {

        associate: function (models) {
            Post.hasMany(
                models.Comment, {
                    as: 'comments',

                    foreignKey: {
                        allowNull: false
                    },

                    onDelete: 'CASCADE'
                });
        }
    },
    instanceMethods: {

        apiRepr: function () {
            return {
                id: this.id,
                createdAt: this.createdAt,
                title: this.title,
                content: this.content,
            }
        }
    }
});


module.exports = {
    Post
};