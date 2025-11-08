import { GraphQLClient } from "graphql-request";

const GRAPHQL_ENDPOINT =
  import.meta.env.VITE_GRAPHQL_ENDPOINT || "http://localhost:13000/graphql";

const SESSION_TOKEN_KEY = "session_token";

export const graphqlClient = new GraphQLClient(GRAPHQL_ENDPOINT, {
  headers: {
    "Content-Type": "application/json",
  },
});

export function setSessionToken(token: string): void {
  localStorage.setItem(SESSION_TOKEN_KEY, token);
}

export function getSessionToken(): string | null {
  return localStorage.getItem(SESSION_TOKEN_KEY);
}

export function clearSessionToken(): void {
  localStorage.removeItem(SESSION_TOKEN_KEY);
}

export function graphqlClientSecure(token: string): GraphQLClient {
  return new GraphQLClient(GRAPHQL_ENDPOINT, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}
