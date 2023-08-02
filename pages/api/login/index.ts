import prisma from '../../../lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {

        try {
            const user = await prisma.user.findFirst({
                where: {
                    emails: {
                        some: {
                            address: req.body.email,
                        },
                    },
                },
                include: {
                    emails: {
                        select: {
                            address: true,
                        },
                    },
                    vote_info: {
                        select: {
                            vote_id: true,
                        },
                    }
                },
            });

            return res.status(200).json(user)
        } catch (err) {
            console.error(err)
            return res.status(500).json({ msg: 'Something went wrong' })

        }

    };

}
