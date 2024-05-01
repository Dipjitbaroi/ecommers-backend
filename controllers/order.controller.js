import User from "../model/user.model.js";
import Order from "../model/order.model.js";
import Product from "../model/product.model.js";
import Cart from "../model/cart.model.js";

export const placeOrder = async (req, res) => {
  try {
    const { userId, cartId, paymentType, addressType } = req.body;

    const userdata = await User.findOne({ _id: userId });
    // TODO: check addressType is matching any type attribute of address. if matches then return address
    const filteredAddresses = userdata.addresses.filter(
      (address) => address.type === addressType
    );
    // genarate random number
    const orderId = Math.floor(
      1000000000 + Math.random() * 9000000000
    ).toString();

    const cart = await Cart.findOne({ _id: cartId });
    const { items, totalPrice } = cart;

    const order = new Order({
      orderId: orderId,
      userId: userId,
      userdata: userdata.fullName,
      deliveryAddress: filteredAddresses,
      items: items,
      deliveryCharge: 90,
      totalAmount: totalPrice + 90,
      paymentType: paymentType,
    });
    const placedOrder = await order.save();

    await Cart.findOneAndDelete({ _id: cartId });
    res.status(201).json({
      success: true,
      status: 201,
      data: placedOrder,
    });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        status: 500,
        error: error,
        message: "Could not place the order",
      });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json({
      status: 200,
      success: true,
      message: "Orders",
      data: orders,
    });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        status: 500,
        error: error,
        message: "Could get orders",
      });
  }
};

export const getOrdersByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId: userId });
    res.status(200).json({
      status: 200,
      success: true,
      message: "Orders",
      data: orders,
    });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        status: 500,
        error: error,
        message: "Could get orders",
      });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const updates = req.body;
    console.log(orderId);
    const updatedOrder = await Order.findOneAndUpdate(
      { _id: orderId },
      updates,
      {
        new: true,
      }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "order not found" });
    }

    res.status(200).json({ success: true, user: updatedOrder });
  } catch (error) {
    res.status(500).json({ error: "Failed to update order" });
  }
};
