import { UserRole } from "./login-helpers";

export function formatRole(role: UserRole): string {
  switch (role) {
    case "admin":
      return "Administrador";
    case "adminmercado":
      return "Administrador de Mercado";
    case "fornecedor":
      return "Fornecedor";
    case "consumidor":
      return "Consumidor";
    default:
      return role;
  }
}

export function formatRoles(roles: UserRole[]): string[] {
  return roles.map(formatRole);
}

export function formatRolesDisplay(roles: UserRole[]): string {
  return formatRoles(roles).join(", ");
}

export function getRoleBadgeColor(
  role: UserRole
): "red" | "orange" | "blue" | "green" | "gray" {
  switch (role) {
    case "admin":
      return "red";
    case "adminmercado":
      return "orange";
    case "fornecedor":
      return "blue";
    case "consumidor":
      return "green";
    default:
      return "gray";
  }
}

export function formatLoginError(error: unknown): string {
  if (error instanceof Error) {
    if (error.message.includes("User not found")) {
      return "Usuário não encontrado ou inativo";
    }
    if (error.message.includes("Unauthorized")) {
      return "Credenciais inválidas";
    }
    if (error.message.includes("Network")) {
      return "Erro de conexão. Verifique sua internet.";
    }
    return error.message;
  }
  return "Erro ao fazer login. Tente novamente.";
}

export function getWelcomeMessage(name: string, role: UserRole): string {
  const greeting = getGreetingByTime();
  const roleFormatted = formatRole(role);
  return `${greeting}, ${name}! (${roleFormatted})`;
}

export function getGreetingByTime(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}
