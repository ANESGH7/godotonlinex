const WebSocket = require('ws');
const port = process.env.PORT || 10000;
const wss = new WebSocket.Server({ port });

wss.on('connection', (ws) => {
    ws.on('message', (data) => {
        const msg = data.toString();
        // أول رسالة يجب أن تكون JOIN:ROOM_ID
        if (msg.startsWith('JOIN:')) {
            ws.roomId = msg.split(':')[1];
            return;
        }
        // توزيع أعمى لبقية الرسائل في نفس الغرفة
        wss.clients.forEach(client => {
            if (client !== ws && client.roomId === ws.roomId && client.readyState === WebSocket.OPEN) {
                client.send(msg);
            }
        });
    });
});
console.log("Server running on port " + port);
