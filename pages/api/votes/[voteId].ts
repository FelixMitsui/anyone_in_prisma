// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prisma from '../../../lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next';

export default async function votes(req: NextApiRequest, res: NextApiResponse) {

    switch (req.method) {

        case 'GET':
            try {
                const voteId = req.query.voteId;
                const data = await prisma.vote.findFirst({
                    where: {
                        id: Number(voteId),
                    },
                    include: {
                        questions: {
                            include: {
                                options: true,
                            },
                        },
                    },
                });

                if (data) {
                    return res.status(200).json(data);
                } else {
                    return res.status(404).send('Vote not found.');
                }
            }
            catch (err) {
                return res.status(500).send('Something went wrong.');
            } finally {
                await prisma.$disconnect();
                break;
            }
        case 'PATCH':
            try {
                const voteId = req.query.voteId;
                const { userId, questions } = req.body;
                console.log(questions)
                const [updatedVote, updatedOptions] = await Promise.all([

                    prisma.vote.update({
                        where: {
                            id: Number(voteId),
                        },
                        data: {
                            vote_total: {
                                increment: 1
                            },
                        },
                    }),

                    prisma.vote_Option.updateMany({
                        where: {
                            id: {
                                in: questions.map((item: { option: string }) =>
                                    Number(item.option)
                                ),
                            },
                        },
                        data: {
                            vote_count: {
                                increment: 1
                            },
                        },
                    }),
                ]);

                const voteInfo = await prisma.vote_Info.create({
                    data: {
                        user_id: Number(userId),
                        vote_id: Number(voteId),
                    },
                });
                if (updatedVote && updatedOptions && voteInfo) {

                    return res.status(200).json({ message: 'Voted completed.', vote_id: voteInfo.vote_id });
                } else {
                    return res.status(404).json({ message: 'Voted failed.' });
                }
            } catch (err) {
                return res.status(500).send('Something went wrong');
            } finally {
                await prisma.$disconnect();
                break;
            }

        default:
            break;
    };
};
