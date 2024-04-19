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



router.get('/register',userController.Loadregister)
router.get('/',userController.loadhomepage)
router.get('/otp-verification',userController.loadotp)
router.get('/forgot-password',userController.loadforgot)
router.post('/login',userController.checkUser)
router.get('/login',userMiddleware.islogin,userController.loginLoad)
router.get('/home-page',userController.loadhomepage)
router.get('/user-productpage/:id',userMiddleware.islogout,userController.Loaduserproduct)
router.get('/logout',userMiddleware.islogout,userController.logoutUser)
router.get('/productView',userController.productDetails)
router.get('/user-account',userMiddleware.islogout,userController.loadAccount)
router.get('/addressEditor/:userId/:addressId',userController.addressEditModal)
router.get('/user-cart',cartConroller.userCart)
router.get('/shop',userController.shopPage)
router.get("/shopFilter", userMiddleware.islogout, userController.shopFilterLoad);
router.get('/checkout',orderController.checkoutpage)
router.get("/ordersuccesspage",orderController.ordersuccsspageload)
router.get("/orderDetails/:id",orderController.orderDetails);
router.get("/user-wishlist",wishlistController.wishlistLoad)


router.post('/resendOTP',otpHelper.resendOtp)
router.post('/otp-verification',userController.insertUserWithVerify)
router.post('/register',otpHelper.sentotp)

router.post("/addToCart/:id/:size", productController.addToCart);

router.post("/addToWishlist/:id", wishlistController.addToWishlist);

router.post("/placeOrder",orderController.placeOrder)

router.post("/searchProduct", productController.searchProduct);

router.post("/applyCoupon", couponController.applyCoupon);

router.patch('/addAddress',userController.addAddress)

router.patch("/updateCartQuantity",cartConroller.updateCartQuantity);

router.patch("/cancelSingleOrder", orderController.cancelSingleOrder);

router.delete("/removeCart/:id",cartConroller.removeCartItem)


router.put('/editAddress/:id',userController.editAddress)

router.put("/updateUser",userController.updateUser)

router.put('/deleteAddress/:id',userController.deleteAddress)

router.put('/updatePassword',userController.updatePassword)

router.put("/removeFromWishlist", wishlistController.removeFromWishlist);




module.exports=router