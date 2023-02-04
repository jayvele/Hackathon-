import getUser from '../getUser';
export async function validateUser(req, type) {
  const user = await getUser(req);
  if (user.usertype != type) throw new Error('Unauthorised user');
  return req;
}
