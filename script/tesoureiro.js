import { db } from './firebase-config.js';
import { collection, onSnapshot, query } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const vRef = collection(db, "vendas");
const custoUnidade = 4.50; // Edite o custo real aqui

// Monitoramento em tempo real das vendas
onSnapshot(query(vRef), (snapshot) => {
    let totalBruto = 0;
    let qtdPastel = 0;
    let qtdCombo = 0;

    snapshot.forEach((doc) => {
        const dados = doc.data();
        if(dados.status === "pago") {
            totalBruto += dados.valor;
            if(dados.tipo === "unidade") qtdPastel++;
            else qtdCombo++;
        }
    });

    const totalVendas = qtdPastel + qtdCombo;
    const custoTotal = totalVendas * custoUnidade;
    const lucro = totalBruto - custoTotal;

    // Atualiza o HTML
    document.getElementById('valBruto').innerText = `R$ ${totalBruto.toFixed(2)}`;
    document.getElementById('valLucro').innerText = `R$ ${lucro.toFixed(2)}`;
    document.getElementById('valCusto').innerText = `R$ ${custoTotal.toFixed(2)}`;
    document.getElementById('qtdTotal').innerText = totalVendas;
    document.getElementById('detalhePastel').innerText = qtdPastel;
    document.getElementById('detalheCombo').innerText = qtdCombo;
    document.getElementById('detalhePastelValor').innerText = `R$ ${(qtdPastel * 10).toFixed(2)}`;
    document.getElementById('detalheComboValor').innerText = `R$ ${(qtdCombo * 15).toFixed(2)}`;
});