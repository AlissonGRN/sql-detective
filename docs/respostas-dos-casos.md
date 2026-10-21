# Respostas dos casos — SQL Detective

> Material de consulta para professores e para conferência após jogar. As consultas seguem a progressão dos níveis: primeiro comandos simples em uma tabela; depois filtros; por fim, relacionamento entre tabelas com `JOIN`. São exemplos de solução, não respostas únicas obrigatórias.

## Caso #001 — O Quadro Desaparecido

**Responsável: Carlos Mendes (ID 2), segurança.**

### Como chegar à resposta

Comece consultando os registros de câmera. Não é necessário usar `JOIN` neste caso: a tabela já contém o identificador do suspeito, o horário e o evento.

```sql
SELECT *
FROM camera_logs
WHERE suspect_id = 2;
```

**O que procurar:** Carlos aparece entrando no corredor da Sala Bellmont às 20:39 e saindo às 20:52.

Depois, confira o depoimento na tabela `interviews`:

```sql
SELECT *
FROM interviews
WHERE suspect_id = 2;
```

Carlos diz que não entrou na Sala Bellmont naquela noite. A gravação contradiz sua declaração.

**Conceitos praticados:** `SELECT`, `FROM` e `WHERE`.

## Caso #002 — O Protótipo Desaparecido

**Responsável: Renata Martins (ID 4), técnica de laboratório.**

### Como chegar à resposta

Neste caso, o jogador pode combinar condições simples para filtrar os registros de acesso ao depósito:

```sql
SELECT *
FROM access_logs
WHERE room_id = 3
  AND time >= '19:00';
```

O resultado mostra quem acessou o depósito depois das 19:00. Para conferir o que aconteceu, consulte os registros de câmera:

```sql
SELECT *
FROM camera_logs
WHERE suspect_id = 4;
```

**O que procurar:** Renata aparece saindo do corredor de armazenamento com uma caixa de equipamentos às 19:48. Ela afirmou que não entrou no depósito depois das 19:00.

**Conceitos praticados:** `SELECT`, `FROM`, `WHERE` e `AND`.

## Caso #003 — A fraude no leilão

**Principal responsável identificado: Clara Nunes (ID 3), intermediária.**

Neste nível, as informações estão em tabelas diferentes. O jogador precisa aprender a relacioná-las usando `JOIN`.

### Como chegar à resposta

Primeiro, encontre os pagamentos rejeitados:

```sql
SELECT *
FROM payments
WHERE status = 'REJECTED';
```

O resultado indica que o pagamento rejeitado está associado ao lance de ID 2. Agora, relacione os pagamentos aos lances para descobrir quem fez esse lance:

```sql
SELECT bids.suspect_id, bids.amount, payments.status
FROM bids
JOIN payments ON payments.bid_id = bids.id
WHERE payments.status = 'REJECTED';
```

O resultado aponta para o suspeito de ID 3. Consulte a tabela `suspects` para identificar a pessoa:

```sql
SELECT *
FROM suspects
WHERE id = 3;
```

**O que procurar:** Clara fez o lance de 6.500 pela obra *Noite Azul*. O pagamento associado ao lance foi rejeitado e está registrado em nome de outra pessoa (ID 1), Ana Ribeiro. Essa divergência é o principal indício da fraude.

**Conceitos praticados:** filtros com `WHERE`, relacionamento entre tabelas e `JOIN ... ON`.

---

## Progressão de aprendizagem

| Caso | Habilidade principal | Complexidade |
|---|---|---|
| #001 | Consultar uma tabela e filtrar por um suspeito | Inicial |
| #002 | Combinar condições com `AND` para encontrar registros | Básica |
| #003 | Relacionar tabelas com `JOIN` e interpretar resultados | Intermediária |

As consultas foram mantidas curtas de propósito. A investigação deve evoluir junto com os conceitos ensinados, sem exigir `JOIN` antes de ele ser apresentado ao jogador.
