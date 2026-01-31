import { WebSocket } from 'ws';

export class ConnectionManager {
    // Map userId -> Set of WebSockets (multitab support)
    private connections: Map<string, Set<WebSocket>> = new Map();

    addConnection(userId: string, ws: WebSocket) {
        if (!this.connections.has(userId)) {
            this.connections.set(userId, new Set());
        }
        this.connections.get(userId)?.add(ws);
    }

    removeConnection(userId: string, ws: WebSocket) {
        const userConns = this.connections.get(userId);
        if (userConns) {
            userConns.delete(ws);
            if (userConns.size === 0) {
                this.connections.delete(userId);
            }
        }
    }

    getConnections(userId: string): Set<WebSocket> | undefined {
        return this.connections.get(userId);
    }

    isUserOnline(userId: string): boolean {
        return this.connections.has(userId);
    }

    broadcastToUser(userId: string, message: any) {
        const conns = this.getConnections(userId);
        if (conns) {
            const payload = JSON.stringify(message);
            conns.forEach(ws => {
                if (ws.readyState === WebSocket.OPEN) {
                    ws.send(payload);
                }
            });
        }
    }
}

export const connectionManager = new ConnectionManager();
