import { db } from './firebase-config.js';
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const form = document.getElementById('formCompra');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const tipoSelecionado = document.querySelector('input[name="item"]:checked').value;
    
    const pedido = {
        nome: document.getElementById('nome').value,
        whatsapp: document.getElementById('whatsapp').value,
        tipo: tipoSelecionado,
        valor: tipoSelecionado === 'combo' ? 15 : 10,
        status: "pendente",
        validado: false,
        data: new Date()
    };

    try {
        const docRef = await addDoc(collection(db, "vendas"), pedido);
        
        // Mostrar área do PIX e QR Code
        document.getElementById('areaPix').classList.remove('hidden');
        document.getElementById('formCompra').classList.add('hidden');
        
        // Gera QR Code com o ID do documento
        new QRCode(document.getElementById("qrcode"), {
            text: docRef.id,
            width: 180,
            height: 180
        });

        alert("Pedido registrado! Realize o pagamento via PIX.");
    } catch (e) {
        console.error("Erro ao salvar: ", e);
        alert("Erro ao processar pedido: " + e.message);
    }
});