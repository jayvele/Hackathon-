import styles from "../styles/Login.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { faLock, faPerson } from "@fortawesome/free-solid-svg-icons";
import { useRef, useState } from "react";
import Form from "react-bootstrap/Form";
import axios from "axios";
import logo from "../assets/logo_myclassroom.png";
import getUser from "../lib/getUser";
import { Alert, Spinner } from "react-bootstrap";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { toast } from "react-toastify";

export async function getServerSideProps({ req, res }) {
    process.env.TZ = "Asia/Kolkata";

    const user = await getUser(req, res);
    if (user) {
      return {
        redirect: {
          permanent: false,
          destination: "/signupDetails",
        },
        props: {},
      };
    }
    return {
      props: {},
    };
  }

export default function signupDetails() {
  const [blocked, setBlocked] = useState(false);
  return (
    <div>
      <div className={styles.nextRadio}>Are you a?</div>
      <div className="flex justify-content-center mb-3 sm:gap-2 md:gap-3 text-white">
        <div className="flex align-items-center basis-1/2 justify-content-around p-1 border-white border-1 rounded-md">
          <div className="a">Teacher</div>
          <Form.Check
            className="align-self-end pt-1"
            inline
            onClick={() => setusertype("teacher")}
            name={`group1}`}
            type="radio"
            id={`inline-radio-${1}`}
          />
        </div>
        <div className="shadow-0 pt-2">Or</div>
        <div className="flex align-items-center basis-1/2 justify-content-around p-1 border-white border-1 rounded-md">
          <div className="a">Student</div>
          <Form.Check
            className="align-self-end pt-1"
            inline
            onClick={() => setusertype("student")}
            name={`group1}`}
            type="radio"
            id={`inline-radio-${2}`}
          />
        </div>
      </div>
    </div>
  );
}
