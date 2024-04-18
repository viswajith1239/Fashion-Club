const isloginAdmin=(req,res,next)=>{
    try {
        if(req.session.admin){
            res.redirect("/admin-login")
        }else{
            next()
        }
    } catch (error) {
        console.log(error);
    }
}

const islogoutAdmin=(req,res,next)=>{
    try {
        if(req.session.admin){
            next()
            
        }else{
            res.redirect("/admin-login") 
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports={
    isloginAdmin,
    islogoutAdmin
}

