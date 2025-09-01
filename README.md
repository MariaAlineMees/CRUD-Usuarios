# 🚀 CRUD de Usuários com Métricas (Node.js & Angular)

Este é um projeto **full-stack** que implementa um sistema completo de **cadastro e gerenciamento de usuários**.  
Desenvolvido durante o curso **+Devs2Blu** com o professor **Ralf Lima** 👨‍🏫.

A aplicação é dividida em dois componentes principais:  
📦 **Back-end** com Node.js + Express  
🎨 **Front-end** com Angular

---

## ✨ Funcionalidades

### 📋 Cadastro de Usuários (CRUD)
* ✅ **Criar (CREATE):** Cadastro de novos usuários com validação de campos obrigatórios:  
  Nome, E-mail, Data de Nascimento, Gênero, Renda, Escolaridade e CEP.
* 🔍 **Ler (READ):**
  * Listagem de todos os usuários cadastrados.
  * Busca de um único usuário por ID.
* ✏️ **Atualizar (UPDATE):** Edição das informações de um usuário existente.
* 🗑️ **Deletar (DELETE):** Remoção de um usuário do sistema.

### 📊 Métricas e Análise
Uma rota especial de métricas fornece uma visão analítica dos usuários cadastrados:
* 👥 Total de usuários
* ⚧️ Distribuição por gênero
* 🗺️ Distribuição por estado (via ViaCEP)
* 🎂 Distribuição por faixa etária
* 💰 Distribuição por faixa de renda (quantidade e percentual)
* 🎓 Distribuição por grau de escolaridade (quantidade, percentual e situação)

---

## 🌐 Integrações

* 🔗 **ViaCEP API:** Busca automática de estado, cidade, bairro e logradouro a partir do CEP.
* 🛠️ **Node.js + Express:** Back-end com rotas REST para CRUD e métricas.
* 🧩 **Angular:** Front-end interativo e reativo para cadastro e visualização de métricas.

---

## 📁 Estrutura do Projeto

O projeto está organizado em duas pastas principais na raiz do repositório:
crud-usuarios/ ├── backend-usuarios/   # Código do servidor Node.js └── frontend-usuarios/  # Código do projeto Angular


---

## 🛠️ Como Rodar o Projeto

### 🔧 Pré-requisitos
Certifique-se de ter o Node.js e o npm instalados. Para o front-end, você precisará do Angular CLI:

* [Node.js](https://nodejs.org/)
* [Angular CLI](https://angular.io/cli)

---

### ▶️ 1. Iniciar o Back-end

```bash
cd backend-usuarios
npm install
npm start
```

O servidor estará rodando em:
📍 http://localhost:3000

▶️ 2. Iniciar o Front-end
```bash
cd frontend-usuarios
npm install
ng serve
```

A aplicação estará disponível em:
📍 http://localhost:4200

🤝 Contribuição: 
Se tiver sugestões de melhoria ou encontrar problemas, sinta-se à vontade para abrir uma issue ou enviar um pull request.

👩🏻‍💻 Projeto desenvolvido por Maria Aline Mees, como parte dos estudos durante o curso +Devs2Blu! 💙



