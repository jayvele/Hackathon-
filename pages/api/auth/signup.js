import jwt from 'jsonwebtoken';
import { setCookie } from 'cookies-next';
import { db } from '../../../lib/mongo';
import bcrypt, { hash } from 'bcrypt';
import { checkRequired } from '../../../lib/utils/check';
export default async function handler(req, res) {
  const userFields = ['email', 'password', 'name', 'usertype'];
  console.log(req.body);

  checkRequired(req, userFields);
  const { name, email, password, usertype } = req.body;
  const saltRounds = 10;
  if (req.method === 'POST') {
    const userExist = await db.getField('users', { email });
    console.log(userExist);

    if (userExist)
      return res.status(422).json({ message: 'Email already in use!' });

    let hashedpassword;
    let userObj = {};
    if (usertype == 'student') {
      const obj = new Student(name, email);
      userObj = await obj.getUserSchema();
    } else {
      const obj = new Teacher(name, email);
      userObj = await obj.getUserSchema();
    }

    bcrypt.hash(password, saltRounds).then(async function (hash) {
      const user = await db.postField('users', {
        ...userObj,
        hashedpassword: hash,
      });
      console.log(user);
      delete user._id;
      delete user.hashedpassword;

      const token = jwt.sign(
        { uid: userObj.uid, name, email },
        process.env.TOKEN_SECRET,
        {
          expiresIn: '10d',
        }
      );

      setCookie('token', token, {
        req,
        res,
        maxAge: 60 * 60 * 24 * 10,
        path: '/',
      });
      res.status(201).json(user);
    });
  } else {
    res.status(424).json({ message: 'Invalid method!' });
  }
}

class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }
}

class Student extends User {
  constructor(name, email) {
    super(name, email);
    this.usertype = 'student';
  }
  getUserSchema = async () => {
    this.uid = await db.incrId('uid');
    return {
      uid: this.uid,
      name: this.name,
      email: this.email,
      usertype: this.usertype,
    };
  };
}

class Teacher extends User {
  constructor(name, password, email) {
    super(name, password, email);
    this.usertype = 'teacher';
  }
  getUserSchema = async () => {
    this.uid = await db.incrId('uid');
    return {
      uid: this.uid,
      name: this.name,
      email: this.email,
      usertype: this.usertype,
    };
  };
}
