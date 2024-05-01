import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoute from "./routes/users.js";
import productRoute from './routes/product.route.js';
import cartRoute from './routes/cart.js'
import file from './routes/files.js';
import orderRoute from './routes/order.js';
import posRoute from './routes/pos.js'
import subscriptionRoute from './routes/subscription.js'

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());
const CONNECTION_URL = process.env.DB_URL;

mongoose.connect(CONNECTION_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB Connections successfull");
});
app.use('/files', express.static('files'));
app.use("/api/users/", userRoute);
app.use("/api/products/", productRoute);
app.use("/api/cart/", cartRoute);
app.use('/api/file',file)
app.use('/api/orders/',orderRoute);
app.use('/api/pos/', posRoute);
app.use('/api/subscriptions/',subscriptionRoute);


app.listen(port, () => console.log(`Ecommerce Listening on port ${port}`));
