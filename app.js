const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error')
const sequelize = require('./util/database')
const Product = require('./models/product')
const User = require('./models/user')
const Cart = require('./models/cart')
const CartItem = require('./models/cart-item')
const Order = require('./models/order')
const OrderItem = require('./models/order-item')

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');


//Testing code
// db.execute('SELECT * FROM products')
//     .then((result) => {
//         console.log(result[0][0], result[0][1])
//     })
//     .catch((err) => {
//         console.log(err)
//     });


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//add a middleware for the user to use it anywhere in the app
app.use((req, res, next) => {
    //retreive the user from the db
    User.findByPk(1) //find is the equivalent of fetch
        .then(user => {
            //store the user in a request
            req.user = user //just we must make sure to don't override an existing field like body // user is a sequelize object and not just a js obj so we can apply all sequelize methods on it
            next()
        })
        .catch(err => console.log(err));
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

// app.use((req, res, next) => {
//   res.status(404).render('404', { pageTitle: 'Page Not Found' });
// });

app.use(errorController.errorPage);


Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' }) //a user created this product // onDelete cascade means the deletion will also be executed for the product related to the user
User.hasMany(Product)//optional: a one direction is enough
User.hasOne(Cart)
Cart.belongsTo(User)//optional
Cart.belongsToMany(Product, { through: CartItem }) //sequelize: getProducts() //through to tell sequelize where these connections should be stored
Product.belongsToMany(Cart, { through: CartItem }) //a many-to-many relation
//this only work with an intermediate table that interconnects them (stores a combination of cart ids and product ids) :cart-item model
Order.belongsTo(User)
User.hasMany(Order) //one to many relation
Order.belongsToMany(Product, { through: OrderItem })



//with this set up sequelize.sync() will not just create tables for our models but also define the relations in the database as we defined them here

sequelize
    //sync syncs our models to the db by creating the appropriate tables and relations
    // .sync({ force: true })  // we already created the products table => it will not override it with the new information so we set force to true to ensure that it will
    .sync()
    .then(result => { //once all the tables are created
        return User.findByPk(1) //gonna check if there's one user otherwise create one
        // console.log(result)
    })
    .then(user => {
        if (!user) {
            return User.create({ name: 'Fatma', email: 'fatmasliti289@gmail.com' })
        }
        // return Promise.resolve(user)
        return user //if a value is returned in a then block it's automatically wrapped into a new promise
    })
    .then(user => {
        // console.log(user)
        user.createCart() //the cart is empty at the beginning
    }).then(cart => {
        app.listen(3000);
    })
    .catch(err => {
        console.log(err)
    })
