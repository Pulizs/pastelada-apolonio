import { db } from './firebase-config.js';
import { 
    collection, 
    query, 
    where, 
    onSnapshot, 
    doc, 
    updateDoc, 
    deleteDoc 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const listaContainer = document.getElementById('listaPendentes');
const contador = document.getElementById('contadorPendentes');

// Escuta em tempo real apenas os PENDENTES
const q = query(collection(db, "vendas"), where("status", "==", "pendente"));

onSnapshot(q, (snapshot) => {
    listaContainer.innerHTML = '';
    contador.innerText = `${snapshot.size} pedidos`;

    if (snapshot.empty) {
        listaContainer.innerHTML = '<p class="text-center text-gray-400 py-10">Tudo em dia! Nenhum pagamento pendente.</p>';
        return;
    }

    snapshot.forEach((pedido) => {
        const data = pedido.data();
        const card = document.createElement('div');
        card.className = "bg-white p-5 rounded-2xl shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 hover:shadow-md transition";
        
        card.innerHTML = `
            <div class="flex-1">
                <h3 class="font-black text-royal-blue uppercase">${data.nome}</h3>
                <p class="text-sm text-gray-500">${data.whatsapp} • <span class="font-bold text-royal-blue">${data.tipo.toUpperCase()}</span></p>
                <p class="text-lg font-bold text-green-600">R$ ${data.valor.toFixed(2)}</p>
            </div>
            <div class="flex gap-2 w-full md:w-auto">
                <button onclick="confirmarPagamento('${pedido.id}')" class="flex-1 bg-green-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-green-700 transition">
                    APROVAR
                </button>
                <button onclick="cancelarPedido('${pedido.id}')" class="bg-red-50 text-red-600 px-4 py-3 rounded-xl font-bold text-sm hover:bg-red-100 transition">
                    EXCLUIR
                </button>
            </div>
        `;
        listaContainer.appendChild(card);
    });
});

// Funções globais para os botões do card
window.confirmarPagamento = async (id) => {
    if(confirm("Confirma que o valor caiu na conta?")){
        const docRef = doc(db, "vendas", id);
        await updateDoc(docRef, { status: "pago" });
    }
};

window.cancelarPedido = async (id) => {
    if(confirm("Deseja realmente excluir este pedido pendente?")){
        await deleteDoc(doc(db, "vendas", id));
    }
};