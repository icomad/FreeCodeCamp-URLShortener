const mongo = require('mongodb');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const AutoIncrement = require('mongoose-sequence')(mongoose);

mongoose.connect(process.env.MONGOLAB_URI, { useMongoClient: true });


const URLSchema = mongoose.Schema({
  original_url: {
    type: String,
    required: true,
  },
  short_url: {
    type: Number,
    unique: true,
  }
});

URLSchema.plugin(AutoIncrement, { inc_field: 'short_url' });

const URLModel = mongoose.model('url', URLSchema);

exports.findOrCreateURL = async (og_url) => {
  let url = null;
  try {
    url = await URLModel.findOne({ original_url: og_url });
  } catch (error) {
    return Promise.reject(error);
  }
  if (url) return Promise.resolve(url);
  url = new URLModel({
    original_url: og_url,
  });
  try {
    await url.save();
  } catch (error) {
    return Promise.reject(error);
  }
  return Promise.resolve(url);
}

exports.shortUrlLookup = async (short_url) => {
  let url = null;
  try {
    url = await URLModel.findOne({ short_url: short_url });
    if (url) return Promise.resolve(url);
    return Promise.reject('Short url not found');
  } catch (error) {
    return Promise.reject(error);
  }
}

exports.showAll = async () => {
  try {
    const urls = await URLModel.find({});
    return Promise.resolve(urls);
  } catch (error) {
    return Promise.reject(error);
  }
}

