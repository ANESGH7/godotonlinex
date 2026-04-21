const WebSocket = require('ws');

// استخدام المنفذ الذي يوفره Render أو المنفذ 10000 محلياً
const port = process.env.PORT || 10000;
const wss = new WebSocket.Server({ port });

wss.on('connection', (ws) => {
    console.log('لاعب جديد اتصل');

    ws.on('message', (data) => {
        const message = data.toString();

        // الحالة الوحيدة التي يقرأ فيها الخادم: تسجيل الغرفة
        if (message.startsWith('JOIN:')) {
            const parts = message.split(':');
            ws.roomId = parts[1];
            console.log(`لاعب انضم للغرفة: ${ws.roomId}`);
            return;
        }

        // التوجيه الأعمى: إرسال أي سطر (STAT, START, إلخ) لبقية اللاعبين في نفس الغرفة
        if (ws.roomId) {
            wss.clients.forEach((client) => {
                if (client !== ws && client.roomId === ws.roomId && client.readyState === WebSocket.OPEN) {
                    client.send(message);
                }
            });
        }
    });

    ws.on('close', () => {
        console.log('لاعب قطع الاتصال');
    });
});

console.log(`Server is running on port ${port}`);
