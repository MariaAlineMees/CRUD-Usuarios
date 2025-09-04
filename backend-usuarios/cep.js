const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function buscarEndereco(cep) {
  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await response.json();

    if (data.erro) {
      console.log("❌ CEP inválido.");
      return;
    }

    console.log("✅ Endereço encontrado:");
    console.log(`Estado: ${data.uf}`);
    console.log(`Cidade: ${data.localidade}`);
    console.log(`Bairro: ${data.bairro}`);
    console.log(`Logradouro: ${data.logradouro}`);
  } catch (error) {
    console.error("❌ Erro ao buscar o CEP:", error.message);
  }
}

// Teste com um CEP real
buscarEndereco("89010-000");