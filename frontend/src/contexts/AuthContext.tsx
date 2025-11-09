import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useNavigate } from "react-router-dom";

import { useLoginUsuario } from "@/hooks/graphql";
import { setSessionToken, clearSessionToken } from "@/lib/graphql-client";

export type UserRole = "consumidor" | "fornecedor" | "admin" | "adminmercado";

interface User {
  id: string;
  email: string;
  name: string;
  roles: UserRole[];
  defaultRole: UserRole;
  photoURL?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  activeRole: UserRole | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  register: (
    email: string,
    password: string,
    name: string,
    roles: UserRole[],
  ) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Função para obter a rota padrão de cada perfil
const getDefaultRoute = (role: UserRole): string => {
  switch (role) {
    case "consumidor":
      return "/dashboard";
    case "fornecedor":
      return "/fornecedor/loja";
    case "admin":
      return "/admin/dashboard";
    case "adminmercado":
      return "/adminmercado/dashboard";
  }
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const loginMutation = useLoginUsuario();

  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("da.user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [activeRole, setActiveRole] = useState<UserRole | null>(() => {
    const stored = localStorage.getItem("da.activeRole");
    return stored ? (stored as UserRole) : null;
  });

  // Sincronizar activeRole com defaultRole do usuário se não estiver definido
  useEffect(() => {
    if (user && !activeRole) {
      setActiveRole(user.defaultRole);
      localStorage.setItem("da.activeRole", user.defaultRole);
    }
  }, [user, activeRole]);

  const register = async (
    email: string,
    password: string,
    name: string,
    roles: UserRole[],
  ) => {
    // Definir defaultRole como o primeiro role selecionado
    const defaultRole = roles[0];

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
      roles,
      defaultRole,
    };

    setUser(newUser);
    setActiveRole(defaultRole);
    localStorage.setItem("da.user", JSON.stringify(newUser));
    localStorage.setItem("da.activeRole", defaultRole);
  };

  const login = async (email: string, password: string) => {
    const response = await loginMutation.mutateAsync({
      email,
      senha: password,
    });

    const { sessionLogin } = response;

    const mapPerfilToRole = (perfil: string): UserRole => {
      switch (perfil) {
        case "admin":
          return "admin";
        case "adminmercado":
          return "adminmercado";
        case "fornecedor":
          return "fornecedor";
        case "consumidor":
          return "consumidor";
        default:
          return "consumidor";
      }
    };

    const roles = sessionLogin.perfis.map(mapPerfilToRole);
    const defaultRole = roles[0];

    const newUser: User = {
      id: sessionLogin.usuarioId,
      email,
      name: email.split("@")[0],
      roles,
      defaultRole,
    };

    setSessionToken(sessionLogin.token);

    setUser(newUser);
    setActiveRole(defaultRole);
    localStorage.setItem("da.user", JSON.stringify(newUser));
    localStorage.setItem("da.activeRole", defaultRole);
  };

  const logout = () => {
    clearSessionToken();
    setUser(null);
    setActiveRole(null);
    localStorage.removeItem("da.user");
    localStorage.removeItem("da.activeRole");
    localStorage.removeItem("da.consumerType");
  };

  const switchRole = (role: UserRole) => {
    if (user && user.roles.includes(role)) {
      setActiveRole(role);
      localStorage.setItem("da.activeRole", role);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        activeRole,
        login,
        logout,
        switchRole,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
