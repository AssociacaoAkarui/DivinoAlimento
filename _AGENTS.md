# Work Log

## Padrão de Commits

Usar **Conventional Commits** com formato: `tipo(escopo): descrição`

**Tipos:**
- `feat`: nova funcionalidade
- `fix`: correção de bug
- `test`: adicionar/modificar testes
- `refactor`: refatoração de código
- `chore`: tarefas gerais (configuração, dependências)
- `docs`: documentação

**Escopos:**
- `backend`: código do backend
- `frontend`: código do frontend
- `db`: banco de dados/migrações
- `deploy`: deploy/infraestrutura
- `tests`: testes

**Exemplo:**
```
feat(backend): implementar validação de perfil admin

- Adicionar import do modelo Usuario
- Implementar função requiredAdmin verificando perfis do usuário
```

---

## 2025-11-08 - Frontend AuthContext Integration with GraphQL
**Computer:** parco
**Branch:** feature/graphql-client-cors

### Frontend
- Corrigir graphql-client.ts (frontend/src/lib/graphql-client.ts)
  - Adicionar import do GraphQLClient do graphql-request
  - Funções já existentes: setSessionToken, getSessionToken, clearSessionToken
- Atualizar hooks GraphQL (frontend/src/hooks/graphql.ts)
  - Adicionar import de getSessionToken
  - Refatorar useSystemInformation para usar getSessionToken() em vez de query cache
  - Corrigir tipagem de retorno da mutation sessionLogin
  - Adicionar tratamento de erro quando token não existe
- Configurar React Query no main.tsx
  - Adicionar QueryClientProvider com configuração padrão
  - Ordem de providers: QueryClientProvider > AuthProvider > ConsumerProvider
  - Desabilitar refetchOnWindowFocus e configurar retry: 1
- AuthContext já integrado com GraphQL
  - ✅ Login usando mutation GraphQL (useLoginUsuario)
  - ✅ Mapeamento de perfis: admin, fornecedor, consumidor
  - ✅ Persistência de token com setSessionToken()
  - ✅ Logout limpa token com clearSessionToken()

### Commits
1. feat(frontend): corrigir integração GraphQL com AuthContext

---

## 2025-11-08 - GraphQL Client + CORS + Testing Infrastructure
**Computer:** parco
**Estimated Time:** 3-4 horas
**Branch:** feature/graphql-client-cors

### Backend
- Configurar CORS no servidor GraphQL (app/src/server.js)
  - Adicionar dependência cors@^2.8.5
  - Habilitar CORS para requisições do frontend
  - Configurar headers de Authorization e métodos HTTP

### Frontend
- Criar biblioteca cliente GraphQL (frontend/src/lib/graphql-client.ts)
  - Cliente não autenticado (graphqlClient)
  - Cliente autenticado (graphqlClientSecure)
  - Funções de gestão de token: setSessionToken, getSessionToken, clearSessionToken
  - Endpoint configurado para http://localhost:13000/graphql
- Criar utilitário cn() para Tailwind (frontend/src/lib/utils.ts)
- Atualizar .gitignore para permitir frontend/src/lib

### Database
- Corrigir constraint de ofertaProdutoId para CASCADE
  - Remover migration duplicada 20251023000000-add-ofertaProdutoId-to-composicao.js
  - Criar migration 20251108190000-alter-composicao-ofertaProdutoId-cascade.js
  - Alterar ON DELETE de SET NULL para CASCADE

### Testing Infrastructure
- Adicionar suporte para testes unitários (app/package.json)
  - Comando test:unit para Mocha
  - Comando test:all para executar unit + cucumber
- Reorganizar comandos de teste no Rakefile
  - rake testes:unit - Testes unitários (Mocha)
  - rake testes:bdd - Testes BDD (Cucumber) excluindo @pending
  - rake testes:all - Unit + BDD com resumo
  - rake testes:bdd_with_pending - Cucumber incluindo @pending
  - rake testes:pending - Apenas cenários @pending
  - Corrigir sintaxe de flags --tags para Cucumber
  - Remover comando redundante testes:test

### Admin Authorization + SQLite Test Support
- Implementar validação de perfil admin (app/src/api-graphql.js)
  - Adicionar import do modelo Usuario
  - Função requiredAdmin verifica se usuário possui perfil admin
  - Usado em systemInformation query
- Suporte para ARRAY em SQLite (app/models/usuario.js)
  - SQLite: usar DataTypes.TEXT com JSON.stringify/parse
  - PostgreSQL: usar DataTypes.ARRAY nativo
  - Getters/setters customizados por dialeto
- Testes unitários (app/test/graphql.test.js)
  - Configurar NODE_ENV=test no package.json
  - Teste: admin pode acessar systemInformation
  - Teste: não-admin recebe erro "Admin required"
  - Teste: não autenticado recebe erro "Unauthorized"
  - Corrigir comparação de arrays com deep.equal

### Commits
1. 8e296ba - Configurar CORS no servidor GraphQL
2. 30c7d7a - Adicionar biblioteca cliente GraphQL
3. 05e83f3 - Atualizar .gitignore para permitir frontend/src/lib
4. 26a4d00 - Corrigir constraint de ofertaProdutoId para CASCADE
5. d0a2621 - Adicionar suporte para testes unitários no Rake e npm
6. cf65f41 - Reorganizar comandos de teste no Rakefile e corrigir sintaxe --tags
7. af871e9 - feat(backend): implementar validação de perfil admin
8. d3c12c4 - test(backend): adicionar testes para validação admin e suporte SQLite
