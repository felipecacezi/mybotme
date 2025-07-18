"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Eye,
  EyeOff,
  User,
  Lock,
  Save,
  AlertCircle,
  Building2,
  MapPin,
  Loader2,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

interface CompanyData {
  id?: number;
  cnpj: string;
  name: string;
  street?: string;
  number?: string;
  district?: string;
  city?: string;
  state?: string;
  country?: string;
  zipcode?: string;
}

interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

export default function UserSettings() {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showDeletePassword, setShowDeletePassword] = useState(false);
  const [showDeletePasswordConfirm, setShowDeletePasswordConfirm] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
  });
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordDelete, setPasswordDelete] = useState({
    password: "",
    confirmPassword: "",
  });
  const [companyData, setCompanyData] = useState<CompanyData>({
    cnpj: "",
    name: "",
    street: "",
    number: "",
    district: "",
    city: "",
    state: "",
    country: "Brasil",
    zipcode: "",
  });
  const [isLoadingCep] = useState(false);
  const router = useRouter();

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/user/update", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: profileData.name,
          email: profileData.email,
        }),
      });
      const data = await response.json();

      if (!data.success) {
        throw new Error(
          "Não foi possivel fazer login, e-mail ou senha inválidos."
        );
      }

      toast.success("Informações pessoais atualizadas com sucesso.", {
        position: "top-right",
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível atualizar as informações pessoais, tente novamente mais tarde";

      toast.error(message, {
        position: "top-right",
      });
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/user/update", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(passwordData),
      });
      const data = await response.json();

      if (!data.success) {
        throw new Error(
          "Não foi possível alterar a sua senha, tente novamente mais tarde."
        );
      }
      setPasswordData({ newPassword: "", confirmPassword: "" });
      toast.success("Senha atualizada com sucesso.", {
        position: "top-right",
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível atualizar a sua senha, tente novamente mais tarde";

      toast.error(message, {
        position: "top-right",
      });
    }
  };

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/user/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(passwordDelete),
      });
      const data = await response.json();

      if (!data.success) {
        throw new Error(
          "Não foi possível deletar sua conta, tente novamente mais tarde."
        );
      }
      setPasswordDelete({ password: "", confirmPassword: "" });
      router.push("/auth/login");
      toast.success("Conta deletada com sucesso.", {
        position: "top-right",
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível deletar sua conta, tente novamente mais tarde";

      toast.error(message, {
        position: "top-right",
      });
    }
  };

  const fetchLoggedUser = async () => {
    try {
      const response = await fetch("/api/auth/loggedUser", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(
          "Você não esta logado, por favor, faça login novamente."
        );
      }
      return data;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Você não esta logado, por favor, faça login novamente.";
      toast.error(message, { position: "top-right" });
      router.push("/auth/login");
    }
  };

  const { data: userData } = useQuery({
    queryKey: ["userData"],
    queryFn: fetchLoggedUser,
  });

  const handleCompanySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("Submitting company data:", companyData);

    try {
      const response = await fetch("/api/company/createUpdate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(companyData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Erro ao atualizar dados da empresa"
        );
      }

      const responseData = await response.json();
      setCompanyData(responseData.data.data);
      toast.success("Dados da empresa atualizados com sucesso!", {
        position: "top-right",
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Erro ao atualizar dados da empresa, tente novamente mais tarde.";
      toast.error(message, { position: "top-right" });
    } finally {
      setIsLoading(false);
    }
  };

  const formatCNPJ = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    return numbers.replace(
      /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
      "$1.$2.$3/$4-$5"
    );
  };

  const handleCNPJChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCNPJ(e.target.value);
    if (formatted.length <= 18) {
      setCompanyData((prev) => ({ ...prev, cnpj: formatted }));
    }
  };

  const formatZipCode = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    return numbers.replace(/^(\d{5})(\d{3})$/, "$1-$2");
  };

  const fetchAddressByCep = async (cep: string) => {
    const cleanCep = cep.replace(/\D/g, "");
    if (cleanCep.length !== 8) return;

    // setIsLoadingCep(true)
    try {
      const response = await fetch(
        `https://viacep.com.br/ws/${cleanCep}/json/`
      );
      const data: ViaCepResponse = await response.json();

      if (data.erro) {
        // setMessage("CEP não encontrado")
        return;
      }
      setCompanyData((prev) => ({
        ...prev,
        street: data.logradouro || prev.street,
        district: data.bairro || prev.district,
        city: data.localidade || prev.city,
        state: data.uf || prev.state,
      }));

      // setMessage("Endereço preenchido automaticamente")
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Endereço não encontrado, verifique o CEP e tente novamente.";
      toast.error(message, { position: "top-right" });
      // setMessage("Erro ao buscar CEP")
    } finally {
      // setIsLoadingCep(false)
    }
  };

  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatZipCode(e.target.value);
    setCompanyData((prev) => ({ ...prev, zipcode: formatted }));

    // Auto-fetch address when zipcode is complete
    const cleanCep = formatted.replace(/\D/g, "");
    if (cleanCep.length === 8) {
      fetchAddressByCep(formatted);
    }
  };

  const fetchCompany = async () => {
    try {
      const response = await fetch("/api/company/getLoggedCompany", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Erro ao buscar dados da empresa");
      }

      return data.data;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Erro ao buscar dados da empresa, tente novamente mais tarde";
      toast.error(message, { position: "top-right" });
    }
  };

  const { data: companyApiData } = useQuery({
    queryKey: ["companyData"],
    queryFn: fetchCompany,
  });

  useEffect(() => {
    if (userData?.user) {
      setProfileData({
        name: userData.user.name,
        email: userData.user.email,
      });
    }
  }, [userData]);

  function sanitizeCompanyData(data: CompanyData[]): CompanyData {
    const company = data[0] ?? {};
    return {
      id: company.id ?? undefined,
      cnpj: company.cnpj ?? "",
      name: company.name ?? "",
      street: company.street ?? "",
      number: company.number ?? "",
      district: company.district ?? "",
      city: company.city ?? "",
      state: company.state ?? "",
      country: company.country ?? "Brasil",
      zipcode: company.zipcode ?? "",
    };
  }

  useEffect(() => {
    if (companyApiData) {
      const safeData = Array.isArray(companyApiData)
        ? companyApiData
        : [companyApiData];
      setCompanyData(sanitizeCompanyData(safeData));
    }
  }, [companyApiData]);

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="space-y-8 md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <CardTitle>Informações Pessoais</CardTitle>
              </div>
              <CardDescription>
                Atualize suas informações básicas de perfil
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome completo</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      placeholder="Digite seu nome completo"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      placeholder="Digite seu email"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="min-w-[120px]"
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        <span>Salvando...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Save className="h-4 w-4" />
                        <span>Salvar</span>
                      </div>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Password Security */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Lock className="h-5 w-5" />
                <CardTitle>Segurança</CardTitle>
              </div>
              <CardDescription>
                Altere sua senha para manter sua conta segura
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="new-password">Nova senha</Label>
                      <div className="relative">
                        <Input
                          id="new-password"
                          type={showNewPassword ? "text" : "password"}
                          value={passwordData.newPassword}
                          onChange={(e) =>
                            setPasswordData((prev) => ({
                              ...prev,
                              newPassword: e.target.value,
                            }))
                          }
                          placeholder="Digite sua nova senha"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">
                        Confirmar nova senha
                      </Label>
                      <div className="relative">
                        <Input
                          id="confirm-password"
                          type={showConfirmPassword ? "text" : "password"}
                          value={passwordData.confirmPassword}
                          onChange={(e) =>
                            setPasswordData((prev) => ({
                              ...prev,
                              confirmPassword: e.target.value,
                            }))
                          }
                          placeholder="Confirme sua nova senha"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {passwordData.newPassword &&
                    passwordData.confirmPassword &&
                    passwordData.newPassword !==
                      passwordData.confirmPassword && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          As senhas não coincidem. Verifique e tente novamente.
                        </AlertDescription>
                      </Alert>
                    )}

                  <div className="rounded-lg bg-blue-50 p-4">
                    <h4 className="text-sm font-medium text-blue-900 mb-2">
                      Requisitos da senha:
                    </h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Mínimo de 8 caracteres</li>
                      <li>• Pelo menos uma letra maiúscula</li>
                      <li>• Pelo menos um número</li>
                      <li>• Pelo menos um caractere especial</li>
                    </ul>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={
                      isLoading ||
                      passwordData.newPassword !== passwordData.confirmPassword
                    }
                    className="min-w-[140px]"
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        <span>Alterando...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Lock className="h-4 w-4" />
                        <span>Alterar Senha</span>
                      </div>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Building2 className="h-5 w-5" />
                <CardTitle>Informações básicas da Empresa</CardTitle>
              </div>
              <CardDescription>
                Atualize os dados básicos da sua empresa
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCompanySubmit} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="cnpj">CNPJ</Label>
                    <Input
                      id="cnpj"
                      value={companyData.cnpj}
                      onChange={handleCNPJChange}
                      placeholder="00.000.000/0000-00"
                      maxLength={18}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome da Empresa</Label>
                    <Input
                      id="name"
                      value={companyData.name}
                      onChange={(e) =>
                        setCompanyData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      placeholder="Digite o nome da empresa"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="min-w-[120px]"
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Salvando...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Save className="h-4 w-4" />
                        <span>Salvar</span>
                      </div>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <CardTitle>Endereço da empresa</CardTitle>
              </div>
              <CardDescription>
                Informações de localização da empresa
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCompanySubmit} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="space-y-2">
                    <Label htmlFor="zipcode">CEP</Label>
                    <div className="relative">
                      <Input
                        id="zipcode"
                        value={companyData.zipcode}
                        onChange={handleZipCodeChange}
                        placeholder="00000-000"
                        maxLength={9}
                      />
                      {isLoadingCep && (
                        <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-gray-400" />
                      )}
                    </div>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="street">Logradouro</Label>
                    <Input
                      id="street"
                      value={companyData.street}
                      onChange={(e) =>
                        setCompanyData((prev) => ({
                          ...prev,
                          street: e.target.value,
                        }))
                      }
                      placeholder="Rua, Avenida, etc."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="number">Número</Label>
                    <Input
                      id="number"
                      value={companyData.number}
                      onChange={(e) =>
                        setCompanyData((prev) => ({
                          ...prev,
                          number: e.target.value,
                        }))
                      }
                      placeholder="123"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="district">Bairro</Label>
                    <Input
                      id="district"
                      value={companyData.district}
                      onChange={(e) =>
                        setCompanyData((prev) => ({
                          ...prev,
                          district: e.target.value,
                        }))
                      }
                      placeholder="Digite o bairro"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">Cidade</Label>
                    <Input
                      id="city"
                      value={companyData.city}
                      onChange={(e) =>
                        setCompanyData((prev) => ({
                          ...prev,
                          city: e.target.value,
                        }))
                      }
                      placeholder="Digite a cidade"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="state">Estado</Label>
                    <Input
                      id="state"
                      value={companyData.state}
                      onChange={(e) =>
                        setCompanyData((prev) => ({
                          ...prev,
                          state: e.target.value,
                        }))
                      }
                      placeholder="Digite o estado"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">País</Label>
                    <Input
                      id="country"
                      value={companyData.country}
                      onChange={(e) =>
                        setCompanyData((prev) => ({
                          ...prev,
                          country: e.target.value,
                        }))
                      }
                      placeholder="Digite o país"
                    />
                  </div>
                </div>

                <div className="rounded-lg bg-blue-50 p-4">
                  <h4 className="text-sm font-medium text-blue-900 mb-2">
                    💡 Dica:
                  </h4>
                  <p className="text-sm text-blue-800">
                    Digite o CEP para preencher automaticamente os campos de
                    endereço
                  </p>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="min-w-[120px]"
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Salvando...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Save className="h-4 w-4" />
                        <span>Salvar</span>
                      </div>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <CardTitle>Excluir minha conta</CardTitle>
              </div>
              <div className="rounded-lg bg-red-50 p-4">
                <h4 className="text-sm font-medium text-red-900 mb-2">
                  Atenção:
                </h4>
                <ul className="text-sm text-red-800 space-y-1">
                  <li>
                    • Após deletar sua conta você irá perder todas as suas
                    configurações
                  </li>
                  <li>
                    • Após deletar sua conta não será possível recuperar nenhum
                    dado
                  </li>
                </ul>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleDeleteAccount} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="delete-password">Senha</Label>
                    <div className="relative">
                      <Input
                        id="delete-password"
                        type={showDeletePassword ? "text" : "password"}
                        value={passwordDelete.password}
                        onChange={(e) =>
                          setPasswordDelete((prev) => ({
                            ...prev,
                            password: e.target.value,
                          }))
                        }
                        placeholder="Digite sua senha"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() =>
                          setShowDeletePassword(!showDeletePassword)
                        }
                      >
                        {showDeletePassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="delete-confirm-password">
                      Confirmar senha
                    </Label>
                    <div className="relative">
                      <Input
                        id="delete-confirm-password"
                        type={showDeletePasswordConfirm ? "text" : "password"}
                        value={passwordDelete.confirmPassword}
                        onChange={(e) =>
                          setPasswordDelete((prev) => ({
                            ...prev,
                            confirmPassword: e.target.value,
                          }))
                        }
                        placeholder="Confirme sua senha"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() =>
                          setShowDeletePasswordConfirm(
                            !showDeletePasswordConfirm
                          )
                        }
                      >
                        {showDeletePasswordConfirm ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                {passwordDelete.password &&
                  passwordDelete.confirmPassword &&
                  passwordDelete.password !==
                    passwordDelete.confirmPassword && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        As senhas não coincidem. Verifique e tente novamente.
                      </AlertDescription>
                    </Alert>
                  )}

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={
                      isLoading ||
                      passwordDelete.password !== passwordDelete.confirmPassword
                    }
                    className="min-w-[120px]"
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        <span>Salvando...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Save className="h-4 w-4" />
                        <span>Excluir conta</span>
                      </div>
                    )}
                  </Button>
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
