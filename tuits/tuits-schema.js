import mongoose from 'mongoose';
const schema = mongoose.Schema({
  tuit: String,
  likes: Number,
  postedBy: {
    username: String
  }
}, {collection: 'tuits'});
export default schema;
// load mongoose library
// create schema
// tuit property of type String
// likes property of type Number
// which collection name
// export schema so it can be used elsewhere
