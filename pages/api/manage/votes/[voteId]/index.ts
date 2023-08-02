import prisma from '@/lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next';

export default async function manageVote(req: NextApiRequest, res: NextApiResponse) {

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
                const { title, questions } = req.body;

                const updatedVote = await prisma.vote.update({
                    data: {
                        title: title,
                        questions: {
                            update: questions.map((question: { id: number, name: string, options: Array<{ id: number, name: string }> }) => ({
                                where: { id: question.id },
                                data: {
                                    name: question.name,
                                    options: {
                                        upsert: question.options.map((option) => ({
                                            where: { id: option.id },
                                            update: { name: option.name },
                                            create: {
                                                name: option.name,
                                                vote_count: 0,

                                            },

                                        })),
                                    },
                                },
                            })),
                        },
                    },
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

                if (updatedVote) {
                    console.log("updatedVote " + updatedVote)
                    return res.status(200).json({ message: 'Vote updated.', vote: updatedVote });
                }

            } catch (err) {
                return res.status(500).send('Something went wrong');
            } finally {
                await prisma.$disconnect();
                break;
            }

        case 'DELETE':
            try {

                const voteId = Number(req.query.voteId);

                const questionsId = await prisma.vote_Question.findMany({
                    where: {
                        vote_id: voteId,
                    },
                    select: {
                        id: true,
                    },
                });

                const questionIdArray = questionsId.map((question) => question.id);

                const option = await prisma.vote_Option.deleteMany({
                    where: {
                        question_id: {
                            in: questionIdArray,
                        },
                    },
                });

                const question = await prisma.vote_Question.deleteMany({
                    where: {
                        vote_id: Number(voteId),
                    }
                });

                const voteInfo = await prisma.vote_Info.findFirst({
                    where: {
                        user_id: Number(req.body),
                        vote_id: voteId,
                    },
                });

                if (voteInfo) {
                    await prisma.vote_Info.delete({
                        where: {
                            id: voteInfo.id,
                        },
                    });
                }
                const vote = await prisma.vote.delete({
                    where: {
                        id: Number(voteId),
                    },
                });
                if (vote) {
                    console.log('its ok')
                    return res.status(200).send('Vote deleted.');
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
        default:
            break;

    };

};
