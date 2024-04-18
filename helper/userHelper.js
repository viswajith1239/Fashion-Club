const { ObjectId } = require("mongodb");
const userModel=require("../models/userModel")
const bcrypt=require('bcrypt')

const addAddressTouser = async (body, userId) => {
  
  try {
  
    const results = await userModel.updateOne(
      { _id: userId },
    
      {
        $push: { address: body },
      },
      {new:true}
    );
    console.log(results);

    return results;
  } catch (error) {
    throw error;
  }
};

const updateUserDetails = (userId, userDetails) => {
  
  return new Promise(async (resolve, reject) => {
    const user = await userModel.findById(new ObjectId(userId));

    let response = {};
    if (user) {
      if (user.isActive) {
        const success = await bcrypt.compare(

          userDetails.password,
          user.password
        );
          console.log(success);
        if (success) {

          if (userDetails.name) {
            user.name = userDetails.name;
          }
          if (userDetails.email) {
            user.email = userDetails.email;
          }
          if (userDetails.mobile) {
            user.mobile = userDetails.mobile;
          }
         
          await user.save();
          response.status = true;
          resolve(response);
        } else {
          response.message = "Incorrect Password";
          resolve(response);
        }
      }
    }
  });
};

  const editAddress=async(userId,addressId,body)=>{
    try{
    const result= await userModel.updateOne(
      {_id:new ObjectId(userId),'address._id':new ObjectId(addressId)},
      {$set:{'address.$':body}}
    )
    return result
    }catch(error){
      console.log(error);
    }
  }

 const deleteAddressHelper= async(userId,addressId)=>{
  try {
    console.log('entered in to delete addrss helper',userId,addressId);
    const result =await userModel.updateOne(
      {_id:userId},
      {$pull:{address:{_id:addressId}}}
    )
    console.log(result);
    if(result){
     
     return result;
    }
    console.log(result);
  } catch (error) {
    console.log(error);    
  }
 }

 const updateUserPassword = async (userId, passwordDetails) => {
  return new Promise(async (resolve, reject) => {
    const user = await userModel.findById(new ObjectId(userId));
    
    console.log(passwordDetails);
    let response = {};
    if (user) {
      if (user.isActive) {
        if (typeof passwordDetails.oldPassword === 'string' && typeof user.password === 'string') {
          const success = await bcrypt.compare(passwordDetails.oldPassword, user.password);
          if (success) {
            if (
              passwordDetails.newPassword &&
              passwordDetails.newPassword === passwordDetails.confirmPassword
            ) {
              user.password = await bcrypt.hash(passwordDetails.newPassword, 10);
              await user.save();
              response.status = true;
              resolve(response);
            }
          } else {
            response.message = "Incorrect Password";
            resolve(response);
          }
        } else {
          response.message = "Invalid input data format";
          resolve(response);
        }
      }
    }
  });
};


const getWalletDetails = async (userId) => {
  return new Promise(async (resolve, reject) => {
    const result = await userModel.findOne({ _id: userId });

    if (result) {
      resolve(result);
    } else {
      console.log("not found");
    }
  });
};

  module.exports={
    addAddressTouser,
    updateUserDetails,
    editAddress,
    deleteAddressHelper,
    updateUserPassword,
    getWalletDetails
  }