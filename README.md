# SuperJogosClick

Plataforma de jogos online no estilo Poki/Friv, construída com **Next.js 16 (App Router)**,
**TypeScript**, **Tailwind CSS v4** e **Firebase** (Auth + Firestore + Storage).

## Funcionalidades

- Grade de jogos por categoria com ícones SVG próprios (sem depender de bibliotecas externas de ícones)
- Cadastro/login de usuários (Firebase Auth)
- Perfil com criador de boneco/avatar (SVG em camadas: pele, cabelo, roupa, acessório, fundo)
- Pontuação por tempo jogado, histórico de jogos e favoritos
- Classificação indicativa (L, 10, 12, 14, 16, 18) em cada jogo
- Painel admin: CRUD de jogos, categorias personalizadas, gestão de usuários/permissões
- Importação em massa de jogos via feeds públicos da **GameMonetize** e **GamePix** (sem chave de API)

## Configuração

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com/) e ative:
   - **Authentication** → método E-mail/senha
   - **Firestore Database**
   - **Storage** (opcional, para uploads futuros)
2. Copie `.env.example` para `.env.local` e preencha com as credenciais do seu app web do Firebase.
3. Publique as regras de segurança em `firestore.rules` (Firebase Console → Firestore → Regras, ou via `firebase deploy --only firestore:rules` com o Firebase CLI).
4. Instale as dependências e rode o servidor:

   ```sh
   npm install
   npm run dev
   ```

5. Crie sua conta pelo site (`/cadastro`). Por padrão todo novo usuário nasce com `role: "user"`.
   Para virar administrador, abra o Firestore Console → coleção `users` → seu documento →
   altere o campo `role` para `admin`. A partir daí você acessa `/admin`.
6. Em `/admin/categorias`, clique em **"Criar categorias padrão"** para popular as categorias
   iniciais (Ação, Aventura, Puzzle, Corrida, Esportes, Tiro, Estratégia, Casual, Raciocínio).
7. Em `/admin/importar`, importe jogos em massa da GameMonetize ou GamePix — os feeds são
   públicos e não exigem cadastro/chave.

## Estrutura

```
src/
  app/            rotas (App Router)
  components/     componentes de UI reutilizáveis
  components/admin/  formulários usados só no painel admin
  lib/            acesso a dados (Firestore), auth, tipos, import de feeds
```

## Scripts

| Comando         | Ação                              |
| --------------- | ---------------------------------- |
| `npm run dev`   | Servidor de desenvolvimento        |
| `npm run build` | Build de produção                  |
| `npm run start` | Roda o build de produção           |
| `npm run lint`  | Lint do projeto                    |
