const mongoose = require("mongoose");

const url = process.env.MONGO_URI;
mongoose.set("strictQuery", false);
const connectDB = () =>
  mongoose
    .connect(url)
    .then((result) => {
      console.log("connected to MongoDB");
    })
    .catch((error) => {
      console.log("error connecting to MongoDB:", error.message);
    });

const phoneSchema = new mongoose.Schema({
  name: { type: String, minLength: 3, require: true },
  number: { type: String, require: true },
});
phoneSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});
const Phone = mongoose.model("Phone", phoneSchema);
module.exports = { connectDB, Phone };
