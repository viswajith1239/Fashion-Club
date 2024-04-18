
const wishlistModel=require("../models/wishlistModel")
const wishlistHelper=require("../helper/wishlistHelper")
const cartHelper=require("../helper/cartHelper")



const wishlistLoad=async(req,res)=>{
    
    try {
        const userData = req.session.user;

    const cartCount = await cartHelper.getCartCount(userData);

    const wishListCount = await wishlistHelper.getWishListCount(userData);

    const wishListItems = await wishlistHelper.getAllWishlistProducts(userData);
    
    
    console.log(wishListItems)
    for (i = 0; i < wishListItems.length; i++){
      wishListItems[i].product.offerPrice = Math.round(
        wishListItems[i].product.productprice -
          (wishListItems[i].product.productprice *
            wishListItems[i].product.productDiscount) /
            100
      );
      const cartStatus = await cartHelper.isAProductInCart(userData, wishListItems[i].product._id);
      if (cartStatus) {
        console.log(true)
        wishListItems[i].cartStatus = cartStatus;
      }
      
    }
    console.log(wishListItems)



        res.render("user/user-wishlist",{
            userData: req.session.user,
            cartCount,
            wishListCount,
            wishListItems,
        })
    } catch (error) {
        console.log(error);
    }
   }

   const addToWishlist = async (req, res) => {
    
    const userId = req.session.user;
    const productId = req.params.id;
  
    const result = await wishlistHelper.addToWishlist(userId, productId);
   
    if (!result.alreadyExists) {
      res.json({ status: true });
    } else {
      res.json({ status: false });
    }
  };

  const removeFromWishlist = async(req, res) => {
    try {
      const userId = req.session.user;
      const result = await wishlistHelper.removeProductFromWishlist(userId, req.body.productId)
      if (result) {
        res.json({ status: true });
      }
    } catch (error) {
      console.log(error)
    }
  }



 module.exports={
    wishlistLoad,
    addToWishlist,
    removeFromWishlist
 }