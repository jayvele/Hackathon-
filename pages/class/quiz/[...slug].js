import React, { useState } from 'react';
import getUser from '../../../lib/getUser';
import styles from '../../../styles/Classroom.module.scss';
import ErrorPage from 'next/error';
import {
  NavbarCommon,
  Wrapper,
  Container,
  QuizMaker,
} from '../../../components';
import Head from 'next/head';
import { db } from '../../../lib/mongo';
export async function getServerSideProps({ req, res, params }) {
  process.env.TZ = 'Asia/Kolkata';

  const user = await getUser(req, res);
  const [cid] = params.slug;
  const classdata = await db.getField('classroom', {
    cid: parseInt(cid),
    type: 'classroom',
  });
  if (user.usertype !== 'teacher') {
    return {
      redirect: {
        permanent: false,
        destination: `/class/${cid}`,
      },
      props: {},
    };
  }
  if (!user) {
    return {
      redirect: {
        permanent: false,
        destination: '/login',
      },
      props: {},
    };
  }
  if (user) {
    return {
      props: {
        user,
        classdata,
        cid,
      },
    };
  }
}

export default function Classroom({ cid, classdata, user }) {
  const [quizinfo, setinfo] = useState({ nav: false });
  if (!classdata) {
    return <ErrorPage statusCode={404} />;
  }
  const handleChange = (e) => {
    const inp = e.target.getAttribute('inp');
    setinfo((prev) => {
      if (inp == 'nav') return { ...prev, [inp]: e.target.checked };
      return { ...prev, [inp]: e.target.value };
    });
  };
  return (
    <>
      <Head>
        <title>Create Quiz</title>
      </Head>
      <NavbarCommon
        current="dash"
        user={user}
        cid={classdata.cid}
        classtitle={classdata.title}
      />
      <Wrapper>
        <div className={styles.mainQuiz}>
          <div className="p-3 mx-auto text-md">
            <Container
              styles={'border-2 border-sky-300 shadow-slate-100 shadowm-sm'}
            >
              <h1 className="text-center text-4xl">Create Quiz</h1>
              <div className="flex gap-3 justify-content-around px-2 py-2 align-items-center">
                <input
                  type="text"
                  value={quizinfo.title}
                  inp="title"
                  placeholder="Enter Title"
                  onChange={handleChange}
                />
                <input
                  type="date"
                  value={quizinfo.date}
                  inp="date"
                  placeholder="Enter Date"
                  onChange={handleChange}
                />
                Navigation
                <input
                  inp="nav"
                  value={quizinfo.nav}
                  type="checkbox"
                  onChange={handleChange}
                />
                <input
                  inp="time"
                  value={quizinfo.time}
                  type="time"
                  placeholder="Enter Time"
                  onChange={handleChange}
                />
              </div>
              <hr />
              <QuizMaker classdata={classdata} quizInfo={quizinfo} />
            </Container>
          </div>
        </div>
      </Wrapper>
    </>
  );
}
