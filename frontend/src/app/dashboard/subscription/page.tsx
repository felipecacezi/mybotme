"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Check, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const plans = [
  {
    name: "Básico",
    price: "R$ 29",
    period: "/mês",
    description: "Perfeito para começar",
    features: [
      "Até 5 projetos",
      "10GB de armazenamento",
      "Suporte por email",
      "Relatórios básicos",
      "SSL gratuito",
    ],
    popular: false,
    buttonText: "Começar Grátis",
    buttonVariant: "outline" as const,
  },
  {
    name: "Profissional",
    price: "R$ 79",
    period: "/mês",
    description: "Para equipes em crescimento",
    features: [
      "Projetos ilimitados",
      "100GB de armazenamento",
      "Suporte prioritário",
      "Relatórios avançados",
      "SSL gratuito",
      "Integrações API",
      "Backup automático",
      "Colaboração em equipe",
    ],
    popular: true,
    buttonText: "Assinar Agora",
    buttonVariant: "default" as const,
  },
  {
    name: "Enterprise",
    price: "R$ 199",
    period: "/mês",
    description: "Para grandes organizações",
    features: [
      "Tudo do Profissional",
      "Armazenamento ilimitado",
      "Suporte 24/7",
      "Relatórios personalizados",
      "SSL dedicado",
      "API personalizada",
      "Gerente de conta dedicado",
      "SLA garantido",
      "Auditoria de segurança",
    ],
    popular: false,
    buttonText: "Falar com Vendas",
    buttonVariant: "outline" as const,
  },
];

export default function Page() {
  const router = useRouter();
  const handleCheckSession = async () => {
    const response = await fetch("/api/auth/session", {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      router.push("/auth/login");
    }
  };

  useEffect(() => {
    handleCheckSession();
  }, []);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative ${
                plan.popular ? "border-primary shadow-lg scale-105" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground px-3 py-1">
                    <Star className="w-3 h-3 mr-1" />
                    Mais Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold">
                  {plan.name}
                </CardTitle>
                <CardDescription className="text-base">
                  {plan.description}
                </CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button
                  variant={plan.buttonVariant}
                  className="w-full"
                  size="lg"
                >
                  {plan.buttonText}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
