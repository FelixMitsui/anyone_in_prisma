import prisma from '../../../lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const user = await prisma.user.create({
                data: {
                    emails: {
                        connectOrCreate: {
                            where: {
                                address: req.body.email,
                            },
                            create: {
                                address: req.body.email,
                            },
                        },
                    },
                },
            });
            console.log('New user created:', user);
            return res.status(200).json(user)
        } catch (error) {
            console.error('Error creating user:', error);
            return null;
        }
    }
}
