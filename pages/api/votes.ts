import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { choice, surveyId, userId } = req.body;
  try {
    const result = await prisma.vote.create({
      data: {
        choice,
        survey: { connect: { id: surveyId } },
        user: { connect: { id: userId } },
      },
    });
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: 'Vote creation failed' });
  }
}
