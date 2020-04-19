<h1 align="center">
  <img alt="Fastfeet" title="Fastfeet" src=".github/logo.png" width="300px" />
</h1>

<h3 align="center">
  Desafio 02: FastFeet, o início.
</h3>
<h3 align="center">
  Desafio 03: FastFeet, continuando a aplicação.
</h3>

##### Mais detalhes sobre os desafios:
[Desafio 02](https://github.com/Rocketseat/bootcamp-gostack-desafio-02)

[Desafio 03](https://github.com/Rocketseat/bootcamp-gostack-desafio-03)

## :rocket: Sobre o desafio

A aplicação desenvolvida é um app para uma transportadora fictícia, o FastFeet.

Nestra primeira parte foi desenvolvido o backend da aplicação, que fará integração com os módulos de frontend para [Web](https://github.com/jvrviegas/fastfeet-web) e [Mobile](https://github.com/jvrviegas/fastfeet-mobile), onde foram feitas todas as funcionalidades e regras de negócio da aplicação.

<h3 align="center">
  :clipboard: Funcionalidades do Administrador:
</h3>

1. Autenticação
Para que o administrador possa acessar o sistema deverá ser informado o e-mail e senha.

2. Gestão de entregadores
Visualizar, cadastrar, editar e excluir entregadores na plataforma.

3. Gestão de encomendas
Visualizar, cadastrar, editar, excluir e cancelar encomendas para os entregadores.
Quando uma encomenda é cadastrada ou cancelada o entregador recebe um e-mail informando-o.

4. Gestão de destinatários
Visualizar, cadastrar, editar e excluir destinatários na plataforma.

5. Gestão de problemas
Visualizar problemas de todas as encomendas.

<h3 align="center">
  :clipboard: Funcionalidades do Entregador:
</h3>

1. Autenticação
Para que o entregador possa visualizar suas encomendas, ele deverá informar apenas seu ID de cadastro (ID do entregador no banco de dados).

2. Visualizar encomendas
Essa funcionalidade deve retornar as encomendas atribuídas a ele que ainda estejam pendentes (ainda não foram entregues e nem foram canceladas);
Também permite um filtro que possa exibir apenas as encomendas que já foram entregues.

3. Alterar status de encomendas
Permite que o entregador registre a data de retirada e data de entrega das encomendas. 
O entregador tem a limitação de horário, podendo retirar apenas entre 08:00 e 18:00 horas, além de apenas 5 retiradas por dia.
Para a funcionalidade de finalizar a entrega o entregador deverá realizar o envio da foto da assinatura do destinatário no ato da entrega através do [aplicativo](https://github.com/jvrviegas/fastfeet-mobile).

4. Problemas nas entregas
O entregador pode tanto registrar como visualizar os problemas de uma entrega em específico.

## 🗄️ Base de dados da aplicação
- [Postgres](https://github.com/postgres/postgres)
- [MongoDB](https://www.mongodb.com/)
- [Redis](https://redis.io/)

#### É necessário instalar [docker](https://www.docker.com/). Após a instalação, o terminal deverá ser aberto e os comandos a seguir executados:

```
# Criar um container com a imagem do PostgreSQL
docker run --name fastfeetdb -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres
(Usuário: postgres | Senha: docker)

# Criar um container com a imagem do MongoDB
docker run --name mongofastfeet -p 27017:27017 -d -t mongo

# Criar um container com a imagem do Redis na versão Alpine
docker run --name redisfastfeet -p 6379:6379 -d -t redis:alpine

# Iniciar os containers
docker start fastfeetdb mongofastfeet redisfastfeet

```

## :computer: Iniciando a aplicação

1. Clone o repositório com `git clone https://github.com/jvrviegas/fastfeet-api.git`
2. Entre na pasta do projeto com `cd fastfeet-api`
3. Instale todas as dependencias com o comando `yarn`
4. Criar a base de dados fastfeet (recomenda-se a utilização do [Postbird](https://www.electronjs.org/apps/postbird))
5. Executar as migrations para criar as tabelas:
6. `yarn sequelize db:migrate`
7. Executar a seed para criar o usuário administrador: 
8. `yarn sequelize db:seed:all`
7. Executar o servidor:
8. `yarn dev` 
9. Executar as filas:
10. `yarn queue`
11. A aplicação estará pronta para receber requisições no endereço `http://localhost:3333`

##### P.S.: Não esqueça criar uma cópia do arquivo `.env.example` e preencher corretamente.

## :hammer: Principais Ferramentas

- :green_book: **Node JS** - Biblioteca para criar aplicações web
- :zap: **Express JS** - Biblioteca para gerenciamento de rotas e requisições
- :large_blue_diamond: **Sequelize** - Biblioteca para gerenciamento de rotas e requisições
- :lock: **JSON Web Token** - Token para autenticação na aplicação
- 📛 **Sentry** - Plataforma para monitoramento de erros e notificação em tempo real
- 📄 **ESLint** - Biblioteca para análise de código estática para identificar e reportar padrões no código Javascript

## :camera: Demonstração
<h1 align="center">
  <img alt="Demonstração" src=""
 />
</h1>


