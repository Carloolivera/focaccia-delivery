"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Lock } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Email o contraseña incorrectos");
      setLoading(false);
    } else {
      router.push("/admin");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[var(--focaccia-dark)] to-[#1a1208] p-4">
      <Card className="w-full max-w-sm shadow-2xl border-0">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-3">
            <div className="w-16 h-16 bg-gradient-to-br from-[var(--focaccia-orange)] to-[#e06b10] rounded-2xl flex items-center justify-center shadow-lg">
              <Lock className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-xl font-bold text-[var(--focaccia-dark)]">
            Panel Admin
          </h1>
          <p className="text-sm text-muted-foreground">
            Focaccia Pizzería
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@focaccia.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 rounded-lg p-3 text-center">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--focaccia-orange)] hover:bg-[#e06b10] text-white font-semibold py-5"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Ingresando...
                </>
              ) : (
                "Ingresar"
              )}
            </Button>
          </form>

          <p className="text-[10px] text-center text-muted-foreground mt-6">
            Acceso exclusivo para administradores
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
