const ImageModel = require('./Image.model');

const addNew = async (data) => {
  try {
    return await new ImageModel(data).save();
  } catch(err) {
    throw new Error(err.message);
  }
};

const getById = async (id) => {
  try {
    return await ImageModel.findOne({ imageId: id });
  } catch(err) {
    throw new Error(err.message);
  }
};

const editById = async (id, data) => {
  try {
    return await ImageModel.findOneAndUpdate({ imageId: id }, data);
  } catch(err) {
    throw new Error(err.message);
  }
};

module.exports.addNew = addNew;
module.exports.getById = getById;
module.exports.editById = editById;