import React, { useState, useEffect } from 'react';
import ErrorPage from 'next/error';
import getUser from '../../../../lib/getUser';
import Head from 'next/head';
import { db } from '../../../../lib/mongo';
import {
  QuizAttempt,
  NavbarCommon,
  Container,
  Wrapper,
  QuizTeacher,
} from '../../../../components';
import { Button } from 'react-bootstrap';
import styles from '../../../../styles/Classroom.module.scss';
export async function getServerSideProps({ req, res, params }) {
  const user = await getUser(req, res);
  // slug -> /cid/qid
  process.env.TZ = 'Asia/Kolkata';

  const [cid, qid] = params.slug;
  const classdata = await db.getField('classroom', {
    cid: parseInt(cid),
    $or: [{ students: user.uid }, { uid: user.uid }],
    type: 'classroom',
  });
  const qdata = await db.getField('quiz', {
    qid: parseInt(qid),
    type: 'quiz',
    cid: parseInt(cid),
  });
  const attemptData = await db.getField('quiz', {
    uid: user.uid,
    cid: parseInt(cid),
    qid: parseInt(qid),
    type: 'submission',
  });
  let q_no = 0;
  let submitted = false;
  let start = false;
  if (attemptData) {
    start = true;
    qdata.questions = attemptData.questions;
    q_no = attemptData.qindex;
    q_no = q_no == attemptData.questions.length ? q_no - 1 : q_no;
    if (attemptData.status == 'submitted') {
      submitted = true;
    }
  }

  if (!user || !classdata || !qdata) {
    return {
      redirect: {
        permanent: false,
        destination: '/dashboard',
      },
      props: {},
    };
  }
  if (user.usertype == 'teacher') {
    return {
      props: {
        user,
        classdata,
        qdata,
      },
    };
  }
  if (user) {
    return {
      props: {
        user,
        classdata,
        qdata,
        start,
        q_no,
        submitted,
      },
    };
  }
}
export default function Classroom({
  qdata,
  classdata,
  user,
  start,
  q_no,
  submitted,
}) {
  return (
    <>
      <Head>
        <title>{qdata.title}</title>
      </Head>
      <NavbarCommon
        current="dash"
        user={user}
        cid={classdata.cid}
        classtitle={classdata.title}
      />
      <Wrapper>
        <div className={styles.main}>
          <Container
            styles={
              'min-h-[570px] text-xl px-5 py-5 border-2 border-indigo-200'
            }
          >
            {user.usertype === 'student' ? (
              <QuizAttempt
                qdata={qdata}
                classdata={classdata}
                user={user}
                startQ={start}
                qno={q_no}
                submitted={submitted}
              />
            ) : (
              <QuizTeacher qdata={qdata} user={user} classdata={classdata} />
            )}
          </Container>
        </div>
      </Wrapper>
    </>
  );
}
