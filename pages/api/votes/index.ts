// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prisma from '../../../lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  switch (req.method) {

    case 'GET':
      if (req.query.target) {
        getFilteredVotes(req, res);
      }
      else {
        getAllVotes(req, res);
      }
      break;

    case 'POST':

      createVote(req, res);
      break;

    default:
      return res.status(404).json({ message: 'not found.' });
  }

}

async function getAllVotes(req: NextApiRequest, res: NextApiResponse) {

  try {
    const data = await prisma.vote.findMany({
      include: {
        questions: {
          select: {
            id: true,
            name: true,
            options: {
              select: {
                id: true,
                name: true,
              },
            }
          },
        },
      }
    })

    if (data) {
      return res.status(200).json(data);
    } else {
      return res.status(404).send('Vote not found.');
    }
  } catch (err) {
    return res.status(500).json({ message: 'Something went wrong' })
  } finally {
    await prisma.$disconnect();
  }
}

async function getFilteredVotes(req: NextApiRequest, res: NextApiResponse) {
  const { limit, target, sorted } = req.query;

  try {

    const parsedLimit = parseInt(limit as string, 10);
    const parsedSorted = sorted as string;

    const votes = await prisma.vote.findMany({
      take: parsedLimit,
      orderBy: {
        [target as string]: parsedSorted === 'ASC' ? 'asc' : 'desc',
      },
    });

    return res.status(200).json(votes);
  } catch (err) {
    return res.status(500).send({message:err});
  } finally {
    await prisma.$disconnect();
  }
}

async function createVote(req: NextApiRequest, res: NextApiResponse) {

  try {
    const { title, questions } = req.body;

    const vote = await prisma.vote.create({
      data: {
        title,
        closing_date: new Date(),
        vote_total: 0,
        questions: {
          create: questions.map((question: { name: string, options: Array<string> }) => ({
            name: question.name,
            options: {
              create: question.options.map((option) => ({
                name: option,
                vote_count: 0,
              })),
            },
          })),
        },
      },
      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
    });
    if (vote) {
      return res.status(200).send({message:'Create successfully.'});
    }

  } catch (err) {
    return res.status(500).send({message:err});
  } finally {
    await prisma.$disconnect();
  }
}


