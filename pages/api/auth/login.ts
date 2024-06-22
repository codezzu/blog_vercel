import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import bcrypt from 'bcryptjs';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { nickname, password } = req.body;
  const user = await prisma.user.findUnique({
    where: { nickname },
  });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.status(200).json(user);
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
}
