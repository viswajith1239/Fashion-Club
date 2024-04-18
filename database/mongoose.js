const mongoose = require("mongoose")
mongoose.connect(process.env.DB_URL)

mongoose.connection.on("connected", () => {
    console.log("connected to mongodb");
})

mongoose.connection.on("error", (err) => {
    console.log("Error connecting to mongodb");
})

mongoose.connection.on("disconnected", () => {
    console.log("disconnected from mongodb");
})

module.exports=mongoose;