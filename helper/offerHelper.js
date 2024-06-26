const offerModel=require("../models/offerModel")


const getAllOffersOfProducts = () => {
    return new Promise(async (resolve, reject) => {
      try {
        const offers = await offerModel
          .find({ "productOffer.offerStatus": true })
          .populate("productOffer.product");
        for (const offer of offers) {
          offer.formattedStartingDate = formatDate(offer.startingDate.toString());
          offer.formattedEndingDate = formatDate(offer.endingDate.toString());
        }
        if (offers) {
          resolve(offers);
        }
      } catch (error) {
        console.log(error);
      }
    });
  };

  const productCreateOffer = (data) => {
    return new Promise(async (resolve, reject) => {
      try {
        const offer = await offerModel.create({
          offerName: data.offerName,
          startingDate: data.startDate,
          endingDate: data.endDate,
          "productOffer.product": data.productName,
          "productOffer.discount": data.discountAmount,
          "productOffer.offerStatus": true,
        });
        resolve(offer);
      } catch (error) {
        console.log(error);
      }
    });
  };



  const getOfferDetails = (offerId) => {
    return new Promise(async (resolve, reject) => {
      const result = await offerModel.findOne({ _id: offerId }).lean();
  
      result.formattedStartingDate = formatDate(result.startingDate.toString());
      result.formattedEndingDate = formatDate(result.endingDate.toString());
  
      if (result) {
        resolve(result);
      }
    });
  };


  const productEditOffer = (data) => {
    return new Promise(async (resolve, reject) => {
      try {
        const offerEdit = await offerModel.updateOne(
          { _id: data.offerId },
          {
            $set: {
              offerName: data.offerName1,
              startingDate: data.startDate,
              endingDate: data.endDate,
              "productOffer.product": data.productName,
              "productOffer.discount": data.offerDiscount1,
              "productOffer.offerStatus": true,
            },
          }
        );
        if (offerEdit) {
          resolve(offerEdit);
        }
      } catch (error) {
        console.log(error);
      }
    });
  };


  const getAllOffersOfCategories = () => {
    return new Promise(async (resolve, reject) => {
      try {
        const offers = await offerModel
          .find({ "categoryOffer.offerStatus": true })
          .populate("categoryOffer.category");
        for (const offer of offers) {
          offer.formattedStartingDate = formatDate(offer.startingDate.toString());
          offer.formattedEndingDate = formatDate(offer.endingDate.toString());
        }
        if (offers) {
          resolve(offers);
        }
      } catch (error) {
        console.log(error);
      }
    });
  };


  const createCategoryOffer = (data) => {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await offerModel.create({
          offerName: data.offerName,
          startingDate: data.startDate,
          endingDate: data.endDate,
          "categoryOffer.category": data.categoryName,
          "categoryOffer.discount": data.offerDiscount,
          "categoryOffer.offerStatus": true,
        });
        resolve(result);
      } catch (error) {
        console.log(error);
      }
    });
  };


  const editCategoryOffer = (data) => {
    console.log("data is ",data);
    return new Promise(async (resolve, reject) => {
      try {
        console.log("thsiis data discount",data.offerDiscount1)
        const result = await offerModel.updateOne(
          { _id: data.offerId1 },
          {
            $set: {
              offerName: data.offerName1,
              startingDate: data.startDate1,
              endingDate: data.endDate1,
              "categoryOffer.category": data.categoryName1,
              "categoryOffer.discount": data.offerDiscount1,
              "categoryOffer.offerStatus": true,
            },
          },{new:true}
        );
        resolve(result);
        console.log("resultis",result)
      } catch (error) {
        console.log(error);
      }
    });
  };


  const listunlistcategoryoffer=(offerId)=>{
    return new Promise(async(resolve,reject)=>{
      const result=await offerModel.findOne({_id:offerId})
      if(result.status===true){
        await offerModel.findOneAndUpdate({_id:offerId},{$set:{status:false} })
      }else{
        await offerModel.findByIdAndUpdate({_id:offerId},{$set:{status:true}})
      }
      resolve(result)
    })
  }

  const listunlistproductoffer=(offerId)=>{
    return new Promise(async(resolve,reject)=>{
      const result=await offerModel.findOne({_id:offerId})
      if(result.status===true){
        await offerModel.findOneAndUpdate({_id:offerId},{$set:{status:false} })
      }else{
        await offerModel.findByIdAndUpdate({_id:offerId},{$set:{status:true}})
      }
      resolve(result)
    })
  }


  const findOffer = (products) => {
    return new Promise(async (resolve, reject) => {
      try {
        const currentDate = new Date();
        const offer = await getActiveOffer(currentDate);
  
        for (let i = 0; i < products.length; i++) {
          const productOffer = offer.find(
            (item) => item.productOffer?.product?.toString() == products[i]._id
          );
  
          const categoryOffer = offer.find(
            (item) =>
              item.categoryOffer?.category?.toString() ==
              products[i].category._id
          );
  
          if (productOffer != undefined && categoryOffer != undefined) {
            console.log("this is first if");
            if (
            
              productOffer.productOffer.discount >
              categoryOffer.categoryOffer.discount
            ) {
              const offerPrice =
                products[i].productprice -
                (products[i].productprice * productOffer.productOffer.discount) /
                  100;
              products[i].offerPrice = (Math.round(offerPrice));
            } else {
              console.log("this is first if else");
              const offerPrice =
                products[i].productprice -
                (products[i].productprice *
                  categoryOffer.categoryOffer.discount) /
                  100;
              products[i].offerPrice = (Math.round(offerPrice));
            }
          } else if (productOffer != undefined) {
            console.log("this is second else if");
            const offerPrice =
              products[i].productprice -
              (products[i].productprice * productOffer.productOffer.discount) /
                100;
            products[i].offerPrice = (Math.round(offerPrice));
          } else if (categoryOffer != undefined) {
            console.log("this is thired if");
            const offerPrice =
              products[i].productprice -
              (products[i].productprice * categoryOffer.categoryOffer.discount) /
                100;
            products[i].offerPrice =(Math.round(offerPrice));
          } else {
            console.log("this is last  if");
            const offerPrice =
              products[i].productprice -
              (products[i].productprice * products[i].productDiscount) / 100;
            products[i].offerPrice =(Math.round(offerPrice));
          }

          products[i].productprice =(products[i].productprice);
          console.log("hello",products);
        }
        console.log('hpro',products)
        resolve(products);
      } catch (error) {
        console.log(error);
      }
    });
  };

  const getActiveOffer = (currentDate) => {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await offerModel.find({
          startingDate: { $lte: currentDate },
          endingDate: { $gte: currentDate },
          status: true,
        });
        // .populate("productOffer.product")
        // .populate("categoryOffer.category");
  
        resolve(result);
      } catch (error) {
        console.log(error);
      }
    });
  };
  

 

  


  function formatDate(dateString) {
   
    const date = new Date(dateString);
  
  
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); 
    const day = String(date.getDate()).padStart(2, "0"); 
  
    return `${year}/${month}/${day}`;
  }

  module.exports={
    getAllOffersOfProducts,
    productCreateOffer,
    getOfferDetails,
    productEditOffer,
    getAllOffersOfCategories,
    createCategoryOffer,
    editCategoryOffer,
    listunlistcategoryoffer,
    listunlistproductoffer,
    findOffer,
    getActiveOffer
  }