const cartHelper=require("../helper/cartHelper")
const cartModel=require('../models/cartModel')
const category = require("../models/categoryModel")
const productModel=require('../models/productModel')
const userModel=require('../models/userModel')
const ObjectId=require('mongoose').Types.ObjectId


const userCart=async(req,res)=>{
    try {
        const userData=req.session.user
        console.log(userData)
        const cartItems= await cartHelper.getAllCartItems(userData)
        
        console.log('cartitems',cartItems);

        if(cartItems){
          if(cartItems.products.length>0){
            let totalandSubTotal = await cartHelper.totalSubtotal(userData, cartItems);
          

            let totalAmountOfEachProduct = [];
            for (i = 0; i < cartItems.products.length; i++) {
              let total =
              cartItems.products[i].quantity * parseInt(cartItems.products[i].price);
              
              
              
              totalAmountOfEachProduct.push(total);
            }
      
            

            res.render('user/user-cart',
          { 
            cartItems: cartItems ,
            totalAmount: totalandSubTotal,
            totalAmountOfEachProduct,
            status:true
            
          });
          }else{
            res.render("user/user-cart",{
            status:false
            })
          }
        }
        else{
          res.render("user/user-cart",{
          status:false
          })
        }
    } catch (error) {
        console.log(error);
    }
  }
const updateCartQuantity = async (req, res) => {
    
    const productId = req.query.productId;
    const quantity = req.query.quantity;
    const userId = req.session.user;
    const product = await productModel.findOne({ _id: productId }).lean();
    const update = await cartHelper.incDecProductQuantity(
      userId,
      productId,
      quantity
    );
   
    
    const cartItems = await cartHelper.getAllCartItems(userId);
    
    // console.log(offerPrice);
  
    if (update.status) {
      const cart = await cartModel.aggregate([
        { $unwind: "$products" },
        {
          $match: {
            user: new ObjectId(userId),
            "products.productItemId": new ObjectId(productId),
          },
        },
      ]);
      
      
      
  
      const totalSubtotal = await cartHelper.totalSubtotal(userId, cartItems);
      
    
  
      res.json({
        status: true,
        message: update.message,
        cartDetails: cart,
        totalSubtotal,
      });
    } else {
      res.json({ status: false, message: update.message });
    }
  };  


 



  const removeCartItem = async (req, res) => {
    try {
      const userId = req.session.user;
      const productId = req.params.id;
  
      const result = await cartHelper.removeItemFromCart(userId, productId);
  
      if (result) {
        res.json({ status: true });
      } else {
        res.json({ status: false });
      }
    } catch (error) {
      console.log(error);
    }
  };
  

  module.exports={
    userCart,
    updateCartQuantity,
    removeCartItem 
  }