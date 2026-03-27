/**
 * Este arquivo contém funções auxiliares reutilizáveis do sistema.
 *
 * O que existe aqui:
 * - Manipulação e mapeamento de dados da planilha
 * - Formatação de informações (anexos, prioridade, etc.)
 * - Integração com serviços externos (Trello)
 * - Envio de e-mails via templates HTML
 * - Funções utilitárias para escrita na planilha
 *
 * IMPORTANTE:
 * - As funções aqui devem ser genéricas e reutilizáveis
 * - Evitar regras de negócio específicas (elas pertencem aos outros arquivos)
 */

// Mapeia as colunas da planilha com base nos nomes definidos no config
function mapearColunas(cabecalho) {
  const map = {};

  for(let key in COLUNAS) {
    const index = cabecalho.indexOf(COLUNAS[key]);

    if(index === -1) {
      throw new Error(`Coluna não encontrada ${COLUNAS[key]}`);
    }

    map[key] = index;
  }

  return map;
}

function buscaCor(prioridade) {
  // Normaliza o texto da prioridade para evitar erros de formatação
  const texto = (prioridade || "").toLowerCase();

  if(texto.includes("alta")) { return CORES.PRIORIDADE.ALTA; }
  if(texto.includes("média")) { return CORES.PRIORIDADE.MEDIA; }

  return CORES.PRIORIDADE.BAIXA;
}

function formataAnexo(textoUrl) {
  if(!textoUrl) { return "Nenhum anexo"; }

  // O Google Forms salva múltiplos anexos como URLs separadas por vírgula
  return textoUrl.split(",").map((url) => url.trim()).join("\n");
}

// Carrega template HTML do Apps Script e injeta dados dinamicamente
function enviaEmail(arquivoHtml, dados, para, assunto) {
  try {
    const template = HtmlService.createTemplateFromFile(arquivoHtml);
    template.dados = dados;
    template.CORES = CORES;
    template.EMAIL = EMAIL;

    const html = template.evaluate().getContent();

    MailApp.sendEmail({
      to: para,
      subject: assunto,
      htmlBody: html,
      name: EMAIL.REMETENTE
    });
  } catch(erro) {
    Logger.log(`Erro ao enviar email (${arquivoHtml}): ${erro.toString()}`);
  }
}

function criarCard(dados) {
  const url = `https://api.trello.com/1/cards?key=${TRELLO.KEY}&token=${TRELLO.TOKEN}`;
  const etiqueta = TRELLO.ETIQUETAS[dados.prioridade] || TRELLO.ETIQUETAS.BAIXA;

  const payload = {
    idList: TRELLO.LISTAS.PENDENTE,

    // Nome do card inclui ID do chamado para rastreamento entre planilha e Trello
    name: `${dados.idChamado}: ${dados.chamado} - ${dados.nome}`,

    desc: `**Setor:** ${dados.setor}\n**Descrição:** ${dados.descricao}\n\n${dados.anexos}`,
    idLabels: etiqueta,
    pos: "top"
  };

  try {
    const resposta = UrlFetchApp.fetch(url, { method: "post", payload });
    const json = JSON.parse(resposta.getContentText());

    if(!json.id) { throw new Error("ID do card não retornado"); }

    return json.id;
  } catch(erro) {
    Logger.log(`Erro ao criar card: ${erro.toString()}`);
    return null;
  }
}

function buscarCard(idCard) {
  // "actions_limit=50" limita ações retornadas para evitar excesso de dados da API
  const url = `https://api.trello.com/1/cards/${idCard}?actions=updateCard:idList,addMemberToCard&actions_limit=50&key=${TRELLO.KEY}&token=${TRELLO.TOKEN}`;
  
  const response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });

  if(response.getResponseCode() === 404) {
    Logger.log(`Card deletado ${idCard}`);
    return null;
  }

  if(response.getResponseCode() !== 200) {
    Logger.log(`Erro ao buscar card ${idCard}`);
    return null;
  }

  return JSON.parse(response.getContentText());
}

function setCelula(aba, linha, coluna, valor) {
  aba.getRange(linha, coluna + 1).setValue(valor);
}