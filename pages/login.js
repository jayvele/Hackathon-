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
        destination: "/dashboard",
      },
      props: {},
    };
  }
  return {
    props: {},
  };
}

export default function Login({ loggingout }) {
  const [signLoginState, setState] = useState(0);
  const [logging, setlogging] = useState(0);
  const [usertype, setusertype] = useState(null);
  const [sitesBlocked, setSitesBlocked] = useState([]);
  var siteList = [];
  
  const name = useRef("");
  const alert = useRef("");
  const password = useRef("");
  const email = useRef("");
  // const sites_to_block = useRef([])
  const router = useRouter();
  useEffect(() => {
    alert.current.style.display = "none";
  }, []);

  const refs = { name, password, email };

  const signinHandler = async (obj) => {
    try {
      const res = await axios.post("/api/auth/signin", obj);
      router.push("/dashboard");

      toast.success("Logged In");
    } catch (error) {
      // alert.current.innerText = error.response.data.message;
      // alert.current.style.display = "block";
      console.log(error);
      toast.error(error.response.data.message);
    }
    setlogging(0);
  };

  const signupHandler = async (obj) => {
    try {
      await axios.post("/api/auth/signup", obj);
      router.push("/dashboard");
      toast.success("Logged In");
    } catch (error) {
      // alert.current.innerText = error.response.data.message;
      // alert.current.style.display = "block";
      toast.error(error.response.data.message);
      console.log(error);
    }
    setlogging(0);
  };
  const handleClick = async (e) => {
    e.preventDefault();
    setlogging(1);
    let obj = {};
    Object.keys(refs).forEach((e) => {
      obj[e] = refs[e].current?.value;
    });
    if (!usertype && signLoginState == 1) {
      toast.error("Please specify a user type!");
      setlogging(0);
      return;
    } else {
      obj.usertype = usertype?.toLowerCase();
    }
    if (signLoginState) await signupHandler(obj);
    else await signinHandler(obj);
  };

  return (
    <>
      <div className={styles.parent}>
        <div className={styles.logoside}>
          <div className={styles.imagecontainer}>
            <Image
              src={logo}
              // width="800px"
              // priority={true}
              height="800px"
              object-fit="cover"
              responsive="true"
            />
          </div>
        </div>
        <div className={styles.loginside}>
          <form action="" onSubmit={handleClick}>
            {signLoginState ? (
              <div className={styles.inputContainer}>
                <FontAwesomeIcon icon={faPerson} className="icons" />
                <input
                  type="text"
                  placeholder="Name"
                  ref={name}
                  required
                  className={styles.input}
                ></input>
              </div>
            ) : (
              ""
            )}
            <div className={styles.inputContainer}>
              <FontAwesomeIcon icon={faUser} className="icons" />
              <input
                type="email"
                required
                ref={email}
                placeholder="Email"
                className={styles.input}
              />
            </div>
            <div className={styles.inputContainer}>
              <FontAwesomeIcon icon={faLock} className="icons" />
              <input
                type="password"
                required
                placeholder="Password"
                className={styles.input}
                ref={password}
              ></input>
            </div>

            {signLoginState ? (
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
            ) : (
              ""
            )}

            <button type="submit">
              {logging ? (
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              ) : signLoginState ? (
                "Sign Up!"
              ) : (
                "Log In"
              )}
            </button>
            <div
              className={styles.signup}
              onClick={() => {
                setState(!signLoginState);
              }}
            >
              {signLoginState ? "Log In" : "Sign Up?"}
            </div>
            <Alert ref={alert} variant={"danger"} className="my-4"></Alert>
          </form>
        </div>
      </div>
    </>
  );
}
