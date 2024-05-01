const offerHelper=require("../helper/offerHelper")
const productHelper=require("../helper/productHelper")
const categoryHelper=require("../helper/categoryHelper")
const offerModel=require("../models/offerModel")





const productofferLoad=async(req,res)=>{
    try {
      const page = req.query.page || 1;
      const startIndex = (page-1) * 6;
      const endIndex = page*6;
      const productcount= await offerModel.find().count()
      const totalPage = Math.ceil(productcount/6);
      const offer= await offerModel.find().skip(startIndex).limit(6)
        let offers = await offerHelper.getAllOffersOfProducts();
        const products = await productHelper.getAllProducts();
        const message = req.flash("message");
        offers = offers.slice(startIndex,endIndex);
        if (message.length > 0) {
          console.log(message);
        res.render("admin/admin-productoffer",{offers,products,message,page,totalPage,offer})
    } else {
        res.render("admin/admin-productoffer", { offers, products,page,totalPage,offer });
      }
    } catch (error) {
        console.log(error);
    }
}

const productAddOffer = async (req, res) => {
    try {
      const offer = await offerHelper.productCreateOffer(req.body);
      if (offer) {
        req.flash("message", "Offer Added");
        res.redirect("/admin-productoffer");
      }
    } catch (error) {
      console.log(error);
    }
  };


  const productEditLoad = async (req, res) => {
    try {
      const id = req.params.id;
      console.log(id);
      const response = await offerHelper.getOfferDetails(id);
      if (response) {
        res.json(response);
      } else {
        res.json({ status: false });
      }
    } catch (error) {
      console.log(error);
    }
  };
  const productEditOffer = async (req, res) => {
    try {
      const result = await offerHelper.productEditOffer(req.body);
      if (result) {
        req.flash("message", "Offer edited");
        res.redirect("/admin-productoffer");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const categoryofferLoad=async(req,res)=>{
    try {
        const page = req.query.page || 1;
        const startIndex = (page-1) * 6;
        const endIndex = page*6;
      const productcount= await offerModel.find().count()
      const totalPage = Math.ceil(productcount/6);
      const offer= await offerModel.find().skip(startIndex).limit(6)
      let offers = await offerHelper.getAllOffersOfCategories();
      const categories = await categoryHelper.getAllActiveCategory();
      const message = req.flash("message");
      offers = offers.slice(startIndex,endIndex);
      if (message.length > 0) {
        console.log(message);
      res.render("admin/admin-categoryoffer",{offers,categories,message,page,totalPage,offer})
    } else {
      res.render("admin/admin-categoryoffer", { offers, categories,page,totalPage,offer });
    }
    } catch (error) {
      console.log(error);
    }
  }

  const addCategoryOffer = async (req, res) => {
    try {
      const offer = await offerHelper.createCategoryOffer(req.body);
      if (offer) {
        req.flash("message", "Offer Added");
        res.redirect("/admin-categoryOffer");
      } 
    } catch (error) {
      console.log(error)
    }
  }
  
  const categoryEditOffer = async (req, res) => {
    try {
      const result = await offerHelper.editCategoryOffer(req.body);
      if (result) {
        req.flash("message", "Offer edited");
        res.redirect("/admin-categoryoffer");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const categoryEditLoad = async (req, res) => {
    try {
      console.log('reached')
      const offerId = req.params.id;
      const response = await offerHelper.getOfferDetails(offerId);
      res.json(response);
  
    } catch (error) {
      console.log(error);
    }
  }
  const deleteCategoryOffer = async (req, res) => {
    try {
      const result = await offerHelper.listunlistcategoryoffer(req.params.id)
      if(result.status){
        res.json({message:"offer unlisted",listed: false})
      }else{
        res.json({message:"offer listed",listed:true })
      }
    } catch (error) {
      console.log(error);
    }
  }
   

  const deleteProductOffer = async (req, res) => {
    try {
      const result = await offerHelper.listunlistproductoffer(req.params.id)
      if(result.status){
        res.json({message:"offer unlisted",listed: false})
      }else{
        res.json({message:"offer listed",listed:true })
      }
    } catch (error) {
      console.log(error);
    }
  }


     
module.exports={
    productofferLoad,
    productAddOffer,
    productEditLoad,
    productEditOffer,
    categoryofferLoad,
    addCategoryOffer,
    categoryEditOffer,
    categoryEditLoad,
    deleteCategoryOffer,
    deleteProductOffer
    
}