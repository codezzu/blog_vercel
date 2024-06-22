import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { title, questions, creatorId } = req.body;

  if (!title || !questions || !creatorId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const result = await prisma.survey.create({
      data: {
        title,
        questions,
        creator: { connect: { id: creatorId } },
      },
    });
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: 'Survey creation failed' });
  }
}
