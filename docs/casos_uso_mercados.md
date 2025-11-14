# Casos de Uso Atualizados - (pós apontamento melhorias equipe Akarui)

## Visão Geral do Sistema
Sistema web para gestão de grupos de compras coletivas com suporte a múltiplos mercados (Cestas, PNAE e Venda Direta), facilitando a organização de ciclos de compras entre fornecedores e consumidores através de autenticação OAuth.

---

## ALTERAÇÕES PRINCIPAIS DO SISTEMA

### Novos Conceitos:
- **MERCADOS**: Substituem e expandem o conceito de CESTAS
- **PRODUTOS COMERCIALIZÁVEIS**: Separação entre produto base e suas variações comerciais
- **ADMINISTRADOR DE MERCADO**: Novo perfil de usuário
- **MÓDULOS ESPECIALIZADOS**: Cesta, Lote e Venda Direta

<br><br>
# CASOS DE USO FINALIZADOS
<br>

## 1. GESTÃO DE USUÁRIOS

| **UC001** | **Autenticar Usuário via OAuth** |
|-----------|----------------------------------|
| **Ator Principal** | Usuário (qualquer perfil) |
| **Pré-condições** | Usuário possui conta Google válida, sistema disponível |
| **Fluxo Normal** | 1. Usuário acessa o sistema<br>2. Clica em "Login"<br>3. Sistema redireciona para autenticação OAuth (Google)<br>4. Usuário fornece credenciais Google<br>5. Sistema recebe token de autenticação<br>6. Sistema verifica se usuário está cadastrado<br>7. Sistema cria sessão do usuário<br>8. Redireciona para área restrita conforme perfil |
| **Fluxos Alternativos** | **FA1 - Usuário não cadastrado:**<br>6a. Sistema identifica email não cadastrado<br>6b. Redireciona para UC002 (Cadastrar Novo Usuário)<br><br>**FA2 - Falha na autenticação:**<br>4a. OAuth retorna erro<br>4b. Sistema exibe mensagem de erro |
| **Pós-condições** | Usuário autenticado com sessão ativa |
| **Rotas/Telas** | `/` (página inicial)<br>`/login` (tela de login)|
| **Protótipo Tela** | Tela UC001 |
| **Ajustes** | 1. O protótipo mostra campo "e-mail", "campo senha" e botão Entrar", que não existirão se continuarmos com login via google. |

<br>

| **UC002** | **Cadastrar Novo Usuário** |
|-----------|---------------------------|---|
| **Ator Principal** | Usuário não cadastrado |
| **Pré-condições** | Usuário autenticado via OAuth mas não cadastrado no sistema |
| **Fluxo Normal** | 1. Sistema detecta usuário não cadastrado<br>2. Exibe formulário com dados do OAuth preenchidos (e-mail)<br>3. Usuário preenche dados complementares (nome completo, celular)<br>4. **[NOVO]** Define perfil de acesso (consumidor/fornecedor)<br>5. Sistema valida dados<br>6. Sistema cria usuário<br>7. Usuário é redirecionado para área restrita |
| **Fluxos Alternativos** | **FA1 - Dados inválidos:**<br>5a. Sistema apresenta erros de validação<br>5b. Usuário corrige dados e resubmete<br><br>**FA2 - Primeiro usuário do sistema:**<br>4a. Se primeiro usuário do sistema, aparece o perfil administrador selecionado e obrigatório (não editável)|
| **Pós-condições** | Usuário cadastrado e autenticado no sistema |
| **Rotas/Telas** | `/` (página inicial)<br>`/login` (tela de login)<br>`/usuarionovo` (cadastro novo usuário)|
| **Protótipo Tela** | Tela UC002 |
| **Ajustes** | 1. O protótipo mostra campo "telefone", deve ser alterado para "celular"<br><br>2. Na configuração de perfil não existe os campos de mercado: selecione um mercado (consumidor), mercados prioritários (fornecedor), e mercados para administrar (administrador de mercado) |

<br>

| **UC003** | **Editar Dados Pessoais** |
|-----------|--------------------------|---|
| **Ator Principal** | Usuário Logado |
| **Pré-condições** | Usuário autenticado no sistema |
| **Fluxo Normal** | 1. Usuário acessa "Dados Pessoais"<br>2. Sistema exibe formulário com dados atuais<br>3. Usuário modifica campos desejados (nome, nome fantasia, celular, e-mail, banco, agência, conta, chave pix, aceite política privacidade)<br>4. Clica em "Salvar"<br>5. Sistema valida alterações<br>6. Sistema atualiza dados<br>8. Exibe mensagem de sucesso |
| **Fluxos Alternativos** | **FA1 - Dados inválidos:**<br>5a. Sistema apresenta erros de validação<br>5b. Usuário corrige e resubmete <br><br>**FA2 - Perfil Administrador:**<br>3a. Usuário pode alterar seu perfil de usuário (fornecedor, consumidor ou administrador de mercado) - **não pode alterar o seu perfil administrador, excluindo seu proprio acesso de admin** |
| **Pós-condições** | Dados do usuário atualizados |
| **Rotas/Telas** | `/cadastro` (cadastros gerais)<br>`/usuario/:id` (editar usuário)|
| **Protótipo Tela** | Tela UC003 |
| **Ajustes** | 1. O protótipo mostra a visão de administrador, ajustar para mostrar visão para não admins (fornecedor, consumidor e administrador de mercado) - fluxo padrão |

<br>

| **UC004** | **Gerenciar Usuários (Admin)** |
|-----------|-------------------------------|
| **Ator Principal** | Administrador |
| **Pré-condições** | Usuário com perfil administrador |
| **Fluxo Normal** | 1. Administrador acessa gestão de usuários <br> 2. Sistema exibe lista de usuários (nome, e-mail, status, perfis) <br> 3. Administrador seleciona usuário para edição <br> 4. Sistema exibe formulário com dados do usuário selecionado <br> 5. Administrador edita dados (nome, nome fantasia, celular, e-mail, banco, agência, conta, chave pix, aceite política privacidade, perfil, status) <br> 6. Salva alterações<br>7. Sistema atualiza registro |
| **Fluxos Alternativos** | **FA1 - Mudança de Status:** <br> 3a. Administrador altera o status de um usuário específico <br> 3b. Sistema atualiza status do usuário selecionado <br><br> **FA2 - Excluir Usuário:** <br> 3a. Administrador seleciona usuário para exclusão <br> 3b. Sistema apaga usuário se usuário não possui registros em tabelas do sistema |
| **Pós-condições** | Usuário atualizado conforme alterações |
| **Rotas/Telas** | `/cadastro` (cadastros gerais)<br>`/usuario/:id` (editar usuário)|
| **Protótipo Tela** | Tela UC004 |

---

## 2. GESTÃO DE MERCADOS (NOVO)

| **UC005** | **Cadastrar/Editar Mercados** |
|-----------|-------------------------------|---|
| **Ator Principal** | Administrador / Administrador de Mercado |
| **Pré-condições** | Usuário com perfil administrador ou administrador de mercado|
| **Fluxo Normal** | 1. Usuário acessa Painel Administrativo<br>2. Administrador acessa "Cadastro de Mercados"<br>3. Clica em "Novo Mercado" ou seleciona mercado existente<br>4. Define nome do mercado<br>5. **[NOVO]** Seleciona tipo de mercado (Cesta, Lote, Venda Direta)<br>6. **[NOVO]** Define administrador responsável pelo mercado<br>7. **[NOVO]** Define taxa administrativa (se aplicável)<br>8. **[NOVO]** Insere/edita/deleta pontos de entrega do mercado<br>9. Define status<br>10. Salva mercado<br>11. Sistema cria/atualiza registro |
| **Fluxos Alternativos** | **FA1 - Administrador de Mercado:**<br>6a. Não pode alterar administrador responsável que será atribuído a ele próprio<br><br>**FA2 - Tipo Cesta:**<br>5a. Se selecionar Tipo Cesta deve definir valor máximo por cesta<br><br>**FA3 - Apagar Mercado:**<br>3a. Seleciona ação "Excluir"<br>3b. Não existindo registros deste mercado em outras tabelas, sistema exclui mercado<br> |
| **Pós-condições** | Mercado criado/atualizado e disponível no sistema |
| **Rotas/Telas** | `/cesta` (criar novo mercado)<br>`/cesta/id` (editar mercado) - rotas serão alteradas para `/mercado`|
| **Ajustes** | 1. Tipo de mercado deve ser campo radio (cada mercado só pode ser um dos tipos: cesta, lote ou venda direta)<br><br> 2. Falta acrescentar campo adicional quando escolher TIPO CESTA, campo "valor máximo por cesta" |
| **Protótipo Tela** | Tela UC005 |

<br>

| **UC006** | **Gerenciar Preços por Mercado (NOVO)** |
|-----------|---------------------------------------|
| **Ator Principal** | Administrador ou Administrador de Mercado |
| **Pré-condições** | Mercados cadastrados, produtos comercializáveis definidos |
| **Fluxo Normal** | 1. Usuário acessa Painel administrativo <br> 2. Usuário acessa "Gestão Preço por Mercado"<br>3. Sistema lista todos os mercados <br> 4. Usuário seleciona mercado que deseja definir os preços<br>5. Sistema exibe produtos comercializáveis do mercado com nome, unidade, preço base e preço do mercado<br>6. Usuário seleciona produto para ajustar preço do mercado<br>7. Usuário altera preço específico para o mercado<br>8. Salva alteração<br>9. Sistema atualiza preços do mercado |
| **Fluxos Alternativos** | **FA1 - Administrador de Mercado:**<br>3a. Sistema lista apenas os mercados adiministrados pelo usuário atual |
| **Pós-condições** | Preços específicos do mercado atualizados |
| **Rotas/Telas** | **[NOVO]** `/precos/:id` (gestão de preços por mercado) |
| **Protótipo Tela** | Tela UC006 |

---

## 3. GESTÃO DE PRODUTOS (ATUALIZADO)

| **UC007** | **Cadastrar/Editar Categorias de Produtos** |
|-----------|---------------------------------------------|
| **Ator Principal** | Administrador |
| **Pré-condições** | Usuário com perfil administrador |
| **Fluxo Normal** | 1. Administrador acessa Painel Administrativo <br>2. Administrador seleciona opção Categorias de Produtos <br> 3. Sistema exibe lista de categorias com: nome e status <br> 4. Clica em "Adicionar Categoria" ou edita existente<br>4. acrescenta/edita o nome e status da categoria<br>5. Salva categoria<br>6. Sistema inclui/atualiza tabela de registros |
| **Fluxos Alternativos** | **FA1 - Apagar Categoria de Produtos:**<br>4a. Seleciona ação "Excluir"<br>4b. Não existindo registros desta categoria em outras tabelas, sistema exclui categoria<br>|
| **Pós-condições** | Nova categoria disponível no sistema |
| **Rotas/Telas** | `/cadastro` (cadastro geral)<br> `/categoria-index` (lista de categorias)<br>`/categoria` (criar categoria)<br>`/categoria/:id` (editar categoria) |
| **Ajustes** | 1. Verificar nomenclaturas, estamos com "Cadastro de Alimentos" e "Categoria de Produtos" - não é melhor padronizar. Como deve ficar? |
| **Protótipo Tela** | Tela UC007 |

<br>

| **UC008** | **Cadastrar/Editar Produto Base (ALTERADO)** |
|-----------|-----------------------------------------------|
| **Ator Principal** | Administrador |
| **Pré-condições** | Categorias de produtos cadastradas |
| **Fluxo Normal** | 1. Administrador acessa Painel Administrativo <br> 2. Administrador acessa Cadastro de Alimentos <br> 3. Sistema exibe lista de alimentos com: nome, categoria e status <br> 4. Clica em "Adicionar Alimento" ou edita existente <br> 5. adiciona/edita nome, categoria e descrição <br> 6. Sistema cria/edita produto base |
| **Fluxos Alternativos** | **FA1 - Apagar Alimento:**<br>4a. Seleciona ação "Excluir"<br>4b. Não existindo registros deste alimento em outras tabelas, sistema exclui alimento<br>|
| **Pós-condições** | Produto base disponível no sistema |
| **Rotas/Telas** | `/cadastro` (cadastro geral)<br> `/produto-index` (lista de produtos)<br>`/produto` (criar produto)<br>`/produto/:id` (editar produto)<br> |
| **Protótipo Tela** | Tela UC008 |

<br>

| **UC009** | **Cadastrar/Editar Produtos Comercializáveis (NOVO)** |
|-----------|-------------------------------------------------------|
| **Ator Principal** | Administrador |
| **Pré-condições** | Produtos base cadastrados |
| **Fluxo Normal** | 1. Administrador acessa Painel Administrativo <br> 2. Administrador acessa "Gestão de Preço e Peso de Alimentos"<br>3. Sistema exibe lista de produtos comercializáveis <br> 4. Clica em "Adicionar Produto Comercializável" ou edita existente. <br> 5. Seleciona produto base, edita unidade, peso, preço e status <br> 6. Salva produto comercializável<br>7. Sistema cria/edita produto comercializável |
| **Fluxos Alternativos** | **FA1 - Apagar Produto Comercializável:**<br>4a. Seleciona ação "Excluir"<br>4b. Não existindo registros deste produto comercializável em outras tabelas, sistema exclui produto<br>|
| **Pós-condições** | Produto comercializável criado e disponível no sistema |
| **Rotas/Telas** | `/cadastro` (cadastro geral)<br> **[NOVO]** `/produtos-comercializaveis-index` (lista de produtos)<br>**[NOVO]** `/produto-comercializavel` (criar produto comercializável)<br>**[NOVO]** `/produto-comercializavel/:id` (editar produto)<br>` |
| **Ajustes** | 1. Verificar nomenclaturas, estamos com "Cadastro de Alimentos",  "Gestão de Preço e Peso de Alimentos", "Acrescentar/Editar Produto Comercializável" - revisar para padronizar. Como deve ficar? |
| **Protótipo Tela** | Tela UC009 |

---

## 4. GESTÃO DE CICLOS (ATUALIZADO)

| **UC010** | **Criar/Editar Ciclo (ATUALIZADO)** |
|-----------|------------------------------|
| **Ator Principal** | Administrador ou Administrador de Mercado |
| **Pré-condições** | Produtos comercializáveis cadastrados, mercados cadastrados, pontos de entrega cadastrados |
| **Fluxo Normal** | 1. Usuário acessa Painel Administrativo <br> 2. Usuário acessa "Ciclos"<br>3. Clica em "Novo Ciclo" ou seleciona Ciclo para editar<br>4. Acrescenta/edita nome<br>5. **[ALTERADO]** Inclui mercados e acrescenta/edita dados por mercado<br>6. **[NOVO]** Define ordem de atendimento dos mercados<br>7. Define período de ofertas (início/fim)<br>8. **[ALTERADO]** Sistema não cria mercado de venda direta automaticamente <br> 9. Acrescenta/edita observação e status <br> 10. Salva ciclo<br>11. Sistema cria/edita ciclo |
| **Fluxos Alternativos** | **FA1 - Usuário administrador:**<br>4a. Acrescenta/edita administrador de mercado <br><br>**FA2 - Mercado Tipo Cesta:**<br>5a. Cadastra quantidade de cestas, valor alvo por cesta, ponto de entrega, período de entrega fornecedores, período de retirada consumidores <br><br>**FA3 - Mercado Tipo Lote:**<br>5a. Cadastra valor alvo por lote, ponto de entrega, período de entrega fornecedores <br><br>**FA4 - Mercado Tipo Feira Livre:**<br>4a. Cadastra ponto de entrega, período de compras, período de entrega fornecedores, período de retirada consumidores|
| **Pós-condições** | Novo ciclo criado com mercados priorizados |
| **Rotas/Telas** | `/ciclo-index` (lista de ciclos)<br> `/ciclo` (criar ciclo)<br>`/ciclo/:id` (editar ciclo)` |
| **Ajustes** | 1. Verificar nomenclaturas, estamos com mercado tipo "Venda Direta" na tela de mercado e "Feira Livre" na tela de ciclos - revisar para padronizar. Como deve ficar? |
| **Protótipo Tela** | Tela UC010 |

---

## 5. GESTÃO DE OFERTAS (ATUALIZADO)

| **UC011** | **Criar/Editar Oferta (ATUALIZADO)** |
|-----------|--------------------------------|---|
| **Ator Principal** | Administrador, Admninistrador de Mercado ou Fornecedor |
| **Pré-condições** | Ciclo cadastrado, fornecedor cadastrado, produtos comercializáveis cadastrados |
| **Fluxo Normal** | 1. Usuário acessa Tela Inicial <br> 2. Seleciona um dos ciclos ativos e clica em "Ofertar Alimento" <br> 3. **[ALTERADO]** Busca produto e visualiza todas as possibilidades de comercialização<br>4. **[ALTERADO]** Seleciona produto comercializável (considera mercados do ciclo)<br>5. **[NOVO]** Permite alteração de preço<br>6. Define quantidade ofertada <br> 7. Seleciona "Certificação do Produto" (Produto Orgânico, Produto em transição agroecológica, Produto convencional) <br> 8. Seleciona "Tipo de Agricultura" (Agricultura familiar, Agricultura não familiar) <br> 9. Adiciona Produto / Salva oferta <br> 10. Sistema registra novo produto na oferta |
| **Fluxos Alternativos** | **FA1 - Usuário administrador e administrador de mercado:**<br>1a. Acessa Tela Gestão de Ciclo <br> 2a. Seleciona um dos ciclos cadastrados e clica em "Ofertar Alimentos" (administrador de mercado visualiza apenas os ciclos que administra) <br> 3a. Seleciona o fornecedor e sistema permite editar o pedido deste fornecedor|
| **Pós-condições** | Oferta registrada e disponível para composições e vendas diretas |
| **Rotas/Telas** | `/ciclo-index` (lista de ciclos)<br> `/oferta/:id` (insere/edita ofertas) |
| **Ajustes** | 1. na tela Painel Fornecedor existe a opção "Ofertar Alimento", ao clicar vai direto para a tela de oferta - porém antes o fornecedor precisa selecionar para qual ciclo ele estará ofertando. Solução 1: deixar apenas na tela inicial a opção de oferta. Solução 2: ao clicar em "Oferta Alimento", sistema direciona fornecedor para tela similar à Gestão de Ciclos, porém listando apenas os ciclos ativos e apenas o botão "Ofertar Alimento" |
| **Protótipo Tela** | Tela UC011 |

---

## 6. GESTÃO DE COMPOSIÇÃO DE MERCADOS (ATUALIZADO)

| **UC012** | **Compor Mercado Tipo Cesta** |
|-----------|--------------------------|---|
| **Ator Principal** | Administrador ou Administrador de Mercado |
| **Pré-condições** | Ciclo cadastrado, ofertas de fornecedores disponíveis |
| **Fluxo Normal** | 1. Usuário acessa "Gestão de Ciclos"<br>2. **[NOVO]** Visualiza todos os mercados do ciclo, em ordem definida, habilitando ações de forma sequencial (só libera o segundo quando o primeiro for finalizado). Seleciona Mercado para composição <br> 3. Seleciona composição de mercado tipo cesta <br> 4. Visualiza resumo do ciclo com quantidade de cestas, valor alvo, valor por cesta composta, saldo <br> 5. **[NOVO]** Visualiza todos os produtos comercializáveis ofertados e disponíveis e seus fornecedores (fornecedor, unidade, preço unitário, quantidade ofertados, quantidade disponíveis, valor acumulado - já consumido deste fornecedor neste ciclo) <br> 6. **[NOVO]** Pode buscar e filtrar lista de produtos comercializáveis <br> 7. Seleciona produtos comercializáveis para compor a cesta informando a quantidade que fará parte da composição <br> 7. **[NOVO]** Publica cesta deste mercado para consumidores (informação tela inicial e painel consumidor) |
| **Fluxos Alternativos** | **FA1 - Administrador de Mercado:**<br>2a. Visualiza somente os ciclos e mercados que administra |
| **Pós-condições** | Mercado Tipo Cesta composta e publicada |
| **Rotas/Telas** | `/ciclo-index` (lista de ciclos)<br>`/composicao/:id?cst=:id_mercado` (define/edita composição) |
| **Ajustes** | 1. Na lista de produtos comercializáveis falta incluir coluna com quantidade disponível e valor acumulado (que considera as composições anteriores) |
| **Protótipo Tela** | Tela UC012 |

<br>

| **UC013** | **Compor Mercado Tipo Lote** |
|-----------|-------------------------------|---|
| **Ator Principal** | Administrador ou Administrador de Mercado |
| **Pré-condições** | Ciclo cadastrado, ofertas de fornecedores disponíveis |
| **Fluxo Normal** | 1. Usuário acessa "Gestão de Ciclos" <br> 2. **[NOVO]** Visualiza todos os mercados do ciclo, em ordem definida, habilitando ações de forma sequencial (só libera o segundo quando o primeiro for finalizado). Seleciona Mercado para composição. <br> 3. Seleciona composição de mercado tipo lote <br> 4. Visualiza resumo do ciclo com valor desta composição <br> 5. **[NOVO]** Visualiza todos os produtos comercializáveis ofertados e disponíveis e seus fornecedores (fornecedor, unidade, preço unitário, quantidade ofertados, quantidade disponíveis, valor acumulado - já consumido deste fornecedor neste ciclo) <br> 6. **[NOVO]** Pode buscar e filtrar lista de produtos comercializáveis <br> 7. **[NOVO]** Seleciona produtos comercializáveis para compor o lote, informando a quantidade que fará parte da composição |
| **Fluxos Alternativos** | **FA1 - Administrador de Mercado:**<br>2a. Visualiza somente os ciclos e mercados que administra |
| **Pós-condições** | Mercado Tipo Lote composto |
| **Rotas/Telas** | `/ciclo-index` (lista de ciclos)<br>`/composicao/:id?cst=:id_mercado` (define/edita composição) |
| **Ajustes** | 1. Na lista de produtos comercializáveis falta incluir coluna com quantidade disponível e valor acumulado (que considera as composições anteriores) <br> 2. No resumo excluir valor máximo e saldo, que não existem no mercado tipo lote |
| **Protótipo Tela** | Tela UC013 |

<br>

| **UC014** | **Compor Mercado Tipo Venda Direta - Liberar para Venda** |
|-----------|--------------------------|---|
| **Ator Principal** | Administrador ou Administrador de Mercado |
| **Pré-condições** | Ciclo cadastrado, ofertas de fornecedores disponíveis |
| **Fluxo Normal** | 1. Usuário acessa "Gestão de Ciclos" <br> 2. **[NOVO]** Visualiza todos os mercados do ciclo, em ordem definida, habilitando ações de forma sequencial (só libera o segundo quando o primeiro for finalizado). Seleciona Mercado para composição. <br> 3. Seleciona composição de mercado tipo venda direta <br> 4. Visualiza resumo do ciclo com valor desta composição, que representa o total sendo comercializado <br> 5. **[NOVO]** Visualiza todos os produtos comercializáveis ofertados e disponíveis e seus fornecedores (fornecedor, unidade, preço unitário, quantidade ofertados, quantidade disponíveis, valor acumulado - já consumido deste fornecedor neste ciclo) <br> 6. **[NOVO]** Pode buscar e filtrar lista de produtos comercializáveis <br> 7. **[NOVO]** Seleciona produtos comercializáveis para serem liberados para venda direta, informando a quantidade que será liberado | 8. Publica Venda Direta |
| **Fluxos Alternativos** | **FA1 - Administrador de Mercado:**<br>2a. Visualiza somente os ciclos e mercados que administra |
| **Pós-condições** | Mercado Tipo Venda Direta composta e publicada tela de venda direta para consumidores|
| **Rotas/Telas** | `/ciclo-index` (lista de ciclos)<br>`/composicao/:id?cst=:id_mercado` (define/edita composição)<br> `/pedidoConsumidores/:id?cst=:id_mercado,usr=:id_usuario` (visualiza/compra produtos venda direta)|
| **Ajustes** | 1. Na lista de produtos comercializáveis falta incluir coluna com quantidade disponível e valor acumulado (que considera as composições anteriores) **Atualizado (https://git.disroot.org/Akarui/DivinoAlimento_dev/issues/215)** <br> 2. No resumo excluir valor máximo e saldo, que não existem no mercado tipo lote |
| **Protótipo Tela** | Tela UC014 |

<br>

| **UC015** | **Compor Mercado Tipo Venda Direta - Compor Vendas** |
|-----------|--------------------------|---|
| **Ator Principal** | Administrador ou Administrador de Mercado |
| **Pré-condições** | Ciclo cadastrado, compras de venda direta finalizadas |
| **Fluxo Normal** | 1. Usuário acessa "Gestão de Ciclos" <br> 2. **[NOVO]** Visualiza todos os mercados do ciclo, em ordem definida, habilitando ações de forma sequencial (só libera o segundo quando o primeiro for finalizado). Seleciona Mercado para composição. <br> 3. Seleciona composição "Composição de Venda Direta" <br> 4. Visualiza resumo do ciclo com valor desta composição, valor total <br> 5. **[NOVO]** Visualiza todos os produtos comercializáveis ofertados e disponíveis e seus fornecedores (fornecedor, unidade, preço unitário, quantidade ofertados, quantidade disponíveis, valor acumulado, quantidade vendida diretamente) <br> 6. **[NOVO]** Pode buscar e filtrar lista de produtos comercializáveis <br> 7. **[NOVO]** Seleciona produtos comercializáveis para compor a venda direta, informando a quantidade que fará parte desta composição |
| **Fluxos Alternativos** | **FA1 - Administrador de Mercado:**<br>2a. Visualiza somente os ciclos e mercados que administra |
| **Pós-condições** | Mercado Tipo Venda Direta composta|
| **Rotas/Telas** | `/ciclo-index` (lista de ciclos)<br>`/composicao/:id?cst=:id_mercado` (define/edita composição)|
| **Ajustes** | 1. a tela mencionada é igual do caso de uso UC014, deve ser feita outra. **Não entendi** <br> 2. Na lista de produtos comercializáveis falta incluir colunas com quantidade disponível, valor acumulado (que considera as composições anteriores) e quantidade vendida<br> 3. No resumo excluir valor máximo e saldo, que não existem no mercado tipo venda direta |
| **Protótipo Tela** | Tela UC015 - mesma que UC014, deve-se criar outra|


## 7. MÓDULO VENDA DIRETA (ALTERADO)

| **UC016** | **Comprar Produtos Venda Direta** |
|-----------|-----------------------------------|
| **Ator Principal** | Consumidor, Administrador ou Administrador de Mercado |
| **Pré-condições** | Mercado Tipo Venda Direta composta |
| **Fluxo Normal** | 1. Usuário acessa Tela Inicial <br> 2. Seleciona um dos ciclos ativos e clica em "Pedido em Varejo" <br> 3. Visualiza produtos à venda (venda direta) <br> 3. Seleciona produtos e informa quantidades<br>4. **[NOVO]** Sistema calcula valor total, valor da taxa e a soma<br>5. **[NOVO]** Confirma pedido |
| **Fluxos Alternativos** | **FA1 - Usuário administrador e administrador de mercado:**<br>1a. Acessa Tela Gestão de Ciclo <br> 2a. Seleciona um dos ciclos cadastrados e clica em "Pedido em Varejo" (administrador de mercado visualiza apenas os ciclos ativos e apenas o ciclos que administra) <br> 3a. Seleciona o consumidor e sistema permite editar o pedido deste consumidor |
| **Pós-condições** | Pedido de venda direta registrado |
| **Ajustes** | 1. na tela Painel Consumidor existe a opção "Pedido em Varejo", ao clicar vai direto para a tela de pedido - porém antes o consumidor precisa selecionar para qual ciclo ele estará pedindo. Solução 1: deixar apenas na tela inicial a opção de realizar pedido. Solução 2: ao clicar em "Pedido em Varejo", sistema direciona consumidor para tela similar à Gestão de Ciclos, porém listando apenas os ciclos ativos e apenas o botão "Pedido em Varejo" <br> 2. Para telas pequenas mostrar linhas em cards, sem a tabela |
| **Protótipo Tela** | Tela UC016 |


## 8. GESTÃO DE RELATÓRIOS (ATUALIZADO)

| **UC017** | **Gerar Relatório Pedidos Fornecedores** |
|-----------|------------------------------------------|
| **Ator Principal** | Administrador, Administrador de Mercado ou Fornecedor |
| **Pré-condições** | Ciclos com composições registradas |
| **Fluxo Normal** | 1. Usuário acessa "Gestão de Ciclos" <br> 2. **[NOVO]** Visualiza todos os mercados do ciclo, em ordem definida, habilitando ações de forma sequencial (só libera o segundo quando o primeiro for finalizado). <br> 3. Usuário acessa "Entrega dos Fornecedores"<br>4. Sistema lista todos os pedidos do ciclo, com nome dos fornecedores, produtos, medida, quantidades, valores por produto e valor total do pedido. <br> 5. Usuário pode baixar as informações do relatório em csv ou pdf.
| **Fluxos Alternativos** | **FA1 - Acesso por usuário perfil fornecedor:**<br>1a. e 2a. usuário acessa Perfil Fornecedor <br> 3a. Sistema lista somente o pedido do referido fornecedor |
| **Pós-condições** | Relatório gerado |
| **Ajustes** | 1. Na tela Painel Fornecedor existe a opção "Relatório de Entrega", ao clicar vai direto para a tela de relatório - porém, antes, o fornecedor precisa selecionar para qual ciclo ele estará gerando estas informações. Solução 1: deixar apenas na tela inicial a opção de gerar "Relatório de Entrega dos Fornecedores". Solução 2: ao clicar em "Relatório de Entregas", sistema direciona consumidor para tela similar à Gestão de Ciclos, porém listando apenas os ciclos ativos e a opção de gerar o "Relatório de Entrega dos Fornecedores" <br> 2. Para telas pequenas mostrar linhas em cards, sem a tabela|
| **Protótipo Tela** | Tela UC017 |

<br>

| **UC018** | **Gerar Relatório Pedidos Consumidores** |
|-----------|------------------------------------------|
| **Ator Principal** | Administrador, Administrador de Mercado ou Consumidor |
| **Pré-condições** | Ciclos com composições registradas |
| **Fluxo Normal** | 1. Usuário acessa "Gestão de Ciclos" <br> 2. **[NOVO]** Visualiza todos os mercados do ciclo, em ordem definida, habilitando ações de forma sequencial (só libera o segundo quando o primeiro for finalizado). <br> 3. Usuário acessa "Pedidos dos Consumidores"<br>4. Sistema lista  todos os pedidos do ciclo, com nome dos fornecedores, produtos, medida, quantidades, valores por produto e valor total do pedido. <br> 5. Usuário pode baixar as informações do relatório em csv ou pdf.
| **Fluxos Alternativos** | **FA1 - Acesso por usuário perfil consumidor:**<br>1a. e 2a. usuário acessa Perfil Consumidor <br> 3a. Sistema lista somente o pedido do referido consumidor |
| **Pós-condições** | Relatório gerado |
| **Ajustes** | 1. Na tela Painel Consumidor no lugar de "Meus pagamentos" deve-se incluir "Relatório de Pedidos", ao clicar deve ir para tela que permita selecionar para qual ciclo ele estará gerando estas informações. Solução 1: deixar apenas na tela inicial a opção de gerar "Pedidos Diretos". Solução 2: ao clicar em "Pedidos Diretos", sistema direciona consumidor para tela similar à Gestão de Ciclos, porém listando apenas os ciclos ativos e a opção de gerar o "Relatório de Pedidos Diretos" <br> 2. Tela deve ser similar a UC017 <br> 2. Para telas pequenas mostrar linhas em cards, sem a tabela|
| **Protótipo Tela** | [Tela UC018] - será refeita com base no Relatório de Entregas|

<br>

| **UC019** | **Gerar Relatório Pedidos Fornecedores Por Ciclos** |
|-----------|------------------------------------------|
| **Ator Principal** | Administrador ou Administrador de Mercado |
| **Pré-condições** | Ciclos com composições registradas |
| **Fluxo Normal** | 1. Usuário acessa "Painel Administrativo <br> 2. Usuário acessa "Relatório Fornecedores" <br>3. Usuário seleciona ciclos que deseja emitir o relatório consolidado, clicando em exibir. <br>4. Sistema lista  todos os pedidos dos vários ciclos selecionados, com o nome do ciclo, nome do mercado, nome dos fornecedores, produtos, unidade, valores por produto, quantidades e valor total do pedido. <br> 5. Usuário pode baixar as informações do relatório em csv ou pdf. |
| **Fluxos Alternativos** | **FA1 - Acesso por usuário perfil administrador de mercado:**<br>1a. Sistema lista somente os ciclos de responsabilidade do referido administrador de mercado **FA2 - Geração em formato csv/pdf:**<br>3a. após a geração sistema faz o download do relatório em formato csv ou pdf|
| **Pós-condições** | Relatório gerado |
| **Ajustes** | 1. Na tela de seleção de ciclos retirar botões de fazer download csv e download pdf <br> 2. Incluir coluna nome do mercado <br> 3. Para telas pequenas mostrar linhas em cards, sem a tabela|
| **Protótipo Tela** | Tela UC019 |

<br>

| **UC020** | **Gerar Relatório Pedidos Consumidores Por Ciclos** |
|-----------|------------------------------------------|
| **Ator Principal** | Administrador ou Administrador de Mercado |
| **Pré-condições** | Ciclos com composições registradas |
| **Fluxo Normal** | 1. Usuário acessa Painel Administrativo <br> 2. Usuário acessa "Relatório Consumidores" <br>3. Usuário seleciona ciclos que deseja emitir o relatório consolidado, clicando em exibir. <br>4. Sistema lista  todos os pedidos dos vários ciclos selecionados, com o nome do ciclo, nome do mercado, nome dos consumidores, produtos, unidade, valores por produto, quantidades e valor total do pedido. <br> 5. Usuário pode baixar as informações do relatório em csv ou pdf. |
| **Fluxos Alternativos** | **FA1 - Acesso por usuário perfil administrador de mercado:**<br>1a. Sistema lista somente os ciclos de responsabilidade do referido administrador de mercado **FA2 - Geração em formato csv/pdf:**<br>3a. após a geração sistema faz o download do relatório em formato csv ou pdf|
| **Pós-condições** | Relatório gerado |
| **Ajustes** | 1. Na tela de seleção de ciclos retirar botões de fazer download csv e download pdf <br> 2. Incluir coluna nome do mercado <br> 3. Para telas pequenas mostrar linhas em cards, sem a tabela|
| **Protótipo Tela** | Tela UC020 |

## 9. GESTÃO DE OFERTAS ENTRE CICLOS (NOVO)

| **UC021** | **Migrar Ofertas de Um Ciclo para Outro** |
|-----------|------------------------------------------|
| **Ator Principal** | Administrador ou Administrador de Mercado |
| **Pré-condições** | Ciclo origem finalizado, ciclo destino iniciado |
| **Fluxo Normal** | 1. Usuário seleciona ciclo de destino <br>2. Usuário seleciona ciclos de onde as sobras serão migradas <br> 3. Clica em "carregar sobras selecionadas" <br> 4. Sistema mostra todas as sobras (produto, fornecedor, medida, quantidade ofertados, pedidos e sobras, valor unitário, quantidade para migrar) <br>5. Usuário edita itens a serem migrados, excluindo e/ou editando quantidades. <br>6. Usuário salva e sistema efetiva a lista como oferta para o ciclo destino. |
| **Fluxos Alternativos** | --- |
| **Pós-condições** | Ofertas migradas |
| **Protótipo Tela** | Tela UC021 |

## 10. GESTÃO DE PAGAMENTOS

| **UC022** | **Gerar Registros de Pagamentos** |
|-----------|------------------------------------------|
| **Ator Principal** | Administrador |
| **Pré-condições** | Ciclo finalizado |
| **Fluxo Normal** | 1. Usuário acessa "Painel Administrativo" <br> 2. Usuário acessa "Gerar Registros de Pagamentos" <br> 3. Sistema lista ciclos finalizados e que os pagamentos não foram gerados <br> 4. Usuário seleciona ciclo <br>5. Usuário clica em "Gerar Registros de Pagamentos" <br>6. Sistema gera todos os registros de pagamento dos mercados daquele ciclo (pagamentos dos fornecedores e recebimento dos consumidores) e os lista (ciclo, mercado, nome do fornecedor/consumidor, valor total, status ) <br> 7. Usuário pode editar registros gerados, excluindo e/ou editando valor, status, data de pagamento e observaçao <br> 8. Usuário salva lista com os registros |
| **Fluxos Alternativos** | --- |
| **Pós-condições** | Registros de pagamento gerados |
| **Ajustes** | 1. No painel administrativo alterar "Lista de Pagamentos" para "Gerar Registros de Pagamento" <br> 2. Acrescentar na lista coluna CICLO e MERCADO (de onde aquele registro foi originado) <br> 3. Remover coluna PRODUTO/ITEM (que não existe pois é um registro de pagamento por mercado (valor total do que forneceu/consumiu naquele mercado)<br> 4. Tela de ediçao de pagamento deve permitir editar valor, status, data pagamento e observação <br> 5. Remover visualização e edição do perfil administrador de mercado|
| **Protótipo Tela** | Tela UC022 |

<br>

| **UC023** | **Administrar Pagamentos** |
|-----------|------------------------------------------|
| **Ator Principal** | Administrador |
| **Pré-condições** | Registros de Pagamentos Gerados |
| **Fluxo Normal** | 1. Usuário acessa "Painel Administrativo" <br> 2. Usuário acessa "Administrar Pagamentos" <br> 3. Sistema mostrar lista com todos os registros de pagamentos pendentes (fornecedores e consumidores), podendo utilizar busca; com campos ciclo, mercado, nome do fornecedor/consumidor, valor total, status, data pagamento. <br>  4. Usuário pode editar registros gerados, excluindo e/ou editando valor, status, data de pagamento e observação <br> 5. Usuário salva lista com os registros |
| **Fluxos Alternativos** | **FA1 - Usuário Ordena Registros** <br>1a. Usuário altera ordem dos dados, por nome ou por datas  |
| **Pós-condições** | Pagamentos registrados como pagos |
| **Ajustes** | 1. No painel administrativo alterar "Editar Lista de Pagamentos" para "Administrar Pagamentos" <br> 2. Acrescentar na lista coluna CICLO e MERCADO (de onde aquele registro foi originado) <br> 3. Remover coluna PRODUTO/ITEM (que não existe pois é um registro de pagamento por mercado (valor total do que forneceu/consumiu naquele mercado)<br> 4. Tela de ediçao de pagamento deve permitir editar valor, status, data de pagamento e observação <br> 5. Remover visualização e edição do perfil administrador de mercado <br> 6. acrescentar botão de excluir, junto com a lista |
| **Protótipo Tela** | Tela UC023 |

<br>

## 11. TELA INICIAL

| **UC024** | **Acessar Tela Inicial** |
|-----------|------------------------------------------|
| **Ator Principal** | Usuário não logado |
| **Pré-condições** |  |
| **Fluxo Normal** | 1. Usuário entra na url do sistema, via browser <br>2. Usuário visualiza informações públicas (cabeçalho, mini texto de apresentação, logos) <br>3. Usuário visualiza link de LOGIN (UC001 e UC002)  |
| **Fluxos Alternativos** | **FA1 - Usuário FORNECEDOR está logado** <br>2a. Sistema direciona para tela Perfil Fornecedor<br><br>**FA2 - Usuário CONSUMIDOR está logado** <br>2a. Sistema direciona para tela Perfil Consumidor<br><br>**FA3 - Usuário ADMINISTRADOR DE MERCADO está logado** <br>2a. Sistema direciona para tela Perfil Admninistrador de Mercado<br><br>**FA4 - Usuário ADMINISTRADOR está logado** <br>Sistema direciona para tela Perfil Admninistrador|
| **Pós-condições** |  |
| **Protótipo Tela** | |
