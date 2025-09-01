const express = require("express");
const axios = require("axios");
const cors = require("cors");
const fs = require("fs/promises");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());

// O db.json vai ser seu banco de dados
const dbPath = path.resolve(__dirname, 'db.json');

// Função de validação dos campos
function validarUsuario(usuario) {
    if (!usuario.nome) return "Nome é obrigatório.";
    if (!usuario.email || !usuario.email.includes("@")) return "Email inválido.";
    if (!usuario.dataNascimento) return "Data de nascimento é obrigatória.";
    if (!usuario.genero) return "Gênero é obrigatório.";
    if (typeof usuario.renda !== 'number' || usuario.renda < 0) return "Renda inválida.";
    if (!usuario.escolaridade || !usuario.escolaridade.nivel || !usuario.escolaridade.situacao) return "Dados de escolaridade incompletos.";
    if (!usuario.cep) return "CEP é obrigatório.";
    return null;
}

// ---------------------------
// ROTAS DE CRUD DE USUÁRIOS
// ---------------------------

// CREATE: Cadastra um novo usuário
app.post("/api/usuarios", async (req, res) => {
    const novoUsuario = req.body;
    const erroValidacao = validarUsuario(novoUsuario);

    if (erroValidacao) {
        return res.status(400).json({ erro: erroValidacao });
    }

    try {
        const cepResponse = await axios.get(`https://viacep.com.br/ws/${novoUsuario.cep}/json/`);
        const cepData = cepResponse.data;

        if (cepData.erro) {
            return res.status(400).json({ erro: 'CEP não encontrado.' });
        }
        
        novoUsuario.id = Date.now().toString(); 

        novoUsuario.estado = cepData.uf;
        novoUsuario.cidade = cepData.localidade;
        novoUsuario.bairro = cepData.bairro;
        novoUsuario.logradouro = cepData.logradouro;

        const db = JSON.parse(await fs.readFile(dbPath, 'utf8'));
        db.usuarios.push(novoUsuario);
        await fs.writeFile(dbPath, JSON.stringify(db, null, 2));

        res.status(201).json(novoUsuario);

    } catch (error) {
        res.status(500).json({ erro: 'Erro ao processar o CEP.' });
    }
});

// READ: Retorna todos os usuários
app.get("/api/usuarios", async (req, res) => {
    try {
        const db = JSON.parse(await fs.readFile(dbPath, 'utf8'));
        res.json(db.usuarios);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao ler os dados.' });
    }
});

// READ: Retorna um único usuário por ID
app.get("/api/usuarios/:id", async (req, res) => {
    try {
        const db = JSON.parse(await fs.readFile(dbPath, 'utf8'));
        const usuario = db.usuarios.find(u => u.id === req.params.id);
        if (usuario) {
            res.json(usuario);
        } else {
            res.status(404).json({ erro: 'Usuário não encontrado.' });
        }
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao buscar o usuário.' });
    }
});

// UPDATE: Atualiza um usuário existente
app.put("/api/usuarios/:id", async (req, res) => {
    const { id } = req.params;
    const dadosAtualizados = req.body;

    try {
        const db = JSON.parse(await fs.readFile(dbPath, 'utf8'));
        const index = db.usuarios.findIndex(u => u.id === id);

        if (index === -1) {
            return res.status(404).json({ erro: 'Usuário não encontrado.' });
        }

        db.usuarios[index] = { ...db.usuarios[index], ...dadosAtualizados };
        await fs.writeFile(dbPath, JSON.stringify(db, null, 2));

        res.json(db.usuarios[index]);

    } catch (error) {
        res.status(500).json({ erro: 'Erro ao atualizar o usuário.' });
    }
});

// DELETE: Deleta um usuário
app.delete("/api/usuarios/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const db = JSON.parse(await fs.readFile(dbPath, 'utf8'));
        const usuariosAntes = db.usuarios.length;
        db.usuarios = db.usuarios.filter(u => u.id !== id);
        
        if (usuariosAntes === db.usuarios.length) {
            return res.status(404).json({ erro: 'Usuário não encontrado.' });
        }

        await fs.writeFile(dbPath, JSON.stringify(db, null, 2));
        res.status(204).end();

    } catch (error) {
        res.status(500).json({ erro: 'Erro ao deletar o usuário.' });
    }
});

// ---------------------------
// ROTA DE MÉTRICAS
// ---------------------------
app.get("/api/metricas", async (req, res) => {
    try {
        const db = JSON.parse(await fs.readFile(dbPath, 'utf8'));
        const usuarios = db.usuarios;

        // CÁLCULOS DAS MÉTRICAS
        const total = usuarios.length;
        
        // Gênero
        const genero = usuarios.reduce((acc, u) => {
            acc[u.genero] = (acc[u.genero] || 0) + 1;
            return acc;
        }, { masculino: 0, feminino: 0, outro: 0 });

        // Por Estado
        const porEstado = usuarios.reduce((acc, u) => {
            acc[u.estado] = (acc[u.estado] || 0) + 1;
            return acc;
        }, {});

        // Faixa Etária
        const faixaEtaria = {
            'Até 13 anos': 0,
            '14 a 17 anos': 0,
            '18 a 24 anos': 0,
            '25 a 34 anos': 0,
            '35 a 49 anos': 0,
            '50+': 0
        };
        const hoje = new Date();
        usuarios.forEach(u => {
            const nasc = new Date(u.dataNascimento);
            let idade = hoje.getFullYear() - nasc.getFullYear();
            const m = hoje.getMonth() - nasc.getMonth();
            if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) {
                idade--;
            }
            if (idade <= 13) faixaEtaria['Até 13 anos']++;
            else if (idade <= 17) faixaEtaria['14 a 17 anos']++;
            else if (idade <= 24) faixaEtaria['18 a 24 anos']++;
            else if (idade <= 34) faixaEtaria['25 a 34 anos']++;
            else if (idade <= 49) faixaEtaria['35 a 49 anos']++;
            else faixaEtaria['50+']++;
        });

        // Renda
        const renda = {
            'Até R$1.520,00': { quantidade: 0, percentual: 0 },
            'Entre R$1.520,01 e R$2.999,99': { quantidade: 0, percentual: 0 },
            'Entre R$3.000,00 e R$4.999,99': { quantidade: 0, percentual: 0 },
            'Entre R$5.000,00 e R$7.999,99': { quantidade: 0, percentual: 0 },
            'Maior ou igual a R$8.000,00': { quantidade: 0, percentual: 0 }
        };
        usuarios.forEach(u => {
            const r = u.renda;
            if (r <= 1520) renda['Até R$1.520,00'].quantidade++;
            else if (r <= 2999.99) renda['Entre R$1.520,01 e R$2.999,99'].quantidade++;
            else if (r <= 4999.99) renda['Entre R$3.000,00 e R$4.999,99'].quantidade++;
            else if (r <= 7999.99) renda['Entre R$5.000,00 e R$7.999,99'].quantidade++;
            else renda['Maior ou igual a R$8.000,00'].quantidade++;
        });
        for (const key in renda) {
            renda[key].percentual = (renda[key].quantidade / total) * 100 || 0;
        }

        // Escolaridade
        const escolaridade = {
            'Ensino Fundamental': { quantidade: 0, percentual: 0, situacoes: {} },
            'Ensino Médio': { quantidade: 0, percentual: 0, situacoes: {} },
            'Técnico': { quantidade: 0, percentual: 0, situacoes: {} },
            'Superior': { quantidade: 0, percentual: 0, situacoes: {} },
            'Especialização/MBA': { quantidade: 0, percentual: 0, situacoes: {} },
            'Mestrado': { quantidade: 0, percentual: 0, situacoes: {} },
            'Doutorado': { quantidade: 0, percentual: 0, situacoes: {} }
        };

        usuarios.forEach(u => {
            const nivel = u.escolaridade.nivel;
            const situacao = u.escolaridade.situacao;

            if (escolaridade[nivel]) {
                escolaridade[nivel].quantidade++;
                escolaridade[nivel].situacoes[situacao] = (escolaridade[nivel].situacoes[situacao] || 0) + 1;
            }
        });

        for (const key in escolaridade) {
            escolaridade[key].percentual = (escolaridade[key].quantidade / total) * 100 || 0;
        }

        // Retorna todas as métricas
        res.json({
            total,
            genero,
            porEstado,
            faixaEtaria,
            renda,
            escolaridade
        });

    } catch (error) {
        res.status(500).json({ erro: 'Erro ao gerar métricas.' });
    }
});

// INICIAR SERVIDOR
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor Express rodando em http://localhost:${PORT}`);
});