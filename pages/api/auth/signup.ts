import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import bcrypt from 'bcryptjs';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { nickname, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const result = await prisma.user.create({
      data: {
        nickname,
        password: hashedPassword,
      },
    });
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: 'User creation failed' });
  }
}
