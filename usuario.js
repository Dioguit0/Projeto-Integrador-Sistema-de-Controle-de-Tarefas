document.addEventListener('DOMContentLoaded', () => {

    // === Tela de Cadastro ===
    const formCadastro = document.getElementById('form-cadastro');
    const btnVoltarLogin = document.getElementById('btn-voltar-login');

    if (formCadastro) {
        formCadastro.addEventListener('submit', (event) => {
            event.preventDefault();

            const nome = document.getElementById('cad-nome').value.trim();
            const email = document.getElementById('cad-email').value.trim().toLowerCase();
            const senha = document.getElementById('cad-senha').value;

            // Busca a lista de usuários existente no localStorage ou inicia um array vazio
            const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

            // Verifica se o email já está cadastrado
            const usuarioExiste = usuarios.find(u => u.email === email);
            if (usuarioExiste) {
                alert('Este e-mail já está cadastrado!');
                return;
            }

            // Cria o novo usuário respeitando os atributos do Diagrama de Classes
            const novoUsuario = {
                id: Date.now(),
                nome: nome,
                email: email,
                senha: senha
            };

            usuarios.push(novoUsuario);

            // Salva de volta no localStorage
            localStorage.setItem('usuarios', JSON.stringify(usuarios));

            alert('Cadastro realizado com sucesso! Você será redirecionado para o login.');
            window.location.href = 'index.html';
        });
    }

    if (btnVoltarLogin) {
        btnVoltarLogin.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }


    // === Tela de Login ===
    const formLogin = document.getElementById('form-login');
    const btnIrCadastro = document.getElementById('btn-ir-cadastro');

    if (formLogin) {
        formLogin.addEventListener('submit', (event) => {
            event.preventDefault();

            const emailDigitado = document.getElementById('login-email').value.trim().toLowerCase();
            const senhaDigitada = document.getElementById('login-senha').value;

            const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

            // Procura um usuário que coincida email e senha
            const usuarioValido = usuarios.find(u => u.email === emailDigitado && u.senha === senhaDigitada);

            if (usuarioValido) {
                // Guarda o usuário logado para usarmos na página principal
                localStorage.setItem('usuarioLogado', JSON.stringify(usuarioValido));
                
                // Redireciona para a página principal das tarefas
                window.location.href = 'paginaPrincipal.html';
            } else {
                alert('E-mail ou senha incorretos!');
            }
        });
    }

    // Botão para ir para a tela de cadastro a partir da tela de login
    if (btnIrCadastro) {
        btnIrCadastro.addEventListener('click', () => {
            window.location.href = 'cadastro.html';
        });
    }

});