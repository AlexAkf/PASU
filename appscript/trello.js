/**
 * Este arquivo é responsável por funcionalidades de suporte e manutenção do sistema.
 *
 * O que acontece aqui:
 * - Registro de histórico dos chamados (logs)
 * - Criação automática da aba de log (caso não exista)
 * - Prevenção de duplicidade de registros
 * - Arquivamento de cards concluídos no Trello
 * - Remoção definitiva de cards antigos (arquivados há mais de 30 dias)
 */

function registrarLog(idChamado, tecnico, status, dataAcao) {
  const abaLog = obterAba();

  // Evita registrar o mesmo evento duas vezes
  if(logExiste(abaLog, idChamado, dataAcao)) { return; }

  abaLog.appendRow([idChamado, tecnico, status, dataAcao]);
}

function obterAba() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let aba = ss.getSheetByName(PLANILHA.LOGS);

  // Cria automaticamente a aba de logs caso ela não exista
  if(!aba) {
    aba = ss.insertSheet(PLANILHA.LOGS);
    aba.appendRow(["ID/Chamado", "Técnico", "Status", "Data/Hora"]);
  }

  return aba;
}

function logExiste(aba, idChamado, dataAcao) {
  const ultimaLinha = aba.getLastRow();
  
  if(ultimaLinha <= 1) { return false; }

  const logs = aba.getRange(2, 1, ultimaLinha - 1, 4).getValues();

  return logs.some(log => {
    const dataLog = new Date(log[3]).getTime();
    const dataNova = new Date(dataAcao).getTime();

    return log[0] == idChamado && dataLog === dataNova;
  });
}

// Arquiva todos os cards da lista de concluídos para evitar acúmulo no board
function arquivarCards() {
  const url = `https://api.trello.com/1/lists/${TRELLO.LISTAS.CONCLUIDO}/archiveAllCards?key=${TRELLO.KEY}&token=${TRELLO.TOKEN}`;

  try {
    const response = UrlFetchApp.fetch(url, { method: "post" });

    if(response.getResponseCode() === 200) {
      Logger.log("Cards arquivados com sucesso");
    }
  } catch(erro) {
    Logger.log(`Erro ao arquivar cards: ${erro.toString()}`);
  }
}

// Remove permanentemente cards arquivados antigos do board
function deletarArquivados() {
  const idBoard = obterIdBoard();
  const cards = buscarArquivados(idBoard);

  cardsAntigos(cards).forEach(card => deletarCards(card));
}

function obterIdBoard() {
  const url = `https://api.trello.com/1/lists/${TRELLO.LISTAS.PENDENTE}?key=${TRELLO.KEY}&token=${TRELLO.TOKEN}`;
  const res = JSON.parse(UrlFetchApp.fetch(url).getContentText());
  
  return res.idBoard;
}

function buscarArquivados(idBoard) {
  const url = `https://api.trello.com/1/boards/${idBoard}/cards?filter=closed&key=${TRELLO.KEY}&token=${TRELLO.TOKEN}`;
  
  return JSON.parse(UrlFetchApp.fetch(url).getContentText());
}

function cardsAntigos(cards) {
  const agora = Date.now();

  // Remove cards arquivados há mais de 30 dias (em milisegundos)
  const limite = 30 * 24 * 60 * 60 * 1000;

  return cards.filter(card => {
    const ultimaAtividade = new Date(card.dateLastActivity).getTime();
    return(agora - ultimaAtividade) > limite;
  });
}

function deletarCards(card) {
  const url = `https://api.trello.com/1/cards/${card.id}?key=${TRELLO.KEY}&token=${TRELLO.TOKEN}`;

  try {
    UrlFetchApp.fetch(url, { method: "delete" });
    Logger.log(`Card deletado: ${card.name}`);
  } catch (erro) {
    Logger.log(`Erro ao deletar ${card.id}: ${erro.toString()}`);
  }
}