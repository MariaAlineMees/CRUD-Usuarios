const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

// 🔍 Validação dos dados do usuário
function validarUsuario(usuario) {
  if (!usuario.nome || usuario.nome.length < 3) {
    throw new Error("Nome inválido");
  }

  if (!usuario.email || !usuario.email.includes("@")) {
    throw new Error("Email inválido");
  }

  if (!usuario.dataNascimento || isNaN(Date.parse(usuario.dataNascimento))) {
    throw new Error("Data de nascimento inválida");
  }

  if (!["masculino", "feminino", "outro"].includes(usuario.genero)) {
    throw new Error("Gênero inválido");
  }

  if (typeof usuario.renda !== "number" || usuario.renda < 0) {
    throw new Error("Renda inválida");
  }

  if (
    !usuario.escolaridade ||
    !usuario.escolaridade.nivel ||
    !usuario.escolaridade.situacao
  ) {
    throw new Error("Escolaridade incompleta");
  }

  if (!usuario.cep || usuario.cep.length < 8) {
    throw new Error("CEP inválido");
  }
}

// 📦 Busca o endereço via API do ViaCEP
async function buscarEndereco(cep) {
  const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
  const data = await response.json();
  if (data.erro) throw new Error("CEP inválido");

  return {
    estado: data.uf,
    cidade: data.localidade,
    bairro: data.bairro,
    logradouro: data.logradouro
  };
}

// 🧩 Cadastra o usuário completo
async function cadastrarUsuario(dadosBasicos) {
  try {
    validarUsuario(dadosBasicos); // Valida os dados

    const endereco = await buscarEndereco(dadosBasicos.cep);

    const usuarioCompleto = {
      ...dadosBasicos,
      ...endereco
    };

    const response = await fetch('http://localhost:3001/usuarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(usuarioCompleto)
    });

    const resultado = await response.json();
    console.log("✅ Usuário cadastrado com sucesso:");
    console.log(resultado);
  } catch (error) {
    console.error("❌ Erro ao cadastrar usuário:", error.message);
  }
}

// 🧪 Dados básicos do usuário para teste
const novoUsuario = {
  nome: "Aline Souza",
  email: "aline@email.com",
  dataNascimento: "1995-08-31",
  genero: "feminino",
  renda: 3500.00,
  escolaridade: {
    nivel: "Superior",
    situacao: "Concluído"
  },
  cep: "89010-000"
};

cadastrarUsuario(novoUsuario);