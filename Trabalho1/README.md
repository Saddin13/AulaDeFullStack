## Pré-requisitos:

Docker e Docker Compose instalados e em execução.

Um editor de código (ex: Visual Studio Code).

Conhecimento básico da linha de comando.

Node.js e NPM instalados na máquina local (para criar os projetos de exemplo).

---

## Passo 1: Estrutura do Projeto

O primeiro passo é organizar nosso espaço de trabalho. Uma estrutura de diretórios bem definida é crucial para a manutenibilidade do projeto.

1. Crie uma pasta principal para o laboratório. Vamos chamá-la de docker-lab.

2. Dentro de docker-lab, crie a seguinte estrutura de arquivos e pastas:


docker-lab/

├── .env

├── docker-compose.yml

├── backend/

│   └── Dockerfile

├── frontend/

│   └── Dockerfile

└── nginx/

    ├── Dockerfile

    └── nginx.conf

---

## Passo 2: Configurando as Variáveis de Ambiente

Centralizar as configurações em um arquivo .env é uma boa prática que nos permite alterar portas, senhas e URLs sem modificar o código de orquestração.

Arquivo: .env

1. Abra o arquivo .env que você criou na raiz do projeto.

2. Adicione as seguintes variáveis. Elas serão usadas pelo docker-compose.yml para configurar os serviços.

```env
# Variáveis de Ambiente do Projeto

#-- NGINX --#
NGINX_PORT=8080

#-- FRONTEND --#
FRONTEND_PORT=5173

#-- BACKEND --#
BACKEND_PORT=3000

#-- POSTGRES --#
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=app-database
POSTGRES_PORT=5532

#-- PGADMIN --#
PGADMIN_DEFAULT_EMAIL=admin@admin.com
PGADMIN_DEFAULT_PASSWORD=admin
PGADMIN_PORT=5550
Passo 3: Criando os Projetos de Exemplo

Para que os containers frontend e backend tenham o que executar, vamos gerar projetos básicos.

Observação: Pode ser necessário instalar as dependências (npm install) em ambas as pastas se o processo de criação não o fizer automaticamente.

1. Backend (NestJS):

Navegue até a pasta backend e crie um novo projeto NestJS.

cd backend
npx @nestjs/cli new . --skip-git --package-manager npm
cd ..
2. Frontend (React + Vite):

Navegue até a pasta frontend e crie um novo projeto Vite.

mkdir frontend
cd frontend
npm create vite@latest . -- --template react
cd ..
Passo 4: Dockerizando os Serviços

Agora, vamos escrever as "receitas" (Dockerfile) para construir as imagens customizadas do nosso frontend, backend e Nginx.

Arquivo: backend/Dockerfile
# Etapa 1: Define a imagem base do Node.js
FROM node:lts-alpine

# Etapa 2: Define o diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Etapa 3: Copia os arquivos de definição de dependências
COPY package*.json ./

# Etapa 4: Instala as dependências da aplicação
RUN npm install

# Etapa 5: Copia todo o restante do código-fonte
COPY . .

# Etapa 6: Expõe a porta que a API usará
EXPOSE 3000

# Etapa 7: Comando para iniciar a aplicação em modo de desenvolvimento
CMD ["npm", "run", "start:dev"]
Arquivo: frontend/Dockerfile
# Etapa 1: Define a imagem base do Node.js
FROM node:lts-alpine

# Etapa 2: Define o diretório de trabalho
WORKDIR /usr/src/app

# Etapa 3: Copia os arquivos de definição de dependências
COPY package*.json ./

# Etapa 4: Instala as dependências
RUN npm install

# Etapa 5: Copia o restante do código da aplicação
COPY . .

# Etapa 6: Expõe a porta do servidor de desenvolvimento do Vite
EXPOSE 5173

# Etapa 7: Inicia o servidor do Vite, escutando em todas as interfaces de rede
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
3. Nginx (Proxy Reverso):

Primeiro, defina a configuração do Nginx.

Arquivo: nginx/nginx.conf

server {

        # O Nginx escutará na porta 80 dentro do container
        listen 80;

        # Rota padrão: encaminha para o container do frontend
        location / {
            # 'frontend' é o nome do serviço no docker-compose.yml
            proxy_pass http://frontend:5173;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }

        # Rota para a API: encaminha para o container do backend
        location /api {
            # Remove o /api do caminho antes de repassar
            rewrite /api/(.*) /$1 break;
            # 'backend' é o nome do serviço no docker-compose.yml
            proxy_pass http://backend:3000;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
}

Arquivo: nginx/Dockerfile

# Usa a imagem oficial do Nginx
FROM nginx:alpine

# Remove a configuração padrão para evitar conflitos
RUN rm /etc/nginx/conf.d/default.conf

# Copia nosso arquivo de configuração personalizado para o local correto
COPY nginx.conf /etc/nginx/conf.d
Passo 5: Orquestrando com Docker Compose

Este é o coração do nosso laboratório. O arquivo docker-compose.yml irá definir todos os nossos serviços, como eles se conectam e como eles persistem dados.

Arquivo: docker-compose.yml

version: '3.8'

services:

  # Serviço do Banco de Dados
  postgres:
    image: postgres:alpine
    container_name: postgres
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    ports:
      - "${POSTGRES_PORT}:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - app_network

  # Serviço de Interface do Banco de Dados
  pgadmin:
    image: dpage/pgadmin4
    container_name: pgadmin_ui
    environment:
      PGADMIN_DEFAULT_EMAIL: ${PGADMIN_DEFAULT_EMAIL}
      PGADMIN_DEFAULT_PASSWORD: ${PGADMIN_DEFAULT_PASSWORD}
    ports:
      - "${PGADMIN_PORT}:80"
    depends_on:
      - postgres
    volumes:
      - pgadmin_data:/var/lib/pgadmin
    networks:
      - app_network

  # Serviço de Backend (API)
  backend:
    build: ./backend
    container_name: backend_api
    ports:
      - "${BACKEND_PORT}:3000"
    volumes:
      - ./backend:/usr/src/app
      - /usr/src/app/node_modules
    depends_on:
      - postgres
    networks:
      - app_network
    environment:
      DATABASE_URL: postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}

  # Serviço de Frontend
  frontend:
    build: ./frontend
    container_name: frontend_app
    ports:
      - "${FRONTEND_PORT}:5173"
    volumes:
      - ./frontend:/usr/src/app
      - /usr/src/app/node_modules
    depends_on:
      - backend
    networks:
      - app_network

  # Serviço de Proxy Reverso
  nginx:
    build: ./nginx
    container_name: nginx_proxy
    ports:
      - "${NGINX_PORT}:80"
    depends_on:
      - frontend
      - backend
    networks:
      - app_network

volumes:
  postgres_data:
  pgadmin_data:

networks:
  app_network:
    driver: bridge
Passo 6: Execução e Verificação

Com todos os arquivos de configuração no lugar, é hora de levantar o ambiente.

1. Construa e inicie os containers:

Abra um terminal na raiz do projeto (docker-lab) e execute:

docker-compose up --build -d
--build: Força a construção das imagens a partir dos Dockerfiles.
-d: Roda os containers em modo "detached" (em segundo plano).
2. Verifique se os containers estão rodando:
docker-compose ps

Você deve ver todos os cinco serviços (postgres, pgadmin, backend, frontend, nginx) com o status Up ou running.

3. Teste os endpoints:

Aplicação Completa (via Nginx):
Abra seu navegador e acesse:

http://localhost:8080

Você deve ver a página inicial do React/Vite.

PGAdmin:

http://localhost:5050

Use o e-mail e senha do arquivo .env para fazer login. Você pode adicionar um novo servidor para se conectar ao banco de dados usando postgres como nome do host.

API (via Nginx):

http://localhost:8080/api

Você deve ver a mensagem "Hello World!" do NestJS.

Frontend (direto):

http://localhost:5173

para interagir diretamente com o servidor de desenvolvimento do Vite (com hot-reload).

Conclusão

Construir com sucesso um ambiente de desenvolvimento full-stack, isolado e reprodutível usando Docker e Docker Compose. Este laboratório cobriu conceitos essenciais de containerização que são fundamentais para práticas modernas de DevOps e desenvolvimento de software. A partir daqui, você pode expandir este ambiente adicionando mais serviços, como Redis para cache, ou criando estágios de build para produção.
