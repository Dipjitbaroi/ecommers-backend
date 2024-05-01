import mongoose from "mongoose";

const { Schema } = mongoose;

const AddressSchema = new Schema(
  {
    type: { type: String, enum: ["Billing", "Shipping"], required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    postalCode: { type: String, required: true },
  },
  { _id: false }
);

const OrderSchema = new Schema(
  {
    userId: { type:mongoose.Schema.Types.ObjectId, required: true },
    orderId: { type: Number, required: true},
    items: [
      {
        product: { type: Object, ref: "Product", required: true },
        quantity: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    deliveryCharge: { type: Number, required: true},
    deliveryAddress: [AddressSchema],
    paymentType: {type:String, required: true, default: "COD", enum: ["COD", "Prepaid"]},
    paymentStatus: { type:String, required: true, default: "unpaid", enum: ["unpaid", "paid"]},
    status: { type: String, enum: ["Pending", "Completed", "Cancelled"], default: "Pending" },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);



const Order = mongoose.model("Order", OrderSchema);

export default Order;
