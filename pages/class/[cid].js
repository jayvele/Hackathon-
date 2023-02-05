import React, { useState, useEffect } from "react";
import getUser from "../../lib/getUser";
import styles from "../../styles/Classroom.module.scss";
import { db } from "../../lib/mongo";
import {
  Wrapper,
  NavbarCommon,
  InputModal,
  CreateTab,
  Members,
} from "../../components";
import Head from "next/head";
import { Button } from "react-bootstrap";
import ErrorPage from "next/error";
import axios from "axios";
import Link from "next/link";

export async function getServerSideProps({ req, res, params }) {
  process.env.TZ = "Asia/Kolkata";

  const user = await getUser(req, res);
  const query = {
    cid: parseInt(params.cid),
  };
  if (user.usertype == "student") query.students = user.uid;
  const classdata = await db.getField("classroom", query);
  console.log(classdata);
  if (!user || !classdata) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
      props: {},
    };
  }
  if (user) {
    return {
      props: {
        user,
        classdata,
        cid: params.cid,
      },
    };
  }
}

export default function Classroom({ cid, user, classdata }) {
  const [todos, settodos] = useState([]);
  useEffect(() => {
    axios.get(`/api/class/quiz?cid=${cid}`).then((e) => {
      console.log(e.data);
      console.log("date rn = ", Date.now());
      settodos(e.data);
    });
  }, [user]);
  if (!classdata) {
    return <ErrorPage statusCode={404} />;
  }

  // const material = [{ subject: "Maths", topic: "Trigonometry", link: "" }];
  const material = [
    {
      subject: "Maths",
      topic: "Trigonometry",
      link: "https://www.khanacademy.org/math/trigonometry",
      priority: 1,
    },
    {
      subject: "Physics",
      topic: "Kinematics",
      link: "https://www.albert.io/blog/what-is-kinematics/",
      priority: 4,
    },
    {
      subject: "Chemistry",
      topic: "Organic Chemistry",
      link: "https://www.masterorganicchemistry.com/",
      priority: 2,
    },
    {
      subject: "Physics",
      topic: "Calorimetry",
      link: "https://byjus.com/physics/principle-of-calorimetry/",
      priority: 3,
    },
    {
      subject: "Maths",
      topic: "Conics",
      link: "https://www.khanacademy.org/math/algebra-home/alg-conic-sections",
      priority: 2,
    },
  ];
  return (
    <>
      <Head>
        <title>{classdata.title}</title>
      </Head>
      <NavbarCommon
        current="dash"
        user={user}
        cid={classdata.cid}
        classtitle={classdata.title}
      />
      <Wrapper>
        <div className={styles.main}>
          <div className="flex gap-2 justify-content-between">
            <div className="px-4 py-2 flex-direction-column ">
              <h4>Todos</h4>
              <div className="flex flex-wrap gap-y-5 gap-x-6 pl-3 pt-2 ">
                {todos.map((e, i) => (
                  <div
                    key={i}
                    className=" w-[250px] rounded-lg shadow-md shadow-black-100"
                  >
                    <div className="w-full bg-[#eee] p-2 font-bold text-md rounded-t-lg text-center">
                      {e.title} (Quiz)
                    </div>
                    <div className="w-full h-[80px] text-md bg-[#fff] p-2 rounded-b-lg text-center">
                      {e.formattedDate}
                    </div>
                    <div className="p-2 rounded-b-lg bg-[#eee] ">
                      {e.startTime < Date.now() ? (
                        <Link href={`quiz/attempt/${e.cid}/${e.qid}`}>
                          {e.submitted?.find((e) => e == user.uid) ||
                          user.usertype == "teacher" ? (
                            <Button
                              variant="success"
                              size="sm"
                              className="d-block mx-auto"
                            >
                              View Grades
                            </Button>
                          ) : (
                            <Button
                              variant="primary"
                              size="sm"
                              className="d-block mx-auto"
                            >
                              Start Attempt
                            </Button>
                          )}
                        </Link>
                      ) : (
                        <div className="text-center text-md ">
                          Attempt Not Started
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <hr className="display-block"></hr>
              <h4>Materials</h4>
              <div className="flex flex-wrap gap-y-5 gap-x-6 pl-3 pt-2 ">
                {material.map((e, i) => (
                  <div
                    key={i}
                    className="w-[250px] rounded-lg shadow-md shadow-black-100"
                  >
                    <div className="w-full bg-[#eee] p-2 font-bold text-md rounded-t-lg text-center">
                      {e.subject} (Resource)
                    </div>

                    <div className="w-full h-[80px] text-md bg-[#fff] p-2 rounded-b-lg text-center">
                      {e.topic}
                    </div>
                    <div className="p-2 rounded-b-lg bg-[#eee] ">
                      <Link href={e.link}>
                        <Button
                          variant="primary"
                          size="sm"
                          className="d-block mx-auto"
                        >
                          Open
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-4 ">
              <div className="flex gap-4">
                {user.usertype == "teacher" ? (
                  <div className="p-3 mt-2 mx-auto border-1 rounded-lg shadow-md">
                    <h4 className="text-lg">Joining Code</h4>
                    <hr />
                    <div className="text-center p-1 text-md">
                      {classdata.code}
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
              <div className="w-[220px]">
                {user.usertype == "teacher" ? (
                  <CreateTab classdata={classdata} />
                ) : (
                  ""
                )}

                <Members classdata={classdata} user={user} />
              </div>
            </div>
          </div>
        </div>
      </Wrapper>
    </>
  );
}
