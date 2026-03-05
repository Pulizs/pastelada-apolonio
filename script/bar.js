import { db } from './firebase-config.js';
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Quantities
const quantidades = {
    agua: 0,
    refri: 0,
    suco: 0
};

// Carrinho
const carrinho = [];

// Preços
const precos = {
    agua: 3,
    refri: 5,
    suco: 5
};

// Nomes das bebidas
const nomes = {
    agua: 'Água',
    refri: 'Refri Lata',
    suco: 'Suco Lata'
};

// Aumentar quantidade
window.aumentar = (tipo) => {
    quantidades[tipo]++;
    document.getElementById('qtd' + (tipo === 'agua' ? 'Agua' : tipo.charAt(0).toUpperCase() + tipo.slice(1))).innerText = quantidades[tipo];
};

// Diminuir quantidade
window.diminuir = (tipo) => {
    if (quantidades[tipo] > 0) {
        quantidades[tipo]--;
        document.getElementById('qtd' + (tipo === 'agua' ? 'Agua' : tipo.charAt(0).toUpperCase() + tipo.slice(1))).innerText = quantidades[tipo];
    }
};

// Adicionar ao carrinho
window.adicionarCarrinho = (tipo, nome, preco) => {
    const qtd = quantidades[tipo];
    
    if (qtd <= 0) {
        alert('Selecione uma quantidade!');
        return;
    }
    
    // Adicionar ao carrinho
    for (let i = 0; i < qtd; i++) {
        carrinho.push({
            tipo: tipo,
            nome: nome,
            preco: preco
        });
    }
    
    // Resetar quantidade
    quantidades[tipo] = 0;
    document.getElementById('qtd' + (tipo === 'agua' ? 'Agua' : tipo.charAt(0).toUpperCase() + tipo.slice(1))).innerText = '0';
    
    // Atualizar interface
    atualizarCarrinho();
};

// Atualizar carrinho
function atualizarCarrinho() {
    const listaProdutos = document.getElementById('listaProdutos');
    
    if (carrinho.length === 0) {
        listaProdutos.innerHTML = '<p class="text-center text-gray-400 py-10">Carrinho vazio. Adicione bebidas acima.</p>';
        document.getElementById('contadorCarrinho').innerText = '0 itens';
        document.getElementById('totalCarrinho').innerText = 'R$ 0,00';
        document.getElementById('btnConfirmar').disabled = true;
        return;
    }
    
    // Agrupar bebidas
    const agrupadas = {};
    carrinho.forEach(item => {
        if (!agrupadas[item.tipo]) {
            agrupadas[item.tipo] = { nome: item.nome, preco: item.preco, qtd: 0 };
        }
        agrupadas[item.tipo].qtd++;
    });
    
    // Renderizar
    listaProdutos.innerHTML = '';
    let total = 0;
    
    Object.entries(agrupadas).forEach(([tipo, dados]) => {
        const subtotal = dados.qtd * dados.preco;
        total += subtotal;
        
        const card = document.createElement('div');
        card.className = 'flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-200';
        card.innerHTML = `
            <div>
                <p class="font-bold text-gray-700">${dados.nome}</p>
                <p class="text-sm text-gray-500">R$ ${dados.preco},00 x ${dados.qtd}</p>
            </div>
            <div class="text-right">
                <p class="font-bold text-royal-blue text-lg">R$ ${subtotal.toFixed(2)}</p>
                <button onclick="removerDoCarrinho('${tipo}')" class="text-xs text-red-600 hover:text-red-700 font-bold mt-1">Remover</button>
            </div>
        `;
        listaProdutos.appendChild(card);
    });
    
    document.getElementById('contadorCarrinho').innerText = `${carrinho.length} itens`;
    document.getElementById('totalCarrinho').innerText = `R$ ${total.toFixed(2)}`;
    document.getElementById('btnConfirmar').disabled = false;
}

// Remover do carrinho
window.removerDoCarrinho = (tipo) => {
    const index = carrinho.findIndex(item => item.tipo === tipo);
    if (index > -1) {
        carrinho.splice(index, 1);
        atualizarCarrinho();
    }
};

// Confirmar venda
window.confirmarVenda = async () => {
    if (carrinho.length === 0) {
        alert('Carrinho vazio!');
        return;
    }
    
    // Calcular total
    let total = 0;
    const items = {};
    
    carrinho.forEach(item => {
        total += item.preco;
        if (!items[item.tipo]) {
            items[item.tipo] = { nome: item.nome, qtd: 0 };
        }
        items[item.tipo].qtd++;
    });
    
    try {
        // Salvar no Firebase
        const venda = {
            tipo: 'bebida_bar',
            items: items,
            total: total,
            data: new Date(),
            status: 'vendido'
        };
        
        await addDoc(collection(db, "vendas_bar"), venda);
        
        alert('✓ Venda registrada com sucesso!');
        
        // Limpar carrinho
        carrinho.length = 0;
        atualizarCarrinho();
        
    } catch (e) {
        alert('Erro ao registrar venda: ' + e.message);
    }
};
