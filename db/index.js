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
    return images.find(i => i.id === id);
  } catch(err) {
    throw new Error(err.message);
  }
};

module.exports.addNew = addNew;
module.exports.getById = getById;