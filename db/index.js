const fs = require('fs').promises;

const addNew = async (data) => {
  try {
    const file = await fs.readFile('db/images.json', {encoding: 'utf-8'});
    const images = [...JSON.parse(file)];
    images.push(data);
    await fs.writeFile('db/images.json', JSON.stringify(images));
    return true
  } catch(err) {
    throw new Error(err.message);
  }
};

const getById = async (id) => {
  try {
    const file = await fs.readFile('db/images.json', {encoding: 'utf-8'});
    const images = [...JSON.parse(file)];
    return images.find(i => i.imageId === id);
  } catch(err) {
    throw new Error(err.message);
  }
};

const editById = async (id, data) => {
  try {
    const file = await fs.readFile('db/images.json', {encoding: 'utf-8'});
    const images = [...JSON.parse(file)];
    const index = images.findIndex(i => i.imageId === id);
    if (index !== -1) {
      images[index] = {...images[index], ...data};
      await fs.writeFile('db/images.json', JSON.stringify(images));
      return true;
    }
    return null;
  } catch(err) {
    throw new Error(err.message);
  }
};

module.exports.addNew = addNew;
module.exports.getById = getById;
module.exports.editById = editById;