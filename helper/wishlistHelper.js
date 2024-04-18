
const wishlistModel=require("../models/wishlistModel")
const productModel=require("../models/productModel")
const ObjectId = require("mongoose").Types.ObjectId;    


const getAllWishlistProducts = (userId) => {
    console.log("this is get all wishlist products");
    return new Promise(async (resolve, reject) => {
      let wishlistProducts = await wishlistModel.aggregate([
        {
          $match: {
            user: new ObjectId(userId),
          },
        },
  
        {
          $unwind: "$products",
        },
        {
          $project: {
            item: "$products.productItemId",
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "item",
            foreignField: "_id",
            as: "product",
          },
        },
        {
          $project: {
            item: 1,
            product: {
              $arrayElemAt: ["$product", 0],
            },
          },
        },
      ]);
      resolve(wishlistProducts);
    });
  };

  const getWishListCount = (userId) => {
  
    return new Promise(async (resolve, reject) => {
      let wishlist = await wishlistModel.findOne({ user: userId });
      let wishlistCount = wishlist?.products.length;
      resolve(wishlistCount);
    });
  };

  const addToWishlist = (userId, productId) => {
    
    return new Promise(async (resolve, reject) => {
      console.log(productId);
      const product = await productModel.findOne({ _id: productId });
  
      if (!product || !product.productstatus) {
        reject(Error("Product Not Found"));
        return;
      }

      const existingWishlist = await wishlistModel.findOne({ user: userId, 'products.productItemId': productId });

      if (existingWishlist) {
         
          resolve({ alreadyExists: true });
          return;
      }else{
  
      const wishlist = await wishlistModel.updateOne(
        {
          user: userId,
        },
        {
          $push: {
            products: { productItemId: productId },
          },
        },
        {
          upsert: true,
        }
      );
   
  
      resolve(wishlist);
    }
    });
    
  };


  const isInWishlist = (userId, productId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const wishList = await wishlistModel.findOne({
          user: userId,
          "products.productItemId": productId,
        });
  
        if (wishList) {
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
  
  const removeProductFromWishlist = (userId, productId) => {
    return new Promise(async (resolve, reject) => {
      const removeItemss = await 
      wishlistModel.findOne({
        user: new ObjectId(userId),
      });
      console.log("ajscjac", removeItemss);
      await wishlistModel
        .updateOne(
          {
            user: new ObjectId(userId),
          },
          {
            $pull: {
              products: {
                productItemId: productId,
              },
            },
          }
        )
        .then((result) => {
          resolve(result);
        });
    });
  };
  

  module.exports={
    getAllWishlistProducts,
    getWishListCount,
    addToWishlist,
    isInWishlist,
    removeProductFromWishlist
  }