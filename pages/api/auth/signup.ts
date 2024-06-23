import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import bcrypt from 'bcryptjs';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { nickname, password } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { nickname }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'This nickname is already taken.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await prisma.user.create({
      data: {
        nickname,
        password: hashedPassword,
      },
    });
    res.status(201).json(result);
  } catch (error) {
    console.error('Error during signup:', error); // Hata loglama
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
