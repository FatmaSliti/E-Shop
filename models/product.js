const Sequelize = require("sequelize"); //this will give me a class

const sequelize = require("../util/database"); // a fully configured sequelize envirement which does also have the database connection pool (all the features of the sequelize package)

//1-name of the model
//2-structure of the model (of the automatically created db table) :js obj that contains fiels our product should have
const Product = sequelize.define("product", { //when creating the table sequelize pluralize this automatically (=> products)
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    title: Sequelize.STRING,
    price: {
        type: Sequelize.DOUBLE,
        allowNull: false
    },
    imageUrl: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false,
    },
});

module.exports = Product;
