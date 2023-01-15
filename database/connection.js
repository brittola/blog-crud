const Sequelize = require('sequelize');

const connection = new Sequelize('nomedobanco', 'usuario', 'senha', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
});

module.exports = connection;