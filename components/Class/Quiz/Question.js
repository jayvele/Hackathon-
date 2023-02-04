import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import styles from '../../../styles/Classroom.module.scss';
import { MdDelete } from 'react-icons/md';
import { ImCross } from 'react-icons/im';
import { IconContext } from 'react-icons';
const Question = ({
  data,
  deleteQuestion,
  deleteOption,
  editQuestion,
  editOption,
  addOption,
  changeCorrect,
  index,
}) => {
  const [correct, setcorrect] = useState(data.correct);
  const handleCorrectChange = (id) => {
    if (id == correct) {
      changeCorrect(data.id, '', 'remove');
    } else {
      changeCorrect(data.id, id, 'change');
    }
  };
  useEffect(() => {
    setcorrect(data.correct);
  }, [data.correct]);
  useEffect(() => {}, [correct]);
  return (
    <>
      <div className="flex align-items-center gap-4 mt-3 text-md">
        <div className="h-full align-self-start mt-2 basis-/5">Q. {index}</div>
        <form action="" className="basis-4/5">
          <input
            type="text"
            placeholder="Enter Question"
            value={data.q}
            onChange={(e) => editQuestion(data.id, e.target.value)}
          />
          <div className="flex flex-column mt-3">
            {data.options.map((e, i) => {
              console.log(correct, e.id);
              return (
                <div key={i} className={styles.option}>
                  <div className="flex gap-3 align-items-center mb-3">
                    <div
                      onClick={() => handleCorrectChange(e.id)}
                      className={
                        correct == e.id
                          ? styles.activeoption
                          : styles.inactiveoption
                      }
                    ></div>
                    <input
                      type="text"
                      placeholder="Enter Option"
                      value={e.content}
                      onChange={(event) =>
                        editOption(data.id, e.id, event.target.value)
                      }
                    />
                    <ImCross
                      className=" cursor-pointer"
                      onClick={() => deleteOption(data.id, e.id)}
                    />
                  </div>
                </div>
              );
            })}
            <div>
              <Button
                size="sm"
                className="h-auto mx-auto d-block text-md p-0 px-2 leading-1"
                onClick={() => addOption(data.id)}
              >
                +
              </Button>
            </div>
          </div>
        </form>
        <IconContext.Provider
          value={{
            color: 'red',
            className: 'global-class-name',
            size: '1.1em',
          }}
        >
          <div
            className="align-self-start pt-3 cursor-pointer"
            onClick={() => deleteQuestion(data.id)}
          >
            <MdDelete className="font-[#]" />
          </div>
        </IconContext.Provider>
      </div>
      <hr />
    </>
  );
};

export default Question;
