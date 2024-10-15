const Sequelize = require("sequelize");

const sequelize = new Sequelize("node-complete-guide", "root", "14282526", {
    dialect: "mysql",
    host: "localhost",
});

module.exports = sequelize;
