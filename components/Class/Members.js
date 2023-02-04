import axios from 'axios';
import React, { useState, useEffect } from 'react';

const Members = ({ user, classdata }) => {
  const [data, setdata] = useState({});
  useEffect(() => {
    if (!classdata) return;
    axios
      .post('/api/class/members', { cid: classdata.cid })
      .then((e) => setdata(e.data));
  }, [classdata]);
  return (
    <>
      <div className=" mt-3 border-1 rounded-lg shadow-md">
        <div className="text-center text-md font-bold px-2 py-1 border-b">
          Teacher
        </div>
        <div className="flex align-items-center justify-content-between p-2 px-3 border-b">
          <div className="text-center textxl">{data.teacher?.name}</div>
          <img
            src={`https://avatars.dicebear.com/api/avataaars/human/${data.teacher?.name}.png?mood[]=happy`}
            width="35px"
            height="35px"
            className="rounded-full border-2"
          ></img>
        </div>
      </div>
      <div className=" mt-3 border-1 rounded-lg shadow-md">
        <div className="text-center text-md px-2 py-1 font-bold border-b">
          Students
        </div>
        {data.students?.map((e, i) => (
          <div
            key={i}
            className="flex align-items-center justify-content-between p-2 px-3 border-b"
          >
            <div className="text-">{e.name}</div>
            <img
              src={`https://avatars.dicebear.com/api/avataaars/human/${e.name}.png?mood[]=happy`}
              width="35px"
              height="35px"
              className="rounded-full border-2"
            ></img>
          </div>
        ))}
      </div>
    </>
  );
};

export default Members;
