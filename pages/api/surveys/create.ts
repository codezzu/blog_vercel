import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { getCookie } from 'cookies-next';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { title, questions } = req.body;
  const userId = getCookie('userId', { req, res });

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const result = await prisma.survey.create({
      data: {
        title,
        questions,
        creator: { connect: { id: Number(userId) } },
      },
    });
    res.status(201).json(result);
  } catch (error) {
    console.error('Error during survey creation:', error);
    res.status(400).json({ error: 'Survey creation failed' });
  }
}
