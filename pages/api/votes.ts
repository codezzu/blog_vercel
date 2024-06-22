import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { choice, surveyId, userId } = req.body;
  const result = await prisma.vote.create({
    data: {
      choice: Number(choice),
      survey: { connect: { id: Number(surveyId) } },
      user: { connect: { id: Number(userId) } },
    },
  });
  res.status(201).json(result);
}
