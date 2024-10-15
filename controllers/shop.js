// const products = []; //we'll use the model instead

//import my class
const Product = require("../models/product");

const path = require("../util/path");
const { where } = require("sequelize");

// exports.getProducts = (req, res, next) => {
//     Product.fetchAll((products) => {
//         // we used this version because of the length error (we added a callback function)
//         res.render("shop/product-list", {
//             prods: products,
//             path: "/products",
//             pageTitle: "All products",
//         });
//     });
// };

exports.getProducts = (req, res, next) => {
    Product.findAll()
        .then((products) => {
            res.render("shop/product-list", {
                prods: products,
                path: "/products",
                pageTitle: "All products",
            });
        })
        .catch((err) => console.log(err));
};

// exports.getProduct = (req, res, next) => {
//     const prodId = req.params.productId; //productId is the name we used when we defined the route
//     Product.findById(prodId, (product) => {
//         // console.log(product)
//         res.render("shop/product-detail", {
//             product: product,
//             pageTitle: "Product details",
//             path: "/products",
//         });
//     });
// };

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId; //productId is the name we used when we defined the route

    Product.findByPk(prodId)
        .then((product) => {
            console.log(product);
            res.render("shop/product-detail", {
                product: product,
                pageTitle: product.title,
                path: "/products",
            });
        })
        .catch((err) => {
            console.log(err);
        });

    //Second method
    // Product.findAll({ where: { id: prodId } })
    //     .then(products => {
    //         res.render("shop/product-detail", {
    //             product: products[0],
    //             pageTitle: products[0].title,
    //             path: "/products",
    //         });
    //     }).catch(err => console.log(err))
};

exports.getIndex = (req, res, next) => {
    Product.findAll()
        .then((products) => {
            res.render("shop/index", {
                prods: products,
                path: "/",
                pageTitle: "Shop",
            });
        })
        .catch((err) => console.log(err));

    // Product.fetchAll()
    //     .then(([rows, fileData]) => {
    //         console.log(rows)
    //         res.render("shop/index", {
    //             prods: rows,
    //             path: "/",
    //             pageTitle: "Shop",
    //         });
    //     })
    //     .catch((err) => console.log(err));
};

exports.getCart = (req, res, next) => {
    req.user
        .getCart()
        .then((cart) => {
            return cart
                .getProducts()
                .then((products) => {
                    //we should have the products that are in this cart
                    res.render("shop/cart", {
                        path: "/cart",
                        pageTitle: "Your Cart",
                        products: products,
                    });
                })
                .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));

    // Cart.getCartProducts((cart) => {
    //     Product.fetchAll((products) => {
    //         const cartProducts = [];
    //         for (product of products) {
    //             const cartProductData = cart.products.find(
    //                 (prod) => prod.id === product.id
    //             );
    //             if (cartProductData) {
    //                 // cartProducts.push(product) //if the product is part of the cart I'll add it to cartProducts
    //                 cartProducts.push({ productData: product, qty: cartProductData.qty });
    //             }
    //         }
    // res.render("shop/cart", {
    //     path: "/cart",
    //     pageTitle: "Your Cart",
    //     products: cartProducts,
    // });
    //     });
    // });
};

exports.postCart = (req, res, next) => {
    //adding new products to teh cart
    const prodId = req.body.productId;
    //1-get access to the cart
    let fetchedCart;
    let newQuantity = 1;
    req.user
        .getCart()
        .then((cart) => {
            fetchedCart = cart; //to make the cart available globally
            //check if the product is already part of the cart otherwise increase the quantity
            return cart.getProducts({ where: { id: prodId } });
        })
        .then((products) => {
            let product;
            if (products.length > 0) {
                product = products[0];
            }
            // let newQuantity = 1;
            if (product) {
                //existing product
                const oldQuantity = product.cartItem.quantity; //cartItem give us access to the in-between table (cartItems)
                newQuantity = oldQuantity + 1;
                // return fetchedCart.addProduct(product, {
                //     through: { quantity: newQuantity }, //add the extra field called quantity with the product
                // });
                return product;
            }
            return Product.findByPk(prodId);
        })

        .then((product) => {
            return fetchedCart.addProduct(product, {
                // addProduct is a magic func created by sequelize for many-to-many relations
                through: { quantity: newQuantity }, //add the extra field called quantity with the product
            });
        })
        .then(() => {
            res.redirect("/cart");
        })
        .catch((err) => console.log(err));

    // .catch((err) => console.log(err));

    // const prodId = req.body.productId;
    // Product.findByPk(prodId, (product) => {
    //     Cart.addProduct(prodId, product.price);
    // });
    // res.redirect("/cart");
};

exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    req.user
        .getCart()
        .then((cart) => {
            return cart.getProducts({ where: { id: prodId } });
        })
        .then((products) => {
            const product = products[0];
            //remove it only from the in-between table
            return product.cartItem.destroy();
        })
        .then((result) => {
            res.redirect("/cart");
        })
        .catch((err) => console.log(err));
};

exports.postOrder = (req, res, next) => {
    //take all the cart items and move them into an order
    // 1-get all the cart items
    let fetchedCart;
    req.user
        .getCart()
        .then((cart) => {
            fetchedCart = cart;
            // 2-from the cart get all products
            return cart.getProducts();
        })
        .then((products) => {
            //create a new order for the user
            return req.user
                .createOrder()
                .then((order) => {
                    //associate my products to the order
                    return order.addProducts(
                        products.map((product) => {
                            product.orderItem = { quantity: product.cartItem.quantity }; //orderItem the name of the model
                            return product;
                        })
                    );
                })
                .catch((err) => console.log(err));
            // console.log(products)
        })
        .then((result) => {
            return fetchedCart.setProducts(null);
        })
        .then((result) => {
            res.redirect("/orders");
        })
        .catch((err) => console.log(err));
};

exports.getOrders = (req, res, next) => {
    //retreive the orders
    req.user
        //to fetch the related products to an order and return an array of orders that also includes the products per order
        .getOrders({ include: ['products'] })
        .then(orders => {
            console.log(orders)
            res.render("shop/orders", {
                path: "/orders",
                pageTitle: "Your Orders",
                orders: orders
            });
        })
        .catch(err => console.log(err));
};








/*
exports.getProducts = (req, res, next) => {
    const products = adminData.products;
    const products = Product.fetchAll();
    res.render('shop', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
        hasProducts: products.length > 0,
        activeShop: true,
        productCSS: true
    });
}
*/
