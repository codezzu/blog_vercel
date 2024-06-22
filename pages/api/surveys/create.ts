import prisma from '../../../lib/prisma';

export default async function handle(req, res) {
  const { title, questions, creatorId } = req.body;

  const result = await prisma.survey.create({
    data: {
      title: title,
      questions: questions,
      creator: { connect: { id: creatorId } },
    },
  });
  res.status(201).json(result);
}

