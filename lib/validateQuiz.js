import moment from 'moment-timezone';
const validateQuiz = async (quiz) => {
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
  if (parseInt(quiz.startTime) < moment().tz('Asia/Kolkata')) {
    throw new Error('Invalid Time');
  }
};

export default validateQuiz;
