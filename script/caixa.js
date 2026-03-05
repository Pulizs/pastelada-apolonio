import { db } from './firebase-config.js';
import { 
    collection, 
    query, 
    where, 
    getDocs,
    doc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const inputBusca = document.getElementById('inputBusca');
const buscaButtons = document.querySelectorAll('button');
const btnBuscar = buscaButtons[buscaButtons.length - 2]; // Botão BUSCAR
const statusCard = document.getElementById('statusCard');
const btnEntrega = document.getElementById('btnEntrega');

let pedidoAtual = null;

// Buscar por nome ou telefone
async function buscarPedido(termo) {
    const q = query(
        collection(db, "vendas"), 
        where("status", "==", "pago")
    );
    
    const snapshot = await getDocs(q);
    const termo_lower = termo.toLowerCase();
    
    let encontrado = null;
    
    snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.nome.toLowerCase().includes(termo_lower) || 
            data.whatsapp.includes(termo)) {
            encontrado = { id: doc.id, ...data };
        }
    });
    
    if (encontrado) {
        mostrarPedido(encontrado);
    } else {
        alert('Pedido não encontrado ou ainda não foi pago!');
        statusCard.classList.add('hidden');
    }
}

function mostrarPedido(pedido) {
    pedidoAtual = pedido;
    document.getElementById('resNome').innerText = pedido.nome;
    document.getElementById('resTipo').innerText = pedido.tipo === 'combo' 
        ? 'COMBO PASTEL + REFRI' 
        : 'PASTEL AVULSO';
    document.getElementById('resTel').innerText = pedido.whatsapp;
    
    statusCard.classList.remove('hidden');
}

btnBuscar.addEventListener('click', () => {
    const termo = inputBusca.value.trim();
    if (termo) {
        buscarPedido(termo);
    } else {
        alert('Digite o nome ou telefone do cliente!');
    }
});

inputBusca.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        btnBuscar.click();
    }
});

// Confirmar entrega
btnEntrega.addEventListener('click', async () => {
    if (!pedidoAtual) return;
    
    if (confirm('Confirmar entrega deste pedido?')) {
        try {
            const docRef = doc(db, "vendas", pedidoAtual.id);
            await updateDoc(docRef, { 
                status: "entregue",
                dataEntrega: new Date()
            });
            
            alert('✓ Entrega confirmada!');
            statusCard.classList.add('hidden');
            inputBusca.value = '';
            pedidoAtual = null;
        } catch (e) {
            alert('Erro ao confirmar entrega: ' + e.message);
        }
    }
});
