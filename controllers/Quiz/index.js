export const quizControllers = {};
import { db } from '../../lib/mongo';
import validateQuiz from '../../lib/validateQuiz';
import moment from 'moment-timezone';

quizControllers.calculateGrades = (result) => {
  let score = 0;
  result.questions.map((e) => {
    if (e.correct == e.chosen) score += 1;
  });
  return score;
};
quizControllers.getGrades = async (req) => {
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
  score = this.calculateGrades(result);
  return { ...result, score };
};

quizControllers.validateQuiz = async (quiz) => {
  ['title', 'time', 'date', 'cid'].map((e) => {
    if (!quiz[e]) throw new Error(`Please Fill the ${e} field!`);
  });

  quiz.questions.map((e, i) => {
    if (e.correct == -1) {
      throw new Error(`Choose Correct Option For Question ${i + 1}`);
    }
    if (e.options.length == 0) {
      throw new Error(`No options For Question ${i + 1}!`);
    }
    if (!e.q.length) {
      throw new Error(`Empty Question for Q.${i + 1}`);
    }
    e.options.map((options, ind) => {
      if (!options.content)
        throw new Error(`Empty option for Q.${i + 1} and option ${ind + 1}`);
    });
  });
  if (parseInt(quiz.time) < moment().tz('Asia/Kolkata')) {
    throw new Error('Invalid Time');
  }
};

quizControllers.createQuiz = async (req) => {
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

  const createdAt = Date.now();
  const time = parseInt(
    moment(`${data.date} ${data.time}`, 'YYYY-MM-DD hh:mm')
      .tz('Asia/Kolkata')
      .format('x')
  );
  const qid = await db.incrId('qid');
  const formattedDate = moment(time).format('LLLL');

  const payload = {
    ...data,
    uid,
    qid,
    cid: data.cid,
    time,
    formattedDate,
    createdAt,
    type: 'quiz',
  };
  await quizControllers.validateQuiz(payload);
  return await db.postField('quiz', payload);
};

quizControllers.submitAttempt = async (req) => {
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
  const result = await db.getField('quiz', keys);
  if (!result) throw new Error('Submission not found!');
  await db.updateField(
    'quiz',
    { qid, cid, type: 'quiz' },
    { $push: { submitted: parseInt(uid) } }
  );
  return await db.updateField('quiz', keys, {
    $set: { status: 'submitted', submittedAt: Date.now() },
  });
};
