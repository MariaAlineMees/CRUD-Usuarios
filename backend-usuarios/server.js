const express = require('express');
const cors = require('cors');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const app = express();

// ✅ CORS para permitir acesso do frontend Angular
app.use(cors({ origin: 'http://localhost:4300' }));
app.options('*', cors()); // responde a preflight
app.use(express.json());

const BASE_URL = 'http://localhost:3001/usuarios';

// 🔹 Rota inicial
app.get('/', (req, res) => {
  res.send('API de Usuários está rodando!');
});

// 🔹 Listar usuários
app.get('/usuarios', async (req, res) => {
  try {
    const response = await fetch(BASE_URL);
    const usuarios = await response.json();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar usuários', detalhes: error.message });
  }
});

// 🔹 Criar usuário
app.post('/usuarios', async (req, res) => {
  try {
    const novoUsuario = req.body;
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novoUsuario)
    });
    const resultado = await response.json();
    res.status(201).json(resultado);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao criar usuário', detalhes: error.message });
  }
});

// 🔹 Atualizar usuário
app.put('/usuarios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const dadosAtualizados = req.body;
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dadosAtualizados)
    });
    const resultado = await response.json();
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao atualizar usuário', detalhes: error.message });
  }
});

// 🔹 Deletar usuário
app.delete('/usuarios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao deletar usuário', detalhes: error.message });
  }
});

// 🔹 Métricas
app.get('/metricas', async (req, res) => {
  try {
    const response = await fetch(BASE_URL);
    const usuarios = await response.json();

    const total = usuarios.length;

    const genero = {
      masculino: usuarios.filter(u => u.genero === 'masculino').length,
      feminino: usuarios.filter(u => u.genero === 'feminino').length,
      outro: usuarios.filter(u => u.genero === 'outro').length
    };

    const porEstado = {};
    usuarios.forEach(u => {
      porEstado[u.estado] = (porEstado[u.estado] || 0) + 1;
    });

    const calcularIdade = (dataNascimento) => {
      const hoje = new Date();
      const nascimento = new Date(dataNascimento);
      let idade = hoje.getFullYear() - nascimento.getFullYear();
      const m = hoje.getMonth() - nascimento.getMonth();
      if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
        idade--;
      }
      return idade;
    };

    const faixaEtaria = {
      "Até 13": 0,
      "14-17": 0,
      "18-24": 0,
      "25-34": 0,
      "35-49": 0,
      "50+": 0
    };

    usuarios.forEach(u => {
      const idade = calcularIdade(u.dataNascimento);
      if (idade <= 13) faixaEtaria["Até 13"]++;
      else if (idade <= 17) faixaEtaria["14-17"]++;
      else if (idade <= 24) faixaEtaria["18-24"]++;
      else if (idade <= 34) faixaEtaria["25-34"]++;
      else if (idade <= 49) faixaEtaria["35-49"]++;
      else faixaEtaria["50+"]++;
    });

    const faixaRenda = {
      "Até 1.520": 0,
      "1.520,01 - 2.999,99": 0,
      "3.000 - 4.999,99": 0,
      "5.000 - 7.999,99": 0,
      "8.000+": 0
    };

    usuarios.forEach(u => {
      const r = u.renda;
      if (r <= 1520) faixaRenda["Até 1.520"]++;
      else if (r <= 2999.99) faixaRenda["1.520,01 - 2.999,99"]++;
      else if (r <= 4999.99) faixaRenda["3.000 - 4.999,99"]++;
      else if (r <= 7999.99) faixaRenda["5.000 - 7.999,99"]++;
      else faixaRenda["8.000+"]++;
    });

    const escolaridade = {};
    usuarios.forEach(u => {
      const chave = `${u.escolaridade.nivel} (${u.escolaridade.situacao})`;
      escolaridade[chave] = (escolaridade[chave] || 0) + 1;
    });

    res.json({
      totalUsuarios: total,
      genero,
      porEstado,
      faixaEtaria,
      faixaRenda,
      escolaridade
    });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao calcular métricas", detalhes: error.message });
  }
});

// 🚀 Iniciar o servidor
app.listen(3000, () => {
  console.log('Servidor Express rodando em http://localhost:3000');
});