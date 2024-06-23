import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import bcrypt from 'bcryptjs';
import { setCookie } from 'cookies-next';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { nickname, password } = req.body;

  const user = await prisma.user.findUnique({ where: { nickname } });
  if (user && bcrypt.compareSync(password, user.password)) {
    setCookie('userId', user.id, { req, res, httpOnly: true, sameSite: 'strict' });
    setCookie('userRole', user.role, { req, res, httpOnly: true, sameSite: 'strict' });
    res.status(200).json({ id: user.id, nickname: user.nickname, role: user.role });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
}
