/**
 * Este arquivo contém apenas configurações do sistema.
 * Nenhuma lógica deve ser implementada aqui.
 *
 * COMO OBTER IDS DO TRELLO:
 * - Abra o board/lista
 * - Adicione ".json" ao final da URL
 * - Use CTRL + F para localizar o nome
 *
 * COMO OBTER API KEY E TOKEN:
 * - https://trello.com/app-key
 */

const scriptProperties = PropertiesService.getScriptProperties();

const PLANILHA = {
  DADOS: "Nome da aba com os dados do formulário",
  LOGS: "Logs"  // Este pode permanecer como está
};

const LINKS = {
  DASHBOARD: "Link do Power BI",

  /**
   * O link de avaliação dever ser um link de formulário pré-preenchido
   * do Google Forms.
   * 
   * COMO CONFIGURAR:
   * - Forms → Obter link pré-preenchido
   * - Preencher a questão de "id do chamado" com um exemplo
   * - Copiar o link gerado
   * - Remover o valor de exemplo
   */
  AVALIACAO: "Link do formulário de avaliação"
};

const EQUIPE = [
  "email@exemplo.com",
  "email@exemplo.com",
  "email@exemplo.com"

];

const COLUNAS = {
  EMAIL: "Nome da coluna",
  NOME: "Nome da coluna",
  SETOR: "Nome da coluna",
  CHAMADO: "Nome da coluna",
  DESCRICAO: "Nome da coluna",
  ANEXO: "Nome da coluna",
  PRIORIDADE: "Nome da coluna",

  STATUS: "Nome da coluna",
  ID_TRELLO: "Nome da coluna",
  ID_CHAMADO: "Nome da coluna",
  RESPONSAVEL: "Nome da coluna",

  ABERTURA: "Nome da coluna",
  ANDAMENTO: "Nome da coluna",
  FECHAMENTO: "Nome da coluna"
};

const TRELLO = {
  /**
   * Credenciais armazenadas nas Script Properties do Google Apps Script.
   *
   * COMO CONFIGURAR:
   * - Abra o projeto no Google Apps Script
   * - Vá em: Project Settings (Configurações do projeto)
   * - Procure por "Script Properties"
   * - Adicione:
   *    key = sua API Key do Trello
   *    token = seu Token do Trello
   *
   * Isso evita expor credenciais diretamente no código.
   */
  KEY: scriptProperties.getProperty('key'),
  TOKEN: scriptProperties.getProperty('token'),


  LISTAS: {
    PENDENTE: "ID da lista",
    ANDAMENTO: "ID da lista",
    CONCLUIDO: "ID da lista"
  },


  ETIQUETAS: {
    BAIXA: "ID da etiqueta",
    MEDIA: "ID da etiqueta",
    ALTA: "ID da etiqueta"
  },


  MEMBROS: {
    "ID do membro" : "Nome Sobrenome",   
    "ID do membro" : "Nome Sobrenome",   
    "ID do membro" : "Nome Sobrenome"   
  },
};

const EMAIL = {
  REMETENTE: "PASU",


  EQUIPE: {
    ASSUNTO: "Novo Chamado aberto",
    RODAPE: "Verifique o Trello para mais detalhes"
  },


  USUARIO: {
    ASSUNTO: "Atualização do chamado",
    RODAPE: "Atenciosamente, equipe de TI"
  }
};

const CORES = {
  GERAL: {
    FUNDO: "#f4f4f4",
    CARD: "#ffffff",
    TEXTO: "#333333",
    TABELA: "#1a73e8",
    RODAPE: "#999999"
  },

  PRIORIDADE: {
    ALTA: "#d93025",
    MEDIA: "#f29900",
    BAIXA: "#1a73e8"
  }
};

const STATUS = {
  PENDENTE: "Pendente",
  ANDAMENTO: "Em andamento",
  CONCLUIDO: "Concluído"
};