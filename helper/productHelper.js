const productModel = require("../models/productModel")
const fs =require("fs")
const sharp=require("sharp")
const path = require("path")




const addProduct = (data, files,req,res) => {

  const { hiddenField1, hiddenField2, hiddenField3, hiddenField4, } = data;
  console.log("hello",data);

  return new Promise(async (resolve, reject) => {
    console.log(data);
   
    let images=[]
    for(const file of files){
        images.push(file.filename)
        
        console.log(files);
    }
    let totalQuantity =
      parseInt(data.smallQuantity) +
      parseInt(data.mediumQuantity) +
      parseInt(data.largeQuantity);

    const productQuantity = [
      {
        size: "S",
        quantity:parseInt(data.smallQuantity),
      },
      {
        size: "M",
        quantity:parseInt(data.mediumQuantity),
      },
      {
        size: "L",
        quantity:parseInt(data.largeQuantity),
      },
    ];

     const newProduct =await productModel
      .create({
        name: data.name,
        description: data.description,
        category: data.productCategory,
        productprice: data.Price,
        productQuantity: productQuantity,
        productDiscount: data.discount,
        totalQuantity: totalQuantity,
        image: images,
      })
console.log();
      // const newProduct = await productModel.create(productAdding);

      
      const cropPromises = [];

      
      async function cropImage(hiddenfield) {
          return new Promise((resolve, reject) => {
              let parts = hiddenfield.split(" ");
              let ind = parseInt(parts[1]);
              let x = parseInt(parts[3]);
              let y = parseInt(parts[5]);
              let width = parseInt(parts[7]);
              let height = parseInt(parts[9]);
      
              let filename = newProduct.image[ind];
              let inputPath = path.join(__dirname, `../public/uploads/${filename}`);
              let outputPath = path.join(__dirname, `../public/uploads/cropped_${filename}`);
      
              sharp(inputPath)
                  .extract({ left: x, top: y, width: width, height: height })
                  .toFile(outputPath, (err) => {
                      if (err) {
                          console.error("Error cropping image:", err);
                          reject(err);
                      } else {
                          // Update the product image path with the cropped image
                          let croppedFilename = `cropped_${filename}`;
                          newProduct.image[ind] = croppedFilename;
      
                          // try {
                          //     // Attempt to unlink the file
                          //     fs.unlinkSync(inputPath);
                          //     console.log('File unlinked successfully');
                          // } catch (err) {
                          //     // Handle the error
                          //     console.error('Error unlinking file:', err);
                          //     // You can take further action here, such as retrying or notifying the user
                          // }
                          // // Resolve the promise
                          resolve();
                      }
                  });
          });
      }
      

      // Push crop promises to array
      if (hiddenField1) {
          cropPromises.push(cropImage(hiddenField1));
      }
      if (hiddenField2) {
          cropPromises.push(cropImage(hiddenField2));
      }
      if (hiddenField3) {
          cropPromises.push(cropImage(hiddenField3));
      }
      if (hiddenField4) {
          cropPromises.push(cropImage(hiddenField4));
      }
     
      

      
      await Promise.all(cropPromises);

      
      await newProduct.save();

      const message = "Product added successfully";
      resolve(true)
    })
      
}

const checkDuplicateFunction = (body, productId) => {
    return new Promise(async (resolve, reject) => {
      const checker = await productModel.findOne({ _id: productId });
      const check = await productModel.findOne({
        productName: body.productName,
      });
  
      if (!check) {
        resolve({ status: 1 });
      } else if (productId == check._id) {
        resolve({ status: 2 });
      } else {
        resolve({ status: 3 });
      }
    });
  };

  const productlistslistunlist=(id)=>{
    return new promise(async(resolve,reject)=>{

      const result= await productModel.findOne({_id: id})
      console.log(result);
      result.productstatus==!result.productstatus;
      result.save()
      console.log(result);
      resolve(result)
    })
  }

  // const editProductPost = async (req, res) => {
  //   try {
  //     const product = await productModel.findById(req.params.id);
  //     if (!product) {

  //       res.redirect("/productlist");
  //     }
     
  //     const totalAmount =
  //       parseInt(req.body.smallQuantity) +
  //       parseInt(req.body.mediumQuantity) +
  //       parseInt(req.body.largeQuantity);
  //     console.log(totalAmount);
  //     const check = await checkDuplicateFunction(
  //       req.body,
  //       req.params.id
  //     );
  //     const productQuantity = [
  //       {
  //         size:"S",
  //         quantity:req.body.smallQuantity
  //       },
  //       {
  //         size:"M",
  //         quantity:req.body.mediumQuantity
  //       },
  //       {
  //         size:"L",
  //         quantity:req.body.largeQuantity
  //       }
  //     ]
  //     switch (check.status) {
  //       case 1:
  //         product.name = req.body.productName;
  //         product.productDescription = req.body.description;
  //         product.productprice = req.body.productprice;
  //         product.productQuantity = productQuantity;
  //         product.totalQuantity = totalAmount;
  //         product.category = req.body. productCategory;
  //         product.productDiscount = req.body.productDiscount;
  //         break;
  //       case 2:
  //         product.name = req.body.productName;
  //         product.productDescription = req.body.description;
  //         product.productprice = req.body.productprice;
  //         product.productQuantity = productQuantity;
  //         product.totalQuantity = totalAmount;
  //         product.category = req.body.productCategory;
  //         product.productDiscount = req.body.productDiscount;
  //         break;
  //       case 3:
  //         console.log("Product already Exists");
  //         break;
  //       default:
  //         console.log("error");
  //         break;
  //     }
  //     if (req.files) {
  //       const filenames = await editImages(
  //         product.image,
  //         req.files
  //       );
  //       if (filenames.status) {
  //         product.image = filenames;
  //       } else {
  //         product.image = filenames;
  //       }
  //     }
  //     await product.save();
  //     res.redirect("/product-list");
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };
  // const editProductPost = async (req, res) => {
  //   try {
  //     const product = await productModel.findById(req.params.id);
  //     if (!product) {
  //       res.redirect("/productlist");
  //     }
     
  //     const totalAmount =
  //       parseInt(req.body.smallQuantity) +
  //       parseInt(req.body.mediumQuantity) +
  //       parseInt(req.body.largeQuantity);
  //     console.log(totalAmount);
  //     const check = await checkDuplicateFunction(
  //       req.body,
  //       req.params.id
  //     );
  //     const productQuantity = [
  //       {
  //         size:"S",
  //         quantity:req.body.smallQuantity
  //       },
  //       {
  //         size:"M",
  //         quantity:req.body.mediumQuantity
  //       },
  //       {
  //         size:"L",
  //         quantity:req.body.largeQuantity
  //       }
  //     ]
  //     switch (check.status) {
  //       case 1:
  //         product.name = req.body.productName;
  //         product.productDescription = req.body.description;
  //         product.productprice = req.body.productprice;
  //         product.productQuantity = productQuantity;
  //         product.totalQuantity = totalAmount;
  //         product.category = req.body.productCategory;
  //         product.productDiscount = req.body.productDiscount;
  //         break;
  //       case 2:
  //         product.name = req.body.productName;
  //         product.productDescription = req.body.description;
  //         product.productprice = req.body.productprice;
  //         product.productQuantity = productQuantity;
  //         product.totalQuantity = totalAmount;
  //         product.category = req.body.productCategory;
  //         product.productDiscount = req.body.productDiscount;
  //         break;
  //       case 3:
  //         console.log("Product already Exists");
  //         break;
  //       default:
  //         console.log("error");
  //         break;
  //     }
  //     if (req.files) {
  //       const newFilenames = await editImages(
  //         product.image,
  //         req.files
  //       );
  //       // Check if there are existing filenames
  //       if (product.image && product.image.length > 0) {
  //         // Merge existing filenames with new filenames
  //         product.image = [...product.image, ...newFilenames];
  //       } else {
  //         // If no existing filenames, simply assign new filenames
  //         product.image = newFilenames;
  //       }
  //     }
  //     await product.save();
  //     res.redirect("/product-list");
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };
  
 

  // const editImages = async (oldImages, newImages) => {
  //   return new Promise((resolve, reject) => {
  //     if (newImages && newImages.length > 0) {
  //       // if new files are uploaded
  //       let filenames = [];
  //       for (let i = 0; i < newImages.length; i++) {
  //         filenames.push(newImages[i].filename);
  //       }
  //       // delete old images if they exist
  //       if (oldImages && oldImages.length > 0) {
  //         for (let i = 0; i < oldImages.length; i++) {
  //           fs.unlink("public/uploads/" + oldImages[i], (err) => {
  //             if (err) {
  //               reject(err);
  //             }
  //           });
  //         }
  //       }
  //       resolve(filenames);
  //     } else {
  //       // use old images if new images are not uploaded
  //       resolve(oldImages);
  //     }
  //   });
  // }
  const editProductPost = async (req, res) => {
    try {
      const product = await productModel.findById(req.params.id);
      if (!product) {
        res.redirect("/productlist");
      }
     
      const totalAmount =
        parseInt(req.body.smallQuantity) +
        parseInt(req.body.mediumQuantity) +
        parseInt(req.body.largeQuantity);
      console.log(totalAmount);
      const check = await checkDuplicateFunction(
        req.body,
        req.params.id
      );
      const productQuantity = [
        {
          size:"S",
          quantity:req.body.smallQuantity
        },
        {
          size:"M",
          quantity:req.body.mediumQuantity
        },
        {
          size:"L",
          quantity:req.body.largeQuantity
        }
      ]
      switch (check.status) {
        case 1:
          product.name = req.body.productName;
          product.productDescription = req.body.description;
          product.productprice = req.body.productprice;
          product.productQuantity = productQuantity;
          product.totalQuantity = totalAmount;
          product.category = req.body.productCategory;
          product.productDiscount = req.body.productDiscount;
          break;
        case 2:
          product.name = req.body.productName;
          product.productDescription = req.body.description;
          product.productprice = req.body.productprice;
          product.productQuantity = productQuantity;
          product.totalQuantity = totalAmount;
          product.category = req.body.productCategory;
          product.productDiscount = req.body.productDiscount;
          break;
        case 3:
          console.log("Product already Exists");
          break;
        default:
          console.log("error");
          break;
      }
      if (req.files) {
        const newFilenames = await editImages(
          product.image,
          req.files
        );
       
        if (product.image && product.image.length > 0) {
          
          product.image = [...product.image, ...newFilenames];
        } else {
         
          product.image = newFilenames;
        }
      }
      await product.save();
      res.redirect("/product-list");
    } catch (err) {
      console.log(err);
    }
  };
  
  const editImages = async (oldImages, newImages) => {
    return new Promise((resolve, reject) => {
      if (newImages && newImages.length > 0) {
       
        let filenames = [];
        for (let i = 0; i < newImages.length; i++) {
          filenames.push(newImages[i].filename);
        }
        
        resolve(filenames);
      } else {
       
        resolve(oldImages);
      }
    });
  }
  

  const getAllActiveProducts = () => {
    return new Promise(async (resolve, reject) => {
      try {
  
        const result = await productModel.aggregate([
          {
            $lookup: {
              from: "categories",
              localField: "category",
              foreignField: "_id",
              as: "category",
            },
          },
          {
            $match: {
              productstatus: true,
              "category.islisted": true,
            },
          },
        ]);
        console.log(result);
  
        resolve(result);
      } catch (error) {
        console.error(error);
        reject(error);
      }
    });
  };

  const getAllProducts = () => {
    return new Promise(async (resolve, reject) => {
      const product = await productModel
        .aggregate([
          {
            $lookup: {
              from: "categories",
              localField: "category",
              foreignField: "_id",
              as: "category",
            },
          },
        ])
        .then((result) => {
          console.log(result);
          resolve(result);
        })
        .catch((error) => {
          console.log(error);
        });
    });
  };
  
  
  
module.exports={
    
     addProduct,
     checkDuplicateFunction,
     productlistslistunlist,
     editProductPost,
     getAllActiveProducts,
     getAllProducts


}