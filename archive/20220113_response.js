const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
  user: {
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
  nComp: {
    type: Number,
    required: true
  },
  compX: {
    type: String,
    required: true,
  },
  compY: {
    type: String,
    required: true,
  },
  nSeats: {
    type: Number,
    required: true
  },
  seatX: {
    type: String,
    required: true,
  },
  seatY: {
    type: String,
    required: true,
  },
  nDoors: {
    type: Number,
    required: true
  },
  doorX: {
    type: String,
    required: true,
  },
  doorY: {
    type: String,
    required: true,
  },
  planWidth: {
    type: Number,
    required: true
  },
  planHeight: {
    type: Number,
    required: true
  },
}, { timestamps: true });

const Response = mongoose.model('Response', responseSchema);
module.exports = Response;