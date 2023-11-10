<h1 align="center">

👾 Geração Sonora API 👾
</h1>
<p align="center">🚀  Esse projeto tem como objetivo principal permitir que o usuário mantenha usuario, intrumentos, unidades e músicas
</p>

### Pré-requisitos

Antes de começar, você vai precisar ter instalado em sua máquina as seguintes ferramentas:
[Git](https://git-scm.com/), [Node.js](https://nodejs.org/en/) versão 19.2.0, [Vue3](https://v3.vuejs.org/)  Yarn.
Além disto é bom ter um editor para trabalhar com o código como [VSCode](https://code.visualstudio.com/)

### 🎲 Rodando o Backend

```
# Clone este repositório
$ git https://github.com/i-zzaa/geracao-api.git

# Acesse a pasta do projeto no terminal/cmd
$ cd geracao-api

# Instale as dependências 
$ yarn install

# Prisma
$ npx prisma generate 
$ cd prisma 
$ mkdir data 
$ echo . dev.db 

# Execute a aplicação em modo de desenvolvimento
$ yarn start:dev

# O servidor inciará na porta:3000 - acesse <http://127.0.0.1:3000/>

```

### 🎲 Rodando o Backend Produção

```
# Clone este repositório
$ git https://github.com/i-zzaa/geracao-api.git

# Acesse a pasta do projeto no terminal/cmd
$ cd geracao-api

# Instale as dependências 
$ yarn install

# Build da aplicação que vai criar a pasta dist para produção
$ yarn build

# Execute a aplicação em modo de produção
$ yarn start:prod

# O servidor inciará

```

### ⚙️ Configurações

É necessário criar um arquivo .env  na raiz do projeto com a variável de ambiente VITE_API_URL com a url do backend

.*env*

```

JWT_PRIVATE_KEY=""
KEY_SECRET_SESSION=""
EXPIRES_IN_SECONDS='1h'

API_ORTS="https://poccamara.i9atech.com/otrs/api/"
CustomerGetTicketList=0
```

### 🛠 Tecnologias

As seguintes ferramentas foram usadas na construção do projeto:

- [Nestjs](https://nestjs.com/)
- [Axios](https://axios-http.com/ptbr/docs/intro)
- Eslint
- Prettier
- Typescript
- Passaport
- class-validator