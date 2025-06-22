"use client";

import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import toast, { Toaster } from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await fetch(`/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Não foi possivel fazer login, e-mail ou senha inválidos.");
      }   
      router.push('/dashboard');
    } catch (error) {      
      const message = error instanceof Error
        ? error.message
        : "Não foi possível faze o login, tente novamente mais tarde";

      toast.error(message, {
        position: "top-right",
      });
    }
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="">Acessar minha conta</CardTitle>
            </CardHeader>
            <CardContent>
              <form>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seuemail@exemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required />
                  </div>
                  <div className="grid gap-3">
                    <div className="flex items-center">
                      <Label htmlFor="password">Senha</Label>
                      <a
                        href="#"
                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                      >
                        Esqueceu sua senha?
                      </a>
                    </div>
                    <Input id="password" 
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)} 
                      required />
                  </div>
                  <div className="flex flex-col gap-3">
                    <Button type="button" 
                      className="w-full"
                      onClick={handleLogin}>
                      Entrar
                    </Button>
                    {/* <Button variant="outline" className="w-full">
                  Login with Google
                </Button> */}
                  </div>
                </div>
                <div className="mt-4 text-center text-sm">
                  Você não possui uma conta ainda? <br />
                  <a href="#" className="underline underline-offset-4">
                    Me cadastrar
                  </a>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      <Toaster />
    </div>
  );
}