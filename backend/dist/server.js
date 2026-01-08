import app from './app.js';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import { networkInterfaces } from 'os';
dotenv.config();
const PORT = Number(process.env.PORT) || 5000;
// Get local IP address for mobile development
const getLocalIP = () => {
    const nets = networkInterfaces();
    const results = [];
    for (const name of Object.keys(nets)) {
        for (const net of nets[name] || []) {
            // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
            if (net.family === 'IPv4' && !net.internal) {
                // Prioritize WiFi and Ethernet adapters over virtual adapters
                if (name.includes('Wi-Fi') || name.includes('Wireless') || name.includes('Ethernet')) {
                    return net.address;
                }
                results.push(net.address);
            }
        }
    }
    return results[0] || 'localhost';
};
// Connect to Database
connectDB().then(() => {
    // Listen on all network interfaces (0.0.0.0) to allow mobile devices to connect
    app.listen(PORT, '0.0.0.0', () => {
        const localIP = getLocalIP();
        console.log(`\n🚀 Server running in ${process.env.NODE_ENV} mode`);
        console.log(`📍 Local: http://localhost:${PORT}`);
        console.log(`📱 Network: http://${localIP}:${PORT}`);
        console.log(`\n💡 For mobile app, use: http://${localIP}:${PORT}/api\n`);
    });
});
//# sourceMappingURL=server.js.map