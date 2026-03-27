# Documentação
- Português (Mais original impossível)
- English: [README](/README.md)



# Licença
- Português: [LICENSE-BR](LICENSE-BR.txt)
- English: [LICENSE](LICENSE)



# Conhecendo o PASU
Seja muito bem-vindo, meu caro!
Você está tendo acesso ao PASU em primeira mão e provavelmente deve estar se perguntando:

## O que é o PASU?
O **Portal de Atendimento e Suporte ao Usuário (PASU)** é um sistema de chamados simples, construído com muito esforço, carinho, criatividade... e um pouco de gambiarra para a ARSP.
Ou melhor, como Ariane diz:

> Não é gambiarra, é recurso técnico



# Funcionamento
Como de praxe, as limitações financeiras fizeram do PASU o que ele é hoje: um modelo espírito-santense que honra suas raízes e funciona na base do:

> Trabalha e confia

O que isso quer dizer? Que cruzemos os dedos para que nem o Google nem a Atlassian mudem nada importante, para o sistema não quebrar.

## Fluxo
Google Forms → Google Sheets → E-mail/Trello → Google Sheets

## Etapas
* Usuário abre um chamado via **Google Forms**
* O envio preenche o **Google Sheets**
* Um e-mail com as informações é enviado para o suporte
* As mesmas informações são enviadas ao **Trello**, virando cards
* As atualizações feitas nos cards são registradas no **Google Sheets**

## Notificações
O usuário recebe e-mails sempre que um card sofre **alterações de status**. O legal é que, quando o chamado é concluído, o e-mail ganha um botão adicional que leva a um formulário de avaliação.

### Mas como funciona?
Toda a automação do PASU é igual: ela gira através dos triggers do **Google Apps Script**. No início, eu tentei usar o webhook do Trello, mas não prestou muito.

#### Importante
**NUNCA** configure o gatilho de atualização principal com **menos de 5 minutos**. O Trello costuma interpretar essas chamadas como spam, causando falhas no funcionamento do PASU.



# Manutenção
A parte divertida, que é onde você começa a descobrir as gambiarras!

## Alterações
Novas colunas no Google Sheets, funcionários, perguntas no formulário ou até listas do Trello devem ser ajustadas no código.
A menos que queira fazer algo muito específico, você só irá alterar o arquivo nomeado como config.

### Limpeza
Eu supus que, em determinado momento, ficaria insalubre mexer no Trello, então os cards que estão na lista de **concluídos** são arquivados, e aqueles arquivados há mais de 1 mês são **deletados permanentemente**.
Isso ajudará o programa a durar mais tempo, mesmo ele sendo uma "medida provisória". Sabe como é:

> Não existe nada mais eterno que uma medida provisória

Sem falar que dá um prazo de 2 meses para o usuário reclamar de alguma coisa.

## Limitações
Bom, o PASU foi feito com coisas gratuitas, então nem tudo é possível.
O **Google** parece ter um limite de cerca de **500 e-mails por dia**. Eu particularmente acho difícil atingir esse limite, mas é bom saber.
Sem falar que, embora tenhamos a opção do **Dashboard**, ele não possui uma automação implementada.



# Considerações finais
Foi divertido e desafiador poder criá-lo, portanto espero que esse projeto lhe seja tão útil quanto foi para o meu local de trabalho.



# Informações do projeto
* **Versão:** 8.1.6
* **Protótipo:** 15/01/2026
* **Teste com usuários:** 09/03/2026

## Autor
* Alex Fernandes (AlexAkf)
