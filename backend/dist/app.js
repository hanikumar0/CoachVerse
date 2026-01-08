import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
dotenv.config();
const app = express();
// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Routes
app.use('/api/auth', authRoutes);
// Health Check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'CoachVerse API is running' });
});
export default app;
//# sourceMappingURL=app.js.map