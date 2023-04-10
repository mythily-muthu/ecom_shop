const express = require('express');
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");


const app = express();

//import routes
const authRoute = require('./routes/auth.routes');
const userRoute = require('./routes/user.routes');
const productRoute = require("./routes/product.routes");
const cartRoute = require("./routes/cart.routes");
const orderRoute = require("./routes/order.routes");


// dot env config variable access
dotenv.config();
app.use(cors());


//mongo db config
mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("mongo db connected successfully");
}).catch((err) => {
    console.log("db connection error", err.message)
})

app.use(express.json())// parsing

const PORT = process.env.PORT || 9000;




//routes

//user auth (register , login)
app.use("/api/auth", authRoute);

//user crud
app.use("/api/users", userRoute);

//product 
app.use("/api/products", productRoute);
// cart
app.use("/api/carts", cartRoute);

//order
app.use("/api/orders", orderRoute);



app.listen(PORT, () => {
    console.log("Server running successfully at", PORT)
})
