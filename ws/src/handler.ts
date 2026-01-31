import { WebSocket } from 'ws';
import prisma from './prisma';
import { connectionManager } from './services/ConnectionManager';
import { assignmentService } from './services/AssignmentService';

interface MessagePayload {
    content: string;
    roomId?: string; // Optional if sender knows it
}

export async function handleMessage(userId: string, userRole: string, message: string) {
    try {
        let parsedMessage: MessagePayload;
        try {
            parsedMessage = JSON.parse(message);
        } catch (e) {
            console.error('Invalid JSON message');
            return;
        }

        const { content } = parsedMessage;

        if (!content) return;

        // 1. Determine Room ID
        let roomId: string | null = null;
        let assignment = null;

        if (userRole === 'HOMEOWNER') {
            const assign = await assignmentService.findOrCreateAssignment(userId);
            if (assign) {
                roomId = assign.roomId;
                assignment = assign;
            }
        } else { // COMPANY or others
            // Company users should send roomId in payload or we infer.
            // For now, let's require roomId or receiverId (if we want to look it up)
            // But simplest is payload has roomId.
            if (parsedMessage.roomId) {
                roomId = parsedMessage.roomId;
            } else {
                // Fallback: If company has only one active assignment, use it?
                // Or if messaging a specific homeowner?
                // For now, let's assume client sends roomId for Company.
                console.warn('Company message missing roomId');
            }
        }

        if (!roomId) {
            console.warn(`No room found for message from ${userId}`);
            connectionManager.broadcastToUser(userId, { type: 'ERROR', message: 'No active chat room context' });
            return;
        }

        // 2. Persist Message
        const savedMessage = await prisma.message.create({
            data: {
                roomId,
                senderId: userId,
                senderRole: userRole,
                content,
                read: false,
            },
            include: {
                sender: { select: { id: true, name: true, email: true } }
            }
        });

        // 3. Broadcast to Room
        if (!assignment) {
            assignment = await assignmentService.getAssignmentByRoomId(roomId);
        }

        if (assignment) {
            const recipients = [assignment.homeownerId, assignment.companyId];

            const outgoingPayload = {
                type: 'NEW_MESSAGE',
                payload: savedMessage,
                roomId: roomId
            };

            recipients.forEach(rid => {
                connectionManager.broadcastToUser(rid, outgoingPayload);
            });
        }

    } catch (error) {
        console.error('Error handling message:', error);
    }
}

export function handleDisconnect(userId: string, ws: WebSocket) {
    connectionManager.removeConnection(userId, ws);
    console.log(`User ${userId} disconnected`);
}
