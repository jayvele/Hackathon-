const expect = require('chai').expect;
const chai = require('chai');
import moment from 'moment-timezone';
const { classControllers } = require('../controllers/Class');
const { quizControllers } = require('../controllers/Quiz');
const { db } = require('../lib/mongo');
chai.use(require('chai-as-promised'));

describe('Test for Classroom', function () {
  this.timeout(2000);
  const req1 = {
    usertype: 'student',
    uid: 10,
    body: {
      title: 'demo class',
    },
  };
  const join_class_mock = {
    uid: -1,
    body: {
      jcode: 'abcdef',
    },
  };
  describe('Only a teacher can create a classroom', () => {
    it('Should Throw error if usertype is student', async function () {
      const res = expect(() => classControllers.createClass(req1)).to.throw(
        'Unauthorised'
      );
    });
  });
});

describe('Grades of a Quiz', function () {
  const mock_grading_data = {
    title: '',
    questions: [
      {
        id: 1,
        chosen: 2,
        correct: 2,
        options: [
          { id: 2, content: 'lorem' },
          { id: 3, content: 'lorem' },
        ],
      },
      {
        id: 2,
        chosen: 4,
        correct: 5,
        options: [
          { id: 4, content: 'lorem' },
          { id: 5, content: 'lorem' },
        ],
      },
    ],
  };

  const mock_request = {
    uid: 41,
    usertype: 'student',
    body: { cid: 38, qid: 95 },
  };
  describe('Accurate Grading', () => {
    it('Should calculate correct grades', async function () {
      expect(quizControllers.calculateGrades(mock_grading_data)).to.equal(1);
      // expect(1).to.equal(2);
    });
  });

  //merge commit 222 test
  // describe('Grading only if submitted', () => {
  //   it('Should throw error if no submission is found', async function () {
  //     await expect(quizControllers.getGrades(mock_request)).to.be.rejectedWith(
  //       'Submission object not found!'
  //     );
  //   });
  // });
});

describe('Validating a Quiz', function () {
  const mock_request = {
    cid: 37,
    title: 'lorem',
    time: '11:11',
    date: '2022-11-28',
    questions: [
      {
        id: 1,
        q: 'lorem',
        correct: 2,
        options: [
          { id: 2, content: 'lorem' },
          { id: 3, content: 'lorem' },
        ],
      },
    ],
    nav: true,
  };
  const options = [
    { id: 2, content: 'lorem' },
    { id: 3, content: 'lorem' },
  ];

  describe('Title is missing', () => {
    it('Should throw error if title not specified', async function () {
      let obj = { ...mock_request };
      delete obj.title;
      await expect(quizControllers.validateQuiz(obj)).to.be.rejectedWith(
        'title'
      );
    });
  });

  describe('Date is missing', () => {
    it('Should throw error if date not specified', async function () {
      let obj = { ...mock_request };
      delete obj.date;
      await expect(quizControllers.validateQuiz(obj)).to.be.rejectedWith(
        'date'
      );
    });
  });

  describe('Start time must be greater than current time', () => {
    it('Should throw error if time is invalid', async function () {
      const time = parseInt(
        moment(`2022-06-28 11:11`, 'YYYY-MM-DD hh:mm')
          .tz('Asia/Kolkata')
          .format('x')
      );

      await expect(
        quizControllers.validateQuiz({ ...mock_request, time })
      ).to.be.rejectedWith('Invalid');
    });
  });

  describe('Options must not be empty', () => {
    it('Should throw error if options for a question are empty', async function () {
      let obj = { ...mock_request };
      obj.questions[0].options = [];
      await expect(quizControllers.validateQuiz(obj)).to.be.rejectedWith(
        'options'
      );
    });
  });

  // describe('All valid details', () => {
  //   it('Should successfully create a quiz', async function () {
  //     mock_request.questions[0].options = options;
  //     const new_mock = { ...mock_request };
  //     let obj = { uid: 42, usertype: 'teacher', body: new_mock };
  //     const res = await quizControllers.createQuiz(obj);
  //     expect(res.qid).to.not.equal(null);
  //   });
  // });
});

// describe('Submitting Quiz', function () {
//   const submission = {
//     uid: 41,
//     body: {
//       cid: 37,
//       qid: 104,
//       title: 'lorem',
//       time: 1111111111111,
//       date: '111',
//       questions: [
//         {
//           id: 1,
//           q: 'lorem',
//           chosen: 2,
//           correct: 2,
//           options: [
//             { id: 2, content: 'lorem' },
//             { id: 3, content: 'lorem' },
//           ],
//         },
//       ],
//       nav: true,
//     },
//   };

//   describe('Successfully submits an attempt', () => {
//     it('Should successfully submit an attempt', async () => {
//       const res = await quizControllers.submitAttempt(submission);
//       expect(res.status).to.equal('submitted');
//     });
//   });
//   describe('If submission object not found', () => {
//     it('Should throw error if submission is not started', async () => {
//       const obj = { ...submission };
//       obj.uid = 1;
//       await expect(quizControllers.submitAttempt(obj)).to.be.rejectedWith(
//         'not found'
//       );
//     });
//   });
// });
