# Administrative Backoffice Frontend

Backoffice administrativo em React + TypeScript para gestão de usuários, pedidos e comissões.

---

## Como rodar o projeto

### Pré-requisitos

- **Node.js** (versão 18+ recomendada)
- **npm** (ou yarn/pnpm)

### Instalação e execução

```bash
# Instalar dependências
npm install

# Rodar em modo desenvolvimento (com hot reload)
npm run dev
```

O app estará disponível em **http://localhost:5173** (ou outra porta indicada no terminal).

### Outros comandos

| Comando        | Descrição                          |
|----------------|------------------------------------|
| `npm run build`| Build de produção                  |
| `npm run preview` | Preview do build de produção    |
| `npm run lint` | Executar ESLint                    |
| `npm run test` | Rodar testes (Vitest) em watch     |
| `npm run test:run` | Rodar testes uma vez (CI)   |

---

## Estrutura de pastas e organização

```
src/
├── api/                    # Camada de dados (mock + servidor)
│   ├── controllers/        # Rotas do MirageJS por domínio
│   ├── mocks/              # Seeds (usuários, pedidos, comissões)
│   ├── services/           # Lógica de negócio e acesso aos dados
│   │   └── tests/          # Testes dos services
│   └── server.ts           # Configuração do MirageJS (modelos, rotas, seeds)
├── components/
│   ├── layout/             # MainLayout, Navbar
│   └── ui/                 # Componentes reutilizáveis (shadcn-style)
│       └── tests/
├── hooks/                  # Hooks de dados (React Query) e utilitários
│   └── tests/
├── lib/                    # Utilitários (ex: cn, formatação)
│   └── tests/
├── pages/                  # Páginas por rota (Dashboard, Users, Orders, Commissions)
├── types/                  # Tipos TypeScript (user, order, commission, dashboard)
├── App.tsx
├── main.tsx
└── index.css
```

- **`api/`**: Toda a “API” hoje é simulada pelo **MirageJS** (apenas em `DEV`). Os **controllers** registram rotas; os **services** implementam listagem, filtros, atualização etc.; os **mocks** alimentam o banco em memória.
- **`hooks/`**: Hooks como `useUsers`, `useOrders`, `useDashboard` fazem `fetch` para `/api/...` e usam **TanStack React Query** para cache e estado.
- **`components/ui/`**: Componentes de interface (botão, card, modal, paginação, toast, etc.) inspirados em padrões tipo shadcn/ui.
- **`pages/`**: Uma pasta por rota, com a página principal e modais de detalhe quando existem (ex.: `UserDetailModal`, `OrderDetailModal`).

---

## Organização de páginas, hooks e componentes

A lógica fica nos **hooks**; as **páginas** e os **componentes** ficam focados em layout e apresentação.

### Páginas

- Cada rota tem uma pasta em `pages/` (ex.: `Dashboard/`, `Users/`, `Orders/`, `Commissions/`) com um `index.tsx` que exporta o componente da página.
- As páginas são **finas**: importam um ou mais hooks, desestruturam o retorno e usam no JSX. Não concentram `useState`, `useMemo` ou regras de negócio; isso fica nos hooks.
- Modais específicos daquela tela ficam na mesma pasta (ex.: `Users/UserDetailModal.tsx`, `Orders/OrderDetailModal.tsx`), pois são usados só ali.
- Fluxo típico: hook de página → dados, filtros, paginação, estado do modal → página renderiza header, painel de filtros, tabela, paginação e modal.

### Hooks

- **Hooks de dados (API)**  
  Ex.: `useUsers`, `useOrders`, `useCommissions`, `useDashboard`.  
  Fazem `fetch` para `/api/...` e usam **React Query** (`useQuery`/`useMutation`). Recebem filtros (ou nada) e devolvem `{ data, isLoading, error }` (e `mutate` quando há escrita). Ficam em `hooks/`.

- **Hooks de página**  
  Ex.: `useUsersPage`, `useOrdersPage`, `useCommissionsPage`.  
  Encapsulam toda a lógica da tela: estado do painel de filtros, `useFilters`, debounce (quando existe), chamada ao hook de dados, paginação (página, tamanho, “resetar página ao mudar filtro”), lista paginada em `useMemo`, estado do modal de detalhe (abrir/fechar, item selecionado). A página só consome o retorno do hook. Também em `hooks/`.

- **Hooks de UI / domínio da página**  
  Ex.: `useDashboardCharts`, `useDashboardStatsCards`.  
  Quando uma tela tem lógica mais pesada (ex.: transformar dados para gráficos, montar opções de eixos, montar lista de cards de resumo), essa lógica fica em hooks dedicados. Recebem os dados já carregados (ex.: `data` do dashboard) e retornam estruturas prontas para o JSX (ex.: `ordersChartOptions`, `statsCards`).

- **Hooks utilitários**  
  Ex.: `useFilters`, `useDebouncedValue`.  
  Genéricos, reutilizáveis entre páginas, em `hooks/`.

Constantes da tela (labels de status, filtros iniciais, tempo de debounce) ficam **dentro do hook** da página ou do hook de UI, não soltas no componente.

### Componentes

- **`components/layout/`**  
  Componentes de estrutura global: `MainLayout`, `Navbar`. Usados em `App` ou no roteador.

- **`components/ui/`**  
  Componentes reutilizáveis de interface (botão, input, card, modal, select, paginação, toast, etc.). Cada arquivo exporta **apenas componentes** (ou um componente + tipos), para não quebrar Fast Refresh: constantes e funções compartilhadas vão para arquivos separados (ex.: `button-variants.ts`, `badge-variants.ts`, `use-toast.ts`, `toast-context.tsx`).

- **Modais de detalhe**  
  Ficam na pasta da página que os usa (`UserDetailModal` em `Users/`, `OrderDetailModal` em `Orders/`). Podem ter um subcomponente interno (ex.: `OrderFormBody`) para isolar estado do formulário e usar `key` para resetar ao trocar o item selecionado.

Resumindo: **páginas** = JSX + chamada a hooks; **hooks** = estado, dados, filtros, paginação, transformações; **componentes** = apresentação reutilizável ou específica da página.

---

## Como os dados são consumidos e manipulados

### Fluxo geral

1. **MirageJS** (apenas em desenvolvimento) sobe um servidor fictício em `/api` e intercepta `fetch` para essas rotas. Ele é inicializado em `main.tsx` quando `import.meta.env.DEV` é verdadeiro.

2. **Models e seeds** (`api/server.ts`):  
   - Modelos: `user`, `order`, `commission` com relacionamentos (`hasMany`/`belongsTo`).  
   - Seeds: dados iniciais vêm de `api/mocks/users.ts`, `orders.ts` e `commissions.ts`.

3. **Controllers** (`api/controllers/*.ts`):  
   - Registram rotas no namespace `api` (ex.: `GET /api/users`, `GET /api/users/:id`, `PATCH /api/users/:id`).  
   - Delegam a lógica para os **services**.

4. **Services** (`api/services/*.ts`):  
   - Recebem `schema` (banco em memória do Mirage) e `request` (params, query, body).  
   - Implementam listagem com filtros (status, tipo, busca), get por id e atualização (ex.: usuário).  
   - O **dashboard.service** agrega dados dos três modelos (totais, por status, melhores vendedores, etc.) e devolve um único objeto para o dashboard.

5. **Hooks** (`hooks/useUsers.ts`, `useOrders.ts`, etc.):  
   - Fazem `fetch` para as rotas acima (ex.: `/api/users?status=ativo&search=...`).  
   - Usam **TanStack React Query** (`useQuery`/`useMutation`) com `queryKey` baseada em filtros, para cache e refetch automático.

6. **Páginas**:  
   - Usam os hooks e repassam dados para tabelas, filtros, modais e gráficos (ex.: react-charts no dashboard).

### Resumo

- **Leitura**: Página → Hook (React Query) → `fetch('/api/...')` → Mirage → Controller → Service → schema (dados em memória) → JSON na resposta.  
- **Escrita** (ex.: editar usuário): Página → mutation/`fetch` PATCH → Mirage → Controller → Service → `schema.find(...).update(attrs)` → resposta.

Os dados são portanto **manipulados em memória** pelo Mirage; não há persistência nem API real ainda.

---

## Decisões técnicas relevantes

| Tecnologia | Motivo |
|------------|--------|
| **React 19** | Stack moderna, suporte a recursos recentes do React. |
| **TypeScript** | Tipagem estática, melhor autocomplete e menos bugs em tempo de desenvolvimento. |
| **Vite** | Build e dev server rápidos, HMR eficiente, boa experiência para React + TS. |
| **TanStack React Query** | Cache de requisições, estados de loading/error, refetch e invalidação por chave (ex.: `['users', filters]`), evitando estado global manual para dados do servidor. |
| **MirageJS** | Simula uma API REST em memória durante o desenvolvimento; permite desenvolver e testar o front sem backend, com modelos, relacionamentos e seeds. |
| **React Router DOM v7** | Roteamento declarativo (Dashboard, Usuários, Pedidos, Comissões, página de erro 500). |
| **Radix UI** (Popover, Select, Slot) | Componentes acessíveis e sem estilo, usados como base para Select, DatePicker, etc. |
| **Tailwind CSS** | Estilização utilitária e consistente; uso com `tailwind-merge` e `class-variance-authority` (cva) para variantes de componentes. |
| **Lucide React** | Ícones leves e consistentes. |
| **date-fns** | Formatação e manipulação de datas (ex.: filtros e exibição em listas). |
| **react-charts** | Gráficos no dashboard (ex.: pedidos por status, comissões). |
| **Vitest + Testing Library** | Testes unitários e de componentes em ambiente Node com jsdom; testes dos services e de componentes críticos (ex.: paginação, hooks). |

O alias `@/` (em `vite.config.ts`) aponta para `src/`, permitindo imports como `@/types/user` e `@/components/ui/button`.

---

## Pontos de melhoria e limitações

### Principal: implementar a conexão com a API real

Hoje **todos os dados vêm do MirageJS**, que só roda em desenvolvimento. Para produção:

1. **Desligar o Mirage em produção**  
   Já está condicionado a `import.meta.env.DEV` em `main.tsx`; em build de produção o Mirage não sobe.

2. **Introduzir uma camada de cliente HTTP**  
   - Criar um módulo (ex.: `src/api/client.ts`) que concentra as chamadas `fetch` (ou use axios/fetch wrapper) para uma **base URL** configurável (ex.: `import.meta.env.VITE_API_URL`).  
   - Os **hooks** devem usar esse cliente em vez de `fetch('/api/...')` direto, para que apontem para o backend real (ex.: `GET ${baseURL}/users`).

3. **Tratamento de erros e autenticação**  
   - Tratar status 401/403 (redirecionar para login ou exibir mensagem).  
   - Interceptor ou wrapper no cliente para token (ex.: header `Authorization`) se a API exigir.

4. **Testes E2E**
   - Adicionar Cypress ou Playwright para fluxos críticos (listar usuários, filtrar, abrir detalhe, editar).
5. **Acessibilidade**
   - Revisar foco, labels e ARIA nos componentes de formulário e modais.
6. **Internacionalização**
   - Se o produto for multilíngue, introduzir i18n (ex.: react-i18next) e extrair textos das páginas.

---

## Scripts de referência

```bash
npm install    # Instalar dependências
npm run dev    # Desenvolvimento (Mirage ativo em /api)
npm run build  # Build de produção (sem Mirage)
npm run test   # Testes (Vitest)
npm run lint   # ESLint
```
