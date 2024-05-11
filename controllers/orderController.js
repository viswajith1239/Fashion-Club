const user=require("../models/userModel")
const cartModel=require("../models/cartModel")
const productModel=require("../models/productModel")
const cartHelper=require("../helper/cartHelper")
const orderHelper=require("../helper/orderHelper")
const couponHelper=require("../helper/couponHelper")
const moment=require("moment")
const couponModel=require("../models/couponModel")
const orderModel=require("../models/orderModel")
const Razorpay = require("razorpay");

var razorpay = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.KEY_SECRET,
});






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
    console.log("hi",cartItems);
    let cart = await cartModel.findOne({ user: userId });
    const coupons = await couponHelper.findAllCoupons();
    let totalandSubTotal = await cartHelper.totalSubtotal(userId, cartItems);

    if (cart.coupon != null) {
      const appliedCoupon = await couponModel.findOne({ code: cart.coupon });
      cartItems.couponAmount = appliedCoupon.discount;
  console.log("d=>>>>>>>>>>>>>>>>>>>>>",cartItems.couponAmount);
      let totalAmountOfEachProduct = [];

      for (i = 0; i < cartItems.products.length; i++) {
        let total = cartItems.products[i].quantity * parseInt(cartItems.products[i].price);
        totalAmountOfEachProduct.push(total);
      }
      totalandSubTotal = totalandSubTotal;
      console.log(cartItems);
      if (cartItems) {
        console.log("cartItems ssssssss", cartItems)
        res.render("user/user-checkout", {
          cartItems,
          totalAmountOfEachProduct,
          totalandSubTotal,
          userData,
          coupons,
          userId,
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
        console.log("cartItems s---", cartItems)
        res.render("user/user-checkout", {
          cartItems,
          totalAmountOfEachProduct,
          totalandSubTotal,
          userData,
          coupons,
          userId,
        });
      }
    }
    
  } catch (error) {
    console.log(error);
  }
}


  // const placeOrder = async (req, res) => {
   
  //   const body = req.body;
  //   const status = req.body.status;
   
  //   const userId = req.session.user;
  //   console.log("this is body",body.couponCode);
  //   let coupon = await couponModel.findOne({ code: body.couponCode })
    
    
  //   console.log("this is coupon",coupon);
  //   const result = await orderHelper.placeOrder(body, userId);
  //   if (result.status) {
    
  //     coupon.usedBy.push(userId);
  //     await coupon.save();
  //     const cart = await cartHelper.clearAllCartItems(userId);
  //     if (cart) {
  //       res.json({ url: "/ordersuccesspage" ,status:true});
  //     }
  //   } else {
  //     res.json({message:result.message,status:false})
  //   }
  // };

//   const placeOrder = async (req, res) => {
//     const body = req.body;
//     const status = req.body.status;
   
//     const userId = req.session.user;
    
//     console.log("place ordeer failed");
//     let coupon = await couponModel.findOne({ code: body.couponCode });
//     let orderdata= await cartModel.find({user:userId})
    
  
    
//     console.log("this is coupon", coupon);
   
//     const result = await orderHelper.placeOrder(body, userId,coupon);
    
    
//     if (result.status) {
//         if (coupon) {
//             coupon.usedBy.push(userId);
            
//             await coupon.save();
          
//         }
        
//         const cart = await cartHelper.clearAllCartItems(userId);
        
//         if (cart) {
          
//             res.json({ url: "/ordersuccesspage", status: true });
//         } 
//     } else {
//         console.log('payment failed');
//         res.json({ message: result.message, status: false });
//     }
// };

const placeOrder = async (req, res) => {
  const body = req.body;
  const status = req.body.status;
  const userId = req.session.user;
  console.log("place order failed");
  
  let coupon = await couponModel.findOne({ code: body.couponCode });
  let orderdata = await cartModel.find({ user: userId });
  console.log("this is coupon", coupon);
  
  

      const cart = await cartModel.findOne({user:userId})

      if (cart) {
         
          if (parseFloat(body.totalAmount) > 1000 && body.paymentOption === "COD") {
             
              return res.json({ message: "COD is not available for this price range", status: false });
          } else {
              const result = await orderHelper.placeOrder(body, userId, coupon);

              if (result.status) {
                if (coupon) {
                    coupon.usedBy.push(userId);
                    await coupon.save();
                }
              await cartHelper.clearAllCartItems(userId);
             
              return res.json({ url: "/ordersuccesspage", status: true });
          }
      }
  } else {
      console.log('payment failed');
     
      return res.json({ message: result.message, status: false });
  }
};


  

  

  const ordersuccsspageload=(req,res)=>{
    const userId = req.session.user;
    res.render("user/ordersuccesspage",{
      userId,
    })
  }


  
  const orderDetails = async (req, res) => {
    try {
      const userId = req.session.user;
      const orderId = req.params.id;
      const userData = await user.findById({_id:req.session.user})
      console.log("this is userdata",userData);
      const orderDetails = await orderHelper.getSingleOrderDetails(orderId);
      const productDetails = await orderHelper.getOrderDetailsOfEachProduct(
        orderId
      );
      console.log("this is product details",productDetails);


  
      if (orderDetails && productDetails) {
        res.render("user/orderDetails", {
          userData,
          orderDetails,
          productDetails,
          userId,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };


  const orderspage = async(req,res)=>{
    try {
      const page = req.query.page || 1;
      const startIndex = (page-1) * 6;
      const endIndex = page*6;
      const productcount= await orderModel.find().count()
   
      const totalPage = Math.ceil(productcount/6);
      const orders= await orderModel.find().skip(startIndex).limit(6)
      let allOrders = await orderHelper.getAllOrders();
      for (const order of allOrders) {
        const dateString = order.orderedOn;
        order.formattedDate = moment(dateString).format("MMMM Do, YYYY");
      }
      allOrders = allOrders.slice(startIndex,endIndex);
      res.render("admin/admin-orderspage", {orders,allOrders,page,totalPage });
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
    console.log("entered in to create order");
    try {
      const amount = parseInt(req.query.totalAmount);
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

  const returnSingleOrder = async (req, res) => {
    try {
      const orderId = req.query.orderId;
      const singleOrderId = req.query.singleOrderId;
      const price = req.query.price;
      const result = await orderHelper.returnSingleOrder(orderId, singleOrderId,price);
      if (result) {
        res.json({ status: true });
      } else {
        res.json({ status: false });
      }
    } catch (error) {
      console.log(error);
    }
  };
  const orderFailedPageLoad = (req, res) => {
    const userId = req.session.user;
    res.render("user/orderFailure-page",{
      userId,
    });
  };

  const paymentSuccess = (req, res) => {
    try {
      const { paymentid, signature, orderId } = req.body;
      const { createHmac } = require("node:crypto");
  
      const hash = createHmac("sha256", process.env.KEY_SECRET)
        .update(orderId + "|" + paymentid)
        .digest("hex");
  
      if (hash === signature) {
        console.log("success");
        res.status(200).json({ success: true, message: "Payment successful" });
      } else {
        console.log("error");
        res.json({ success: false, message: "Invalid payment details" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };
 
  



  const SalesReportload = async (req, res) => {
    try {
      const page = req.query.page || 1;
      const startIndex = (page-1) * 6;
      const endIndex = page*6;
      orderHelper .salesReport().then((response) => {
          console.log("this is respos",response);
          response.forEach((order) => {
            const orderDate = new Date(order.orderedOn);
            const formattedDate = orderDate.toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            });
            order.orderedOn = formattedDate;
          });
          const productcount= response.length
          const totalPage = Math.ceil(productcount/6);
          response = response.slice(startIndex,endIndex)
          res.render("admin/admin-salesReport", { sales: response, page,totalPage});
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const SalesReportDateSortload = async (req, res) => {
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    console.log(startDate, endDate);
    orderHelper.salesReportDateSort(startDate, endDate).then((response) => {
        console.log(response);
        response.forEach((order) => {
          const orderDate = new Date(order.orderedOn);
          const formattedDate = orderDate.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          });
          order.orderedOn = formattedDate;
        });
  
        res.json({ sales: response });
      })
      .catch((error) => {
        console.log(error);
      });
  };



  const retryPayment = async (req, res) => {
    try {
      console.log("inside retrypayment");
      const orderId = req.query.orderId;
      console.log('orderId',orderId);
      const orderDetails = await orderModel.findOne({ orderId: orderId });
      console.log(orderDetails);
  
      orderDetails.products.forEach((item) => {
        item.status = "pending";
      });
     
      await orderDetails.save();
      
      const totalAmount = orderDetails.totalAmount;
      console.log('orderdetails',orderDetails);
  
    
      res.status(200).json({ orderId: orderDetails._id, totalAmount });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal server error" });
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
    createOrder,
    SalesReportload ,
    orderFailedPageLoad,
    SalesReportDateSortload,
    paymentSuccess,
    returnSingleOrder,
    retryPayment  
  }