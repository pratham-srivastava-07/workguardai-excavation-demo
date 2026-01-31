

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare, Send, User as UserIcon, Briefcase } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useWebSocket } from '@/hooks/useWebSocket';
import { getValidAccessToken } from '@/utils/tokenManager';

export function MessagesTab() {
  const { user } = useAuth();
  const [token, setToken] = useState<string | null>(null);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null); // Effectively RoomId for Company
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Get token for WS
  useEffect(() => {
    const fetchToken = async () => {
      const t = await getValidAccessToken();
      setToken(t);
    };
    fetchToken();
  }, []);

  const { messages, sendMessage, isConnected, assignments, activeRoomId: homeownerRoomId, assignedCompanyId } = useWebSocket(token);

  // Determine role-based view props
  const isHomeowner = user?.role === 'HOMEOWNER';

  // For company: Derived conversations from assignments + messages
  const conversations = useMemo(() => {
    if (isHomeowner) return []; // Homeowner has single implicit conversation

    if (!user || assignments.length === 0) return [];

    // Map assignments to conversation objects
    return assignments.map((assign: any) => {
      const otherUser = assign.homeowner; // Since we are company, other is homeowner
      const roomId = assign.roomId;

      // Find latest message for this room
      const roomMessages = messages.filter(m => m.roomId === roomId);
      const lastMessage = roomMessages[roomMessages.length - 1];

      return {
        id: roomId, // Use RoomID as conversation ID
        userId: otherUser.id,
        name: otherUser.name || otherUser.email || 'Homeowner',
        email: otherUser.email,
        lastMessage: lastMessage,
        unreadCount: 0 // logic for unread needs persistent read state
      };
    }).sort((a, b) => {
      const timeA = a.lastMessage?.createdAt ? new Date(a.lastMessage.createdAt).getTime() : 0;
      const timeB = b.lastMessage?.createdAt ? new Date(b.lastMessage.createdAt).getTime() : 0;
      return timeB - timeA;
    });
  }, [assignments, messages, user, isHomeowner]);

  // Set active conversation for Company
  useEffect(() => {
    if (!isHomeowner && !activeConversationId && conversations.length > 0) {
      setActiveConversationId(conversations[0].id);
    }
  }, [conversations, activeConversationId, isHomeowner]);

  // Set active conversation for Homeowner (auto-set)
  useEffect(() => {
    if (isHomeowner && homeownerRoomId) {
      setActiveConversationId(homeownerRoomId);
    }
  }, [homeownerRoomId, isHomeowner]);


  // Scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, activeConversationId]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    // If Homeowner, roomId might be implicit in hook or we pass homeownerRoomId
    // If Company, we MUST pass activeConversationId (which is roomId)
    const targetRoomId = isHomeowner ? (homeownerRoomId || undefined) : activeConversationId;

    if (targetRoomId) {
      sendMessage(inputText, targetRoomId);
      setInputText('');
    }
  };

  // Filter messages for current view
  const activeMessages = useMemo(() => {
    if (!activeConversationId) return [];
    return messages.filter(m => m.roomId === activeConversationId);
  }, [messages, activeConversationId]);

  // Display Name logic
  const activePartnerName = useMemo(() => {
    if (isHomeowner) return "Your Assigned Agent";
    const conv = conversations.find(c => c.id === activeConversationId);
    return conv ? conv.name : "Chat";
  }, [isHomeowner, conversations, activeConversationId]);


  return (
    <div className="flex h-[600px] bg-black text-white border border-gray-800 rounded-lg overflow-hidden">

      {/* Sidebar - Only for Company or if we want to show 'Agents' list in future */}
      {!isHomeowner && (
        <div className="w-1/3 border-r border-gray-800 flex flex-col">
          <div className="p-4 border-b border-gray-800">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <MessageSquare className="w-5 h-5" /> Inquiries
            </h2>
          </div>
          <ScrollArea className="flex-1">
            <div className="flex flex-col">
              {conversations.length === 0 ? (
                <div className="p-4 text-center text-gray-500">No projects assigned yet</div>
              ) : (
                conversations.map(conv => (
                  <button
                    key={conv.id}
                    onClick={() => setActiveConversationId(conv.id)}
                    className={`p-4 flex items-center gap-3 hover:bg-gray-900 transition-colors text-left ${activeConversationId === conv.id ? 'bg-gray-900' : ''
                      }`}
                  >
                    <Avatar>
                      <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${conv.email}`} />
                      <AvatarFallback><UserIcon className="w-4 h-4" /></AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-1">
                        <span className="font-medium truncate">{conv.name}</span>
                      </div>
                      <p className="text-sm text-gray-400 truncate">
                        {conv.lastMessage?.content || "New inquiry"}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-950">
        {(activeConversationId || isHomeowner) ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-800 flex items-center gap-3">
              <Avatar>
                {/* For Homeowner, maybe show company logo? For now generic */}
                <AvatarFallback><Briefcase className="w-4 h-4" /></AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">{activePartnerName}</h3>
                <span className={`text-xs ${isConnected ? 'text-green-500' : 'text-red-500'}`}>
                  {isConnected ? 'Connected' : 'Connecting...'}
                </span>
                {isHomeowner && !homeownerRoomId && <span className="ml-2 text-yellow-500 text-xs">(Assigning agent...)</span>}
              </div>
            </div>

            {/* Messages List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
              {activeMessages.length === 0 && (
                <div className="text-center text-gray-500 mt-10">
                  {isHomeowner && !homeownerRoomId ? "Waiting for assignment..." : "Start the conversation!"}
                </div>
              )}

              {activeMessages.map((msg, idx) => {
                const isMe = msg.senderId === user?.id; // backend uses database id
                return (
                  <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${isMe ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-200'
                        }`}
                    >
                      <p>{msg.content}</p>
                      <p className={`text-[10px] mt-1 ${isMe ? 'text-blue-200' : 'text-gray-400'}`}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-800">
              <form onSubmit={handleSend} className="flex gap-2">
                <Input
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type a message..."
                  className="bg-gray-900 border-gray-700 text-white"
                  disabled={!isConnected || (isHomeowner && !homeownerRoomId)}
                />
                <Button type="submit" size="icon" disabled={!inputText.trim() || !isConnected}>
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
            <MessageSquare className="w-12 h-12 mb-4 opacity-20" />
            <p>Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}

