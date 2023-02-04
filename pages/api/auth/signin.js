import jwt from 'jsonwebtoken';
import { setCookie } from 'cookies-next';
import { db } from '../../../lib/mongo';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    let { email, password } = req.body;
    const user = await db.getField('users', { email });
    if (!user) return res.status(422).json({ message: 'Wrong email!' });
    const hash = user.hashedpassword;

    bcrypt.compare(password, hash).then(async function (result) {
      if (!result)
        return res.status(422).json({ message: 'Wrong email or password!' });

      let { uid, name } = user;

      const token = jwt.sign({ uid, name, email }, process.env.TOKEN_SECRET, {
        expiresIn: '10d',
      });

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
