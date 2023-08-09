import prisma from '../../../lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === 'POST') {
        
        try {
            const user = await prisma.user.create({
                data: {
                    auth: 0,
                    emails: {
                        create: {
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
                return res.status(200).json({ message: 'Create successfully.', user: user });
            } 
        } catch (err) {
            return res.status(500).json({ message: err });
        }finally {
            await prisma.$disconnect();
        }
    }
}
