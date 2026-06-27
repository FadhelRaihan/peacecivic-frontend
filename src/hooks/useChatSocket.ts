import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'https://peacecivic-backend.vercel.app'; // Sesuaikan dengan URL backend Anda

interface TypingUser {
  userId: string;
  fullName: string;
}

export const useChatSocket = (isForum: boolean, teamId?: string) => {
  const socketRef = useRef<Socket | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    // Inisialisasi socket
    const socket = io(SOCKET_URL, {
      auth: { token }
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      console.log('Socket connected');
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Socket disconnected');
    });

    // Listener pesan masuk
    socket.on('receive_message', (message: any) => {
      setMessages((prev) => [...prev, message]);
    });

    // Listener typing indicator
    socket.on('user_typing', (payload: TypingUser) => {
      setTypingUsers((prev) => {
        if (prev.find(u => u.userId === payload.userId)) return prev;
        return [...prev, payload];
      });
    });

    socket.on('user_stop_typing', (payload: { userId: string }) => {
      setTypingUsers((prev) => prev.filter(u => u.userId !== payload.userId));
    });

    return () => {
      socket.disconnect();
    };
  }, []); // Reconnect if needed, or keeping it stable

  const sendMessage = useCallback((messageBody: string) => {
    if (socketRef.current && messageBody.trim()) {
      socketRef.current.emit('send_message', {
        is_forum: isForum,
        team_id: teamId,
        message_body: messageBody
      });
    }
  }, [isForum, teamId]);

  const sendTyping = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.emit('typing', { is_forum: isForum, team_id: teamId });
    }
  }, [isForum, teamId]);

  const sendStopTyping = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.emit('stop_typing', { is_forum: isForum, team_id: teamId });
    }
  }, [isForum, teamId]);

  return {
    messages,
    setMessages,
    typingUsers,
    isConnected,
    sendMessage,
    sendTyping,
    sendStopTyping
  };
};
