"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { GripVertical } from "lucide-react"

interface Client {
  id: string
  name: string
  email: string
  avatar?: string
  status: "waiting" | "in-progress" | "completed"
  lastMessage: string
  lastActivity: Date
  unreadCount: number
}

interface ClientCardProps {
  client: Client
  onClick?: () => void
  isDragging?: boolean
}

export function ClientCard({ client, onClick, isDragging = false }: ClientCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: client.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging || isSortableDragging ? 0.5 : 1,
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
    <Card
      ref={setNodeRef}
      style={style}
      className={`transition-all duration-200 ${
        isDragging || isSortableDragging
          ? "shadow-2xl ring-2 ring-blue-400 bg-white scale-105 rotate-2 z-50"
          : "hover:shadow-md hover:scale-[1.01]"
      }`}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div
            className={`cursor-grab active:cursor-grabbing mt-1 transition-colors duration-200 ${
              isDragging || isSortableDragging ? "text-blue-600" : "text-gray-400 hover:text-gray-600"
            }`}
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-4 w-4" />
          </div>

          <div
            className="flex-1 min-w-0 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation()
              onClick?.()
            }}
          >
            <div className="flex items-start gap-3">
              <Avatar
                className={`h-10 w-10 transition-all duration-200 ${
                  isDragging || isSortableDragging ? "ring-2 ring-blue-300" : ""
                }`}
              >
                <AvatarImage src={client.avatar || "/placeholder.svg"} />
                <AvatarFallback>
                  {client.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-medium text-sm truncate">{client.name}</h3>
                  {client.unreadCount > 0 && (
                    <Badge variant="destructive" className="text-xs px-1.5 py-0.5">
                      {client.unreadCount}
                    </Badge>
                  )}
                </div>

                <p className="text-xs text-gray-500 mb-2 truncate">{client.email}</p>

                <p className="text-sm text-gray-700 mb-3 line-clamp-2">{client.lastMessage}</p>

                <div className="flex items-center justify-between">
                  <Badge className={`text-xs ${getStatusColor(client.status)}`}>{getStatusText(client.status)}</Badge>

                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(client.lastActivity, {
                      addSuffix: true,
                      locale: ptBR,
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
