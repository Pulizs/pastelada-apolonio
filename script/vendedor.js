import { db } from './firebase-config.js';
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Quantidades
const quantidades = {
    pastel: 0,
    combo: 0,
    agua: 0,
    refri: 0,
    suco: 0
};

// Histórico de vendas
const historico = [];

// Dados do dia
let totalArrecadado = 0;
let vendidosPastel = 0;
let vendidosCombo = 0;
let vendidosBebidas = 0;

// Preços
const precos = {
    pastel: 10,
    combo: 15,
    agua: 3,
    refri: 5,
    suco: 5
};

// Nomes dos produtos
const nomes = {
    pastel: 'Pastel Avulso',
    combo: 'Combo',
    agua: 'Água',
    refri: 'Refri Lata',
    suco: 'Suco Lata'
};

// Aumentar quantidade
window.aumentar = (tipo) => {
    quantidades[tipo]++;
    atualizarDisplay(tipo);
};

// Diminuir quantidade
window.diminuir = (tipo) => {
    if (quantidades[tipo] > 0) {
        quantidades[tipo]--;
        atualizarDisplay(tipo);
    }
};

// Atualizar display da quantidade
function atualizarDisplay(tipo) {
    const idMap = {
        pastel: 'qtdPastel',
        combo: 'qtdCombo',
        agua: 'qtdAgua',
        refri: 'qtdRefri',
        suco: 'qtdSuco'
    };
    document.getElementById(idMap[tipo]).innerText = quantidades[tipo];
}

// Vender produto
window.venderProduto = async (tipo, nome, preco) => {
    const qtd = quantidades[tipo];
    
    if (qtd <= 0) {
        alert('Selecione uma quantidade!');
        return;
    }
    
    try {
        // Registrar no Firebase
        const venda = {
            tipo: tipo,
            nome: nome,
            quantidade: qtd,
            valor_unitario: preco,
            total: qtd * preco,
            data: new Date(),
            timestamp: new Date().toLocaleTimeString('pt-BR')
        };
        
        await addDoc(collection(db, "vendas_presenciais"), venda);
        
        // Atualizar totais
        totalArrecadado += qtd * preco;
        
        if (tipo === 'pastel') vendidosPastel += qtd;
        if (tipo === 'combo') vendidosCombo += qtd;
        if (['agua', 'refri', 'suco'].includes(tipo)) vendidosBebidas += qtd;
        
        // Adicionar ao histórico
        historico.push({
            nome: nome,
            quantidade: qtd,
            total: qtd * preco,
            hora: new Date().toLocaleTimeString('pt-BR')
        });
        
        // Resetar quantidade
        quantidades[tipo] = 0;
        atualizarDisplay(tipo);
        
        // Atualizar interface
        atualizarResumo();
        
        // Feedback visual
        const btn = event.target;
        const bgOriginal = btn.className;
        btn.innerText = '✓ VENDIDO!';
        btn.classList.add('bg-green-600', 'hover:bg-green-700');
        setTimeout(() => {
            btn.innerText = 'VENDER';
            btn.className = bgOriginal;
        }, 1500);
        
    } catch (e) {
        alert('Erro ao registrar venda: ' + e.message);
    }
};

// Atualizar resumo
function atualizarResumo() {
    document.getElementById('vendidosPastel').innerText = vendidosPastel;
    document.getElementById('vendidosCombo').innerText = vendidosCombo;
    document.getElementById('totalArrecadado').innerText = `R$ ${totalArrecadado.toFixed(2)}`;
    document.getElementById('totalBebidas').innerText = `${vendidosBebidas} unidades`;
    
    // Atualizar histórico
    const historicoDiv = document.getElementById('historicoVendas');
    if (historico.length === 0) {
        historicoDiv.innerHTML = '<p class="text-center text-gray-400 text-sm">Nenhuma venda registrada ainda</p>';
    } else {
        historicoDiv.innerHTML = historico.map((venda, idx) => `
            <div class="bg-gray-50 p-3 rounded-lg border border-gray-200 flex justify-between items-center">
                <div class="flex-1">
                    <p class="font-bold text-sm text-gray-700">${venda.nome}</p>
                    <p class="text-xs text-gray-500">Qt: ${venda.quantidade} | ${venda.hora}</p>
                </div>
                <p class="font-bold text-green-600">R$ ${venda.total.toFixed(2)}</p>
            </div>
        `).reverse().join('');
    }
}

// Exportar dados
window.exportarDados = () => {
    const dados = {
        data: new Date().toLocaleDateString('pt-BR'),
        vendas: historico,
        totalPasteis: vendidosPastel,
        totalCombos: vendidosCombo,
        totalBebidas: vendidosBebidas,
        totalArrecadado: totalArrecadado
    };
    
    const csv = [
        ['RELATÓRIO DE VENDAS PRESENCIAIS'],
        ['Data: ' + dados.data],
        [],
        ['RESUMO'],
        ['Pastéis Avulsos', vendidosPastel],
        ['Combos', vendidosCombo],
        ['Bebidas', vendidosBebidas],
        ['Total Arrecadado', 'R$ ' + totalArrecadado.toFixed(2)],
        [],
        ['DETALHAMENTO'],
        ['Produto', 'Quantidade', 'Valor', 'Hora'],
        ...historico.map(v => [v.nome, v.quantidade, 'R$ ' + v.total.toFixed(2), v.hora])
    ];
    
    const csvContent = csv.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vendas_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    alert('✓ Dados exportados com sucesso!');
};

// Inicializar
atualizarResumo();
