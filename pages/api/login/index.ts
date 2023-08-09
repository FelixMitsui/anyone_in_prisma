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
            if (user) {
                return res.status(200).json(user);
            } else {
                return res.status(404).json({ message: 'Not found.'});
}
        } catch (err) {
            return res.status(500).json({ message: err });
        }finally {
            await prisma.$disconnect();
        }
    }
}
