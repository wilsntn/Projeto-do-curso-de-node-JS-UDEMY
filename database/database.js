const Sequelize = require('sequelize');

const connection = new Sequelize('guiaperguntas','root','!@34win-vnc&*90oxaGvCAn2',{
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = connection;
