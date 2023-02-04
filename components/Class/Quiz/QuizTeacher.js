import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import styles from '../../../styles/Classroom.module.scss';
import { Spinner } from 'react-bootstrap';
const QuizTeacher = ({ user, classdata, qdata }) => {
  const [grades, setgrades] = useState([]);
  const [loading, setloading] = useState(true);
  useEffect(() => {
    axios
      .post('/api/class/quiz/attempt', {
        qid: qdata.qid,
        uid: user.uid,
        type: 'grades',
      })
      .then((e) => {
        setloading(false);
        setgrades(e.data);
      });
  }, []);
  return (
    <>
      <h3 className="pb-2">Results</h3>
      <div className={styles.teacherQuiz}>
        {grades.length ? (
          <Table striped bordered variant="light" size="sm">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Score</th>
                <th>Submitted At</th>
              </tr>
            </thead>
            <tbody>
              {grades.map((e, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{e.name}</td>
                  <td>
                    {e.score}/{e.questions.length}
                  </td>
                  <td>{e.submittedAt}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : !loading ? (
          <div className="mx-auto text-md mt-4">No submissions yet!</div>
        ) : (
          <div className="p-4">
            <Spinner
              animation="border"
              role="status"
              variant="primary"
              className="p-2"
            />
          </div>
        )}
      </div>
    </>
  );
};

export default QuizTeacher;
