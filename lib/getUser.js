import { getCookie } from 'cookies-next';
import jwt from 'jsonwebtoken';
import { db } from './mongo';

export default async function getUser(req, res) {
  const token = getCookie('token', { req, res });
  try {
    const data = jwt.verify(token, process.env.TOKEN_SECRET);
    let user = await db.getField('users', { uid: data.uid });
    user = JSON.parse(JSON.stringify(user));
    return user;
  } catch (error) {
    console.log(error);
    return null;
  }
}
