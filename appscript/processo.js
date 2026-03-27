/**
 * Este arquivo é responsável pelo processamento e atualização dos chamados.
 *
 * O que acontece aqui:
 * - Lê os chamados existentes na planilha
 * - Filtra chamados ativos
 * - Consulta os dados atualizados no Trello
 * - Sincroniza status e responsável
 * - Registra histórico de ações
 * - Atualiza datas de andamento e conclusão
 * - Envia notificações de mudança de status
 */

function atualizarStatus() {  // Executado periodicamente pelo trigger de tempo
  const planilha = obterPlanilha();
  
  if(!planilha) { return; }

  const contexto = contextoPlanilha(planilha);
  const chamados = filtrarChamados(contexto);

  chamados.forEach(chamado => {
    try {
      processarChamado(chamado, contexto);
    } catch(erro) {
      Logger.log(`Erro na linha ${chamado.linhaPlanilha}: ${erro.toString()}`);
    }
  });
}

function obterPlanilha() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const planilha = ss.getSheetByName(PLANILHA.DADOS);

  if(!planilha) {
    Logger.log("Planilha não encontrada");
    return null;
  }

  if(planilha.getLastRow() < 2) {
    return null;
  }

  return planilha;
}

function contextoPlanilha(planilha) {
  const cabecalho = planilha.getRange(1, 1, 1, planilha.getLastColumn()).getValues()[0];
  const colunas = mapearColunas(cabecalho);
  const dados = planilha.getRange(2, 1, planilha.getLastRow() - 1, planilha.getLastColumn()).getValues();

  return { planilha, colunas, dados };
}

function filtrarChamados({dados, colunas}) {
  return dados.map((linha, index) => ({
    dados: linha,
    linhaPlanilha: index + 2,
  })).filter(({dados}) => {
    const id = dados[colunas.ID_TRELLO];
    const status = dados[colunas.STATUS];

    // Processa apenas chamados que já possuem cards e que não foram concluídos
    return id && status !== STATUS.CONCLUIDO;
  });
}

function processarChamado(item, contexto) {
  const { planilha, colunas } = contexto;
  const { dados, linhaPlanilha } = item;
  const idCard = dados[colunas.ID_TRELLO];
  const card = buscarCard(idCard);

  if(!card) { return; }

  registrarMembro(card, dados[colunas.ID_CHAMADO]);
  atualizarData(planilha, linhaPlanilha, colunas, dados, card);

  const resultado = interpretarCard(card, dados, colunas);

  atualizarPlanilha(planilha, linhaPlanilha, colunas, resultado);

  if(resultado.notificar) {
    notificarStatus(resultado, dados, colunas);
  }
}

function interpretarCard(card, dados, colunas) {
  const statusAtual =  dados[colunas.STATUS];
  const responsavelAtual = dados[colunas.RESPONSAVEL];
  const novoStatus = traduzirStatus(card.idList);
  const novoResponsavel = obterResponsavel(card);
  const mudouStatus = novoStatus && novoStatus !== statusAtual;
  const mudouResponsavel = novoResponsavel && novoResponsavel !== responsavelAtual;

  return {
    novoStatus,
    novoResponsavel,
    mudouStatus,
    mudouResponsavel,
    notificar: mudouStatus
  };
}

// Converte o ID da lista do Trello para o status interno do PASU
function traduzirStatus(idList) {
  if (idList === TRELLO.LISTAS.PENDENTE) { return STATUS.PENDENTE; }
  if (idList === TRELLO.LISTAS.ANDAMENTO) { return STATUS.ANDAMENTO; }
  return STATUS.CONCLUIDO;
}

function obterResponsavel(card) {
  if(!card.idMembers || card.idMembers.length === 0) { return ""; }

  return TRELLO.MEMBROS[card.idMembers[0]] || "Membro não cadastrado";
}

function registrarMembro(card, idChamado) {
  if(!card.actions) { return; }

  const acoes = card.actions.filter(acao =>
    acao.type === "addMemberToCard" || acao.type === "removeMemberFromCard"
  );

  acoes.forEach(acao => {
    const idTecnico = acao.data.idMember;
    const tecnico = TRELLO.MEMBROS[idTecnico] || "Membro não cadastrado";
    const dataAcao = new Date(acao.date);
    const status = acao.type === "addMemberToCard" ? "Assumiu o chamado" : "Saiu do chamado";
    
    registrarLog(idChamado, tecnico, status, dataAcao);
  });
}

function atualizarData(planilha, linhaPlanilha, colunas, dados, card) {
  const acoes = card.actions || [];
  const andamento = acoes.find(acao => acao.data?.listAfter?.id === TRELLO.LISTAS.ANDAMENTO);
  const concluido = acoes.find(acao => acao.data?.listAfter?.id === TRELLO.LISTAS.CONCLUIDO);

  if(andamento && !dados[colunas.ANDAMENTO]) {
    setCelula(planilha, linhaPlanilha, colunas.ANDAMENTO, new Date(andamento.date));
  }

  if(concluido && !dados[colunas.FECHAMENTO]) {
    setCelula(planilha, linhaPlanilha, colunas.FECHAMENTO, new Date(concluido.date));
  }
}

function atualizarPlanilha(planilha, linhaPlanilha, colunas, resultado) {
  const { novoStatus, novoResponsavel } = resultado;

  if(novoStatus) {
    setCelula(planilha, linhaPlanilha, colunas.STATUS, novoStatus);
  }

  if(novoResponsavel) {
    setCelula(planilha, linhaPlanilha, colunas.RESPONSAVEL, novoResponsavel);
  }
}

function notificarStatus(resultado, dados, colunas) {
  const novoStatus = resultado.novoStatus;

  if(dados[colunas.STATUS] === STATUS.PENDENTE && novoStatus === STATUS.CONCLUIDO) {
    Logger.log("Pulou direto para concluído");
  }

  const dadosEmail = {
    idChamado: dados[colunas.ID_CHAMADO],
    nome: dados[colunas.NOME],
    chamado: dados[colunas.CHAMADO],
    descricao: dados[colunas.DESCRICAO],
    status: novoStatus,
    cor: buscaCor(dados[colunas.PRIORIDADE]),

    // Quando o chamado é concluído, envia o link de avaliação, com o id sendo anexado ao link base do "config.gs"
    link:  novoStatus === STATUS.CONCLUIDO ? `${LINKS.AVALIACAO}${dados[colunas.ID_CHAMADO]}` : null,
    
    emailUsuario: dados[colunas.EMAIL]
  };

  enviaEmail("status", dadosEmail, dadosEmail.emailUsuario, EMAIL.USUARIO.ASSUNTO);
}