import React, { useRef, useEffect, useState } from 'react';
import { Popover, OverlayTrigger, Button, Spinner } from 'react-bootstrap';
import Link from 'next/link';
import styles from '../../styles/Navbar.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faBell, faBars } from '@fortawesome/free-solid-svg-icons';
import { deleteCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useDetectClickOutside } from 'react-detect-click-outside';

export default function NavbarCommon({
  current,
  signout,
  user,
  classtitle,
  cid,
}) {
  const hamburger = useRef('');
  const router = useRouter();
  const [sidebarOpen, setsidebar] = useState(false);
  const [loggingout, setloggingout] = useState(true);
  const ref = useDetectClickOutside({
    onTriggered: () => {
      if (sidebarOpen == false) return;
      console.log(sidebarOpen);
      setsidebar(false);
    },
  });

  const signoutHandler = () => {
    setloggingout(true);
    deleteCookie('token');
    router.push('/login');
  };

  const popover = (
    <Popover id="popover-basic">
      {/* <Popover.Header as="h3">Hello There</Popover.Header> */}
      <div>
        <Button variant="danger m-2" onClick={signoutHandler}>
          Logout
        </Button>
      </div>
    </Popover>
  );

  const pages = [
    { name: 'Dashboard', e: 'dash', link: '/dashboard' },
    { name: 'Blogs', e: 'blogs', link: '/blogs' },
    { name: 'Communities', e: 'comms', link: '/communities' },
    { name: 'Appointments', e: 'apps', link: '/appointments' },
    { name: 'Reflect', e: 'reflect', link: '/reflect' },
  ];

  const [classes, setclasses] = useState([]);
  async function getClasses() {
    axios.get('/api/class/get').then((e) => setclasses(e.data));
  }
  useEffect(() => {
    getClasses();
  }, []);

  return (
    <>
      <div className={styles.navbar} ref={ref}>
        <div className="d-flex justify-content-between align-items-center">
          <div className={styles.hamburger}>
            <FontAwesomeIcon
              icon={faBars}
              onClick={() => {
                hamburger.current.style.display =
                  hamburger.current.style.display == 'none' ? 'flex' : 'none';
              }}
            />
          </div>
          <div className="flex justify-content-around align-items-center gap-2">
            <div
              className="rounded-full cursor-pointer p-3 hover:bg-neutral-100"
              onClick={() => setsidebar(true)}
            >
              <div className="flex gap-1 flex-column bg-transparent">
                <div className="bg-[#282c35] w-6 h-1"></div>
                <div className="bg-[#282c35] w-6 h-1"></div>
                <div className="bg-[#282c35] w-6 h-1"></div>
              </div>
            </div>
            <Link href={'/dashboard'}>
              <div className={styles.brand}>MyClassroom</div>
            </Link>
          </div>

          {classtitle ? (
            <div className="mr-[100px] text-md align-self-center mt-1 ">
              {classtitle}
            </div>
          ) : (
            ''
          )}

          <div className="flex justify-content-between gap-4 sm:gap-2 align-items-center">
            <OverlayTrigger
              trigger="focus"
              placement="bottom"
              overlay={popover}
            >
              <button>
                <img
                  // src={`https://api.dicebear.com/5.x/human/${user.name}.png?mood[]=happy`}
                  src={'https://api.dicebear.com/5.x/personas/svg'}
                  width="45px"
                  height="45px"
                  className="rounded-full border-2"
                ></img>
              </button>
            </OverlayTrigger>
          </div>
        </div>
        <div className={styles.smallnav} ref={hamburger}>
          {pages.map((ele, i) => {
            return (
              <div
                key={i}
                className={current == ele.e ? 'font-bold' : 'hover:font-bold'}
              >
                <Link href={ele.link}>{ele.name}</Link>
              </div>
            );
          })}
        </div>
        <div
          className={sidebarOpen ? styles.sidebarOpen : styles.sidebarClosed}
        >
          <div className="fixed shadow shadow-black-50 truncate z-40 bg-white top-0 left-0 bottom-0">
            <div>
              <h4 className=" mb-3 text-center">
                {user.usertype == 'student' ? 'Enrolled' : 'Your'} Classes
              </h4>
              <hr className="w-3/5 mx-auto" />
            </div>
            <div className="">
              {classes.map((e, i) => (
                <Link key={i} href={`/class/${e.cid}`}>
                  <div
                    className={`pl-7 py-2
                    border-b-1 rounded-tr-lg rounded-br-lg 
                    cursor-pointer text-md transition-colors
                    ${cid == e.cid ? 'bg-[#4cb7f7] text-white' : ''} 
                    hover:bg-[#4cb7f7] hover:text-white w-4/5`}
                  >
                    {e.title}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
