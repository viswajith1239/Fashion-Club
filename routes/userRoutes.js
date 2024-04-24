const express=require('express')
const otpHelper = require('../helper/otpHelper')

const router=express.Router()

const userController=require('../controllers/userController')
const cartConroller=require('../controllers/cartController')
const productController=require("../controllers/productController")
const  orderController=require("../controllers/orderController")
const wishlistController=require("../controllers/wishlistController")
const couponController=require("../controllers/couponController")
const userMiddleware=require("../middlewares/userMiddleware")



router.get('/register',userMiddleware.islogout,userController.Loadregister)
router.get('/',userController.loadhomepage)
router.get('/otp-verification',userController.loadotp)
router.get('/forgot-password',userController.loadforgot)
router.post('/login',userMiddleware.islogout,userController.checkUser)
router.get('/login',userMiddleware.islogout,userController.loginLoad)
router.get('/home-page',userController.loadhomepage)
router.get('/user-productpage/:id',userMiddleware.islogin,userController.Loaduserproduct)
router.get('/logout',userMiddleware.islogin,userController.logoutUser)
router.get('/productView',userMiddleware.islogin,userController.productDetails)
router.get('/user-account',userMiddleware.islogin,userController.loadAccount)
router.get('/addressEditor/:userId/:addressId',userController.addressEditModal)
router.get('/user-cart',userMiddleware.islogin,cartConroller.userCart)
router.get('/shop',userMiddleware.islogin,userController.shopPage)
router.get("/shopFilter", userMiddleware.islogout, userController.shopFilterLoad);
router.get('/checkout',userMiddleware.islogin,orderController.checkoutpage)
router.get("/ordersuccesspage",userMiddleware.islogin,orderController.ordersuccsspageload)
router.get("/orderDetails/:id",userMiddleware.islogin,orderController.orderDetails);
router.get("/user-wishlist",userMiddleware.islogin,wishlistController.wishlistLoad);
router.get("/orderFailure-page", userMiddleware.islogin, orderController.orderFailedPageLoad);



router.post('/resendOTP',otpHelper.resendOtp)
router.post('/otp-verification',userController.insertUserWithVerify)
router.post('/register',otpHelper.sentotp)

router.post("/addToCart/:id/:size",userMiddleware.islogin, productController.addToCart);

router.post("/addToWishlist/:id",userMiddleware.islogin, wishlistController.addToWishlist);

router.post("/placeOrder",userMiddleware.islogin,orderController.placeOrder)

router.post("/searchProduct",userMiddleware.islogin, productController.searchProduct);

router.post("/applyCoupon",userMiddleware.islogin, couponController.applyCoupon);

router.patch('/addAddress',userMiddleware.islogin,userController.addAddress)

router.patch("/updateCartQuantity",userMiddleware.islogin,cartConroller.updateCartQuantity);

router.patch("/cancelSingleOrder", userMiddleware.islogin,orderController.cancelSingleOrder);

router.delete("/removeCart/:id",userMiddleware.islogin,cartConroller.removeCartItem)

router.post("/createOrder", orderController.createOrder);


router.put('/editAddress/:id',userMiddleware.islogin,userController.editAddress)

router.put("/updateUser",userMiddleware.islogin,userController.updateUser)

router.put('/deleteAddress/:id',userMiddleware.islogin,userController.deleteAddress)

router.put('/updatePassword',userMiddleware.islogin,userController.updatePassword)

router.put("/removeFromWishlist", userMiddleware.islogin,wishlistController.removeFromWishlist);




module.exports=router