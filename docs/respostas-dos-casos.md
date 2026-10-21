# Respostas dos casos — SQL Detective

> Material de consulta para professores e para conferência após jogar. Cada resposta inclui a conclusão, as evidências principais e uma consulta SQL de exemplo. Existem outras consultas válidas que podem levar à mesma conclusão.

## Caso #001 — O Quadro Desaparecido

**Responsável: Carlos Mendes (ID 2), segurança.**

### Evidências

- O registro de acesso mostra que Carlos entrou na Sala Bellmont às 20:36.
- A câmera CAM-04 o registra entrando no corredor da sala às 20:39 e saindo às 20:52.
- Em seu depoimento, Carlos afirma que não entrou na Sala Bellmont naquela noite. O registro de acesso e as imagens contradizem essa declaração.

### Consulta de exemplo

```sql
SELECT suspects.name, camera_logs.time, camera_logs.event
FROM suspects
JOIN camera_logs ON suspects.id = camera_logs.suspect_id
WHERE suspects.id = 2;
```

Para conferir o acesso à sala:

```sql
SELECT suspects.name, access_logs.time
FROM access_logs
JOIN suspects ON suspects.id = access_logs.suspect_id
WHERE access_logs.room_id = 4
  AND access_logs.time >= '20:30'
  AND access_logs.time <= '20:50';
```

## Caso #002 — O Protótipo Desaparecido

**Responsável: Renata Martins (ID 4), técnica de laboratório.**

### Evidências

- O registro de acesso mostra que o crachá de Renata abriu o Depósito de Protótipos às 19:18.
- A câmera registra Renata saindo do corredor de armazenamento com uma caixa de equipamentos às 19:48.
- Renata afirma que não entrou no depósito depois das 19:00 e que permaneceu organizando o laboratório. O registro de acesso e a gravação contradizem seu depoimento.

### Consulta de exemplo

```sql
SELECT suspects.name, camera_logs.time, camera_logs.event
FROM suspects
JOIN camera_logs ON suspects.id = camera_logs.suspect_id
WHERE suspects.id = 4;
```

Para conferir o acesso ao depósito:

```sql
SELECT suspects.name, access_logs.time
FROM access_logs
JOIN suspects ON suspects.id = access_logs.suspect_id
WHERE access_logs.room_id = 3
  AND access_logs.time >= '19:00';
```

## Caso #003 — A fraude no leilão

**Principal responsável identificado: Clara Nunes (ID 3), intermediária.** Os registros também apontam para uma inconsistência envolvendo Ana Ribeiro (ID 1), indicada como pagadora.

### Evidências

- Clara fez o lance de ID 2, no valor de 6.500, pela obra *Noite Azul*.
- O pagamento associado a esse lance foi rejeitado.
- O registro do pagamento indica Ana Ribeiro como pagadora, e não Clara. Essa divergência entre o autor do lance e a pessoa associada ao pagamento é o principal indício da fraude.

### Consulta de exemplo

```sql
SELECT
  suspects.name AS responsavel_pelo_lance,
  bids.id AS lance_id,
  artworks.title AS obra,
  bids.amount AS valor_lance,
  payments.payer_id,
  payments.amount AS valor_pago,
  payments.status
FROM bids
JOIN payments ON payments.bid_id = bids.id
JOIN suspects ON suspects.id = bids.suspect_id
JOIN artworks ON artworks.id = bids.artwork_id
WHERE payments.status = 'REJECTED';
```

Para identificar também o nome da pessoa registrada como pagadora, relacione a tabela `suspects` uma segunda vez com um alias para o pagador:

```sql
SELECT
  bidder.name AS autor_do_lance,
  payer.name AS pagador_registrado,
  artworks.title AS obra,
  bids.amount AS valor_lance,
  payments.amount AS valor_pagamento,
  payments.status
FROM bids
JOIN payments ON payments.bid_id = bids.id
JOIN suspects AS bidder ON bidder.id = bids.suspect_id
JOIN suspects AS payer ON payer.id = payments.payer_id
JOIN artworks ON artworks.id = bids.artwork_id
WHERE payments.status = 'REJECTED';
```

---

## Observação

As consultas são exemplos para conferir as evidências, não uma única solução obrigatória. O objetivo é relacionar registros de tabelas diferentes e justificar a acusação com dados do banco.
