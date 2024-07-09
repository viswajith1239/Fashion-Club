const user = require("../models/userModel")
const otpHelper = require('../helper/otpHelper')
const signupHelper = require('../helper/signupHelper')
const userHelper=require("../helper/userHelper")
const bcrypt = require('bcrypt')
const productHelper=require('../helper/productHelper')
const categoryHelper=require("../helper/categoryHelper")
const Category=require('../models/categoryModel')
const productModel = require("../models/productModel")
const cartModel=require("../models/cartModel")
const moment = require("moment");
const orderHelper=require("../helper/orderHelper")
const cartHelper=require("../helper/cartHelper")
const wishlistHelper=require("../helper/wishlistHelper")
const offerHelper=require("../helper/offerHelper")
const offerModel=require("../models/offerModel")

const loginLoad = (req, res) => {
    try {
        res.render('user/login')
    } catch (error) {
        console.log(error);
    }
}

const createUser = async (req, res) => {
    try {
        const userIn = {
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mobile,
            password: req.body.password,
            isadmin: 0
        }

       
        const result = await user.create(userIn)
        if (result) {
            res.redirect("/otp-verification")
        }
    } catch (error) {
        if (error) {
            console.log(error);
            res.redirect("/register")
        }
    }
}
const checkUser = async (req, res) => {
    
    const logemail = req.body.email
    console.log('............',logemail)
    const logpassword = req.body.password
    try {
        const loggeduser = await user.findOne({
            email:logemail,
        })
        console.log('the user details is',loggeduser)
        if(!loggeduser){
            res.render("user/login",{errmessage:"wrong Email"})
        }else{
            bcrypt.compare(logpassword,loggeduser.password)
            .then((passwordMatch)=>{
                if(passwordMatch){
        if(loggeduser.isActive){
            bcrypt.compare(logpassword, loggeduser.password).then((response)=>{
                console.log("Entered in to checkUser");
                req.session.user = loggeduser._id
    //           
                res.redirect("/home-page")
                console.log(loggeduser);
            })
            .catch((error)=>{console.log(error)})
        }else{
            res.render('user/login',{blocked:"user has been blocked"})
        }
         }else{
            res.render("user/login",{errmessage:"Wrong Password"})
         }
    })
        .catch((error)=>{
            console.log("Error comparing password:",error);
            res.render('user/login',{errmessage:"An error occured"})
        })
        
//         // console.log(loggeduser);
//         // if (success) {
//         //     console.log("Entered in to checkUser");
//         //     req.session.user = loggeduser._id
//         //     console.log(req.session.user)
//         //     res.redirect("/home-page")
//             // console.log(loggeduser);
//         // } else {
//         //     res.redirect("/")
//         // }


    }

    } catch (err) {
        console.log(err.message);
    }
}




const Loadregister = (req, res) => {
    try {
        res.render('user/register')
    } catch (error) {
        console.log(error);
    }
}
const loadotp = (req, res) => {
    try {
        const message = req.flash("error");
        
        res.render("user/otp-verification",{message:message})
    } catch (error) {
        console.log(error);
    }
}
// const loadhome=(req,res)=>{
//     try{
//         res.render("home-page")
//     }catch(error){
//         console.log(error);
//     }
// }
const loadforgot = (req, res) => {
    try {
        res.render("forgot-password")
    } catch (error) {
        console.log(error);
    }
}

const insertUserWithVerify = async function (req, res) {
    try {
        const sendedOtp = req.session.otp
        const verifyOtp = req.body.otp
       


        if (sendedOtp === verifyOtp && Date.now() < req.session.otpExpiry) {
           
            req.session.otpMatched = true
           


            const userData = req.session.insertData
            console.log(userData);
            const respons = await signupHelper.doSignUp(userData)
            console.log(respons);

            
            if (!respons.status) {
                const error = respons.message
                req.flash("message", error)
                return res.redirect("/register")
            } else {
                const message = respons.message
               
                return res.redirect('/login')
            }
        } else {
           
            req.session.otpExpiry = false
            req.flash("error", "Incorrect OTP entered. Please enter the correct OTP.");
            res.redirect('/otp-verification')
        }
    } catch (error) {
        console.error(error);
        return res.redirect("/register")
    }

}
const Loaduserproduct = async (req, res) => {
    const id=req.params.id
    const userData=req.session.user
    const categories=await categoryHelper.getAllcategory()
    const product = await productModel
    
    .findById({_id:id})
    .populate("category")
    .lean()
    const categoryId= product.category._id
   
    const products = await productModel.find({category:categoryId}) 
    .populate("category")
    .lean()
   
    const catresult=await offerModel.find({'categoryOffer.category':product.category})
    const productresult=await offerModel.find({'productOffer.product':product._id})
   
    
       if(catresult.length>0&&productresult.length>0){
        product.categoryOffer=catresult[0].categoryOffer.discount
        product.productOffer=productresult[0].productOffer.discount
       }else if(catresult>0){
        product.categoryOffer=catresult[0].categoryOffer.discount
        product.productOffer= 0
       }else if(productresult>0){
        product.productOffer=productresult[0].productOffer.discount
        product.categoryOffer= 0
       }else{
        product.productOffer= 0
        product.categoryOffer= 0
       }
       console.log( "this is category offer",product.categoryOffer);
       console.log( "this is product offer",product.productOffer);
        res.render('user/user-productpage', {
         product,products,
         userData,categories })
   
}



// const logoutUser = async (req, res) => {
//     try {
//         if (req.session.user) {
//             req.session.destroy((error) => {
//                 if (error) {
//                     res.redirect('/home-page')
//                 } else {
//                     res.redirect("/home-page")
//                 }
//             })
//         } else {
//             res.redirect("/home-page")
//         }
//     } catch (error) {
//         console.log(error);

//     }
// }

const logoutUser = async (req, res) => {
    try {
        if (req.session.user) {
            req.session.destroy((error) => {
                if (error) {
                    console.log("Error destroying session:", error);
                }
                res.redirect('/home-page');
            });
        } else {
            res.redirect("/home-page");
        }
    } catch (error) {
        
        res.redirect("/home-page");
    }
}

const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
        return next()
    } else {
        res.redirect('/home-page')
    }
}

// const loadhomepage = (req, res) => {
//     try {
//         console.log(req.session.user)
//         if (req.session.user) {
//             res.render("home-page", { users: req.session.user })
//         } else {

//             res.render("home-page")
//         }
//     } catch (error) {
//         console.log(error);
//     }
// }

const loadhomepage = async(req,res)=>{
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    try{
      const users =  req.session.user;
      const categories = await categoryHelper.getAllcategory();
      const Products = await productHelper.getAllActiveProducts();
     
  console.log(Products);
      if(users){
        res.render("user/home-page", {
          products: Products ,
          users,
          categories
        
        });
      }else{
        res.render("user/home-page", {
          products: Products ,
          categories
          
        });     
      }
      
     
  
    }catch(error){
      console.log(error)
    }
  }



  const productDetails = async(req,res)=>{
    try{
     const pdata = req.query._id
     
     console.log(pdata);
    }catch(err){
        console.log(err);
    }
  }

  const loadAccount=async(req,res)=>{
    try {
        const userId=req.session.user
        const userData=await user.findOne({_id:userId})
        const walletData = await userHelper.getWalletDetails(userId);
        console.log("deeee",walletData);
        for (const amount of walletData.wallet.details) {
            amount.formattedDate = moment(amount.date).format("MMM Do, YYYY");
          }
          

        const orderDetails = await orderHelper.getOrderDetails(userId);
        for (const order of orderDetails) {
          const dateString = order.orderedOn;
          order.formattedDate = moment(dateString).format("MMMM Do, YYYY");
          order.formattedTotal = order.totalAmount;
          let quantity = 0;
          for (const product of order.products) {
            quantity += Number(product.quantity);
          }
          order.quantity = quantity;
          quantity = 0;
        }
        if(userId){
            res.render('user/user-account',{userData,orderDetails,walletData})
        }else{
            res.render('user/user-account')
        }
       
    } catch (error) {
        console.log(error);
    }
  }

  

   const addAddress= async(req,res)=>{
    try {
        const body=req.body
       
        const userId=req.session.user
        const results=await userHelper.addAddressTouser(body, userId)
        console.log(results);
        if(results){
            console.log(results);
            res.json({success:true})
            
        }

    } catch (error) {
        console.log(error);
    }
   }

   const editAddress=async(req,res,next)=>{
    try {
       
        const userId=req.session.user
        console.log(userId);
        const addressId=req.params.id;
        const body=req.body
        const result= await userHelper.editAddress(userId,addressId,body)
        if(result){
            console.log(result);
            res.json(result)
        }
    } catch (error) {
        console.log(error);
    }
   }

   const updateUser=async(req,res,next)=>{
    try {
       
        const userId=req.session.user
        console.log("User ID:", userId);
        const userDetails=req.body;
        const result=await userHelper.updateUserDetails(userId,userDetails,)
       
        res.json(result)
    } catch (error) {
        console.log(error);
    }
   }

   const addressEditModal = async (req, res) => {
    try {
     
      const userId = req.params.userId;
      const addressId = req.params.addressId;
  
     
      const userData = await user.findById(userId);
      console.log(userId)
      if (userData) {
        
        const addressData = userData.address.id(addressId);
        
        if (addressData) {
          console.log(addressData);
          res.json({ addressData });
        } else {
          res.status(404).json({ message: 'Address not found' });
        }
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  const deleteAddress=async(req,res,next)=>{
    try {
        
        const userId=req.session.user
        console.log(userId);
        const addressId=req.params.id
        const result=await userHelper.deleteAddressHelper(userId,addressId)
        if(result){
            console.log(result);
            res.json(result)
        }
    } catch (error) {
        console.log(error);
    }
  }


  const updatePassword=async(req,res,next)=>{
    try{
    const userId=req.session.user;
    const passwordDetails=req.body
   
    const result=await userHelper.updateUserPassword(userId,passwordDetails)
    res.json(result)
    }catch(error){
    console.log(error);
    }
  }

//   const shopPage=async(req,res)=>{
//     try {
//         const currentPage=req.query.page || 1;
//         const pageLimit= 3;
//         const productCount=await productModel.find({productstatus:true}).count()
//         const startIndex= (currentPage - 1)*pageLimit
//         const endIndex= currentPage*pageLimit
//         const Products=await productModel.find({productstatus:true})
//         .skip(startIndex)
//         .limit(pageLimit)
//         const totalPages=Math.ceil(productCount/pageLimit)
//         const users=req.session.user;
//         const categories=await categoryHelper.getAllcategory()
//         let products=await productHelper.getAllActiveProducts()
//         console.log(startIndex , pageLimit)
//         products = products.slice(startIndex,endIndex)
//         console.log('products',products);
//         if(users){
//         res.render('user/shop',{
//            products:products,
//             categories,
//             users,
//             currentPage,
//             totalPages,
//             startIndex,
//             endIndex,
//             Products
//         })
//     }else{
//         res.render('user/home-page',{
//             products:products,
//             categories,  currentPage,
//             totalPages,
//             startIndex,
//             endIndex,
//             Products
//         });
//     }

//     } catch (error) {
//         console.log(error);
//     }
//   }

const  shopPage= async (req, res, next) => {
    try {
      if (req.query.search) {
        let payload = req.query.search.trim();
        let searchResult = await productModel
          .find({
            name: { $regex: new RegExp( payload + ".*", "i") },
          })
          .populate("category")
          .exec();
        if (searchResult) {
          var sorted = true;
          var normalSorted=false
        }
  
        let userId = req.session.user;
        const categories = await categoryHelper.getAllActiveCategory();
  
        let cartCount = await cartHelper.getCartCount(userId);
  
        let wishListCount = await wishlistHelper.getWishListCount(userId);
  
        let products = await productHelper.getAllActiveProducts();
        for (const product of products) {
          const cartStatus = await cartHelper.isAProductInCart(
            userId,
            product._id
          );
          const wishlistStatus = await wishlistHelper.isInWishlist(
            userId,
            product._id
          );
        }
        const offerPrice = await offerHelper.findOffer(searchResult);
  
        let itemsPerPage = 6;
        let currentPage = parseInt(req.query.page) || 1;
        let startIndex = (currentPage - 1) * itemsPerPage;
        let endIndex = startIndex + itemsPerPage;
        let totalPages = Math.ceil(offerPrice.length / 6);
        console.log(totalPages);
        const currentProduct = offerPrice.slice(startIndex, endIndex);
  
        res.render("user/shop", {
          products: offerPrice,
          userData: req.session.user,
          cartCount,
          wishListCount,
          categories,
          sorted,
          normalSorted,
          totalPages,
          payload,
        });
      } else {
        let userId = req.session.user;
        
  
        
  
        const categories = await categoryHelper.getAllcategory();
  
        let cartCount = await cartHelper.getCartCount(userId);
  
        let wishListCount = await wishlistHelper.getWishListCount(userId);
  
        let products = await productHelper.getAllActiveProducts();
  
        const offerPrice = await offerHelper.findOffer(products);
        let sorted = false;
        let normalSorted;
  
        if (req.query.filter) {
          if (req.query.filter == "Ascending") {
            console.log("inside ascending");
            
            offerPrice.sort(
              (a, b) => a.productprice - b.productprice
            );
            normalSorted="Ascending"
         
          } else if (req.query.filter == "Descending") {
            offerPrice.sort(
              (a, b) => b.productprice - a.productprice
            );
            normalSorted="Descending"
        
          } else if (req.query.filter == "Alpha") {
            offerPrice.sort((a, b) => {
              const nameA = a.name.toUpperCase();
              const nameB = b.name.toUpperCase();
              if (nameA < nameB) {
                return -1;
              }
              if (nameA > nameB) {
                return 1;
              }
              return 0;
            });
            normalSorted="Alpha"
          }
        }
  
        let itemsPerPage = 6;
        let currentPage = parseInt(req.query.page) || 1;
        let startIndex = (currentPage - 1) * itemsPerPage;
        let endIndex = startIndex + itemsPerPage;
        let totalPages = Math.ceil(offerPrice.length / 6);
        console.log(totalPages);
        const currentProduct = offerPrice.slice(startIndex, endIndex);
  
        res.render("user/shop", {
          products: currentProduct,
          userData: req.session.user,
          cartCount,
          wishListCount,
          categories,
          normalSorted,
          totalPages: totalPages,sorted,filter:req.query.filter
        });
      }
    } catch (error) {
      next(error);
    }
  };

  const shopFilterLoad = async (req, res, next) => {
    try {
      console.log("reached here");
      const extractPrice = (price) => parseInt(price.replace(/[^\d]/g, ""));
      const { search, category, sort, page, limit } = req.query;
      console.log(sort);
      let filteredProducts
      if (category) {
        let userId = req.session.user;
        
        var categories = await categoryHelper.getAllcategory();
  
        var cartCount = await cartHelper.getCartCount(userId);
  
        var wishListCount = await wishlistHelper.getWishListCount(userId);
  
        var products = await productHelper.getAllActiveProducts();
        console.log("products",products)
    
  
        let categorySortedProducts = await products.filter((product) => {
          if(product.category[0]._id.toString().trim() == category.trim()){
            return product
          }
          return null;
        });
        console.log("ss",categorySortedProducts)
  
       filteredProducts = await offerHelper.findOffer(categorySortedProducts);
       console.log('categoryProducts',categorySortedProducts)
        console.log("this is filted product",filteredProducts);
        
        var sorted = false;
      }
    
      
      if (sort !== undefined) {
        if (sort == "Ascending") {
          console.log("inside ascending");
          filteredProducts.sort(
            (a, b) => extractPrice(a.productprice) - extractPrice(b.productPrice)
          );
          sorted = "Ascending";
        } else if (sort == "Descending") {
          filteredProducts.sort(
            (a, b) => extractPrice(b.productprice) - extractPrice(a.productprice)
          );
          sorted = "Descending";
        } else if (sort == "Alpha") {
          filteredProducts.sort((a, b) => {
            const nameA = a.name.toUpperCase();
            const nameB = b.name.toUpperCase();
            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }
            return 0;
          });
          sorted = "Alpha";
        }
      }else{
        
      }
    
      let itemsPerPage = 6;
      let currentPage = parseInt(req.query.page) || 1;
      let startIndex = (currentPage - 1) * itemsPerPage;
      let endIndex = startIndex + itemsPerPage;
      let totalPages = Math.ceil(filteredProducts.length / 6);
      const currentProduct = filteredProducts.slice(startIndex, endIndex);
      res.json({
        products: currentProduct,
        totalPages,
        userData: req.session.user,
        cartCount,
        wishListCount,
        categories,
        sorted,
      });
    } catch (error) {
      next(error);
    }
  };
  
 
  
module.exports = {
    loginLoad,
    createUser,
    Loadregister,
    loadotp,
    checkUser,
    loadforgot,
    insertUserWithVerify,
    Loaduserproduct,
    logoutUser,
    isAuthenticated,
    loadhomepage,
    productDetails,
    loadAccount,
    addAddress,
    editAddress,
    updateUser,
    addressEditModal,
    deleteAddress,
    updatePassword,
    shopPage,
    shopFilterLoad
    
   


}