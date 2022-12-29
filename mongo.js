const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://stalin:${password}@cluster0.5xor7az.mongodb.net/phonebook?retryWrites=true&w=majority`;
mongoose.set("strictQuery", false);

mongoose.connect(url);

const phoneSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Phone = mongoose.model("Phone", phoneSchema);

const phone = new Phone({
  name: process.argv[3],
  number: process.argv[4],
});

if (process.argv.length == 5) {
  phone.save().then((result) => {
    console.log(
      "added " + result.name + " number " + result.number + " to phonebook"
    );
    mongoose.connection.close();
  });
}

if (process.argv.length == 3) {
  Phone.find({}).then((result) => {
    console.log("Directorio telefónico:");
    result.forEach((item) => console.log(item.name + " " + item.number));
    mongoose.connection.close();
  });
}
