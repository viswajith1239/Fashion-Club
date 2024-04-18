const user = require('../models/userModel')
const bcrypt=require('bcrypt')

const doSignUp = async (userData)=>{
   
    // console.log(userData);
   
    return new Promise(async(resolve, reject) => {
        const userExist = await user.findOne({
            $or:[{email:userData.email},{mobile:userData.mobile}],
        })
        const response={}
        console.log('hello');
        // console.log(userExist);
        if(!userExist){
            console.log("user not exit");
            console.log(userData.password);

            // if(verify){
                console.log("verify");
                try{
                    const hashedpassword= await bcrypt.hash(userData.password,10)
                    const userDataToSave={
                        name:userData.name,
                        email:userData.email,
                        mobile:userData.mobile,
                        password:hashedpassword,
                        isadmin:0,
                        isActive:true
                    }
                    const data= await user.create(userDataToSave)
                    response.status=true
                    response.message="Signedup Successfully"
                    resolve(response)
                    console.log(data);
                }catch(error){
                    console.log(error.message);
                }
            // }else{
            //     response.status=false
            //     response.message="Enter the correct otp"
            //     resolve(response)
            // }
        }else{
            response.status=false
            response.message="User alredy exists"
            resolve(response)
        }
    })
}

module.exports = {doSignUp}