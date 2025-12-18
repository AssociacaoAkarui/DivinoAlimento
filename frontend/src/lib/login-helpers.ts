export type UserRole = "consumidor" | "fornecedor" | "admin" | "adminmercado";

export function mapPerfilToRole(perfil: string): UserRole {
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
}

export function getDefaultRoute(role: UserRole): string {
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
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPassword(password: string): boolean {
  return password.length >= 6;
}

export function validateLoginCredentials(email: string, password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!email) {
    errors.push("Email é obrigatório");
  } else if (!isValidEmail(email)) {
    errors.push("Email inválido");
  }

  if (!password) {
    errors.push("Senha é obrigatória");
  } else if (!isValidPassword(password)) {
    errors.push("Senha deve ter no mínimo 6 caracteres");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function extractNameFromEmail(email: string): string {
  return email.split("@")[0];
}

export function isAuthenticated(): boolean {
  const token = localStorage.getItem("session_token");
  return token !== null && token !== "";
}

export function hasRole(userRoles: UserRole[], requiredRole: UserRole): boolean {
  return userRoles.includes(requiredRole);
}

export function hasAnyRole(
  userRoles: UserRole[],
  requiredRoles: UserRole[]
): boolean {
  return requiredRoles.some((role) => userRoles.includes(role));
}

export function isAdmin(userRoles: UserRole[]): boolean {
  return hasRole(userRoles, "admin");
}

export function isAdminMercado(userRoles: UserRole[]): boolean {
  return hasRole(userRoles, "adminmercado");
}

export function hasAdminPermissions(userRoles: UserRole[]): boolean {
  return hasAnyRole(userRoles, ["admin", "adminmercado"]);
}
