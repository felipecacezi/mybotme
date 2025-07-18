"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Eye, EyeOff } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"

const aiProviders = [
  {
    value: "deepseek",
    label: "DeepSeek",
  },
]

export default function AIConfigForm() {
  const [open, setOpen] = React.useState(false)
  const [selectedAI, setSelectedAI] = React.useState("")
  const [showApiKey, setShowApiKey] = React.useState(false)
  const [apiKey, setApiKey] = React.useState("")
  const [context, setContext] = React.useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log({
      ai: selectedAI,
      apiKey,
      context,
    })
    // Aqui você pode implementar a lógica para salvar as configurações
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Configuração da IA</CardTitle>
          <CardDescription>
            Configure sua API de inteligência artificial e defina o comportamento do bot
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Seleção da IA */}
            <div className="space-y-2">
              <Label htmlFor="ai-provider">Provedor de IA</Label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between bg-transparent"
                  >
                    {selectedAI
                      ? aiProviders.find((provider) => provider.value === selectedAI)?.label
                      : "Selecione uma IA..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Buscar IA..." />
                    <CommandList>
                      <CommandEmpty>Nenhuma IA encontrada.</CommandEmpty>
                      <CommandGroup>
                        {aiProviders.map((provider) => (
                          <CommandItem
                            key={provider.value}
                            value={provider.value}
                            onSelect={(currentValue) => {
                              setSelectedAI(currentValue === selectedAI ? "" : currentValue)
                              setOpen(false)
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedAI === provider.value ? "opacity-100" : "opacity-0",
                              )}
                            />
                            {provider.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Campo da API Key */}
            <div className="space-y-2">
              <Label htmlFor="api-key">Chave da API</Label>
              <div className="relative">
                <Input
                  id="api-key"
                  type={showApiKey ? "text" : "password"}
                  placeholder="Digite sua chave da API..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowApiKey(!showApiKey)}
                >
                  {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  <span className="sr-only">{showApiKey ? "Ocultar" : "Mostrar"} chave da API</span>
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">Sua chave da API será armazenada de forma segura</p>
            </div>

            {/* Campo de Contexto */}
            <div className="space-y-2">
              <Label htmlFor="context">Contexto do Bot</Label>
              <Textarea
                id="context"
                placeholder="Descreva como o bot deve se comportar, seu tom de voz, especialidades, limitações, etc..."
                value={context}
                onChange={(e) => setContext(e.target.value)}
                rows={6}
                className="resize-none"
              />
              <p className="text-sm text-muted-foreground">Defina a personalidade e comportamento do seu bot de IA</p>
            </div>

            {/* Botões de Ação */}
            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1">
                Salvar Configurações
              </Button>
              <Button type="button" variant="outline" className="flex-1 bg-transparent">
                Testar Conexão
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}