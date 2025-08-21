const express = require('express')
require("dotenv").config()
const userRoute = require('./routes/userRoutes')
const adminRoute = require('./routes/adminRoutes')
const path = require('path')
const session = require("express-session")
const nocache = require("nocache")
const flash = require("express-flash")
// const connectDB=require("./database/mongoose")
const methodoverride=require('method-override');
const  mongoose  = require('mongoose')





const app = express()
const PORT = 3002
mongoose.connect(process.env.DB_URL,{
})
.then(()=>{
    console.log("mongodb connected");
    
}).catch((error)=>{
    console.error(error);
    
})
app.use(express.urlencoded({ extended: true }))
app.use("/public", express.static(path.join(__dirname, "/public")))

app.set('view engine', 'ejs')
app.use(methodoverride("_method"));

app.use(
    session({
        secret: "1231fdsdfssg33435",
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 3600 * 1000,
        }
    })
)

app.use(flash())
app.use((req, res, next) => {
    res.locals.message = req.session.message
    delete req.session.message
    next()
})

app.use("/", nocache())

app.use("/", userRoute)
app.use("/", adminRoute)

app.listen(PORT, () => {
    console.log('server is running on http://localhost:3002');
    console.log("for Admin login http://localhost:3002/admin-login");
})

