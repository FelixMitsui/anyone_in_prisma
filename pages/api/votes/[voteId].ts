
import prisma from '../../../lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next';

export default async function vote(req: NextApiRequest, res: NextApiResponse) {

    switch (req.method) {

        case 'GET':
            try {
                const voteId = req.query.voteId;
                const vote = await prisma.vote.findFirst({
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

                if (vote) {
                    return res.status(200).json({message:'',vote:vote});
                } else {
                    return res.status(404).json({message:'Not found.'});
                }
            }
            catch (err) {
                return res.status(500).json({message:err});
            } finally {
                await prisma.$disconnect();
            }

        case 'PATCH':
            try {
                const voteId = req.query.voteId;
                const { userId, questions } = req.body;
    
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
                    return res.status(200).json({ message: 'Voted completed.', voteId: voteInfo.vote_id });
                } else {
                    return res.status(404).json({ message: 'Voted failed.' });
                }
            } catch (err) {
                return res.status(500).json({ message:err });
            } finally {
                await prisma.$disconnect();
            }

        default:
            return res.status(404).json({ message: 'not found.'});
    }
}
