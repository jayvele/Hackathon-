import attachUid from '../../../../lib/attachUid';
import { db } from '../../../../lib/mongo';
import moment from 'moment-timezone';
export default async function handler(req, res) {
  try {
    req = await attachUid(req);
    const quizObject = new QuizAttempt();
    let result;
    if (req.method !== 'POST') throw new Error('Invalid Method!');

    switch (req.body.type) {
      case 'start':
        result = await quizObject.startAttempt(req);
        break;

      case 'post':
        result = await quizObject.postAttempt(req);
        break;

      case 'submit':
        result = await quizObject.submitAttempt(req);
        break;

      case 'grades':
        result = await quizObject.getGrades(req);
        break;

      default:
        throw new Error('Invalid Method!');
    }
    res.json(result);
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
}
class QuizAttempt {
  postAttempt = async (req) => {
    const { uid } = req;
    const data = req.body;
    const qid = parseInt(data.qid);
    const cid = parseInt(data.cid);
    const questionId = parseInt(data.questionId);
    const chosen = data.chosen;
    const qindex = data.qindex;
    const keys = {
      cid,
      qid,
      uid,
      type: 'submission',
    };
    const result = await db.getField('quiz', keys);
    if (!result) throw new Error('Submission object not found!');
    const updates = {
      $set: {
        'questions.$[elem].chosen': parseInt(chosen),
        qindex,
      },
    };
    const submission = await db.updateField('quiz', keys, updates, {
      arrayFilters: [{ 'elem.id': questionId }],
    });
    if (submission) {
      return { added: true, submission };
    } else return false;
  };

  startAttempt = async (req) => {
    const { uid, usertype } = req;
    if (usertype !== 'student') throw new Error('Unauthorised!');
    const data = req.body;
    const qid = parseInt(data.qid);
    const cid = parseInt(data.cid);
    const keys = {
      cid,
      qid,
      uid,
      type: 'quiz_submission',
    };
    const submission = await db.getField('quiz', keys);
    if (submission) return submission;
    const pid = await db.incrId('pid');
    const payload = {
      cid,
      qid,
      uid,
      qindex: 0,
      questions: data.questions,
      status: 'ongoing',
      startedAt: Date.now(),
      type: 'submission',
    };
    console.log(payload);
    return await db.postField('quiz', payload);
  };

  submitAttempt = async (req) => {
    moment.tz.setDefault('Asia/Kolkata');
    const { uid } = req;
    const data = req.body;
    const qid = parseInt(data.qid);
    const cid = parseInt(data.cid);
    const keys = {
      cid,
      qid,
      uid,
      type: 'submission',
    };
    await db.updateField(
      'quiz',
      { qid, cid, type: 'quiz' },
      { $push: { submitted: parseInt(uid) } }
    );
    return await db.updateField('quiz', keys, {
      $set: { status: 'submitted', submittedAt: moment().valueOf() },
    });
  };

  getGrades = async (req) => {
    const data = req.body;
    const usertype = req.usertype;
    const qid = parseInt(data.qid);
    const uid = parseInt(req.uid);
    const cid = parseInt(data.cid);
    const keys = {
      qid,
      uid,
      cid,
      type: 'submission',
      status: 'submitted',
    };
    if (usertype == 'teacher') {
      let results = await db.getFields('quiz', {
        qid,
        type: 'submission',
        status: 'submitted',
      });
      results = await Promise.all(
        results.map(async (result) => {
          let score = 0;
          score = calculateGrades(result);
          const submittedAt = moment(result.submittedAt).format('LLL');
          const a = moment(result.startedAt || 0);
          const b = moment(result.submittedAt || 0);
          const timeTaken = b.diff(a, 'minutes', true);
          let user = await db.getField('users', { uid: result.uid });
          return { ...result, score, name: user.name, submittedAt, timeTaken };
        })
      );
      return results;
    }
    const result = await db.getField('quiz', keys);
    let score = 0;
    if (!result) throw new Error('Submission object not found!');
    score = calculateGrades(result);
    return { ...result, score };
  };
}

const calculateGrades = (result) => {
  let score = 0;
  result.questions.map((e) => {
    if (e.correct == e.chosen) score += 1;
  });
  return score;
};
