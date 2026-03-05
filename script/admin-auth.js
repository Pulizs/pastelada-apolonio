// Script para verificar autenticação em todas as páginas admin
function verificarAutenticacao() {
    const logado = localStorage.getItem('adminLogado');
    
    if (!logado) {
        // Redireciona para login se não estiver autenticado
        window.location.href = 'login.html';
    }
}

function fazerLogout() {
    localStorage.removeItem('adminLogado');
    localStorage.removeItem('funcaoAdmin');
    window.location.href = '../subpages/login.html';
}

// Executar verificação ao carregar
verificarAutenticacao();
