# Vercel Web Analytics

O SQL Detective usa o pacote @vercel/analytics para medir visualizações de página na aplicação publicada na Vercel.

## O que é medido

- Visitas à página inicial.
- Abertura do arquivo de casos.
- Abertura de cada caso (/cases/case-001, /cases/case-002 e /cases/case-003).
- Navegação entre essas rotas dentro da aplicação.
- Informações agregadas de origem do tráfego, dispositivo, navegador e sistema operacional.

O pacote não envia o texto SQL montado, os valores retornados nas consultas, nomes de suspeitos escolhidos ou identificadores de alunos.

## Limite do plano Hobby

O projeto está no plano Hobby. Nesse plano, o Vercel Web Analytics inclui até 50 mil eventos por mês, mas não oferece eventos personalizados. Portanto, nesta configuração é possível acompanhar visitas e páginas acessadas, mas não medir diretamente ações como abrir uma tabela, executar uma consulta, concluir uma etapa ou acertar uma acusação.

Eventos personalizados no Vercel Web Analytics exigem o plano Pro ou Enterprise. Para relatórios de interação sem mudar de plano, será necessário integrar uma ferramenta de produto que ofereça eventos no plano gratuito.

## Ativar no painel da Vercel

1. Abra o projeto sql-detective no painel da Vercel.
2. Entre em Analytics.
3. Clique em Enable.
4. Aguarde o deploy que contém o pacote @vercel/analytics.
5. Acesse o site publicado e depois confira os dados em Analytics.

A coleta é feita em produção; o pacote não envia dados quando a aplicação está rodando em desenvolvimento.
