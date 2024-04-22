const user=require("../models/userModel")
const cartModel=require("../models/cartModel")
const productModel=require("../models/productModel")
const cartHelper=require("../helper/cartHelper")
const orderHelper=require("../helper/orderHelper")
const couponHelper=require("../helper/couponHelper")
const moment=require("moment")
const couponModel=require("../models/couponModel")
const Razorpay = require("razorpay");






// const checkoutpage=async(req,res)=>{
//     try {
//         const userId=req.session.user
       
//         const userData=await user.findById({_id:userId})
//         const cartItems= await cartHelper.getAllCartItems(userId)
//         let totalandSubTotal = await cartHelper.totalSubtotal(userId, cartItems);

//         let totalAmountOfEachProduct = [];
//         for (i = 0; i < cartItems.products.length; i++) {
//           let total =
//             cartItems.products[i].quantity * parseInt(cartItems.products[i].price);
//             console.log(cartItems.products[i].quantity , parseInt(cartItems.products[i].price))
//             console.log(total)
          
//           totalAmountOfEachProduct.push(total);
//         }
//         res.render('user/user-checkout',{
//             userData,
//             cartItems,
//             totalandSubTotal,
//             totalAmountOfEachProduct
//         })
//     } catch (error) {
//         console.log(error);        
//     }
//   }

const checkoutpage = async (req, res) => {
  try {
    const userId = req.session.user;
    const userData = await user.findById({ _id: userId })
    let cartItems = await cartHelper.getAllCartItems(userId);
    let cart = await cartModel.findOne({ user: userId });
    const coupons = await couponHelper.findAllCoupons();
    let totalandSubTotal = await cartHelper.totalSubtotal(userId, cartItems);
    if (cart.coupon != null) {
      const appliedCoupon = await couponModel.findOne({ code: cart.coupon });
      cartItems[0].couponAmount = appliedCoupon.discount;
  
      let totalAmountOfEachProduct = [];
      for (i = 0; i < cartItems.products.length; i++) {
        let total = cartItems.products[i].quantity * parseInt(cartItems.products[i].price);
        totalAmountOfEachProduct.push(total);
      }
      totalandSubTotal = totalandSubTotal;
      console.log(cartItems);
      if (cartItems) {
        res.render("user/user-checkout", {
          cartItems,
          totalAmountOfEachProduct,
          totalandSubTotal,
          userData,
          coupons,
        });
      }
    } else {
      let totalAmountOfEachProduct = [];
      for (i = 0; i < cartItems.products.length; i++) {
        let total = cartItems.products[i].quantity * parseInt(cartItems.products[i].price);
        totalAmountOfEachProduct.push(total);
      }
      totalandSubTotal = totalandSubTotal;
  
      if (cartItems) {
        res.render("user/user-checkout", {
          cartItems,
          totalAmountOfEachProduct,
          totalandSubTotal,
          userData,
          coupons,
        });
      }
    }
    
  } catch (error) {
    console.log(error);
  }
}


  const placeOrder = async (req, res) => {
   
    const body = req.body;
    const status = req.body.status;
   
    const userId = req.session.user;
    
    
    const result = await orderHelper.placeOrder(body, userId);
    if (result.status) {
      const cart = await cartHelper.clearAllCartItems(userId);
      if (cart) {
        res.json({ url: "/ordersuccesspage" ,status:true});
      }
    } else {
      res.json({message:result.message,status:false})
    }
  };
  

  

  const ordersuccsspageload=(req,res)=>{
    res.render("user/ordersuccesspage")
  }


  
  const orderDetails = async (req, res) => {
    try {
      const orderId = req.params.id;
      const userData = await user.findById({_id:req.session.user})
      const orderDetails = await orderHelper.getSingleOrderDetails(orderId);
      const productDetails = await orderHelper.getOrderDetailsOfEachProduct(
        orderId
      );
      console.log("this is product details",productDetails);


  
      if (orderDetails && productDetails) {
        res.render("user/orderDetails", {
          userData,
          orderDetails,
          productDetails
        });
      }
    } catch (error) {
      console.log(error);
    }
  };


  const orderspage = async(req,res)=>{
    try {
      const allOrders = await orderHelper.getAllOrders();
      for (const order of allOrders) {
        const dateString = order.orderedOn;
        order.formattedDate = moment(dateString).format("MMMM Do, YYYY");
      }
  
      res.render("admin/admin-orderspage", { allOrders });
    } catch (error) {
      console.log(error);
    }
  }
  
  const changeOrderStatusOfEachProduct = async (req, res) => {
    const orderId = req.params.orderId;
    const productId = req.params.productId;
    const status = req.body.status;
    const result = await orderHelper.changeOrderStatusOfEachProduct(
      orderId,
      productId,
      status,
    );
    if (result) {
      res.json({ status: true });
    } else {
      res.json({ status: false });
    }
  };

  const adminOrderDetails = async (req, res) => {
    try {
      const orderId = req.params.id;
  
      const productDetails = await orderHelper.getOrderDetailsOfEachProduct(
        orderId
      );
      const userData = await user.findOne({ _id: productDetails[0].user });
      for (const product of productDetails) {
        const dateString = product.orderedOn;
        product.formattedDate = moment(dateString).format("MMMM Do, YYYY");
        product.formattedTotal = product.totalAmount;
        product.products.formattedProductPrice = product.products.productPrice;
      }
      
      if (orderDetails && productDetails) {
        res.render("admin/admin-orderDetailspage", { orderDetails, productDetails, userData });
      }
      console.log(productDetails);
    } catch (error) {
      console.log(error);
    }
  };

  const changeOrderStatus = async (req, res, next) => {
    try {
      const response = await orderHelper.changeOrderStatus(
        req.body.orderId,
        req.body.status
      );
      res.json({
        error: false,
        message: "order status updated",
        status: response.orderStatus,
      });
    } catch (error) {
      return next(error);
    }
  };

  const cancelSingleOrder = async (req, res) => {
    try {
      const orderId = req.query.orderId;
      const singleOrderId = req.query.singleOrderId;
      const price = req.query.price;
      
      const result = await orderHelper.cancelSingleOrder(orderId, singleOrderId,price);
      if (result) {
        res.json({ status: true });
      } else {
        res.json({ status: false });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const createOrder = async (req, res) => {
    try {
      const amount = parseInt(req.body.totalPrice);
      console.log(amount);
      const order = await razorpay.orders.create({
        amount: amount * 100,
        currency: "INR",
        receipt: req.session.user,
      });
  
      console.log(order);
  
      res.json({ orderId: order });
    } catch (error) {
      console.log(error);
    }
  };
  module.exports={
    checkoutpage,
    ordersuccsspageload,
    placeOrder,
    orderDetails,
    orderspage,
    changeOrderStatusOfEachProduct,
    adminOrderDetails,
    cancelSingleOrder,
    changeOrderStatus,
    createOrder
  }