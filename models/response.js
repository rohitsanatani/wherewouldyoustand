const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/*
const responseSchema = new Schema({
  sceneId: {
    type: Array,
    required: true,
  },
  sceneCount: {
    type: Array,
    required: true,
  },
  dataset: {
    type: Array,
    required: true,
  },
  userName: {
    type: Array,
    required: true,
  },
  gameId: {
    type: Array,
    required: true,
  },
  userX: {
    type: Array,
    required: true
  },
  userY: {
    type: Array,
    required: true
  },
  responseTime: {
    type: Array,
    required: true
  },
}, { timestamps: true });
*/

//
const responseSchema = new Schema({
  sceneId: {
    type: Number,
    required: true,
  },
  sceneCount: {
    type: Number,
    required: true,
  },
  dataset: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  gameId: {
    type: String,
    required: true,
  },
  userX: {
    type: Number,
    required: true
  },
  userY: {
    type: Number,
    required: true
  },
  responseTime: {
    type: Number,
    required: true
  },
}, { timestamps: true });
//

const Response = mongoose.model('Response', responseSchema);
module.exports = Response;