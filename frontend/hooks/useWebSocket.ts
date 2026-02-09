import { useEffect, useState, useRef, useCallback } from 'react';

const WS_URL = 'ws://localhost:8080'; // Should be env var

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
    const [socket, setSocket] = useState<WebSocket | null>(null);
    // Messages grouped by roomId or just a flat list? Let's keep flat list and filter in UI for now
    // But ideally we want to know which room we are in. 
    const [messages, setMessages] = useState<Message[]>([]);
    const [isConnected, setIsConnected] = useState(false);

    // State for assignments (mainly for Company view)
    const [assignments, setAssignments] = useState<Assignment[]>([]);

    // State for current active room (mainly for Homeowner view)
    const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
    const [assignedCompanyId, setAssignedCompanyId] = useState<string | null>(null);

    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const connect = useCallback(() => {
        if (!token) return;

        if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) {
            return;
        }

        console.log('Connecting to WebSocket...');
        const ws = new WebSocket(`${WS_URL}?token=${token}`);

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
                        // data.payload is array of messages
                        setMessages(prev => {
                            // Merge history: prevent duplicates
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
                        // For Homeowner: payload = { companyId, roomId }
                        setAssignedCompanyId(data.payload.companyId);
                        setActiveRoomId(data.payload.roomId);
                        break;

                    case 'ASSIGNMENTS':
                        // For Company: payload = [ { room: {...}, homeowner: {...} } ]
                        // We map this to a cleaner structure if needed, or just use raw
                        // For now let's store raw or flattened assignments
                        setAssignments(data.payload);
                        break;

                    case 'INFO':
                        console.log('WS Info:', data.message);
                        break;

                    case 'ERROR':
                        console.error('WS Error:', data.message);
                        break;

                    default:
                        console.log('Unknown WS message type:', data.type);
                }

            } catch (err) {
                console.error('Failed to parse WS message', err);
            }
        };

        ws.onclose = () => {
            console.log('WebSocket disconnected');
            setIsConnected(false);
            setSocket(null);

            // Attempt reconnect
            reconnectTimeoutRef.current = setTimeout(() => {
                connect();
            }, 3000);
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            ws.close();
        };

        setSocket(ws);
    }, [token]);

    useEffect(() => {
        if (token) {
            connect();
        }
        return () => {
            if (socket) {
                socket.close();
            }
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
        };
    }, [token, connect]);

    const sendMessage = useCallback((content: string, roomId?: string) => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            // For Homeowner, roomId is optional (server knows), but good to send if we have it
            // For Company, roomId is required (or they need to know who they are talking to)
            // Hook user should pass roomId if known
            const targetRoomId = roomId || activeRoomId;

            const payload = {
                content,
                roomId: targetRoomId
            };
            socket.send(JSON.stringify(payload));
        } else {
            console.warn('Socket not connected');
        }
    }, [socket, activeRoomId]);

    return {
        isConnected,
        sendMessage,
        messages,
        assignments,
        activeRoomId,
        assignedCompanyId
    };
}
