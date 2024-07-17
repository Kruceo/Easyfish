# Linux

Guia para instalação em um ambiente Linux.

## Requisitos

- [Git](https://git-scm.com/) - Ferramenta para gerir repositórios
- [NodeJS v21.0.0](https://nodejs.org/en) - Runtime de Javascript
- [PostgresSQL](https://www.postgresql.org/download/) - Database
- [Thermal-Printer](https://github.com/Kruceo/thermal-printer) - Servidor para impressoras térmicas

## Instalação

### Passo 1 - Database

Para o projeto funcionar é necessário um `database`, o modelo recomedando é `PostgreSQL`.
Você pode instalar diretamente em seu computador ou utilizar um contâiner Docker (recomendado).

- [Guia de instalação no Ubuntu Server](https://ubuntu.com/server/docs/install-and-configure-postgresql)

Container Docker:

```bash
docker run -e POSTGRES_PASSWORD=password -v /var/lib/postgresql/data -p 5432:5432 postgres:latest
```

### Passo 2 - Thermal-Printer

Clone o repositório [thermal-printer](https://github.com/Kruceo/thermal-printer) e siga os passos de compilação.

Execute o servidor, dependendo da sua compilação pode ser diferente:

```bash 
./thermal-printer
```

### Passo 3 - Repositório

Clone o repositório do github e o acesse:

```bash
git clone https://github.com/Kruceo/easyfish.git
cd easyfish
```

### Passo 4 - Backend

Os passos a seguir ocorrem dentro do diretório `./easyfish/backend`.

Instalar depêndencias:

```bash
npm i 
```

Devemos ajustar o arquivo de configuração do Backend em `./config/config.json`, se precisar de mais informações, consulte [BACKEND/CONFIG](https://github.com/Kruceo/easyfish/blob/main/docs/backend/CONFIG.md).

Finalmente podemos iniciar o servidor, utilizando:

```bash
node index.mjs
```

### Passo 5 - Frontend

Os passos a seguir ocorrem dentro do diretório `./easyfish/frontend`.

Instalar depêndencias:

```bash
npm i 
```

Devemos ajustar o arquivo de configuração do Backend em `./config.json`, se precisar de mais informações, consulte [FRONTEND/CONFIG](https://github.com/Kruceo/easyfish/blob/main/docs/frontend/CONFIG.md).

Agora devemos compilar o codigo do frontend:

```bash
npm run build
```

Isso vai gerar novos arquivos dentro da pasta `dist`, estes são todos os arquivos necessários para o frontend.

Existem varias formas de prosseguir a partir daqui, podemos usar servidores como `Nginx` e `Apache` ou até mesmo afim de ser rapido e pratico, utilizar `python http server` e o próprio `vite`.

Neste exemplo utilizaremos o `vite` como servidor por ser mais prático, mas para produção recomendamos o `Nginx`.

```bash
cd dist
npx vite --host --port 8081
```

Esse comando iniciara um servidor de testes na porta 8081.

Considere utilizar o `Nginx` ou outro servidor de sua confiança para produção.

A partir daqui você pode acessar http://localhost:8081 (ou o endereço posteriormente configurado).

Se tudo ocorreu bem, você vai chegar a tela de login.

Para criar um usuario e senha você pode executar o `userManager.mjs`, encontrado dentro da pasta `tools` do backend.