import Cart from "../model/cart.model.js";
import Product from "../model/product.model.js";

// Controller function to add items to the cart

// Controller function to add or update the cart
export const addOrUpdateCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    // Validate input data
    if (!userId || !productId || !quantity) {
      return res.status(400).json({ message: "Incomplete data" });
    }

    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    } else {
      console.log(product);
    }

    // Retrieve the user's cart
    let cart = await Cart.findOne({ userId });

    // If the cart doesn't exist, create a new cart
    if (!cart) {
      cart = new Cart({
        userId,
        items: [],
      });
    }

    // Check if the product already exists in the cart
    // const cartItem = cart.items.find(item => item.product === productId);  // not working

    const cartItem = cart.items.find(
      (item) => item.product._id.toString() === productId
    );
    console.log("cartItem", cartItem);

    if (cartItem) {
      // Update the quantity of the existing item
      cartItem.quantity += quantity;
    } else {
      // Create a new cart item
      cart.items.push({
        product: product,
        quantity,
      });
    }

    // Calculate the total price for each item in the cart
    cart.items.forEach((item) => {
      const productPrice = product.price;
      item.totalPrice = productPrice * item.quantity;
    });

    // Calculate the overall cart total
    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.totalPrice,
      0
    );

    // Save the cart
    await cart.save();

    res.json({ message: "Cart updated successfully", cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
};

// // Function to calculate the total price based on the items in the cart
// const calculateTotalPrice = (items) => {
//   let totalPrice = 0;
//   items.forEach((item) => {
//     totalPrice += item.product.totalPrice;
//   });
//   return totalPrice;
// };

export const getCartbyUserId = async (req, res) => {
  try {
    const userId = req.params.id;
    // Retrieve the user's cart
    const cart = await Cart.findOne({ userId: userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.json({ cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const deleteCartbyUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const productId = req.params.productId;

    console.log(userId, productId);
    // Retrieve the user's cart
    const cart = await Cart.findOne({ userId: userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Find the index of the item to be removed
    const itemIndex = cart.items.findIndex(
      (item) => item.product._id.toString() === productId
    );
    console.log("findIndex", itemIndex);
    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in the cart" });
    }

    // Remove the item from the cart
    cart.items.splice(itemIndex, 1);

    // Calculate the overall cart total
    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.totalPrice,
      0
    );

    // Save the updated cart
    await cart.save();

    res.json({ message: "Item removed from cart successfully", cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
