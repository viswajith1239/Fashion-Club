const categoryModel=require("../models/categoryModel")
// const addcat = async (productName, productDescription) => {
//     try {
//         const checkingName = await categoryModel.find({ name: { $regex: new RegExp("^" + productName + "$", "i") } });
//         console.log("This is checkingName:", checkingName);
        
//         if (checkingName && checkingName.length > 0) {
//             return { status: false, message: "Category Already Exists" };
//         } else {
            
//             return { status: true };
//         }
//     } catch (error) {
//         console.error("Error while adding category:", error);
//         throw error;
//     }
// };

const addcat = (productName, productDescription) => {
    try {
        return new Promise(async (resolve, reject) => {
            const checkCat = await categoryModel.findOne({ name: { $regex: new RegExp(productName, 'i') } });
            if(!checkCat){
            const category = await categoryModel.updateOne({ name: productName }, {
                $set: {
                    name: productName, description: productDescription
                }
            }, { upsert: true });
            resolve({ status: true ,message: "Category Added"});
            
            } else {
                resolve({ status: false, message: "Category Already Exists" });
            }
        }
    )
    } catch (error) {
        console.log(error)
    }
}

const editedSave = async(req,res)=>{
    try {
      console.log("entered in to edited save");
        const { editId, editName, editDescription } = req.body;
        console.log(editId,editName,editDescription);
        
        const checkCat = await categoryModel.findOne({ 
            _id: { $ne: editId },
            name:{$eq:editName}
        });
        if(!checkCat){
            const updatedCategory = await categoryModel.findByIdAndUpdate(
                editId,
                { name: editName, description: editDescription },
    
            );
            
            if (!updatedCategory) {
                return res.status(404).json({ error: 'Category not found' });
            }else{
                res.status(200).json({status: true, message: 'Category updated successfully', updatedCategory });
            }
        }else{
            return res.status(200).json({status: false, message: 'Category already exists' });
        }

        
    } catch (error) {
        console.log(error);
    }
  }
  const getAllcategory = () => {
    return new Promise(async (resolve, reject) => {
      await categoryModel.find().then((result) => {
        resolve(result);
      });
    });
  };

  const getAllActiveCategory = () => {
    return new Promise(async (resolve, reject) => {
      try {
        const categories = await categoryModel.find({ islisted: true });
        if (categories) {
          resolve(categories);
        } else {
          resolve({ message: "No Active Categories" });
        }
      } catch (error) {
        console.log(error);
      }
    });
  };



module.exports={
    addcat,
    editedSave,
    getAllcategory,
    getAllActiveCategory
}