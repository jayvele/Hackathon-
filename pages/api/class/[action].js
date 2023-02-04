import attachUid from '../../../lib/attachUid';
import { db } from '../../../lib/mongo';
import randomstring from 'randomstring';
export default async function handler(req, res) {
  const { action } = req.query;

  try {
    let result;
    req = await attachUid(req);
    const classroomObj = new Classroom();
    switch (action) {
      case 'create':
        result = await classroomObj.createClass(req);
        break;

      case 'get':
        result = await classroomObj.getClasses(req);
        break;

      case 'join':
        result = await classroomObj.joinClass(req);
        break;

      case 'members':
        result = await classroomObj.getMembers(req);
        break;
    }
    res.json(result);
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
}

const classroomHandler = {};
//  Classroom Class
export class Classroom {
  getOne = async (req) => {
    return 1;
  };
  createClass = async (req) => {
    const { uid, usertype } = req;
    if (req.usertype != 'teacher') throw new Error('Unauthorised user');
    const data = req.body;
    const { title, description } = data;
    const cid = await db.incrId('cid');
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
    return await db.postField('classroom', payload);
  };

  getClasses = async (req) => {
    const { uid, usertype } = req;
    let keys = {
      type: 'classroom',
    };
    if (usertype == 'teacher') {
      keys.uid = uid;
    } else {
      keys.students = uid;
    }
    return await db.getFields('classroom', keys, { sort: { createdAt: 1 } });
  };

  joinClass = async (req) => {
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

  getMembers = async (req) => {
    const { uid, usertype } = req;
    const cid = parseInt(req.body.cid);
    const classdata = await db.getField('classroom', {
      type: 'classroom',
      cid,
    });
    const uids = classdata.students;
    const students = await db.getFields('users', {
      uid: { $in: uids },
      usertype: 'student',
    });
    const teacher = await db.getField('users', { uid: classdata.uid });
    return { teacher, students };
  };
}
