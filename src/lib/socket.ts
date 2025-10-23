import { Server } from 'socket.io';
import { db } from './db';

interface ChatMessage {
  id: string;
  sessionId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface TypingUser {
  userId: string;
  userName: string;
  sessionId: string;
}

export const setupSocket = (io: Server) => {
  const activeUsers = new Map<string, TypingUser>();
  const typingUsers = new Map<string, TypingUser>();

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    
    // Join chat session room
    socket.on('join-session', (sessionId: string) => {
      socket.join(`session-${sessionId}`);
      socket.emit('joined-session', sessionId);
    });

    // Leave chat session room
    socket.on('leave-session', (sessionId: string) => {
      socket.leave(`session-${sessionId}`);
      socket.emit('left-session', sessionId);
    });

    // Handle real-time chat messages
    socket.on('chat-message', async (data: {
      sessionId: string;
      message: string;
      userId?: string;
      role: 'user' | 'assistant';
    }) => {
      try {
        // Save message to database if userId is provided
        if (data.userId) {
          await db.chatMessage.create({
            data: {
              sessionId: data.sessionId,
              role: data.role.toUpperCase() as 'USER' | 'ASSISTANT',
              content: data.message,
              createdAt: new Date(),
            },
          });
        }

        // Broadcast to all clients in the session
        const messageData: ChatMessage = {
          id: `msg-${Date.now()}`,
          sessionId: data.sessionId,
          role: data.role,
          content: data.message,
          timestamp: new Date(),
        };

        io.to(`session-${data.sessionId}`).emit('chat-message', messageData);
      } catch (error) {
        console.error('Error saving chat message:', error);
        socket.emit('error', { message: 'Failed to save message' });
      }
    });

    // Handle typing indicators
    socket.on('typing-start', (data: {
      sessionId: string;
      userId: string;
      userName: string;
    }) => {
      typingUsers.set(socket.id, data);
      socket.to(`session-${data.sessionId}`).emit('user-typing', {
        userId: data.userId,
        userName: data.userName,
        isTyping: true,
      });
    });

    socket.on('typing-stop', (data: { sessionId: string }) => {
      const typingUser = typingUsers.get(socket.id);
      if (typingUser) {
        socket.to(`session-${typingUser.sessionId}`).emit('user-typing', {
          userId: typingUser.userId,
          userName: typingUser.userName,
          isTyping: false,
        });
        typingUsers.delete(socket.id);
      }
    });

    // Handle image generation progress
    socket.on('generate-image', async (data: {
      prompt: string;
      size: string;
      userId?: string;
    }) => {
      try {
        // Emit progress updates
        socket.emit('image-generation-progress', {
          status: 'processing',
          message: 'Generating image...',
          progress: 25,
        });

        // Simulate processing time
        setTimeout(() => {
          socket.emit('image-generation-progress', {
            status: 'processing',
            message: 'Refining details...',
            progress: 75,
          });
        }, 2000);

        // This would integrate with your actual image generation API
        setTimeout(() => {
          socket.emit('image-generation-complete', {
            status: 'complete',
            message: 'Image generated successfully!',
            imageUrl: '/api/placeholder-image', // Replace with actual image
            prompt: data.prompt,
          });
        }, 4000);

      } catch (error) {
        socket.emit('image-generation-error', {
          status: 'error',
          message: 'Failed to generate image',
        });
      }
    });

    // Handle web search progress
    socket.on('web-search', async (data: {
      query: string;
      userId?: string;
    }) => {
      try {
        socket.emit('search-progress', {
          status: 'searching',
          message: `Searching for "${data.query}"...`,
          progress: 25,
        });

        // Simulate search process
        setTimeout(() => {
          socket.emit('search-progress', {
            status: 'processing',
            message: 'Processing results...',
            progress: 75,
          });
        }, 1500);

        setTimeout(() => {
          socket.emit('search-complete', {
            status: 'complete',
            message: 'Search completed',
            query: data.query,
            results: [], // Replace with actual search results
          });
        }, 3000);

      } catch (error) {
        socket.emit('search-error', {
          status: 'error',
          message: 'Search failed',
        });
      }
    });

    // Handle real-time collaboration
    socket.on('join-workspace', (workspaceId: string) => {
      socket.join(`workspace-${workspaceId}`);
      activeUsers.set(socket.id, {
        userId: socket.id,
        userName: `User-${socket.id.slice(-4)}`,
        sessionId: workspaceId,
      });

      // Notify others in workspace
      socket.to(`workspace-${workspaceId}`).emit('user-joined', {
        userId: socket.id,
        userName: `User-${socket.id.slice(-4)}`,
      });

      // Send list of active users
      const workspaceUsers = Array.from(activeUsers.values())
        .filter(user => user.sessionId === workspaceId);
      socket.emit('active-users', workspaceUsers);
    });

    socket.on('leave-workspace', (workspaceId: string) => {
      socket.leave(`workspace-${workspaceId}`);
      activeUsers.delete(socket.id);
      
      socket.to(`workspace-${workspaceId}`).emit('user-left', {
        userId: socket.id,
      });
    });

    // Handle cursor position for real-time collaboration
    socket.on('cursor-move', (data: {
      workspaceId: string;
      x: number;
      y: number;
      userId: string;
    }) => {
      socket.to(`workspace-${data.workspaceId}`).emit('cursor-update', {
        userId: data.userId,
        x: data.x,
        y: data.y,
      });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
      
      // Clean up typing indicators
      const typingUser = typingUsers.get(socket.id);
      if (typingUser) {
        socket.to(`session-${typingUser.sessionId}`).emit('user-typing', {
          userId: typingUser.userId,
          userName: typingUser.userName,
          isTyping: false,
        });
        typingUsers.delete(socket.id);
      }

      // Clean up active users
      const user = activeUsers.get(socket.id);
      if (user) {
        socket.to(`workspace-${user.sessionId}`).emit('user-left', {
          userId: socket.id,
        });
        activeUsers.delete(socket.id);
      }
    });

    // Send welcome message
    socket.emit('connected', {
      message: 'Connected to ODARK AI WebSocket Server',
      socketId: socket.id,
      timestamp: new Date().toISOString(),
    });
  });
};