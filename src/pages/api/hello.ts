import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  success: boolean;
  data: any;
  msg: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    if (req.method === 'POST') {
      const endpoint = req.body.endpoint;
      delete req.body['endpoint'];
      const _resp = await fetch(
        `https://api.hyperliquid-testnet.xyz/${endpoint}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(req.body),
        }
      );
      const response = await _resp.json();
      console.log('response: ', response);
      if (response.status === 'ok') {
        res.status(200).json({
          success: true,
          msg: '',
          data: response,
        });
      } else {
        res.status(200).json({
          success: true,
          msg: '',
          data: '',
        });
      }
    } else {
      // Handle any other HTTP method
    }
  } catch (err) {
    console.log('err: ', err);
  }
}
