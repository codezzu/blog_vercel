import { NextApiRequest, NextApiResponse } from 'next';
import { deleteCookie } from 'cookies-next';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  deleteCookie('userId', { req, res });
  res.status(200).json({ message: 'Logged out' });
}
