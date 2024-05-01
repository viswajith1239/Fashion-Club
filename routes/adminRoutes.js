const express = require('express')
const app = express()
const router = express.Router()
const nocache = require('nocache')
const categoryHelper = require("../helper/categoryHelper")
const adminController = require('../controllers/adminController')
const multer = require('../middlewares/multer')
const productHelper = require('../helper/productHelper')
const adminMiddleware = require('../middlewares/adminMiddleware')
const orderController = require('../controllers/orderController')
const couponController = require("../controllers/couponController")
const offerController = require("../controllers/offerController")

router.get('/product-list', adminMiddleware.islogoutAdmin, adminController.Loadproductlists)
router.get('/admin-userEdit', adminMiddleware.islogoutAdmin, adminController.LoadadminuserEdit)
router.get('/admin-category', adminMiddleware.islogoutAdmin, adminController.LoadadminCategories);
router.get('/admin-login', adminMiddleware.isloginAdmin, adminController.Adminloginload)
router.get("/admin-editcategory", adminMiddleware.islogoutAdmin, adminController.loadEditcategory)
router.get("/admin-catEditor/:id", adminMiddleware.islogoutAdmin, adminController.modalLoader)
router.get('/adminadd-products', adminMiddleware.islogoutAdmin, adminController.LoadAddproduct)
router.get('/admin-dashboard', adminMiddleware.islogoutAdmin, adminController.Loaddashboard)
router.get("/product-listEdit/:id", adminMiddleware.islogoutAdmin, adminController.editProductLoad);
router.get('/logoutAdmin', adminMiddleware.islogoutAdmin, adminController.logoutAdmin)
router.get("/admin-orders", orderController.orderspage)
router.get("/admin-orderDetails/:id", adminMiddleware.islogoutAdmin, orderController.adminOrderDetails)
router.get("/admin-coupon", adminMiddleware.islogoutAdmin, couponController.adminCoupon)
router.get("/editCoupon/:id", adminMiddleware.islogoutAdmin, couponController.getEditCoupon);
router.get("/admin-productoffer", adminMiddleware.islogoutAdmin, offerController.productofferLoad)
router.get("/productEditOffer/:id", adminMiddleware.islogoutAdmin, offerController.productEditLoad);
router.get("/admin-categoryoffer", adminMiddleware.islogoutAdmin, offerController.categoryofferLoad)
router.get("/categoryEditOffer/:id", adminMiddleware.islogoutAdmin, offerController.categoryEditLoad);
router.get("/admin-salesReport",adminMiddleware.islogoutAdmin, orderController.SalesReportload );



router.patch("/blockuser", adminMiddleware.islogoutAdmin, adminController.blockUser)
router.patch("/listunlist", adminMiddleware.islogoutAdmin, adminController.listunlist)
router.patch("/editcategory", adminMiddleware.islogoutAdmin, categoryHelper.editedSave)
router.patch('/deleteproduct/:id', adminMiddleware.islogoutAdmin, adminController.softdeleteproduct)
router.patch("/orderStatusChangeForEachProduct/:orderId/:productId", adminMiddleware.islogoutAdmin,
    orderController.changeOrderStatusOfEachProduct);
    router.patch('/deleteCategoryOffer/:id', adminMiddleware.islogoutAdmin,offerController.deleteCategoryOffer);
    router.patch('/deleteProductOffer/:id', adminMiddleware.islogoutAdmin,offerController.deleteProductOffer);
    router.patch("/deleteImage/:id/:image",adminMiddleware.islogoutAdmin,adminController.deleteImage);

router.put('/addcategory', adminMiddleware.islogoutAdmin, adminController.addcategory)
router.put("/orderStatusChange", orderController.changeOrderStatus);
router.put("/editProduct/:id", adminMiddleware.islogoutAdmin, multer.productUpload.array("images"), productHelper.editProductPost)
router.post('/addproduct', adminMiddleware.islogoutAdmin, multer.productUpload.array("images"), adminController.addProduct)
router.post('/admin-login', adminMiddleware.isloginAdmin, adminController.checkAdmin)
router.post("/addCoupon", adminMiddleware.islogoutAdmin, couponController.addCoupon);
router.post("/editCoupon", adminMiddleware.islogoutAdmin, couponController.editCoupon);
router.post("/productAddOffer", adminMiddleware.islogoutAdmin, offerController.productAddOffer);
router.post("/productEditOffer", adminMiddleware.islogoutAdmin, offerController.productEditOffer);
router.post("/categoryAddOffer", adminMiddleware.islogoutAdmin, offerController.addCategoryOffer);
router.post("/categoryEditOffer", adminMiddleware.islogoutAdmin, offerController.categoryEditOffer);
router.post("/admin-salesReport",adminMiddleware.islogoutAdmin, orderController.SalesReportDateSortload);

router.delete("/deleteCoupon/:id", adminMiddleware.islogoutAdmin, couponController.deleteCoupon)




module.exports = router