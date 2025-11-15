/* eslint-disable react-refresh/only-export-components */
import React, { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { roleLabel } from "@/utils/labels";
import { cn } from "@/lib/utils";

interface RoleTitleProps {
  page?: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  updateDocumentTitle?: boolean;
}

export const RoleTitle: React.FC<RoleTitleProps> = ({
  page,
  className,
  as: Tag = "h1",
  updateDocumentTitle = true,
}) => {
  const { activeRole, user } = useAuth();

  const roleText = activeRole ? roleLabel(activeRole, user?.gender) : "";
  const title = page ? `${roleText} – ${page}` : roleText;

  useEffect(() => {
    if (updateDocumentTitle && title) {
      document.title = `${title} | Divino Alimento`;
    }
  }, [title, updateDocumentTitle]);

  if (!activeRole) return null;

  return (
    <Tag
      className={cn(
        "text-2xl lg:text-3xl font-bold text-gradient-primary",
        className,
      )}
    >
      {title}
    </Tag>
  );
};

export const useRoleTitle = (page?: string): string => {
  const { activeRole, user } = useAuth();

  if (!activeRole) return page || "";

  const roleText = roleLabel(activeRole, user?.gender);
  return page ? `${roleText} – ${page}` : roleText;
};
