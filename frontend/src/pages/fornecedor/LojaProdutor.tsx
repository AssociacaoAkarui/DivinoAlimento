import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { ResponsiveLayout } from "@/components/layout/ResponsiveLayout";
import {
  ArrowLeft,
  ShoppingBag,
  Truck,
  UserCircle,
  Package,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { UserMenuLarge } from "@/components/layout/UserMenuLarge";
import { useAuth } from "@/contexts/AuthContext";
import { roleLabel } from "@/utils/labels";
import leafTitleIcon from "@/assets/leaf-title-icon.png";

const LojaProdutor = () => {
  const navigate = useNavigate();
  const { activeRole, user } = useAuth();

  const roleText = activeRole ? roleLabel(activeRole, user?.gender) : "";
  const pageTitle = `Painel ${roleText}`;

  useEffect(() => {
    if (pageTitle) {
      document.title = `${pageTitle} | Divino Alimento`;
    }
  }, [pageTitle]);

  const acoesLoja = [
    {
      title: "Ofertar Alimento",
      description:
        "Publique e edite seus alimentos nos ciclos ativos, dentro do período de oferta.",
      icon: ShoppingBag,
      route: "/fornecedor/selecionar-ciclo",
      enabled: true,
    },
    {
      title: "Relatório de Entregas",
      description:
        "Veja os pedidos e locais de entrega dos alimentos desse ciclo.",
      icon: Truck,
      route: "/fornecedor/selecionar-ciclo-entregas",
      enabled: true,
    },
  ];

  const acoesAdministracao = [
    {
      title: "Dados Pessoais",
      description: "Atualize suas informações de perfil e contato.",
      icon: UserCircle,
      route: "/usuario/1",
      enabled: true,
    },
  ];

  return (
    <ResponsiveLayout
      leftHeaderContent={
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/dashboard")}
          className="text-white hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      }
      headerContent={<UserMenuLarge />}
    >
      <div className="container max-w-7xl mx-auto py-6 px-4 space-y-8 pt-8">
        {/* Header */}
        <div className="text-center relative mb-8">
          <img
            src={leafTitleIcon}
            alt=""
            className="absolute left-1/2 -translate-x-[175px] md:-translate-x-[270px] top-1/2 -translate-y-[90%] w-10 h-10 md:w-16 md:h-16"
          />
          <h1 className="text-xl md:text-[28px] font-bold text-primary">
            Agricultoras e agricultores
          </h1>
        </div>

        {/* Loja */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary" />
            Loja
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {acoesLoja.map((acao, index) => (
              <Card
                key={index}
                className="shadow-sm transition-all duration-200 hover:shadow-md cursor-pointer hover:scale-[1.02]"
                onClick={() => navigate(acao.route)}
              >
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <acao.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{acao.title}</CardTitle>
                      <CardDescription className="mt-2">
                        {acao.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* Administração */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            Administração
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {acoesAdministracao.map((acao, index) => (
              <Card
                key={index}
                className="shadow-sm transition-all duration-200 hover:shadow-md cursor-pointer hover:scale-[1.02]"
                onClick={() => navigate(acao.route)}
              >
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <acao.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{acao.title}</CardTitle>
                      <CardDescription className="mt-2">
                        {acao.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default LojaProdutor;
