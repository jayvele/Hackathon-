import { connectToDatabase } from '../lib/mongodb';
const mongoOps = {};
mongoOps.getField = async (collection, keys, options = {}) => {
  let { db } = await connectToDatabase();
  let data = await db.collection(collection).findOne(keys, options);
  if (data) delete data._id;
  // if (Object.keys(data).length == 0) return null;
  return data;
};
mongoOps.getFields = async (collection, keys, options = {}) => {
  let { db } = await connectToDatabase();
  let data;
  if (options.sort) {
    data = await db
      .collection(collection)
      .find(keys, options)
      .sort(options.sort)
      .toArray();
  } else {
    data = await db.collection(collection).find(keys, options).toArray();
  }
  return data;
};

mongoOps.getUser = async (token) => {
  let { db } = await connectToDatabase();
  let res = await this.getField('user', { token });
  if (res) {
    return res.uid;
  }
  const uid = await this.incrId('uid');
  res = await this.postField('user', {
    uid,
    token,
  });
  if (res.insertedId) return await db.getField('user', { token });
  return false;
};

mongoOps.incrId = async function incrId(id, collectionName = 'config') {
  const { db } = await connectToDatabase();
  let keys = {
    type: 'ids',
  };
  let updates = {
    $inc: {},
  };
  updates.$inc[id] = 1;
  await db.collection(collectionName).updateOne(keys, updates);
  let data = await this.getField(collectionName, { type: 'ids' });
  if (!data) {
    const payload = {
      pid: 1,
      tid: 1,
      uid: 1,
      type: 'ids',
    };
    const data = await this.postField('config', payload);
    return await this.incrId(id);
  }
  return data[id];
};

mongoOps.getUser = async function incrId(id) {};

mongoOps.postField = async (collection, payload, options = {}) => {
  let { db } = await connectToDatabase();

  let data = await db.collection(collection).insertOne(payload, options);
  if (data.insertedId) {
    return payload;
  } else return false;
};

mongoOps.updateField = async (collection, keys, updates, options = {}) => {
  let { db } = await connectToDatabase();

  let data = await db.collection(collection).updateOne(keys, updates, options);
  if (data.acknowledged) return await mongoOps.getField(collection, keys);
  return false;
};

mongoOps.deleteField = async (collection, keys, updates, options = {}) => {
  let { db } = await connectToDatabase();

  let data = await db.collection(collection).deleteOne(keys, updates, options);
  if (data.acknowledged && data.deletedCount)
    return { deleted: true, count: data.deletedCount };
  if (data.acknowledged && !data.deletedCount) return { matched: 0 };
  return false;
};

mongoOps.deleteFields = async (collection, keys, updates, options = {}) => {
  let { db } = await connectToDatabase();

  let data = await db.collection(collection).deleteMany(keys, updates, options);
  if (data.acknowledged && data.deletedCount)
    return { deleted: true, count: data.deletedCount };
  if (data.acknowledged && !data.deletedCount) return { matched: 0 };
  return false;
};
let db = mongoOps;
export { db };
