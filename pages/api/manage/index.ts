
import prisma from '../../../lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next';

export default async function manage(req: NextApiRequest, res: NextApiResponse) {

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

            try {
                const { title, questions } = req.body;

                const vote = await prisma.vote.create({
                    data: {
                        title,
                        closing_date: new Date(),
                        vote_total: 0,
                        questions: {
                            create: questions.map((question: { name: string, options: Array<{ name: string }> }) => ({
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
                    return res.status(200).json({ message: 'Created successfully.', vote: vote });
                }
            } catch (err) {
                return res.status(500).json({ message: err });
            } finally {
                await prisma.$disconnect();
            }
            break;

        default:
            return res.status(400).json({ message: 'Invalid request method.'});
    }

}

async function getAllVotes(req: NextApiRequest, res: NextApiResponse) {
    try {
        const votes = await prisma.vote.findMany({
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

        if (votes) {
            return res.status(200).json({message:'',votes:votes});
        } else {
            return res.status(404).json({message:'Vote not found.'});
        }
    } catch (err) {
        return res.status(500).json({ message: err });
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
        if (votes) {
      return res.status(200).json({ message: '', votes:votes});
        } else {
            return res.status(404).json({ message: 'Not found.'});
}
      
    } catch (err) {
        return res.status(500).json({ message: err });
    }finally {
        await prisma.$disconnect();
    }
}


