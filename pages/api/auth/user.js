import jwt from "jsonwebtoken";
import { setCookie } from "cookies-next";
import { db } from "../../../lib/mongo";
import bcrypt from "bcrypt";
import getUser from "../../../lib/getUser";
export default async function handler(req, res) {
  if (!req.cookies.token) res.status(401).json({ err: "No cookies found" });
  let user = await getUser(req, res);
  if (!user) res.status(404).json({ err: "No user found" });
  delete user._id;
  delete user.hashedpassword;
  res.json(user);
}
