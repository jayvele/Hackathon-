import axios from 'axios';
import next from 'next';
import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import styles from '../../../styles/Classroom.module.scss';
const QuizAttempt = ({ qdata, classdata, user, startQ, qno, submitted }) => {
  const [quiz, setQuiz] = useState(qdata);
  const [submit, setsubmit] = useState(submitted);
  const [start, setstart] = useState(startQ);
  const [q_no, setq_no] = useState(qno);
  const [currQ, setcurrQ] = useState(qdata.questions[q_no]);
  const [chosen, setchosen] = useState(currQ.chosen || -1);
  const [graded, setGrade] = useState(submitted);
  const [finalData, setFinal] = useState();
  const nextQuestion = async (m) => {
    const questions = quiz.questions.map((e, i) => {
      if (i != q_no) return e;
      return { ...e, chosen };
    });

    axios
      .post('/api/class/quiz/attempt', {
        cid: qdata.cid,
        qid: qdata.qid,
        chosen: chosen,
        questionId: currQ.id,
        qindex: q_no + 1,
        type: 'post',
      })
      .then(async () => {
        setQuiz((e) => {
          return { ...e, questions };
        });
        if (q_no == qdata.questions.length - 1 && m != -1) {
          if (confirm('Are you sure you want to submit')) {
            await submitQuiz();
          } else {
            return;
          }
          setq_no((e) => qdata.questions.length - 1);
        } else {
          setq_no((e) => e + m);
        }
      });
  };
  const submitQuiz = async () => {
    await axios
      .post('/api/class/quiz/attempt', {
        cid: qdata.cid,
        qid: qdata.qid,
        questions: quiz.questions,
        type: 'submit',
      })
      .then((e) => {
        if (e.data.status == 'submitted') {
          setsubmit(true);
          setFinal(e.data);
          toast.success('Submitted Successfully!');
        }
      });
  };
  useEffect(() => {
    setcurrQ(quiz.questions[q_no]);
  }, [q_no]);
  useEffect(() => {
    setchosen(currQ.chosen || -1);
  }, [currQ]);
  const startQuiz = () => {
    axios
      .post('/api/class/quiz/attempt', {
        cid: qdata.cid,
        qid: qdata.qid,
        questions: qdata.questions,
        type: 'start',
      })
      .then((e) => {
        toast.success('Quiz has started!');
        setstart(true);
      });
  };

  const getGrades = () => {
    axios
      .post('/api/class/quiz/attempt', {
        cid: qdata.cid,
        qid: qdata.qid,
        uid: user.uid,
        type: 'grades',
      })
      .then((e) => {
        setFinal(e.data || {});
        setsubmit(false);
        setGrade(true);
      });
  };
  if (graded) {
    if (!finalData) {
      getGrades();
      return;
    }
    return (
      <div>
        <div className="mx-auto text-center pt-4 text-2xl">
          <div className="text-2xl">Grades</div>
          {finalData?.score}/{finalData?.questions?.length}
          <hr />
          <div className="mt-4 sm:w-full md:w-3/4 lg:w-2/4 text-lg mx-auto">
            {finalData.questions.map((qs, qind) => {
              return (
                <div
                  key={qind}
                  className="mb-4 border-1 p-4 border-sm  shadow-sm rounded-lg"
                >
                  <div className="text-center mb-2 text-lg">Q. {qind + 1}</div>
                  <div className="flex gap-4 justify-content-center text-xl">
                    <div className="basis- align-self-end text-xl p-2  rounded-lg mb-3">
                      {qs.q}
                    </div>
                  </div>
                  <div className="flex flex-column align-items-start mx-auto">
                    {qs.options.map((e, i) => {
                      let correct, chosen;
                      if (qs.chosen == e.id) chosen = true;
                      if (e.id == qs.correct) correct = true;
                      return (
                        <div className={styles.option} key={i}>
                          <div
                            className={`flex gap-3 border-1 w-full 
                            cursor-pointer align-items-center
                            ${chosen && !correct ? 'border-red-400' : ''}
                            ${correct ? 'border-green-400' : ''} 
                            mb-3 border-2 rounded-lg p-2`}
                          >
                            <div className="px-3">{e.content}</div>
                          </div>
                        </div>
                      );
                    })}
                    {/* <hr className="w-2/3 mx-auto" /> */}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
      </div>
    );
  }
  if (submit) {
    return (
      <div>
        <div className="mx-auto text-center pt-4">
          <Button variant="success" onClick={getGrades}>
            View Grades
          </Button>
        </div>
      </div>
    );
  }
  if (!start)
    return (
      <>
        <div className="color-red text-center p-4">
          {!qdata.nav ? 'Note: Navigation is Off' : ''}
        </div>
        <Button className="d-block mx-auto" onClick={startQuiz}>
          Start Quiz
        </Button>
      </>
    );
  else {
    return (
      <div className={styles.quiz}>
        <div className="p-2">
          <div className="mx-auto w-[400px]">
            <div className="text-center mb-4 text-xl">Q. {q_no + 1}</div>
            <div className="flex gap-4 justify-content-center text-xl">
              <div className="basis- align-self-end text-2xl p-2  rounded-lg mb-3">
                {currQ.q}
              </div>
            </div>
            <div className="flex flex-column align-items-start mx-auto">
              {currQ.options.map((e, i) => (
                <div className={styles.option} key={i}>
                  <div
                    className="flex gap-3 w-full cursor-pointer align-items-center mb-3 border-2 rounded-lg p-2"
                    onClick={() => setchosen(e.id)}
                  >
                    <div
                      className={
                        chosen == e.id
                          ? styles.activeoption
                          : styles.inactiveoption
                      }
                    ></div>
                    <div className="">{e.content}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-content-center gap-5 mt-4 text-md">
              {qdata.nav && q_no != 0 ? (
                <Button
                  variant={'info'}
                  size="sm"
                  onClick={() => nextQuestion(-1)}
                >
                  Previous
                </Button>
              ) : (
                ''
              )}

              {q_no == qdata.questions.length - 1 ? (
                <Button
                  variant={'danger'}
                  onClick={() => nextQuestion(1)}
                  size="sm"
                >
                  Submit Quiz
                </Button>
              ) : (
                <Button
                  variant={'info'}
                  onClick={() => nextQuestion(1)}
                  size="sm"
                >
                  Next
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default QuizAttempt;
