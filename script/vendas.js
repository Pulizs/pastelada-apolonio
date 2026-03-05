import { db } from './firebase-config.js';
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const form = document.getElementById('formCompra');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const pedido = {
        nome: document.getElementById('nome').value,
        whatsapp: document.getElementById('whatsapp').value,
        tipo: document.getElementById('tipoPedido').value,
        valor: document.getElementById('tipoPedido').value === 'combo' ? 15 : 10,
        status: "pendente",
        validado: false,
        data: new Date()
    };

    try {
        const docRef = await addDoc(collection(db, "vendas"), pedido);
        
        // Mostrar área do PIX e QR Code
        document.getElementById('areaPix').classList.remove('hidden');
        document.getElementById('pedidoId').innerText = `ID: ${docRef.id}`;
        
        // Gera QR Code com o ID do documento
        new QRCode(document.getElementById("qrcode"), {
            text: docRef.id,
            width: 180,
            height: 180
        });

        alert("Pedido registrado! Realize o pagamento via PIX.");
    } catch (e) {
        console.error("Erro ao salvar: ", e);
    }
});