import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import styles from '../../../styles/Classroom.module.scss';
import Question from './Question';
const QuizMaker = ({ classdata, quizInfo }) => {
  const Q_INIT = {
    id: 1,
    q: '',
    correct: 1,
    options: [{ id: 1, content: '' }],
  };
  const O_INIT = {
    id: 1,
    content: '',
  };
  const [nextqid, setNextQid] = useState(1);
  const [nextoid, setNextOid] = useState(1);
  const incrId = (t) => {
    if (t == 'q') {
      const next = nextqid + 1;
      setNextQid(next);
      return next;
    } else {
      const next = nextoid + 1;
      setNextOid(next);
      return next;
    }
  };
  const [_q, setq] = useState([Q_INIT]);
  const deleteQuestion = (id) => {
    setq((prev) => prev.filter((e) => e.id != id));
  };
  const deleteOption = (qid, oid) => {
    setq((prev) =>
      prev.map((q) => {
        if (q.id != qid) return q;
        const newOptions = q.options.filter((e) => e.id != oid);
        // if (!newOptions.length) return { ...q, correct: -1, options: [] };
        return { ...q, options: newOptions };
      })
    );
  };
  const editQuestion = (qid, content) => {
    setq((prev) =>
      prev.map((qq) => {
        if (qq.id != qid) return qq;
        return { ...qq, q: content };
      })
    );
  };
  const editOption = (qid, oid, content) => {
    setq((prev) =>
      prev.map((qq) => {
        if (qq.id != qid) return qq;
        const options = qq.options.map((e) => {
          if (e.id != oid) return e;
          return { ...e, content };
        });
        return { ...qq, options };
      })
    );
  };
  const addOption = (qid) => {
    setq((prev) =>
      prev.map((q) => {
        if (q.id != qid) return q;
        const newoid = incrId('o');
        const newOptions = [...q.options, { id: newoid, content: '' }];
        if (newOptions.length == 1)
          return { ...q, correct: newoid, options: newOptions };
        return { ...q, options: newOptions };
      })
    );
  };
  const addQuestion = () => {
    const newqid = incrId('q');
    const newoid = incrId('o');
    console.log(newqid);
    const options = [{ id: newoid, content: '' }];
    setq((prev) => [
      ...prev,
      { ...Q_INIT, id: newqid, correct: newoid, options },
    ]);
  };
  const changeCorrect = (qid, newc, option) => {
    if (option == 'change') {
      setq((prev) =>
        prev.map((q) => {
          if (q.id !== qid) return q;
          let obj = q;
          obj.correct = newc;
          return obj;
        })
      );
    } else {
      setq((prev) =>
        prev.map((q) => {
          if (q.id !== qid) return q;
          let obj = q;
          obj.correct = -1;
          return obj;
        })
      );
    }
  };
  const validateQuiz = () => {
    const qObject = {
      ...quizInfo,
      questions: _q,
      cid: classdata.cid,
    };
    console.log('final = ', qObject);
    axios
      .post('/api/class/quiz', qObject)
      .then((e) => {
        toast.success('Quiz created Successfully');
        setNextOid(1);
        setNextQid(1);
        setq([Q_INIT]);
      })
      .catch((e) =>
        toast.error(e.response?.data?.err || 'unknown error occured')
      );
  };
  // useEffect(() => {
  //   console.log(_q);
  // }, [_q]);
  return (
    <div className={styles.quiz}>
      <div className="gap-2  w-full flex flex-column">
        <div className="p-2 mx-auto w-3/5">
          {_q.map((e, i) => {
            return (
              <Question
                key={e.id}
                index={i + 1}
                data={e}
                editQuestion={editQuestion}
                editOption={editOption}
                deleteOption={deleteOption}
                deleteQuestion={deleteQuestion}
                addOption={addOption}
                changeCorrect={changeCorrect}
              />
            );
          })}
          <div className="flex gap-2 justify-content-center px-4">
            <Button className="mx-auto  mt-3" onClick={() => addQuestion()}>
              Add question
            </Button>
            <Button
              className="mx-auto mt-3"
              variant={'danger'}
              onClick={validateQuiz}
            >
              Publish
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizMaker;
