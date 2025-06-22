'use client'
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation";

// app/dashboard/page.tsx
export default function DashboardPage() {
  const router = useRouter()
  const handleTest = ()=>{
    router.push('/dashboard/subscription')
  }

  return (
    <>
      <Button type="button" 
        className="w-full"
        onClick={handleTest}>
        Entrar
      </Button>
    </>
  );
}
