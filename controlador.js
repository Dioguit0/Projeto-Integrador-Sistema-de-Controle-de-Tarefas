document.addEventListener('DOMContentLoaded', () => {

    //Menu e Seções
    const btnAdicionar = document.getElementById('btn-adicionar');
    const btnListar = document.getElementById('btn-listar');
    const btnFiltrar = document.getElementById('btn-filtrar');
    const btnSair = document.getElementById('btn-sair');

    const telas = document.querySelectorAll('main > section');

    //Formulário e Lista
    const formTarefa = document.getElementById('form-tarefa');
    const inputTitulo = document.getElementById('titulo');
    const inputDescricao = document.getElementById('descricao');
    const inputPrazo = document.getElementById('prazo');
    const containerLista = document.getElementById('lista-tarefas-container');

    //Filtro (Adicionados)
    const selectFiltro = document.getElementById('filtro-status');
    const btnAplicarFiltro = document.getElementById('btn-aplicar-filtro');

    //Array para armazenar as tarefas
    let tarefas = [];
    let idTarefaEmEdicao = null;


    // === Navegação entre Telas ===
    btnAdicionar.addEventListener('click', () => {
        limparFormulario();
        alternarTela('tela-adicionar');
    });

    btnListar.addEventListener('click', () => {
        renderizarTarefas('TODOS');
        alternarTela('tela-listar');
    });

    btnFiltrar.addEventListener('click', () => 
        alternarTela('tela-filtrar'));

    btnSair.addEventListener('click', () => {
        window.location.href = 'index.html';
    });


    // === Funções Principais ===
    function alternarTela(idTelaDesejada){
        telas.forEach(tela => {
            if(tela.id === idTelaDesejada){
                tela.classList.remove('oculto');
            }else{
                tela.classList.add('oculto');
            }
        });
    }

    function limparFormulario(){
        formTarefa.reset();
        idTarefaEmEdicao = null;
        const btnSalvar = formTarefa.querySelector('button[type="submit"]');
        if (btnSalvar) btnSalvar.textContent = 'Salvar Tarefa';
    }

    // Parâmetro statusFiltro adicionado com valor padrão 'TODOS'
    function renderizarTarefas(statusFiltro = 'TODOS'){
        containerLista.innerHTML = '';

        // === Filtragem ===
        const tarefasFiltradas = tarefas.filter(tarefa => { 
            if (statusFiltro === 'TODOS') return true;
            return tarefa.status === statusFiltro;
        });

        if (tarefasFiltradas.length === 0) {
            containerLista.innerHTML = '<p>Nenhuma tarefa encontrada para este filtro.</p>';
            return; // Interrompe para não tentar renderizar novamente
        }

        tarefasFiltradas.forEach(tarefa => {
            const card = document.createElement('div');
            card.className = 'card-tarefa';

            const prazoFormatado = tarefa.prazo
                ? tarefa.prazo.split('-').reverse().join('/')
                : 'Não informado';

            const estaConcluida = tarefa.status === 'CONCLUIDA';

            card.innerHTML = `
                <h3>${tarefa.titulo}</h3>
                <p>${tarefa.descricao || '<em>Sem descrição</em>'}</p>
                <p><strong>Prazo:</strong> ${prazoFormatado}</p>
                <p><strong>Status:</strong> <span class="status-${tarefa.status.toLowerCase()}">${tarefa.status}</span></p>
                
                <div class="acoes-card" data-id="${tarefa.id}">
                    ${!estaConcluida ? '<button class="btn-concluir">Concluir</button>' : ''}
                    <button class="btn-editar">Editar</button>
                    <button class="btn-excluir">Excluir</button>
                </div>
            `;

            containerLista.appendChild(card);
        });
    }


    // === Submissão do Formulário ===
    formTarefa.addEventListener('submit', (event) => {
        event.preventDefault();

        if (idTarefaEmEdicao !== null) {
            const tarefa = tarefas.find(t => t.id === idTarefaEmEdicao);
            if (tarefa) {
                tarefa.titulo = inputTitulo.value.trim();
                tarefa.descricao = inputDescricao.value.trim();
                tarefa.prazo = inputPrazo.value;
            }
        } else {
            const novaTarefa = {
                id: Date.now(),
                titulo: inputTitulo.value.trim(),
                descricao: inputDescricao.value.trim(),
                prazo: inputPrazo.value,
                dataCriacao: new Date().toLocaleDateString('pt-BR'),
                status: 'PENDENTE'
            };
            tarefas.push(novaTarefa);
        }

        limparFormulario();
        renderizarTarefas('TODOS');
        alternarTela('tela-listar');
    });
    
    // === Botão Aplicar Filtro ===
    if (btnAplicarFiltro) {
        btnAplicarFiltro.addEventListener('click', () => {
            const statusSelecionado = selectFiltro.value;
            renderizarTarefas(statusSelecionado);
            alternarTela('tela-listar');
        });
    }

    // === Ações nos Cards ===
    containerLista.addEventListener('click', (event) => {
        const elementoClicado = event.target;
        const containerAcoes = elementoClicado.closest('.acoes-card');

        if (!containerAcoes) return;

        const idTarefa = Number(containerAcoes.dataset.id);

        if (elementoClicado.classList.contains('btn-concluir')) {
            const tarefa = tarefas.find(t => t.id === idTarefa);
            if (tarefa) {
                tarefa.status = 'CONCLUIDA';
                renderizarTarefas(selectFiltro ? selectFiltro.value : 'TODOS');
            }
        }

        if (elementoClicado.classList.contains('btn-excluir')) {
            tarefas = tarefas.filter(t => t.id !== idTarefa);
            renderizarTarefas(selectFiltro ? selectFiltro.value : 'TODOS');
        }

        if (elementoClicado.classList.contains('btn-editar')) {
            const tarefa = tarefas.find(t => t.id === idTarefa);
            if (tarefa) {
                inputTitulo.value = tarefa.titulo;
                inputDescricao.value = tarefa.descricao;
                inputPrazo.value = tarefa.prazo;

                idTarefaEmEdicao = tarefa.id;

                const btnSalvar = formTarefa.querySelector('button[type="submit"]');
                if (btnSalvar) btnSalvar.textContent = 'Atualizar Tarefa';

                alternarTela('tela-adicionar');
            }
        }
    });

});