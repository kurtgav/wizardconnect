package websocket

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"wizard-connect/internal/domain/entities"
	"wizard-connect/internal/infrastructure/database"

	"github.com/gin-gonic/gin"
	socketio "github.com/googollee/go-socket.io"
)

type SocketHandler struct {
	Server           *socketio.Server
	conversationRepo *database.ConversationRepository
	messageRepo      *database.MessageRepository
	userRepo         *database.UserRepository
}

type MessagePayload struct {
	ID        string `json:"id"`
	RoomID    string `json:"roomId"`
	UserID    string `json:"userId"`
	Message   string `json:"message"`
	Timestamp int64  `json:"timestamp"`
}

func NewSocketHandler(
	conversationRepo *database.ConversationRepository,
	messageRepo *database.MessageRepository,
	userRepo *database.UserRepository,
) (*SocketHandler, error) {
	server := socketio.NewServer(nil)

	handler := &SocketHandler{
		Server:           server,
		conversationRepo: conversationRepo,
		messageRepo:      messageRepo,
		userRepo:         userRepo,
	}

	server.OnConnect("/", func(s socketio.Conn) error {
		s.SetContext("")
		fmt.Println("WS Connected:", s.ID())
		return nil
	})

	server.OnEvent("/", "join-room", func(s socketio.Conn, roomID string) {
		s.Join(roomID)
		fmt.Printf("WS User %s joined room %s\n", s.ID(), roomID)
	})

	server.OnEvent("/", "send-message", func(s socketio.Conn, msg string) {
		var payload MessagePayload
		if err := json.Unmarshal([]byte(msg), &payload); err != nil {
			log.Printf("WS Error unmarshaling message: %v", err)
			return
		}

		fmt.Printf("WS Message from %s in room %s: %s\n", payload.UserID, payload.RoomID, payload.Message)

		// Save to database
		message := &entities.Message{
			ConversationID: payload.RoomID,
			SenderID:       payload.UserID,
			Content:        payload.Message,
			IsRead:         false,
		}

		ctx := context.Background()
		if err := handler.messageRepo.Create(ctx, message); err != nil {
			log.Printf("WS Error saving message to DB: %v", err)
			return
		}

		// Update conversation last message
		_ = handler.conversationRepo.UpdateLastMessage(ctx, payload.RoomID, payload.Message)

		// Update payload with DB generated fields
		payload.ID = message.ID
		payload.Timestamp = message.CreatedAt.UnixMilli()

		// Broadcast to room
		handler.Server.BroadcastToRoom("/", payload.RoomID, "receive-message", payload)
	})

	server.OnDisconnect("/", func(s socketio.Conn, reason string) {
		fmt.Println("WS Disconnected:", s.ID(), reason)
	})

	go func() {
		if err := server.Serve(); err != nil {
			log.Fatalf("socketio listen error: %s\n", err)
		}
	}()

	return handler, nil
}

func (h *SocketHandler) Handler() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Set CORS headers for Socket.IO
		origin := c.Request.Header.Get("Origin")
		c.Writer.Header().Set("Access-Control-Allow-Origin", origin)
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Accept, Authorization, Content-Type, Content-Length, X-CSRF-Token, Token, session, Origin, Host, Connection, Accept-Encoding, Accept-Language, X-Requested-With")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}

		h.Server.ServeHTTP(c.Writer, c.Request)
	}
}
