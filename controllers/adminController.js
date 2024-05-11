const user=require("../models/userModel")
const categoryHelper=require("../helper/categoryHelper");
const category = require("../models/categoryModel");
const { response } = require("express");
const productHelper=require("../helper/productHelper")
const product=require('../models/productModel')
const admin=require("../models/adminModel")
const orderHelper=require("../helper/orderHelper")
const orderModel=require("../models/orderModel")
const fs =require("fs")


const Loadproductlists=async(req,res)=>{
    try{
      const page = req.query.page || 1;
      const startIndex = (page-1) * 6;
      const productcount= await product.find().count()
      const totalPage = Math.ceil(productcount/6);
      const products= await product.find().populate('category').skip(startIndex).limit(6)
      console.log(products);
        res.render('admin/product-list',{products,page,totalPage})
    }catch(error){
        console.log(error);
    }
}

const Loadaddproducts=async(req,res)=>{
    try{
    
        res.render('admin/adminadd-products',{ })
    }catch(error){
        console.log(error);
    }
}


const LoadadminuserEdit= async (req,res)=>{
    try{
      const page = req.query.page || 1;
      const startIndex = (page-1) * 6;
      const productcount= await user.find().count()
      const totalPage = Math.ceil(productcount/6);
        const users = await user.find().skip(startIndex).limit(6)
        
        res.render('admin/admin-userEdit',{users,page,totalPage})
    }catch(error){
        console.log(error);
    }
}

const LoadadminCategories=async(req,res)=>{
    try{
      const page = req.query.page || 1;
      const startIndex = (page-1) * 6;
      const productcount= await category.find().count()
      const totalPage = Math.ceil(productcount/6);
        const categories= await category.find().skip(startIndex).limit(6)
        res.render('admin/admin-category',{categories,page,totalPage})
    }catch(error){
        console.log(error);
    }
}

const Adminloginload=(req,res)=>{
  try {
    res.render('admin/admin-login')
  } catch (error) {
    console.log(error);
  }
}

const loadEditcategory=(rq,res)=>{
  try {
    res.render('admin/admin-editcategory')
  } catch (error) {
    console.log(error);
  }
}


const blockUser = async (req, res) => {
    try {
      console.log("Enter to the block user page");
      const userId = req.query.id;
      console.log(userId);
      const findUser = await user.findById({ _id: userId });
      if (findUser.isActive === true) {
        await user.findByIdAndUpdate({ _id: userId }, { $set: { isActive: false } });
    } else {
        await user.findByIdAndUpdate({ _id: userId }, { $set: { isActive: true } });
    }

    //   findUser.isblocked=!findUser.isblocked
    //  await findUser.save()
    
  
      res.json({ success: true }); // Send a JSON response
    } catch (error) {
      console.log(error.message);
       // Handle errors
    }
  };


  const listunlist = async (req, res) => {
    try {
      console.log("Enter to the listunlist");
      const categoryId = req.query.id;
      console.log("this is category id:",categoryId);
      const findcategory = await category.findById( categoryId );
      console.log(findcategory)
      
        
      if (findcategory.islisted === true) {
        console.log("Entered in if");
        await category.findByIdAndUpdate({ _id: categoryId }, { $set: { islisted: false } });
        res.json({ success: true });
    } else {
        console.log("Entered into else");
        await category.findByIdAndUpdate({ _id: categoryId }, { $set: { islisted: true } });
        res.json({ success: true });
    }
    
    
  
      
    
    } catch (error) {
      console.log(error.message);
      
    }
  }



  // const addcategory=async(req,res)=>{
  //   const userId=req.session.user;
  //   const{productName,productDescription}=req.body;
  //   const result=await categoryHelper.addcat(productName,productDescription);
  //   console.log(result)

  //   if(result.status){
  //     const categorys=await category.create({name:productName,description:productDescription})
  //       res.json({success:true})
  //   }else{
  //       res.json({success:false,message:"Category Exists!!"})
  //   }
  
  // }
  
  const addcategory = async (req, res) => {
    const userId = req.session.user;
    const { productName, productDescription } = req.body;
    const result = await categoryHelper.addcat(productName,productDescription);
    if (result.status) {
        res.json({ status: true })
    } else {

        res.json({ status: false });
    }

}

const modalLoader=async(req,res)=>{
  try {
    const id=req.params.id
    const catData=await category.findById(id)
    console.log(catData);
    res.json({catData})
  } catch (error) {
    console.log(error);
  }
}
const LoadAddproduct= async (req,res)=>{
  try{
      const categories = await category.find()
     
      console.log(categories);
      
      res.render('admin/adminadd-products',{categories})
  }catch(error){
      console.log(error);
  }
}

// const Loaddashboard=async(req,res)=>{
//   try {
    
//     res.render('admin/admin-dashboard')
//   } catch (error) {
//     console.log(error);
//   }
// }
const Loaddashboard = async (req, res, next) => {
  try {
    // Fetch all orders
    const salesDetails = await orderModel.find();
    console.log("sales",salesDetails);

    // Fetch all products and categories
    const products = await product.find();
    const categories = await category.find();

    // Aggregate for finding the top selling products
    const topSellingProducts = await orderModel.aggregate([
      { $unwind: "$products" }, // Split orders into individual products
      {
        $group: {
          _id: "$products.product",
          totalQuantity: { $sum: "$products.quantity" },
        },
      }, // Group by productId and sum quantities
      { $sort: { totalQuantity: -1 } }, // Sort by total quantity descending
      { $limit: 10 }, // Limit to top 10 products
    ]);

    // Extract product IDs of top selling products
    const productIds = topSellingProducts.map((product) => product._id);

    
    // Fetch details of top selling products
    const productsData = await product.find(
      { _id: { $in: productIds } },
      { name: 1, image: 1 }
    );

    // Aggregate to find the top selling categories
    const topSellingCategories = await orderModel.aggregate([
      { $unwind: "$products" }, // Split orders into individual products
      {
        $lookup: {
          from: "products",
          localField: "products.product",
          foreignField: "_id",
          as: "product",
        },
      }, // Lookup products collection to get product details
      { $unwind: "$product" }, // Unwind the product array
      {
        $lookup: {
          from: "categories",
          localField: "product.category",
          foreignField: "_id",
          as: "category",
        },
      }, // Lookup categories collection to get category details
      { $unwind: "$category" }, // Unwind the category array
      {
        $group: {
          _id: "$category._id",
          totalQuantity: { $sum: "$products.quantity" },
        },
      }, // Group by categoryId and sum quantities
      { $sort: { totalQuantity: -1 } }, // Sort by total quantity descending
      { $limit: 10 }, // Limit to top 10 categories
    ]);

    // Fetch details of the top selling categories
    const topSellingCategoriesData = await category.find({
      _id: { $in: topSellingCategories.map((cat) => cat._id) },
    });

    res.render("admin/admin-dashboard", {
      salesDetails: salesDetails,
      products: products,
      categories: categories, // Pass categories to the rendering context
      productsData: productsData,
      topSellingCategories: topSellingCategoriesData,
      topSellingProducts: topSellingProducts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};


const addProduct=(req,res)=>{
  const body=req.body
  const files=req.files

  console.log(files);
  productHelper
  .addProduct(body,files)
  .then((response)=>{
    console.log("hello",response);
    res.redirect('/product-list')
  })
  .catch((error)=>{
    console.log(error);
  })
}

const softdeleteproduct= async (req,res)=>{
  
  const id=req.params.id;
  // productHelper
  // .productlistslistunlist(id)
  // .then((response)=>{
  //   if(response.productStatus){
  //     res.json({message:"Listed successfully"})
  //   }else{
  //     res.json({message:"Unlisted successfully"})
  //   }
  // })
  // .catch((error)=>{
  //   res.json({error:"Failed"})
  // })
  const productData = await product.findOne({_id:id});
  if(productData.productstatus === true){
    var statusChange = await product.updateOne({_id:id},{$set:{"productstatus":false}});
  }
  else{
    var statusChange = await product.updateOne({_id:id},{$set:{"productstatus":true}});
  }
  
  console.log("statuchange: ",statusChange)
  
  if(statusChange.modifiedCount>0){
    res.json({success:true})
  }else{
    res.json({success:false})
  }
}
const editProductLoad = async (req, res) => {
  
  const id = req.params.id;
  const categories = await categoryHelper.getAllcategory();
  const productDetail = await product.findOne({ _id: id });

  res.render("admin/product-listEdit", {
    product: productDetail,
    category: categories,
  });
};


const checkAdmin = async (req, res) => {
 
  const logemail = req.body.email
  const logpassword = req.body.password
  try {
      const loggedAdmin = await admin.findOne({
          email: logemail,
        
      }).catch(error=>console.error("mongoose.findOne error:",error))
      console.log(loggedAdmin);
      if (!loggedAdmin) {
        // If no admin found with the provided email
        res.render('admin/admin-login',{errmessage:"wrong Email"})
      }
      if(logpassword===loggedAdmin.password){
        req.session.admin=loggedAdmin._id
        res.redirect('/admin-dashboard')
        console.log(loggedAdmin);
        console.log(req.session.admin);
      }else{
        res.render("admin/admin-login",{errmessage:"Wrong Password"})
      }
      
    } catch (err) {
      console.log(err.message);
  }
}

const logoutAdmin = async (req, res) => {
  try {
    if (req.session.admin) {
      req.session.destroy((error) => {
        if (error) {
          res.redirect("/admin-userEdit");
        } else {
          res.redirect("/admin-login");
        }
      });
    } else {
      res.redirect("/admin-login");
    }
  } catch (error) {
    console.log(error);
  }
};

const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.admin) {
    return next();
  } else {
    res.redirect('/admin-login'); 
  }
};

const deleteImage = async (req,res)=>{
  try{
    
    const productId = req.params.id;
    const image = req.params.image;

    

    const updatedProduct = await product.findByIdAndUpdate(
      {_id:productId},
      { $pull: { image: image } }, 
      { new: true } 
  );
  
  fs.unlink("public/uploads/" + image, (err) => {
    if (err) {
      reject(err);
    }
  });

  if(updatedProduct){
    res.json({message : "image deleted"});

  }else{
    res.json({message : "something went wrong"});

  }
  }catch(error){
    console.log(error)

  }
}

const showChart = async (req, res) => {
 
  try {
   
    if (req.query.msg) {
    
     
      const monthlySalesData = await orderModel.aggregate([
        {
          $match: { "products.status": "delivered" }, 
        },
        {
          $group: {
            _id: { $month: "$orderedOn" },
            totalAmount: { $sum: "$totalAmount" }, 
          },
        },
        {
          $sort: { _id: 1 },
        },
      ]);
      

      
      const dailySalesData = await orderModel.aggregate([
        {
          $match: { "products.status": "delivered" }, 
        },
        {
          $group: {
            _id: { $dayOfMonth: "$orderedOn" }, 
            totalAmount: { $sum: "$totalAmount" },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ]);
      console.log("daily",dailySalesData);

      const orderStatuses = await orderModel.aggregate([
        {
          $unwind: "$products", 
        },
        {
          $group: {
            _id: "$products.status", 
            count: { $sum: 1 }, 
          },
        },
      ]);
      console.log("order",orderStatuses);

     
      const eachOrderStatusCount = {};
      orderStatuses.forEach((status) => {
        eachOrderStatusCount[status._id] = status.count;
      });
      

      res
        .status(200)
        .json({ monthlySalesData, dailySalesData, eachOrderStatusCount });
    }
   
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};






module.exports={
    Loadproductlists,
    Loadaddproducts,
    LoadadminuserEdit,
    LoadadminCategories,
    blockUser,
    addcategory,
    listunlist,
    Adminloginload,
    loadEditcategory,
    modalLoader,
    LoadAddproduct,
    Loaddashboard,
    addProduct,
    softdeleteproduct,
    editProductLoad,
    checkAdmin,
    logoutAdmin,
    isAuthenticated,
    deleteImage,
    showChart,
    

}