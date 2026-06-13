ETAPA 1 DE 10: Criar o projeto base e instalar dependências
Passo 1: Criar o projeto React com Vite

No terminal, execute:
bash

npm create vite@latest concurso-pro -- --template react
cd concurso-pro

Passo 2: Instalar as dependências iniciais
bash

npm install react-router-dom @tanstack/react-query framer-motion lucide-react
npm install -D tailwindcss@3 postcss autoprefixer concurrently json-server

Passo 3: Inicializar Tailwind CSS
bash

npx tailwindcss init -p

Isso cria tailwind.config.js e postcss.config.js na raiz.
Passo 4: Configurar o package.json manualmente

Abra o package.json no VS Code. Ele deve estar mais ou menos assim:
json

{
  "name": "concurso-pro",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": { ... },
  "devDependencies": { ... }
}

Adicione as seguintes linhas dentro de "scripts":
json

"api": "json-server --watch db.json --port 3001",
"start": "concurrently \"npm run api\" \"npm run dev\""

O trecho deve ficar assim:
json

"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "api": "json-server --watch db.json --port 3001",
  "start": "concurrently \"npm run api\" \"npm run dev\""
}

Passo 5: Criar o arquivo db.json (API fake)

Na raiz do projeto (mesma pasta do package.json), crie um arquivo db.json com o seguinte conteúdo:
json

{
  "orgaos": [],
  "bancas": []
}

✅ Testes (você executa e confirma)

    Teste o React:
    bash

    npm run dev

    Deve abrir a página padrão do Vite em http://localhost:5173.
    Pare com Ctrl+C

    Teste a API fake:
    bash

    npm run api

    Deve mostrar json-server started on port 3001.
    Pare com Ctrl+C

    Teste os dois juntos:
    bash

    npm run start

    Os dois servidores devem subir simultaneamente. Acesse http://localhost:3001/orgaos e veja [].
    Pare com Ctrl+C

📦 Commit
