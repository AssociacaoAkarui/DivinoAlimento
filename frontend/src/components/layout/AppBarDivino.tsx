import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface AppBarDivinoProps {
  children?: React.ReactNode;
  leftContent?: React.ReactNode;
  className?: string;
  showLoginButton?: boolean;
}

export const AppBarDivino = ({
  children,
  leftContent,
  className,
  showLoginButton = false,
}: AppBarDivinoProps) => {
  const [hasScrolled, setHasScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { activeRole } = useAuth();

  const handleLogoClick = () => {
    // Usa o perfil ativo para determinar para onde navegar
    switch (activeRole) {
      case "consumidor":
        navigate("/dashboard");
        break;
      case "fornecedor":
        navigate("/fornecedor/loja");
        break;
      case "adminmercado":
        navigate("/adminmercado/dashboard");
        break;
      case "admin":
        navigate("/admin/dashboard");
        break;
      default:
        navigate("/");
    }
  };

  const handleVoltar = () => {
    // Redirecionar baseado no perfil ativo
    switch (activeRole) {
      case "consumidor":
        navigate("/dashboard");
        break;
      case "fornecedor":
        navigate("/fornecedor/loja");
        break;
      case "adminmercado":
        navigate("/adminmercado/dashboard");
        break;
      case "admin":
        navigate("/admin/dashboard");
        break;
      default:
        navigate("/dashboard");
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isLoginRoute =
    location.pathname.includes("/login") ||
    location.pathname.includes("/register") ||
    location.pathname.includes("/verify-email") ||
    location.pathname.includes("/onboarding");

  if (!isLoginRoute) {
    return (
      <>
        {/* Faixa branca superior - EXATAMENTE igual à home */}
        <div className="h-12 lg:h-16 bg-white" />

        {/* Header laranja com logo sobreposto - EXATAMENTE igual à home */}
        <header
          className="relative h-20 lg:h-28 bg-[#F29B2C] flex items-center justify-center"
          style={{
            width: "100vw",
            marginLeft: "calc(-50vw + 50%)",
          }}
        >
          {/* Logo circular sobreposto - mesma posição, tamanho e sombra da home */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-10 lg:mt-14 z-20">
            <button
              onClick={handleLogoClick}
              className="hover:opacity-90 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-full"
              style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.15))" }}
              aria-label="Voltar para o início"
            >
              <img
                src="/assets/logo-divino-circular.png"
                alt="Divino Alimento"
                className="w-[120px] h-[120px] sm:w-[160px] sm:h-[160px] lg:w-[200px] lg:h-[200px] object-contain"
                decoding="async"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </button>
          </div>

          {/* Botão de voltar - canto superior esquerdo */}
          {leftContent ? (
            <div className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-10">
              {leftContent}
            </div>
          ) : (
            location.pathname !== "/dashboard" &&
            !location.pathname.startsWith("/fornecedor/loja") && (
              <button
                onClick={handleVoltar}
                className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-10 text-white hover:opacity-80 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 rounded-full p-2"
                aria-label="Voltar"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
            )
          )}

          {/* Avatar do usuário - centralizado verticalmente na faixa laranja */}
          {children && (
            <div className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-30 touch-target">
              {children}
            </div>
          )}
        </header>
      </>
    );
  }

  return null;
};

export default AppBarDivino;
