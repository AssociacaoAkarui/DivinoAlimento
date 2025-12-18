import type { UserRole, Gender } from "@/contexts/AuthContext";

export interface RegisterFormData {
  name: string;
  phone: string;
  gender: Gender;
  email: string;
  confirmEmail: string;
  password: string;
  confirmPassword: string;
  profiles: {
    consumidor: boolean;
    fornecedor: boolean;
    adminGeral: boolean;
    adminMercado: boolean;
  };
}

export function mapRoleToPerfil(role: UserRole): string {
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
}

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

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPassword(password: string): boolean {
  return password.length >= 6;
}

export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
  return phoneRegex.test(phone);
}

export function hasAnyProfile(profiles: RegisterFormData["profiles"]): boolean {
  return Object.values(profiles).some(Boolean);
}

export function getSelectedRoles(profiles: RegisterFormData["profiles"]): UserRole[] {
  const roles: UserRole[] = [];
  if (profiles.consumidor) roles.push("consumidor");
  if (profiles.fornecedor) roles.push("fornecedor");
  if (profiles.adminGeral) roles.push("admin");
  if (profiles.adminMercado) roles.push("adminmercado");
  return roles;
}

export function getSelectedPerfis(profiles: RegisterFormData["profiles"]): string[] {
  return getSelectedRoles(profiles).map(mapRoleToPerfil);
}

export function validateRegistrationForm(data: RegisterFormData): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!data.name.trim()) {
    errors.push("Nome é obrigatório");
  }

  if (!data.phone.trim()) {
    errors.push("Celular é obrigatório");
  } else if (!isValidPhone(data.phone)) {
    errors.push("Celular inválido");
  }

  if (!data.gender) {
    errors.push("Selecione seu gênero");
  }

  if (!data.email.trim()) {
    errors.push("E-mail é obrigatório");
  } else if (!isValidEmail(data.email)) {
    errors.push("E-mail inválido");
  }

  if (!data.confirmEmail.trim()) {
    errors.push("Confirmação de e-mail é obrigatória");
  } else if (data.email !== data.confirmEmail) {
    errors.push("E-mails não coincidem");
  }

  if (!data.password.trim()) {
    errors.push("Senha é obrigatória");
  } else if (!isValidPassword(data.password)) {
    errors.push("Senha deve ter pelo menos 6 caracteres");
  }

  if (!data.confirmPassword.trim()) {
    errors.push("Confirmação de senha é obrigatória");
  } else if (data.password !== data.confirmPassword) {
    errors.push("Senhas não coincidem");
  }

  if (!hasAnyProfile(data.profiles)) {
    errors.push("Selecione pelo menos um perfil");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function extractNameFromEmail(email: string): string {
  return email.split("@")[0];
}

export function getDefaultRole(roles: UserRole[]): UserRole {
  return roles[0] || "consumidor";
}

export function formatPhoneForBackend(phone: string): string {
  return phone.replace(/\D/g, "");
}
