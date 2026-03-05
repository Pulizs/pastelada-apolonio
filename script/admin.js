import { db } from './firebase-config.js';
import { 
    collection, 
    query, 
    where, 
    getDocs, 
    doc, 
    updateDoc, 
    getDoc 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// --- FUNÇÃO DE BUSCA (CAIXA E BAR) ---
window.buscarPedido = async (termo) => {
    const vRef = collection(db, "vendas");
    // Busca por nome exato ou telefone
    const q = query(vRef, where("nome", "==", termo));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
        alert("Nenhum pedido encontrado com este nome.");
        return;
    }

    querySnapshot.forEach((docSnap) => {
        exibirResultado(docSnap.id, docSnap.data());
    });
};

// --- EXIBIR DADOS NA TELA ---
function exibirResultado(id, dados) {
    const card = document.getElementById('statusCard');
    card.classList.remove('hidden');
    
    document.getElementById('resNome').innerText = dados.nome;
    document.getElementById('resTipo').innerText = dados.tipo.toUpperCase();
    document.getElementById('resTel').innerText = dados.whatsapp;

    const btnValidar = card.querySelector('button');
    
    if (dados.validado) {
        card.classList.replace('border-green-500', 'border-red-500');
        btnValidar.innerText = "JÁ ENTREGUE / VALIDADO";
        btnValidar.disabled = true;
        btnValidar.classList.add('bg-gray-400');
    } else {
        card.classList.replace('border-red-500', 'border-green-500');
        btnValidar.innerText = "CONFIRMAR ENTREGA";
        btnValidar.disabled = false;
        btnValidar.onclick = () => darBaixa(id);
    }
}

// --- DAR BAIXA NO PEDIDO ---
async function darBaixa(id) {
    const docRef = doc(db, "vendas", id);
    await updateDoc(docRef, { 
        validado: true,
        dataEntrega: new Date() 
    });
    alert("Baixa confirmada! Pode entregar o produto.");
    location.reload(); 
}

// --- INICIALIZAR SCANNER (HTML5-QRCODE) ---
if(document.getElementById('reader')) {
    const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 });
    scanner.render((decodedText) => {
        scanner.clear(); // Para o scanner após ler
        buscarPedidoPorId(decodedText);
    });
}

async function buscarPedidoPorId(id) {
    const docRef = doc(db, "vendas", id);
    const snap = await getDoc(docRef);
    if(snap.exists()) exibirResultado(snap.id, snap.data());
}