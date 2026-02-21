import { useEffect, useState, useRef, useCallback } from 'react';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080';

interface Message {
    id: string;
    roomId: string;
    senderId: string;
    senderRole: string; // 'HOMEOWNER' | 'COMPANY'
    content: string;
    createdAt: string;
    sender?: { name: string | null };
}

interface Assignment {
    id: string;
    homeownerId: string;
    companyId: string;
    roomId: string;
}

export function useWebSocket(token: string | null) {
    const socketRef = useRef<WebSocket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
    const [assignedCompanyId, setAssignedCompanyId] = useState<string | null>(null);

    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const connect = useCallback(() => {
        if (!token) return;

        // Cleanup existing socket if any
        if (socketRef.current) {
            if (socketRef.current.readyState === WebSocket.OPEN || socketRef.current.readyState === WebSocket.CONNECTING) {
                return;
            }
            socketRef.current.close();
            socketRef.current = null;
        }

        console.log('Connecting to WebSocket...');
        const ws = new WebSocket(`${WS_URL}?token=${token}`);
        socketRef.current = ws;

        ws.onopen = () => {
            console.log('WebSocket connected');
            setIsConnected(true);
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                switch (data.type) {
                    case 'HISTORY':
                        setMessages(prev => {
                            const newMsgs = data.payload as Message[];
                            const existingIds = new Set(prev.map(m => m.id));
                            const uniqueNew = newMsgs.filter(m => !existingIds.has(m.id));
                            return [...prev, ...uniqueNew].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
                        });
                        break;
                    case 'NEW_MESSAGE':
                        setMessages(prev => [...prev, data.payload]);
                        break;
                    case 'ASSIGNED':
                        setAssignedCompanyId(data.payload.companyId);
                        setActiveRoomId(data.payload.roomId);
                        break;
                    case 'ASSIGNMENTS':
                        setAssignments(data.payload);
                        break;
                    case 'INFO':
                        console.log('WS Info:', data.message);
                        break;
                    case 'ERROR':
                        console.error('WS Error:', data.message);
                        break;
                }
            } catch (err) {
                console.error('Failed to parse WS message', err);
            }
        };

        ws.onclose = () => {
            console.log('WebSocket disconnected');
            setIsConnected(false);
            socketRef.current = null;

            if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = setTimeout(() => {
                connect();
            }, 3000);
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            ws.close();
        };
    }, [token]);

    useEffect(() => {
        if (token) {
            connect();
        }
        return () => {
            if (socketRef.current) {
                socketRef.current.onclose = null; // Prevent reconnect on intentional unmount
                socketRef.current.close();
                socketRef.current = null;
            }
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
        };
    }, [token, connect]);

    const sendMessage = useCallback((content: string, roomId?: string) => {
        const ws = socketRef.current;
        if (ws && ws.readyState === WebSocket.OPEN) {
            const targetRoomId = roomId || activeRoomId;
            socketRef.current?.send(JSON.stringify({ content, roomId: targetRoomId }));
        } else {
            console.warn('Socket not connected');
        }
    }, [activeRoomId]);

    return {
        isConnected,
        sendMessage,
        messages,
        assignments,
        activeRoomId,
        assignedCompanyId
    };
}
