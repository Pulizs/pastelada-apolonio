import { db } from './firebase-config.js';
import { collection, onSnapshot, query } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const vRef = collection(db, "vendas");
const barRef = collection(db, "vendas_bar");
const custoUnidade = 4.50; // Edite o custo real aqui

// Monitoramento em tempo real das vendas de pastel e bebidas
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
    document.getElementById('qtdTotal').innerText = totalVendas;
    document.getElementById('detalhePastel').innerText = qtdPastel;
    document.getElementById('detalheCombo').innerText = qtdCombo;
    document.getElementById('detalhePastelValor').innerText = `R$ ${(qtdPastel * 10).toFixed(2)}`;
    document.getElementById('detalheComboValor').innerText = `R$ ${(qtdCombo * 15).toFixed(2)}`;
});

// Monitoramento em tempo real das vendas do bar
onSnapshot(query(barRef), (snapshot) => {
    let totalAgua = 0;
    let qtdAgua = 0;
    let totalRefri = 0;
    let qtdRefri = 0;
    let totalSuco = 0;
    let qtdSuco = 0;

    snapshot.forEach((doc) => {
        const dados = doc.data();
        if (dados.items) {
            if (dados.items.agua) {
                qtdAgua += dados.items.agua.qtd;
                totalAgua += dados.items.agua.qtd * 3;
            }
            if (dados.items.refri) {
                qtdRefri += dados.items.refri.qtd;
                totalRefri += dados.items.refri.qtd * 5;
            }
            if (dados.items.suco) {
                qtdSuco += dados.items.suco.qtd;
                totalSuco += dados.items.suco.qtd * 5;
            }
        }
    });

    const totalBebidas = totalAgua + totalRefri + totalSuco;

    // Atualiza o HTML
    document.getElementById('valBebidas').innerText = `R$ ${totalBebidas.toFixed(2)}`;
    document.getElementById('detalheAgua').innerText = qtdAgua;
    document.getElementById('detalheAguaValor').innerText = `R$ ${totalAgua.toFixed(2)}`;
    document.getElementById('detalheRefri').innerText = qtdRefri;
    document.getElementById('detalheRefriValor').innerText = `R$ ${totalRefri.toFixed(2)}`;
    document.getElementById('detalheSuco').innerText = qtdSuco;
    document.getElementById('detalheSucoValor').innerText = `R$ ${totalSuco.toFixed(2)}`;
});