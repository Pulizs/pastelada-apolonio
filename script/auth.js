const form = document.getElementById('formLogin');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const senha = document.getElementById('senha').value;
    const funcao = document.getElementById('funcao').value;
    const senhaCorreta = "admin123"; // Altere para uma senha mais segura

    if (senha === senhaCorreta) {
        // Armazena a sessão no localStorage
        localStorage.setItem('adminLogado', 'true');
        localStorage.setItem('funcaoAdmin', funcao);
        
        // Redireciona para a tela apropriada
        switch(funcao) {
            case 'aprovacao':
                window.location.href = 'aprovacao.html';
                break;
            case 'caixa':
                window.location.href = 'caixa.html';
                break;
            case 'tesoureiro':
                window.location.href = 'tesoureiro.html';
                break;
        }
    } else {
        alert('Senha incorreta!');
        document.getElementById('senha').value = '';
    }
});
