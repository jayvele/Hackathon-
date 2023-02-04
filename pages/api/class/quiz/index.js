import attachUid from '../../../../lib/attachUid';
import { db } from '../../../../lib/mongo';
import moment from 'moment';
import validateQuiz from '../../../../lib/validateQuiz';
export default async function handler(req, res) {
  try {
    req = await attachUid(req);
    const quizObject = new Quiz();
    let result;

    switch (req.method) {
      case 'POST':
        result = await quizObject.createQuiz(req);
        break;
      case 'GET':
        result = await quizObject.getQuizzes(req);
        break;
      default:
        throw new Error('Invalid Method!');
    }
    res.json(result);
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
}
//  Quiz Class
class Quiz {
  createQuiz = async (req) => {
    const { usertype, uid } = req;
    if (usertype !== 'teacher') throw new Error('Not authorised');
    const data = req.body;
    const cid = parseInt(data.cid);
    const classdata = await db.getField('classroom', {
      cid,
      type: 'classroom',
    });
    if (classdata.cid != cid) {
      throw new Error('The teacher does not belong to this class!');
    }

    ['title', 'time', 'date', 'cid'].map((e) => {
      if (!data[e]) throw new Error(`Please Fill the ${e} field!`);
    });
    moment.tz.setDefault('Asia/Kolkata');

    const createdAt = Date.now();
    const startTime = parseInt(
      moment(`${data.date} ${data.time}`, 'YYYY-MM-DD hh:mm').format('x')
    );
    const qid = await db.incrId('qid');
    const formattedDate = moment(startTime).format('LLLL');

    console.log(22, data);
    const payload = {
      ...data,
      uid,
      qid,
      cid: data.cid,
      startTime,
      formattedDate,
      createdAt,
      type: 'quiz',
    };
    await validateQuiz(payload);
    return await db.postField('quiz', payload);
  };

  getQuizzes = async (req) => {
    const { usertype, uid } = req;
    const cid = parseInt(req.query.cid);
    const keys = {
      cid,
      type: 'quiz',
    };
    const quizzes = await db.getFields('quiz', keys);
    return quizzes;
  };
}
