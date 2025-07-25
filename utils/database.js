const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("db", "root", "hjp1008611",{
    host:"localhost",
    dialect:"mysql",
    port: 3308
});

module.exports = sequelize;