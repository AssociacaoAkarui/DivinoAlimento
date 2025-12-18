import React, {
  createContext,
  /* eslint-disable react-refresh/only-export-components */
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useLoginUsuario, useCriarUsuario } from "@/hooks/graphql";
import { setSessionToken, clearSessionToken } from "@/lib/graphql-client";

export type UserRole = "consumidor" | "fornecedor" | "admin" | "adminmercado";
export type Gender = "male" | "female" | "nonbinary" | "unspecified";

interface User {
  id: string;
  email: string;
  name: string;
  roles: UserRole[];
  defaultRole: UserRole;
  gender?: Gender;
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
    gender?: Gender,
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

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const loginMutation = useLoginUsuario();
  const criarUsuarioMutation = useCriarUsuario();
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
    gender: Gender = "unspecified",
  ) => {
    const mapRoleToPerfil = (role: UserRole): string => {
      switch (role) {
        case "admin":
          return "admin";
        case "adminmercado":
          return "adminmercado";
        case "fornecedor":
          return "fornecedor";
        case "consumidor":
          return "consumidor";
      }
    };

    const perfis = roles.map(mapRoleToPerfil);

    await criarUsuarioMutation.mutateAsync({
      input: {
        nome: name,
        email,
        senha: password,
        perfis,
        status: "ativo",
      },
    });

    await login(email, password);
  };

  const login = async (email: string, password: string) => {
    const response = await loginMutation.mutateAsync({
      input: {
        email,
        senha: password,
      },
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
      gender: "unspecified",
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
