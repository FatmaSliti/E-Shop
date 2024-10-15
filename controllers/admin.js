//import my class
const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
    res.render("admin/edit-product", {
        pageTitle: "Add Product",
        path: "/admin/add-product",
        editing: false,
    });
};

exports.postAddProduct = (req, res, next) => {
    // products.push({ title: req.body.title }); //we'll use the model instead
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    //create a new Product
    // Product.create({
    //     title: title,
    //     imageUrl: imageUrl,
    //     price: price,
    //     description: description,
    //     userId: req.user.id //this is the manual method and the .createProduct is the dynamic one
    // }) //create will immediately save it to db

    req.user
        .createProduct({ //createProduct is combined from 'create' and 'Product' which is the name of the model the user belongs to(we defined the relation in app.js)
            title: title,
            imageUrl: imageUrl,
            price: price,
            description: description,
        }) //we pass only the data that can't been inferred by sequelize (userId and timestamp no)
        .then((result) => {
            // console.log(res)
            console.log("Product Created!");
            res.redirect("/admin/products");
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit; //if the query param (edit = true) exists it will be true else undefined which conveniently is also treated as false in a Boolean check
    if (!editMode) {
        return res.redirect("/");
    }
    //to prepopulate the form in the edit mode we need to fetch the data first
    const prodId = req.params.productId;

    //to restrict the product to a specific user
    req.user.getProducts({ where: { id: prodId } })
        // Product.findByPk(prodId)
        .then((products) => {
            const product = products[0]
            if (!product) {
                return res.redirect("/");
            }
            res.render("admin/edit-product", {
                pageTitle: "Edit Product",
                path: "/admin/edit-product",
                // editing: true
                editing: editMode, //these are variables availble in the template we can use them directly in the views
                product: product,
            });
        })
        .catch((err) => console.log(err));

    // Product.findByPk(prodId, (product) => {
    //     if (!product) {
    //         return res.redirect("/");
    //     }
    //     res.render("admin/edit-product", {
    //         pageTitle: "Edit Product",
    //         path: "/admin/edit-product",
    //         // editing: true
    //         editing: editMode, //these are variables availble in the template we can use them directly in the views
    //         product: product,
    //     });
    // });
};

// exports.postEditProduct = (req, res, next) => {
//     //we need to construct a new product and replace the old one with the updated one
//     //1-fetch information for the product
//     const prodId = req.body.productId;
//     const updatedTitle = req.body.title;
//     const updatedImageUrl = req.body.imageUrl;
//     const updatedPrice = req.body.price;
//     const updatedDesc = req.body.description;
//     //2-create a new product instance and populate it with that information
//     const updatedProduct = new Product(
//         prodId,
//         updatedTitle,
//         updatedImageUrl,
//         updatedPrice,
//         updatedDesc
//     );
//     //3-call save()
//     updatedProduct.save();
//     //redirect
//     res.redirect("/admin/products");
// };

exports.postEditProduct = (req, res, next) => {
    //we need to construct a new product and replace the old one with the updated one
    //1-fetch information for the product
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedImageUrl = req.body.imageUrl;
    const updatedPrice = req.body.price;
    const updatedDesc = req.body.description;
    Product.findByPk(prodId)
        .then((product) => {
            product.title = updatedTitle;
            product.imageUrl = updatedImageUrl;
            product.price = updatedPrice;
            product.description = updatedDesc;
            //3-call save()
            return product.save(); //save is a sequelise method
        })
        .then((result) => {
            console.log("UPDATED PRODUCT!");
            //redirect
            res.redirect("/admin/products"); // we only redirect if the update was successful
        })
        .catch((err) => console.log(err));
};

// exports.getProducts = (req, res, next) => {
//     Product.fetchAll((products) => {
//         res.render("admin/products", {
//             prods: products,
//             pageTitle: "Admin Products",
//             path: "/admin/products",
//         });
//     });
// };

exports.getProducts = (req, res, next) => {
    // Product.fetchAll()
    //     .then(([rows]) => {
    //         res.render("admin/products", {
    //             prods: rows,
    //             pageTitle: "Admin Products",
    //             path: "/admin/products",
    //         });
    //     })
    //     .catch((err) => {
    //         console.log(err);
    //     });
    
    // Product.findAll()
    //to find products only for one user
    req.user.getProducts() //give me all products for this user
        .then((products) => {
            res.render("admin/products", {
                prods: products,
                pageTitle: "Admin Products",
                path: "/admin/products",
            });
        })
        .catch((err) => {
            console.log(err);
        });
};

// exports.postDeleteProduct = (req, res, next) => {
//     const prodId = req.body.productId;
//     Product.deleteById(prodId);
//     res.redirect("/admin/products");
// };

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findByPk(prodId) //it will fetch the product with this id
        .then((product) => {
            return product.destroy();
        })
        .then((result) => {
            console.log("Destroyed Product!");
            res.redirect("/admin/products"); //we put it here to make sure we only redirect once the delete succeeded
        })
        .catch((err) => console.log(err));
};
