import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const survey = await prisma.survey.findUnique({
    where: { id: Number(id) },
    include: {
      votes: true,
      creator: {
        select: { nickname: true },
      },
    },
  });

  if (!survey) {
    return res.status(404).json({ error: 'Survey not found' });
  }

  const results = survey.questions.map((_, index) => {
    const votesForQuestion = survey.votes.filter(vote => vote.choice === index);
    return votesForQuestion.length;
  });

  res.json({ ...survey, results });
}
