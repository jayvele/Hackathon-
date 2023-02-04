export const classControllers = {};
const randomstring = require('randomstring');
import { db } from '../../lib/mongo';

classControllers.createClass = function (req) {
  const { uid, usertype } = req;
  if (req.usertype != 'teacher') throw new Error('Unauthorised user');
  const data = req.body;
  const { title, description } = data;
  // const cid = await db.incrId('cid');
  const code = randomstring.generate({ length: 6, charset: 'alphanumeric' });
  const payload = {
    uid,
    cid,
    title,
    description: description || '',
    createdAt: Date.now(),
    students: data.students || [],
    code,
    type: 'classroom',
  };
  return payload;
};
classControllers.joinClass = async function (req) {
  const { uid, usertype } = req;
  const code = req.body.jcode;
  const keys = {
    type: 'classroom',
    code,
  };
  const res = await db.getField('classroom', keys);
  if (!res) throw new Error('No Class found!');
  if (res.students.findIndex((id) => id == uid) != -1)
    throw new Error('Already joined');
  const updates = {
    $push: {
      students: uid,
    },
  };
  return await db.updateField('classroom', keys, updates);
};
