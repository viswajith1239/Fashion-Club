
const cartHelper=require("../helper/cartHelper")
const productModel=require("../models/productModel")


const addToCart = async (req, res) => {
  
    const userId = req.session.user;
  
    const productId = req.params.id;
    const size = req.params.size;
  
    const result = await cartHelper.addToCart(userId, productId, size);
  
    if (result) {
      res.json({ status: true });
    } else {
      res.json({ status: false });
    }
  };

  const searchProduct = async (req, res, next) => {
    let payload = req.body.payload.trim();
    try {
      let searchResult = await productModel
        .find({ name: { $regex: new RegExp("^" + payload + ".*", "i") } })
        .exec();
      searchResult = searchResult.slice(0, 5);
      res.json({ searchResult });
    } catch (error) {
      // res.status(500).render("error", { error, layout: false });
      console.log(error);
    }
  };

  module.exports={
    addToCart,
    searchProduct
  }