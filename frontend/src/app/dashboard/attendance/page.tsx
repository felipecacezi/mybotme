"use client"

import { useState } from "react"
import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
} from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Search, MessageCircle, Clock, CheckCircle } from "lucide-react"
import { ClientCard } from "@/components/client-card"
import { ChatConversation } from "@/components/chat-conversation"

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

const mockClients: Client[] = [
  {
    id: "1",
    name: "Ana Silva",
    email: "ana@email.com",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "waiting",
    lastMessage: "Preciso de ajuda com meu pedido",
    lastActivity: new Date("2024-01-15T10:30:00"),
    unreadCount: 2,
    messages: [
      {
        id: "1",
        content: "Olá! Preciso de ajuda com meu pedido",
        sender: "user",
        timestamp: new Date("2024-01-15T10:25:00"),
      },
      {
        id: "2",
        content: "Olá! Claro, posso te ajudar. Qual é o número do seu pedido?",
        sender: "bot",
        timestamp: new Date("2024-01-15T10:26:00"),
      },
      { id: "3", content: "É o pedido #12345", sender: "user", timestamp: new Date("2024-01-15T10:27:00") },
      {
        id: "4",
        content: "Encontrei seu pedido! Ele está sendo preparado e será enviado hoje.",
        sender: "bot",
        timestamp: new Date("2024-01-15T10:28:00"),
      },
      {
        id: "5",
        content: "Preciso de ajuda com meu pedido",
        sender: "user",
        timestamp: new Date("2024-01-15T10:30:00"),
      },
    ],
  },
  {
    id: "2",
    name: "Carlos Santos",
    email: "carlos@email.com",
    status: "in-progress",
    lastMessage: "Obrigado pela ajuda!",
    lastActivity: new Date("2024-01-15T09:45:00"),
    unreadCount: 0,
    messages: [
      {
        id: "1",
        content: "Tenho uma dúvida sobre o produto",
        sender: "user",
        timestamp: new Date("2024-01-15T09:40:00"),
      },
      {
        id: "2",
        content: "Claro! Qual produto você gostaria de saber mais?",
        sender: "bot",
        timestamp: new Date("2024-01-15T09:41:00"),
      },
      { id: "3", content: "O smartphone XYZ", sender: "user", timestamp: new Date("2024-01-15T09:42:00") },
      {
        id: "4",
        content: "Esse modelo tem 128GB de armazenamento, câmera de 48MP e bateria de 4000mAh.",
        sender: "bot",
        timestamp: new Date("2024-01-15T09:43:00"),
      },
      { id: "5", content: "Obrigado pela ajuda!", sender: "user", timestamp: new Date("2024-01-15T09:45:00") },
    ],
  },
  {
    id: "3",
    name: "Maria Oliveira",
    email: "maria@email.com",
    status: "completed",
    lastMessage: "Problema resolvido, obrigada!",
    lastActivity: new Date("2024-01-15T08:20:00"),
    unreadCount: 0,
    messages: [
      { id: "1", content: "Não consigo fazer login", sender: "user", timestamp: new Date("2024-01-15T08:15:00") },
      {
        id: "2",
        content: "Vou te ajudar com isso. Você está usando o email correto?",
        sender: "bot",
        timestamp: new Date("2024-01-15T08:16:00"),
      },
      { id: "3", content: "Sim, maria@email.com", sender: "user", timestamp: new Date("2024-01-15T08:17:00") },
      {
        id: "4",
        content: 'Tente redefinir sua senha clicando em "Esqueci minha senha"',
        sender: "bot",
        timestamp: new Date("2024-01-15T08:18:00"),
      },
      {
        id: "5",
        content: "Funcionou! Problema resolvido, obrigada!",
        sender: "user",
        timestamp: new Date("2024-01-15T08:20:00"),
      },
    ],
  },
  {
    id: "4",
    name: "João Pereira",
    email: "joao@email.com",
    status: "waiting",
    lastMessage: "Quando meu pedido chega?",
    lastActivity: new Date("2024-01-15T11:15:00"),
    unreadCount: 1,
    messages: [
      { id: "1", content: "Quando meu pedido chega?", sender: "user", timestamp: new Date("2024-01-15T11:15:00") },
    ],
  },
]

const columns = [
  { id: "waiting", title: "Aguardando", icon: Clock, color: "bg-yellow-100 text-yellow-800" },
  { id: "in-progress", title: "Em Atendimento", icon: MessageCircle, color: "bg-blue-100 text-blue-800" },
  { id: "completed", title: "Finalizado", icon: CheckCircle, color: "bg-green-100 text-green-800" },
]

export default function Dashboard() {
  const [clients, setClients] = useState<Client[]>(mockClients)
  const [activeClient, setActiveClient] = useState<Client | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  )

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getClientsByStatus = (status: string) => {
    return filteredClients.filter((client) => client.status === status)
  }

  const handleDragStart = (event: DragStartEvent) => {
    const client = clients.find((c) => c.id === event.active.id)
    setActiveClient(client || null)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over) {
      setActiveClient(null)
      return
    }

    const clientId = active.id as string
    const overId = over.id as string

    // Verifica se foi solto em uma coluna
    const targetColumn = columns.find((col) => col.id === overId)
    if (targetColumn) {
      const newStatus = targetColumn.id as "waiting" | "in-progress" | "completed"

      setClients((prev) => prev.map((client) => (client.id === clientId ? { ...client, status: newStatus } : client)))
    }

    setActiveClient(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard de Atendimento</h1>
          <p className="text-gray-600">Gerencie seus clientes e conversas do chatbot</p>
        </div>

        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar por nome ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {columns.map((column) => (
              <DroppableColumn
                key={column.id}
                column={column}
                clients={getClientsByStatus(column.id)}
                onClientClick={setSelectedClient}
              />
            ))}
          </div>

          <DragOverlay>{activeClient ? <ClientCard client={activeClient} isDragging /> : null}</DragOverlay>
        </DndContext>

        <Sheet open={!!selectedClient} onOpenChange={() => setSelectedClient(null)}>
          <SheetContent className="w-full sm:max-w-2xl">
            {selectedClient && (
              <>
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={selectedClient.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {selectedClient.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div>{selectedClient.name}</div>
                      <div className="text-sm text-gray-500 font-normal">{selectedClient.email}</div>
                    </div>
                  </SheetTitle>
                </SheetHeader>
                <ChatConversation client={selectedClient} />
              </>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}

interface DroppableColumnProps {
  column: { id: string; title: string; icon: unknown; color: string }
  clients: Client[]
  onClientClick: (client: Client) => void
}

function DroppableColumn({ column, clients, onClientClick }: DroppableColumnProps) {
  const { setNodeRef } = useDroppable({ id: column.id })
  const Icon = column.icon

  return (
    <Card ref={setNodeRef} className="h-fit">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Icon className="h-5 w-5" />
          {column.title}
          <Badge variant="secondary" className={column.color}>
            {clients.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <SortableContext items={clients.map((c) => c.id)} strategy={verticalListSortingStrategy} id={column.id}>
          <div className="space-y-3 min-h-[200px]">
            {clients.map((client) => (
              <ClientCard key={client.id} client={client} onClick={() => onClientClick(client)} />
            ))}
          </div>
        </SortableContext>
      </CardContent>
    </Card>
  )
}
