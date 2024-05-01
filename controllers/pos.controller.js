import Product from "../model/product.model.js";
import User from "../model/user.model.js";
import POrder from "../model/pos.model.js";
import mongoose from "mongoose";



// Create a new POS order
export const createPOrder = async (req, res) => {
  try {
    const { userId, items, VAT, discount } = req.body;

    // Check if items array is empty
    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Items array cannot be empty' });
    }

    // Validate that each item has a valid product ID and quantity
    for (const item of items) {
      const { product, quantity } = item;
      if (!mongoose.isValidObjectId(product)) {
        return res.status(400).json({ error: 'Invalid product ID' });
      }
      if (isNaN(quantity) || quantity <= 0) {
        return res.status(400).json({ error: 'Invalid quantity' });
      }
    }

    let name, phone;

    // If name and phone are not provided, retrieve them based on userId
    if (!req.body.name || !req.body.phone) {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      name = user.fullName;
      phone = user.phone;
    } else {
      // If name and phone are provided in the request body, use them directly
      name = req.body.name;
      phone = req.body.phone;
    }

    // Fetch products from the database
    const products = await Product.find({ _id: { $in: items.map((item) => item.product) } });

    // Create a map of product ID to product object for easy lookup
    const productMap = new Map();
    products.forEach((product) => {
      productMap.set(product._id.toString(), product);
    });

    // Calculate the subTotal based on the items
    let subTotal = 0;
    items.forEach((item) => {
      const product = productMap.get(item.product);
      if (product) {
        subTotal += product.price * item.quantity;
      }
    });

    // Calculate the VAT amount based on the subTotal
    const vatAmount = (VAT / 100) * subTotal;

    // Calculate the totalAmount by adding VAT and applying discount
    const totalAmount = subTotal + vatAmount - discount;

    // Create the POS order
    const pOrder = new POrder({
      user: userId,
      name,
      phone,
      items,
      VAT: vatAmount,
      discount,
      totalAmount,
    });

    // Decrease the product quantity in the inventory
    for (const item of items) {
      const product = productMap.get(item.product);
      if (product) {
        product.quantity -= item.quantity;
        await product.save();
      }
    }

    // Save the POS order
    await pOrder.save();

    res.status(201).json({ pOrder });
  } catch (error) {

    console.error(error);
    res.status(500).json({ error: 'Failed to create the POS order' });
  }
};




  

export const getPOrders = async (req, res) => {
    try {
      const pOrders = await POrder.find().populate('user', 'username');
      res.json({ pOrders });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch POS orders' });
    }
  };