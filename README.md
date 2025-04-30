# Plataforma do Divino Alimento

A plataforma do Divino Alimento facilita o fluxo de informação de vendas alimentos produzido por diversos agricultores, para diversos compradores por meio de ciclos de entrega de cestas e lista extra de produtos para o varejo.

Uma plataforma criada a luz iniciativa do Divino Alimento, que é contada com mais detalhes no site da [Akarui](https://www.akarui.org.br/divinoalimento).

Hoje apoiada pela chamada do [Mover-se na web](https://moverse.ceweb.br/), com os objetivos de deixar a ferramenta em código livre e compartilhado e a aproximação de mais coletivos para uso da ferramenta por meio do trabalho de articulação local e regional.

O [programa atual](https://divinoalimento.herokuapp.com/) foi desenvolvido por Carmen Freitas em diálogo com Juliana Farinaci e se somam mais pessoas ao processo na fase atual,  ligadas a [Tekoporã](https://tekopora.top/), Alejandro González, Alejandro Ayala e Nádia Coelho Pontes e a [Akarui](https://www.akarui.org.br/), Ana Laura Carrilli, Damaris Chaves, Daniela Coura e Sofia Kraja.

Para utilizar esse programa precisamos clonar o repositório em um lugar do computador de seu conhecimento. Para tanto sugerimos o uso do terminal, e utilizamos o código abaixo.

`git clone https://github.com/AssociacaoAkarui/DivinoAlimento.git`

Entrar na pasta que foi criada, utilizando o comando cd 

`cd DivinoAlimento`

Copiar o arquivo com nome "env.example" para a pasta oculta com nome .env. Nesse documento "env.example" tem as configuração das portas e dos acessos incluíndo login e senha.

`cp env.example .env`

Nesse arquivo, a porta padrão é 13000 e pode ser alterada na [linha](https://github.com/AssociacaoAkarui/DivinoAlimento/blob/main/env.example#L7) 

Vamos ao *rake*, para poder ligar ou desligar o docker que contém o programa do Divino Alimento. Para conhecer os comandos, utilize:

`rake --tasks`

Para construir:

`rake vivo:constroi`

Para subir o docker

`rake vivo:liga`

*Obs: nesse momento precisa colocar o usuário que foi criado, como usuário administrativo para que possa ter acesso a todo o programa. 

Assim precisamos popular o banco de dados. Para tanto:

`rake vivo:popular`

*observação: na tela do sistema é possível acrescentar outras cestas ou editar as informações destas duas. Porém os relatórios não irão incluir as novas cestas cadastradas.*

Para acessar o programa usamos a porta 13000 (ou a porta que deixamos configurada no arquivo .env). Para tanto no buscador de internet colocar:

`localhost:13000`

Para parar o docker

`rake vivo:para`

## Dependências ou programas necessários em seu computador para utilizar o programa:

1. **docker-compose-v2**
2. **rake**
3. **git**