import mongoose from "mongoose";

const UserSchema =  new mongoose.Schema({
  name: {type: String, required: true},
  username: {type: String, required: true},
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  phone: {type: String, required: true},
  dob: {type: String, required: true},
  college: {type: String, required: true},
  quote: {type: String},
}, {collection: 'users'})

const User = mongoose.model("UserData", UserSchema);
export default User;