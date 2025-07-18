"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Bot } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useState } from "react"

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
}

interface Client {
  id: string
  name: string
  email: string
  avatar?: string
  status: "waiting" | "in-progress" | "completed"
  lastMessage: string
  lastActivity: Date
  messages: Message[]
  unreadCount: number
}

interface ChatConversationProps {
  client: Client
}

export function ChatConversation({ client }: ChatConversationProps) {
  const [newMessage, setNewMessage] = useState("")

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Aqui você implementaria a lógica para enviar a mensagem
      console.log("Enviando mensagem:", newMessage)
      setNewMessage("")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "waiting":
        return "bg-yellow-100 text-yellow-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "waiting":
        return "Aguardando"
      case "in-progress":
        return "Em Atendimento"
      case "completed":
        return "Finalizado"
      default:
        return status
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] mt-6">
      <div className="flex items-center justify-between mb-4 pb-4 border-b">
        <div className="flex items-center gap-2">
          <Badge className={getStatusColor(client.status)}>{getStatusText(client.status)}</Badge>
          <span className="text-sm text-gray-500">
            Última atividade:{" "}
            {formatDistanceToNow(client.lastActivity, {
              addSuffix: true,
              locale: ptBR,
            })}
          </span>
        </div>
      </div>

      <ScrollArea className="flex-1 pr-4">
        <div className="space-y-4">
          {client.messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.sender === "bot" && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-blue-100">
                    <Bot className="h-4 w-4 text-blue-600" />
                  </AvatarFallback>
                </Avatar>
              )}

              <div
                className={`max-w-[70%] rounded-lg px-4 py-2 ${
                  message.sender === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className={`text-xs mt-1 ${message.sender === "user" ? "text-blue-100" : "text-gray-500"}`}>
                  {formatDistanceToNow(message.timestamp, {
                    addSuffix: true,
                    locale: ptBR,
                  })}
                </p>
              </div>

              {message.sender === "user" && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src={client.avatar || "/placeholder.svg"} />
                  <AvatarFallback>
                    {client.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="mt-4 pt-4 border-t">
        <div className="flex gap-2">
          <Input
            placeholder="Digite sua mensagem..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-1"
          />
          <Button onClick={handleSendMessage} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
