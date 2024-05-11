const userModel = require("../models/userModel");

const walletAmountAdding = async (userId,subTotal) => {
  console.log("enterd in to amount adding");

  try {
   
    const user = await userModel.findById(userId);
    console.log(user);

    console.log("hello",subTotal)
    
    const currentBalance = user.wallet.balance;
    const amount = parseInt(subTotal);
    const newBalance = currentBalance + amount;

   
    const newDetail = {
      type: "refund",
      amount: amount,
      date: new Date(),
      transactionId: Math.floor(100000 + Math.random() * 900000),
    };

    
    const response = await userModel.findOneAndUpdate(
      { _id: userId },
      {
        $set: { "wallet.balance": newBalance },
        $push: { "wallet.details": newDetail },
      },
      { new: true }
    );

    return response;
  } catch (error) {
    console.error("Error updating wallet amount:", error);
    throw error;
  }
};

module.exports = {
  walletAmountAdding,
};