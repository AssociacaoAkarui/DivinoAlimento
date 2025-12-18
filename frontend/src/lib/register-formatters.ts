import type { UserRole, Gender } from "@/contexts/AuthContext";

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

export function formatGender(gender: Gender): string {
  switch (gender) {
    case "male":
      return "Masculino";
    case "female":
      return "Feminino";
    case "nonbinary":
      return "Não binário";
    case "unspecified":
      return "Prefiro não informar";
    default:
      return gender;
  }
}

export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  }
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  }
  return phone;
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

export function formatRegistrationError(error: unknown): string {
  if (error instanceof Error) {
    if (error.message.includes("email")) {
      return "Este e-mail já está cadastrado";
    }
    if (error.message.includes("Network")) {
      return "Erro de conexão. Verifique sua internet.";
    }
    if (error.message.includes("GraphQL")) {
      return "Erro ao processar requisição. Tente novamente.";
    }
    return error.message;
  }
  return "Erro ao criar conta. Tente novamente.";
}

export function getSuccessMessage(name: string): string {
  return `Bem-vindo(a), ${name}! Sua conta foi criada com sucesso.`;
}

export function getProfileSelectionMessage(count: number): string {
  if (count === 0) return "Nenhum perfil selecionado";
  if (count === 1) return "1 perfil selecionado";
  return `${count} perfis selecionados`;
}

export function formatValidationErrors(errors: string[]): string {
  if (errors.length === 0) return "";
  if (errors.length === 1) return errors[0];
  return `${errors.length} erros encontrados: ${errors.join(", ")}`;
}
