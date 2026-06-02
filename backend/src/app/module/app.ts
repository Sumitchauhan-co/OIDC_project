import express from 'express';
import authRouter from './auth/auth.route.js';
import cookieParser from 'cookie-parser';
import path from 'node:path';
import cors from 'cors';
import oidcRouter from './OIDC/oidc.route.js';
import adminRouter from './admin/admin.route.js';
import type { Request, Response, NextFunction } from 'express';

const app = express();

const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve('public')));

app.use('/api/auth', authRouter);

app.use(oidcRouter);

app.use('/api/admin', adminRouter);

interface HttpError extends Error {
    statusCode?: number;
}

app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal Server Error',
    });
});

app.get('/health', (req, res) =>
    res.json({ message: 'Server is healthy', healthy: true }),
);

export default app;
