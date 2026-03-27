
/**
 * Este arquivo controla as execuções principais do sistema.
 * As lógicas específicas estão em seus respectivos arquivos.
 *
 * CONFIGURAÇÃO DE GATILHOS:
 * - onFormSubmit: ícone de relógio → "ao enviar formulário"
 * - atualizarChamado: ícone de relógio → "baseado no tempo" → "a cada 5 minutos" (ou mais)
 * - limpezaTrello: ícone de relógio → "baseado no tempo" → "mensalmente"
 */

/**
 * O nome "onFormSubmit" é reservado pelo Google Apps Script para execuções quando um
 * formulário é enviado. O parâmetro "e" é o objeto de evento fornecido automaticamente
 * com os dados de envio. Alterar isso pode impedir o funcionamento correto do gatilho.
 */
function onFormSubmit(e) {
  if(!e) { return; }  // Evita execução manual sem evento
  criarChamado(e);
}

function atualizarChamado() {
  atualizarStatus();
}

function limpezaTrello() {
  deletarArquivados();
  arquivarCards();
}