// import { NextApiRequest, NextApiResponse } from 'next';
// import { WebSocketServer } from 'ws';

// const wss = new WebSocketServer({ noServer: true });

// wss.on('connection', (socket) => {
//   socket.on('message', (data) => {
//     const message = JSON.parse(data.toString());
//     // Broadcast the message to all connected clients
//     wss.clients.forEach((client) => {
//       if (client.readyState === WebSocket.OPEN) {
//         client.send(JSON.stringify(message));
//       }
//     });
//   });
// });

// export default function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method === 'GET') {
//     res.status(200).json({ message: 'WebSocket server ready' });
//   }
// }

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// export function websocketServer(server: any) {
//   server.on('upgrade', (req: any, socket: any, head: any) => {
//     wss.handleUpgrade(req, socket, head, (ws) => {
//       wss.emit('connection', ws, req);
//     });
//   });
// }
