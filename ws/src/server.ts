import { WebSocketServer, WebSocket } from 'ws';
import { IncomingMessage } from 'http';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { handleMessage, handleDisconnect } from './handler';
import { connectionManager } from './services/ConnectionManager';
import { assignmentService } from './services/AssignmentService';
import prisma from './prisma';

dotenv.config();

const port = process.env.WS_PORT ? parseInt(process.env.WS_PORT) : 8080;
const wss = new WebSocketServer({ port });

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) console.warn('Warning: JWT_SECRET missing');

console.log(`WebSocket server started on port ${port} (Production Mode)`);

wss.on('connection', async (ws: WebSocket, req: IncomingMessage) => {
    const url = new URL(req.url || '', `http://${req.headers.host || 'localhost'}`);
    const token = url.searchParams.get('token');

    let isAlive = true;
    ws.on('pong', () => {
        isAlive = true;
    });

    if (!token) {
        ws.close(1008, 'Token required');
        return;
    }

    try {
        if (!JWT_SECRET) {
            // Use default if missing, essentially insecure mode but prevents crash
            console.error('JWT_SECRET is missing, refusing connection');
            ws.close(1011);
            return;
        }

        const decoded = jwt.verify(token, JWT_SECRET) as { id: string, email: string, role?: string };
        const userId = decoded.id;
        const role = decoded.role || 'HOMEOWNER'; // Default fallback

        console.log(`User connected: ${userId} (${role})`);

        // 1. Add to Connection Manager
        connectionManager.addConnection(userId, ws);

        // 2. Handle Assignments & History
        if (role === 'HOMEOWNER') {
            // Auto-assign or retrieve assignment
            const assignment = await assignmentService.findOrCreateAssignment(userId);

            if (assignment) {
                // Send History
                const history = await prisma.message.findMany({
                    where: { roomId: assignment.roomId },
                    orderBy: { createdAt: 'asc' },
                    include: { sender: { select: { id: true, name: true } } }
                });

                if (ws.readyState === WebSocket.OPEN) {
                    ws.send(JSON.stringify({ type: 'HISTORY', payload: history, roomId: assignment.roomId }));
                    ws.send(JSON.stringify({ type: 'ASSIGNED', payload: { companyId: assignment.companyId, roomId: assignment.roomId } }));
                }
            } else {
                if (ws.readyState === WebSocket.OPEN) {
                    ws.send(JSON.stringify({ type: 'INFO', message: 'Waiting for available company agent...' }));
                }
            }
        } else if (role === 'COMPANY') {
            // Fetch all active assignments for this company
            const assignments = await assignmentService.getAssignmentsForCompany(userId);
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({ type: 'ASSIGNMENTS', payload: assignments }));
            }
        }

        ws.on('message', (message: string) => {
            handleMessage(userId, role, message.toString());
        });

        ws.on('close', () => {
            clearInterval(heartbeatInterval);
            handleDisconnect(userId, ws);
        });

        ws.on('error', (error: Error) => {
            console.error(`WebSocket error for user ${userId}:`, error);
        });

        // 3. Keep-alive heartbeat (every 20s)
        const heartbeatInterval = setInterval(() => {
            if (isAlive === false) {
                console.log(`Terminating stale connection for user: ${userId}`);
                return ws.terminate();
            }
            isAlive = false;
            ws.ping();
        }, 20000);

    } catch (error) {
        console.log('Connection rejected:', error);
        ws.close(1008, 'Invalid token');
    }
});
