/**
 * Este arquivo é responsável pelo fluxo de abertura de chamados do sistema.
 *
 * O QUE ACONTECE AQUI:
 * - Processa o envio do formulário
 * - Coleta e organiza os dados do chamado
 * - Gera o ID do chamado
 * - Envia notificações iniciais
 * - Cria o card no Trello
 * - Registra as informações na planilha
 */

function criarChamado(envio) {
    const contexto = contextoFormulario(envio);
  
    if(contexto.chamadoProcessado) { return; }    // Evita processar o mesmo envio mais de uma vez
    
    const dados = montarChamado(contexto);
    
    // Fluxo principal de criação do chamado
    try {
        notificar(dados);
        const idCard = criarCard(dados);

        if(!idCard){
        throw new Error(`Falha ao criar card ${dados.idChamado}`);
        }

        atualizarRegistro(contexto, idCard, dados.idChamado);
    } catch(erro) {
        Logger.log(`Erro ao criar chamado: ${erro.toString()}`);
    }
}

function contextoFormulario(envio) {
    const aba = envio.range.getSheet();
    const linha = envio.range.getRow();
    const valores = envio.values;

    const cabecalho = aba.getRange(1, 1, 1, aba.getLastColumn()).getValues()[0];
    const colunas = mapearColunas(cabecalho);

    if (colunas.STATUS === -1) {
        throw new Error("Coluna de STATUS não encontrada.");
    }

    const chamadoProcessado = aba.getRange(linha, colunas.STATUS + 1).getValue();

    return { aba, linha, valores, colunas, chamadoProcessado };
}

function montarChamado({aba, valores, colunas}) {
    const idChamado = gerarIdChamado(aba);
    
    return {
        emailUsuario: valores[colunas.EMAIL],
        nome: valores[colunas.NOME],
        setor: valores[colunas.SETOR],
        chamado: valores[colunas.CHAMADO],
        descricao: valores[colunas.DESCRICAO],
        anexos: formataAnexo(valores[colunas.ANEXO]),
        prioridade: valores[colunas.PRIORIDADE],
        cor: buscaCor(valores[colunas.PRIORIDADE]),
        link: LINKS.DASHBOARD,
        idChamado
    };
}

function gerarIdChamado(aba) {
    // ID baseado na posição da linha na planilha
    return (aba.getLastRow() - 1).toString().padStart(2, "0");
}

function notificar(dados) {
    enviaEmail(
        "chamado",
        dados,
        EQUIPE.join(","),
        `${EMAIL.EQUIPE.ASSUNTO} ${dados.chamado}`
    );

    enviaEmail(
        "status",
        dados,
        dados.emailUsuario,
        EMAIL.USUARIO.ASSUNTO
    );
}

function atualizarRegistro(contexto, idCard, idChamado) {
    const { aba, linha, colunas } = contexto;

    setCelula(aba, linha, colunas.ID_TRELLO, idCard);
    setCelula(aba, linha, colunas.STATUS, STATUS.PENDENTE);
    setCelula(aba, linha, colunas.ID_CHAMADO, idChamado);
}