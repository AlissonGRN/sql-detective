# Respostas dos casos — SQL Detective

Este material acompanha a nova progressão pedagógica. As consultas são exemplos de solução; o objetivo é compreender a estrutura e interpretar os registros.

## Caso #001 — O Quadro Desaparecido

**Responsável: Carlos Mendes (ID 2), segurança.**

### Progressão

1. Consulte todas as pessoas:

```sql
SELECT *
FROM suspects;
```

2. Escolha apenas nome e profissão:

```sql
SELECT name, occupation
FROM suspects;
```

3. Filtre a profissão:

```sql
SELECT *
FROM suspects
WHERE occupation = 'Segurança';
```

4. Confira a câmera:

```sql
SELECT *
FROM camera_logs
WHERE suspect_id = 2;
```

5. Compare com o depoimento:

```sql
SELECT *
FROM interviews
WHERE suspect_id = 2;
```

**O que observar:** os registros da câmera mostram Carlos entrando e saindo do corredor da Sala Bellmont. No depoimento, ele afirma que não entrou na sala naquela noite.

**Conceitos praticados:** tabelas, registros, colunas, `SELECT`, `FROM` e `WHERE` com igualdade.

## Caso #002 — O Protótipo Desaparecido

**Responsável: Renata Martins (ID 4), técnica de laboratório.**

### Progressão

1. Encontre quem saiu às 19:00 ou depois:

```sql
SELECT suspect_id, exit_time
FROM visits
WHERE exit_time >= '19:00';
```

2. Consulte quem acessou o depósito (sala 3):

```sql
SELECT *
FROM access_logs
WHERE room_id = 3;
```

3. Combine o local e o horário:

```sql
SELECT suspect_id, time
FROM access_logs
WHERE room_id = 3
  AND time >= '19:00';
```

4. Confira a câmera:

```sql
SELECT *
FROM camera_logs
WHERE suspect_id = 4;
```

5. Compare com o depoimento:

```sql
SELECT *
FROM interviews
WHERE suspect_id = 4;
```

**O que observar:** Renata aparece saindo do corredor de armazenamento com uma caixa de equipamentos às 19:48. Ela afirmou que não entrou no depósito depois das 19:00.

**Conceitos praticados:** comparação com `>=`, filtros com `WHERE` e combinação de condições com `AND`.

## Caso #003 — A Fraude no Leilão

**Principal responsável identificado: Clara Nunes (ID 3), intermediária.**

### Progressão

1. Consulte os lances:

```sql
SELECT *
FROM bids;
```

2. Encontre lances de 5.000 ou mais:

```sql
SELECT suspect_id, amount
FROM bids
WHERE amount >= 5000;
```

3. Localize o pagamento rejeitado:

```sql
SELECT *
FROM payments
WHERE status = 'REJECTED';
```

Observe que `payments.bid_id` guarda o identificador do lance relacionado.

4. Relacione lances e pagamentos com `JOIN`:

```sql
SELECT bids.suspect_id, payments.status
FROM bids
JOIN payments ON payments.bid_id = bids.id
WHERE payments.status = 'REJECTED';
```

5. Descubra o nome do participante:

```sql
SELECT *
FROM suspects
WHERE id = 3;
```

**O que observar:** o pagamento rejeitado está ligado ao lance de ID 2, realizado pelo suspeito de ID 3. O pagamento aparece associado a outra pessoa (ID 1), Ana Ribeiro. A divergência é o principal indício da fraude.

**Conceitos praticados:** filtros, comparações, chaves relacionadas, `JOIN` e `ON`.

---

## Progressão de aprendizagem

| Caso | Conteúdo novo | Objetivo pedagógico |
|---|---|---|
| #001 | `SELECT`, `FROM`, seleção de colunas e `WHERE` | Aprender a consultar uma tabela e filtrar por igualdade |
| #002 | `>=` e `AND` | Comparar valores e combinar condições |
| #003 | `JOIN` e `ON` | Relacionar dados de tabelas diferentes |

Cada caso reaproveita conceitos anteriores e introduz poucos elementos novos por vez. O aluno continua montando todas as consultas com blocos; a interface não exige digitação de SQL.
