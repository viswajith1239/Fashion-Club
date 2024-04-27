const user=require("../models/userModel")
const categoryHelper=require("../helper/categoryHelper");
const category = require("../models/categoryModel");
const { response } = require("express");
const productHelper=require("../helper/productHelper")
const product=require('../models/productModel')
const admin=require("../models/adminModel")
const orderHelper=require("../helper/orderHelper")
const fs =require("fs")


const Loadproductlists=async(req,res)=>{
    try{
      const products= await product.find().populate('category')
      console.log(products);
        res.render('admin/product-list',{products})
    }catch(error){
        console.log(error);
    }
}

const Loadaddproducts=(req,res)=>{
    try{
        res.render('admin/adminadd-products')
    }catch(error){
        console.log(error);
    }
}


const LoadadminuserEdit= async (req,res)=>{
    try{
        const users = await user.find()
        
        res.render('admin/admin-userEdit',{users})
    }catch(error){
        console.log(error);
    }
}

const LoadadminCategories=async(req,res)=>{
    try{
        const categories= await category.find()
        res.render('admin/admin-category',{categories})
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
      console.log("categories");
      console.log(categories);
      
      res.render('admin/adminadd-products',{categories})
  }catch(error){
      console.log(error);
  }
}

const Loaddashboard=async(req,res)=>{
  try {
    res.render('admin/admin-dashboard')
  } catch (error) {
    console.log(error);
  }
}

const addProduct=(req,res)=>{
  const body=req.body
  const files=req.files

  console.log(files);
  productHelper
  .addProduct(body,files)
  .then((response)=>{
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
      if(logpassword===loggedAdmin.password){
        req.session.admin=loggedAdmin._id
        res.redirect('/admin-dashboard')
        console.log(loggedAdmin);
        console.log(req.session.admin);
      }else{
        res.redirect("/admin-login")
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
      { $pull: { image: image } }, // Use $pull to remove the specified image from the images array
      { new: true } // Set { new: true } to return the updated document after the update operation
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
    deleteImage
    
    

}