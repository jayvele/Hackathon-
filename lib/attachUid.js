import { getCookie } from 'cookies-next';
import jwt from 'jsonwebtoken';
import getUser from './getUser';

export default async function attachUid(req, res) {
  const token = getCookie('token', { req, res });
  const data = jwt.verify(token, process.env.TOKEN_SECRET);
  if (!data.uid) throw new Error('No uid');
  req.uid = data.uid;
  const user = await getUser(req, res);
  req.usertype = user.usertype;
  return req;
}
