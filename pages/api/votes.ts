import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';
import { getCookie } from 'cookies-next';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { choice, surveyId } = req.body;
  const userId = getCookie('userId', { req, res });

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Kullanıcının bu ankette daha önce oy verip vermediğini kontrol et
    const existingVote = await prisma.vote.findFirst({
      where: {
        surveyId: Number(surveyId),
        userId: Number(userId),
      },
    });

    if (existingVote) {
      return res.status(400).json({ error: 'You have already voted on this survey.' });
    }

    // Eğer daha önce oy vermemişse, yeni bir oy oluştur
    const result = await prisma.vote.create({
      data: {
        choice,
        survey: { connect: { id: Number(surveyId) } },
        user: { connect: { id: Number(userId) } },
      },
    });

    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
