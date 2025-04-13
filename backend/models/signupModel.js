// // import mongoose from "mongoose";
// // import bcrypt from "bcryptjs";  

// // const userSchema = new mongoose.Schema({
// //   name: { type: String, required: true },
// //   email: { type: String, required: true, unique: true },
// //   password: { type: String, required: true },
// //   profileImage: { type: String, required: false },
// //   googleId: { type: String, required: false },
// //   shippingAddress: {
// //     type: mongoose.Schema.Types.ObjectId,
// //     ref: 'ShippingAddress', 
// //     required: false
// //   },
// //   isBlocked: { type: Boolean, default: false },
// // });


// // userSchema.methods.matchPassword = async function (enteredPassword) {
// //   try {
// //     return await bcrypt.compare(enteredPassword, this.password);
// //   } catch (error) {
// //     throw error;
// //   }
// // };

// // export default mongoose.model("User", userSchema);
// import mongoose from "mongoose";
// import bcrypt from "bcryptjs";  

// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   profileImage: { type: String, required: false },
//   googleId: { type: String, required: false },
//   shippingAddress: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'ShippingAddress', 
//     required: false
//   },
//   isBlocked: { type: Boolean, default: false },
//   // You can add fields to track order statistics if needed
//   orderCount: { type: Number, default: 0 },
//   lastOrderDate: { type: Date },
// }, {
//   // Adding timestamps for created/updated tracking
//   timestamps: true,
//   // This ensures the Mongoose _id is also available as id in JSON
//   toJSON: {
//     virtuals: true,
//     transform: function(doc, ret) {
//       ret.id = ret._id;
//       return ret;
//     }
//   }
// });

// // Virtual for getting all user's orders (if needed)
// userSchema.virtual('orders', {
//   ref: 'Order',
//   localField: '_id',
//   foreignField: 'userId',
//   justOne: false // Set to true if you want to get just one order
// });

// userSchema.methods.matchPassword = async function (enteredPassword) {
//   try {
//     return await bcrypt.compare(enteredPassword, this.password);
//   } catch (error) {
//     throw error;
//   }
// };

// export default mongoose.model("User", userSchema);
import mongoose from "mongoose";
import bcrypt from "bcryptjs";  

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profileImage: { type: String, required: false },
  googleId: { type: String, required: false },
  shippingAddress: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ShippingAddress', 
    required: false
  },
  isBlocked: { type: Boolean, default: false },
  orderCount: { type: Number, default: 0 },
  lastOrderDate: { type: Date },
}, {
  timestamps: true,
  // This ensures the Mongoose _id is also available as id in JSON
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
      ret.id = ret._id;
      return ret;
    }
  }
});

userSchema.virtual('orders', {
  ref: 'Order',
  localField: '_id',
  foreignField: 'userId',
  justOne: false 
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  try {
    return await bcrypt.compare(enteredPassword, this.password);
  } catch (error) {
    throw error;
  }
};

export default mongoose.model("User", userSchema);