import React from 'react';
import styles from '../../styles/Dashboard.module.scss';
import Link from 'next/link';

export const ClassCard = ({ ele }) => {
  return (
    <Link href={`/class/${ele.cid}`}>
      <div className={styles.classcard} key={ele.cid}>
        <div className="h-2/5 bg-[#ffb60a] p-3 text-center text-md">
          {ele.title}
        </div>
        <div className="h-3/5 bg-[#4cb7f7] leading-5 text-md px-3">
          {ele.description}
        </div>
        <div className="">
          <img
            src={`https://ui-avatars.com/api/?rounded=true&name=${ele.title}&background=eaeaea`}
            alt=""
            width="45px"
            height="45px"
            className=" rounded-full"
          />
        </div>
      </div>
    </Link>
  );
};
