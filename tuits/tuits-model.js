import mongoose from 'mongoose';
import tuitsSchema from './tuits-schema.js'
const tuitsModel = mongoose.model('TuitModel', tuitsSchema);
export default tuitsModel;
// load mongoose library
// load tuits schema
// create mongoose model from the schema
// export so it can be used elsewhere