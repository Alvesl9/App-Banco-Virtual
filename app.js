let contas = [];
let contaAtiva = null;
let saldoVisivel = false;

// Função para criar conta
document.querySelector('.user-icon').addEventListener('click', function () {
  abrirModal('Criar Conta', 'Insira o nome para nova conta:', criarConta);
});

function criarConta(nome) {
  if (nome) {
    const novaConta = {
      nome: nome,
      saldo: 0
    };
    contas.push(novaConta);
    alert(`Conta criada com sucesso!`);
    fecharModal();
    if (contas.length === 1) {
      contaAtiva = novaConta;
      atualizarConta();
      atualizarSaldo();
    }
  }
}

// Função para escolher a conta ativa
function escolherConta() {
  const contasDisponiveis = contas.map((conta, index) => `${index + 1} - ${conta.nome}`).join('\n');
  const escolha = prompt(`Escolha uma conta para acessar:\n${contasDisponiveis}`);
  const contaEscolhida = contas[escolha - 1];
  if (contaEscolhida) {
    contaAtiva = contaEscolhida;
    atualizarConta();
    atualizarSaldo();
  } else {
    alert('Conta inválida.');
  }
}

// Função para trocar de conta
function trocarConta() {
  const contasDisponiveis = contas.map((conta, index) => `${index + 1} - ${conta.nome}`).join('\n');
  const escolha = prompt(`Escolha uma conta para trocar:\n${contasDisponiveis}`);
  const contaEscolhida = contas[escolha - 1];
  if (contaEscolhida) {
    contaAtiva = contaEscolhida;
    atualizarConta();
    atualizarSaldo();
  } else {
    alert('Conta inválida.');
  }
}

// Função para depositar na conta ativa
function depositar() {
  if (contaAtiva) {
    abrirModal('Depositar', 'Valor para depósito (R$ 1.000,00):', function (valor) {
      const valorDeposito = validarValor(valor);
      if (valorDeposito !== null) {
        contaAtiva.saldo += valorDeposito;
        atualizarSaldo();
        fecharModal();
      }
    });
  } else {
    alert('Selecione uma conta antes de depositar.');
  }
}

function abrirModal(titulo, placeholder, callback) {
  const modal = document.getElementById('modal');
  modal.classList.add('active');
  modal.innerHTML = `
    <div class="modal-content">
      <h2>${titulo}</h2>
      <input type="text" id="modal-input" placeholder="${placeholder}">
      <button id="confirmar-btn">Confirmar</button>
      <button onclick="fecharModal()">Cancelar</button>
    </div>
  `;

  document.getElementById('confirmar-btn').addEventListener('click', function() {
    const valor = document.getElementById('modal-input').value;
    callback(valor);
  });
}

// Função Pix (sacar e enviar para outra conta)
function pix() {
  if (contaAtiva) {
      // Em vez de escolher outra conta para enviar Pix, 
      // o usuário irá sacar da conta ativa
      abrirModal('Sacar', 'Valor a sacar (R$):', function (valor) {
          const valorSaque = validarValor(valor);
          if (valorSaque !== null && contaAtiva.saldo >= valorSaque) {
              contaAtiva.saldo -= valorSaque;
              alert(`Saque realizado com sucesso!`);
              atualizarSaldo();
              fecharModal();
          } else {
              alert('Saldo insuficiente ou valor inválido.');
          }
      });
  } else {
      alert('Selecione uma conta antes de realizar o saque.');
  }
}
// Função para consultar saldo
function consultarSaldo() {
  if (contaAtiva) {
    alert(`Saldo atual: R$ ${contaAtiva.saldo.toFixed(2)}`);
  } else {
    alert('Selecione uma conta para consultar o saldo.');
  }
}

// Função para sair da conta
function sairConta() {
  contaAtiva = null;
  atualizarConta();
  atualizarSaldo();
  alert('Você saiu da conta.');
}

// Função para esconder/mostrar saldo
function toggleSaldo() {
  saldoVisivel = !saldoVisivel;
  atualizarSaldo();
}

// Função para formatar números no formato de moeda Real (R$)
function formatarMoeda(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Atualizar a exibição do saldo na interface com formato de moeda
function atualizarSaldo() {
  const balanceAmount = document.getElementById('balance-amount');
  if (contaAtiva) {
    balanceAmount.textContent = saldoVisivel ? formatarMoeda(contaAtiva.saldo) : 'R$ ******';
  } else {
    balanceAmount.textContent = 'R$ ******';
  }
}

// Função para validar e converter entrada para número
function validarValor(valor) {
  // Verifica se o valor é um número inteiro positivo
  if (!/^\d+$/.test(valor)) {
      alert('Por favor, insira apenas números inteiros.');
      return null;
  }

  // Converte o valor para número sem dividir por 100
  const valorNumerico = parseFloat(valor);
  return valorNumerico;
}

// Função para atualizar o menu com o número da conta
function atualizarConta() {
  const menuConta = document.getElementById('menu-conta');
  if (contaAtiva) {
    menuConta.textContent = `Conta: ${contas.indexOf(contaAtiva) + 1}`;
  } else {
    menuConta.textContent = '';
  }
}

// Funções de modal reutilizáveis
function abrirModal(titulo, placeholder, callback) {
  const modal = document.getElementById('modal');
  modal.classList.add('active');
  modal.innerHTML = `
    <div class="modal-content">
      <h2>${titulo}</h2>
      <input type="text" id="modal-input" placeholder="${placeholder}">
      <button onclick="confirmarModal(${callback})">Confirmar</button>
      <button onclick="fecharModal()">Cancelar</button>
    </div>
  `;
}

function confirmarModal(callback) {
  const valor = document.getElementById('modal-input').value;
  callback(valor);
}

function fecharModal() {
  const modal = document.getElementById('modal');
  modal.classList.remove('active');
}

