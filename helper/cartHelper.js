
const cartModel=require('../models/cartModel')
const productModel=require('../models/productModel')
const ObjectId = require("mongoose").Types.ObjectId;

// const addToCart = (userId, productId, size) => {
//     return new Promise(async (resolve, reject) => {
//       const product = await productModel.findOne({ _id: productId });
//       const discountedPrice = Math.round(
//         product.productprice -
//           (product.productprice * product.productDiscount) / 100
//       );
//       const existingCartItem=await cartModel.findOne({
//         user:userId,
//         "products.productsItemId":productId,
//       })
//       if(!existingCartItem){
//       const cart = await cartModel.updateOne(
//         { user: userId },
//         {
//           $push: {
//             products: {
//               productItemId: productId,
//               quantity: 1,
//               size: size,
//               price: discountedPrice,
//             },
//           },
//         },
//         { upsert: true }
//       );
//       console.log(cart);
  
//       resolve(cart);
//       }else{
//         await cartModel.updateOne(
//           {user:userId,"products.productsItemId":productId,"products.size":size},
//           {$inc:{"products.$quantity":1}}
//         )
//         resolve (existingCartItem)
//       }
//     });
//   };


const addToCart = (userId, productId, size) => {
  return new Promise(async (resolve, reject) => {
      const product = await productModel.findOne({ _id: productId });
      const discountedPrice = Math.round(
          product.productprice - (product.productprice * product.productDiscount) / 100
      );
      const existingCartItem = await cartModel.findOne({
          user: userId,
          "products.productItemId": productId,
          "products.size": size,
      });
      if (!existingCartItem) {
          const cart = await cartModel.updateOne(
              { user: userId },
              {
                  $push: {
                      products: {
                          productItemId: productId,
                          quantity: 1,
                          size: size,
                          price: discountedPrice,
                      },
                  },
              },
              { upsert: true }
          );
          console.log(cart);

          resolve(cart);
      } else {
          await cartModel.updateOne(
              { user: userId, "products.productItemId": productId, "products.size": size },
              { $inc: { "products.$.quantity": 1 } }
          );
          const updatedCart = await cartModel.findOne({
              user: userId,
              "products.productItemId": productId,
              "products.size": size,
          });
          resolve(updatedCart);
      }
  });
};


  const isAProductInCart = (userId, productId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const cart = await cartModel.findOne({
          user: userId,
          "products.productItemId": productId,
        });
  
        if (cart) {
          resolve(true);
        } else {
          resolve(false);
        }
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  };
  
  const getCartCount = (userId) => {
    return new Promise(async (resolve, reject) => {
      let count = 0;
      let cart = await cartModel.findOne({ user: userId });
      if (cart) {
        count = cart.products.length;
      } else {
        count = 0;
      }
      resolve(count);
    });
  };

  const getAllCartItems = (userId) => {
    
    return new Promise(async (resolve, reject) => {
      try {
    
      let userCartItems = await cartModel.findOne({ user: new ObjectId(userId) }).populate('products.productItemId');

      // let userCartItems = await cartModel.aggregate([
       
      //   {
      //     $match: { user: new ObjectId(userId) },
      //   },
      //   {
      //     $unwind: "$products",
      //   },
      //   {
      //     $project: {
      //       item: "$products.productItemId",
      //       quantity: "$products.quantity",
      //       size: "$products.size",
      //       price:"$products.price"
      //     },
      //   },
      //   {
      //     $lookup: {
      //       from: "Products",
      //       localField: "item",
      //       foreignField: "_id",
      //       as: "product",
      //     },
      //   },
      //   {
      //     $project: {
      //       item: 1,
      //       quantity: 1,
      //       size: 1,
      //       price: 1,
      //       productName: { $arrayElemAt: ["$product.name", 0] }, // Project the name field
      //       productName: { $arrayElemAt: ["$product.name", 0] },
      //       product: {
      //         $arrayElemAt: ["$product", 0],
      //       },
      //   },}
      // ]);
  
      resolve(userCartItems);
    } catch (error) {
      reject(error);
    }
    });
  };
 

  // const totalSubtotal = (userId, cartItems) => {
  //   console.log("subtotal");
  //   return new Promise(async (resolve, reject) => {
  //     console.log(userId);
  //     let cart = await cartModel.findOne({ user: userId });
  //     let total = 0;
  //     if (cart) {
  //       console.log("entered in to cart",cart);
  //       // if (cart.coupon == null) {
  //         if (cartItems.products.length) {
  //           for (let i = 0; i < cartItems.products.length; i++) {

  //             console.log(cartItems.products[i])
  //             total =
  //               total +
  //               cartItems.products[i].quantity *
  //                 parseInt(
  //                   cartItems.products[i].productprice
  //                 );
  //           }
  //         }
  //         cart.totalAmount = parseFloat(total);
  //         console.log(cart.totalAmount);
  
  //         await cart.save();
  
  //         resolve(total);
  //       // } else {
  //       //   resolve(cart.totalAmount);
  //       // }
  //     } else {
  //       resolve(total);
       
  //     }
  //   });
  // };


  const totalSubtotal = (userId, cartItems) => {
    
    return new Promise(async (resolve, reject) => {
      console.log(userId);
      let cart = await cartModel.findOne({ user: userId });
      let total = 0;
      if (cart) {
          if (cartItems.products.length) {
            for (let i = 0; i < cartItems.products.length; i++) {
              console.log(cartItems.products[i])
              total =total + cartItems.products[i].quantity *parseInt(cartItems.products[i].price);
            }
          } 
          cart.totalAmount = parseFloat(total);
          console.log(cart.totalAmount);
  
          await cart.save();
  
          resolve(total);
       
      } else {
        resolve(total);
      }
    });
  };

  


  const incDecProductQuantity = (userId, productId, quantity) => {
    return new Promise(async (resolve, reject) => {
      const cart = await cartModel.findOne({ user: userId });
  
      const product = cart.products.find((items) => {

        return items.productItemId.toString() == productId;
      });
     
  
      const productStock = await productModel.findOne({ _id: productId });
  
      const size = product.size;
  
      const sizeStock = productStock.productQuantity.find((items) => {
        return items.size == size;
      });
      let newQuantity = product.quantity + parseInt(quantity);
  
      if (newQuantity < 1) {
        newQuantity = 1;
      }
      console.log(newQuantity);
      if (newQuantity > sizeStock.quantity) {
        resolve({ status: false, message: "Stock limit exceeded" });
      } else {
        product.quantity = newQuantity;
        await cart.save();
        resolve({
          status: true,
          message: "Quantity updated",
          price: productStock.productprice,
          discount: productStock.productDiscount,
        });
      }
    });
  };

  const removeItemFromCart = (userId, productId) => {
    return new Promise(async (resolve, reject) => {
      cartModel
        .updateOne(
          { user: userId },
          {
            $pull: { products: { productItemId: productId } },
          }
        )
        .then((result) => {
         
          resolve(result);
        });
    });
  };

  const clearAllCartItems = (userId) => {
    return new Promise(async (resolve, reject) => {
      const result = await cartModel.deleteOne({ user: userId });
      resolve(result);
    });
  };
  
  const fakeFunction = () => {

    console.log("agsdgaksdgk")
  }


  module.exports={
    addToCart,
    getCartCount,
    getAllCartItems,
    totalSubtotal,
    isAProductInCart,
    incDecProductQuantity,
    removeItemFromCart,
    clearAllCartItems
  }