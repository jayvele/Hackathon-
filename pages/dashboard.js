import React, { useState, useContext, useEffect , useRef} from "react";
import getUser from "../lib/getUser";
import { Wrapper, NavbarCommon, InputModal, ClassCard } from "../components";
import Head from "next/head";
import styles from "../styles/Dashboard.module.scss";
import { IoIosAdd } from "react-icons/io";
import axios from "axios";
import { Spinner } from "react-bootstrap";
import { db } from "../lib/mongo";
import { userContext } from "../components/userContext";
import { NextPage } from 'next';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Webcam from 'react-webcam'
import {Component} from 'react'


export async function getServerSideProps({ req, res }) {
  process.env.TZ = "Asia/Kolkata";
  const user = await getUser(req, res);
  let students = [];


  if (user.usertype === "teacher") {
    students = await db.getFields("users", { usertype: "student" });
    students = students.map((e) => {
      delete e._id;
      return e;
    });
  }
  
  if (user.usertype === 'student'){
    
  }
  if (!user) {
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
        students,
      },
    };
  }
}

export default function Dashboard({ user, students }) {
  const [classes, setclasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setmodal] = useState(false);
  console.log(user);
  const [value, setValue] = React.useState("");
  const [prompt, setPrompt] = React.useState("");
  const [completion, setCompletion] = React.useState("");
  const notify = () => toast("Hope you're not sleepy!!");
  const [data, setData] = useState({
    "Id": "",
    "weakSub": "",
    "strongSub": "",
    "schedulePref": "",
    "materialPref": "",
    "pastAnalysis":""
  })

  
    
  const WebcamComponent = () => <Webcam />
  const videoConstraints = {
    width: 400,
    height: 400,
    facingMode: 'user',
  }


useEffect(() => {
  // Using fetch to fetch the api from 
  // flask server it will be redirected to proxy
  


  fetch("/data").then((res) =>
      res.json().then((data) => {
          // Setting a data from api
          setData({
            Id: data.Id,
            weakSub: data.weakSub,
            strongSub: data.strongSub ,
            schedulePref: data.schedulePref,
            materialPref: data.materialPref,
            pastAnalysis: data.pastAnalysis 
          });
      })
      .then(console.log(data.Id, data.weakSub, data.strongSub, data.schedulePref, data.materialPref, data.pastAnalysis))
  );
  },[]);

  
  const handleInput = React.useCallback((e) => {
    setValue(e.target.value);
  }, []);

  const handleKeyDown = React.useCallback(
    async (e) => {
      if (e.key === "Enter") {
        setPrompt(value);
        setCompletion("Loading...");
        const response = await fetch("/api/gpt", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: value }),
        });
        const data = await response.json();
        setValue("");
        setCompletion(data.result.choices[0].text);
      }
    },
    [value]
  );
  const fields =
    user.usertype == "teacher"
      ? [
          {
            name: "cname",
            label: "Enter class name",
            placeholder: "Class name",
          },
          {
            name: "desc",
            label: "Enter class description",
            placeholder: "Optional",
            textarea: true,
          },
        ]
      : [{ name: "jcode", label: "Enter joining code" }];

  async function getClasses() {
    axios.get("/api/class/get").then((e) => {
      setclasses(e.data);
      setLoading(false);
    });
  }

  useEffect(() => {
    getClasses();
    // uploader();
  }, []);

  const handleSubmit = (data) => {
    const obj = {};
    obj.title = data.cname;
    obj.description = data.desc;
    obj.jcode = data.jcode || "";

    if (user.usertype == "teacher") {
      obj.students = data.selectedStudents.map((e) => e.uid) || [];
      if (!data.cname) {
        toast.error("Title is required");
        return;
      }
      axios
        .post("/api/class/create", { ...obj })
        .then((res) => {
          if (res.data.cid) toast.success("Class created successfully!");
          getClasses();
        })
        .catch((e) =>
          toast.error(e.response?.data?.err || "unknown error occured")
        );
    } else {
      if (!data.jcode) {
        toast.error("Please enter the code!");
        return;
      }
      axios
        .post("/api/class/join", { ...obj })
        .then((res) => {
          if (res.data.cid) toast.success(`Joined ${res.data?.title}!`);
          getClasses();
        })
        .catch((e) =>
          toast.error(e.response?.data?.err || "unknown error occured")
        );
    }
  };



    const uploader = () => {
      const data = 'capturenow';

      fetch('http://localhost:5000/checkawr', {
        method: 'GET'
        // body: data,
      }).then((response) => {
        response.json().then((body) => {
          console.log("Done")
        });
      });
    }

  return (
    <>
      <Head>
        <title>Personal Prof Dashboard</title>
      </Head>
      <NavbarCommon current="dash" user={user} />
      <Wrapper>
        <div className="flex justify-content-space-between" >
        <div className={styles.main}>
          <div className="px-4">
            <div className="pt-2 pb-3">
              <div>Ask your doubt!!</div>
              <input
                value={value}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
              />
              <div>Question: {prompt}</div>
              <div>
                Answer:{" "}
                {completion.split("\n").map((item) => (
                  <>
                    {item}
                    <br />
                  </>
                ))}
              </div>
              </div>
             
              </div>
        </div>
        <div>
          <div>
            <div>
              <h4 className="mb-3">Classrooms</h4>
              {loading ? (
                <div className="p-5 mx-auto">
                  <Spinner
                    animation="border"
                    role="status"
                    variant="primary"
                    className="p-2 mx-auto"
                  />
                </div>
              ) : (
                <div className="flex flex-wrap gap-4 ml-4 w-4/5">
                  {classes.map((e, i) => (
                    <ClassCard key={i} ele={e} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        </div>
        <InputModal
          state={modal}
          user={user}
          fields={fields}
          students={students}
          type="dashboard"
          handleSubmit={handleSubmit}
          closeModal={() => setmodal(false)}
          title={
            user.usertype == "teacher"
              ? "Create a Classroom"
              : "Join a Classroom"
          }
        />
        <div
          onClick={() => setmodal(true)}
          className="cursor-pointer shadow-md shadow-gray-400 position-fixed top-[630px] right-20 p-2 bg-[#ffb60a] rounded-full w-12 h-12"
        >
          <IoIosAdd className="text-2xl translate-x-1 translate-y-1" />
        </div>
      </Wrapper>
    </>
  );
}
