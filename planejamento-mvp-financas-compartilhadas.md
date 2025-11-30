# Planejamento MVP - Gestão Financeira Compartilhada

## 1. Visão Geral do Produto

### 1.1 Conceito

Plataforma SaaS para gestão financeira de pessoas que dividem contas (casais, amigos, familiares que moram juntos), oferecendo um sistema híbrido que equilibra privacidade individual com transparência compartilhada.

### 1.2 Proposta de Valor

**"O maior desafio não é somar números, é equilibrar privacidade e transparência."**

A solução permite que cada usuário mantenha sua autonomia financeira pessoal enquanto gerencia de forma transparente e justa as despesas compartilhadas com seu parceiro(a) ou coabitante.

---

## 2. Público-Alvo

### Perfil Principal

- Casais que moram juntos
- Amigos que dividem apartamento
- Familiares que compartilham moradia

### Características Comuns

- Possuem contas bancárias individuais
- Dividem despesas comuns (aluguel, mercado, contas)
- Mantêm gastos pessoais separados
- Buscam transparência sem perder privacidade
- Necessitam de praticidade no controle financeiro

---

## 3. Problemas e Dores Identificadas

### 3.1 Dores Principais

1. **Falta de transparência**: Não saber exatamente quanto cada um gastou com despesas compartilhadas
2. **Dificuldade em dividir gastos**: Cálculos manuais de quem deve para quem
3. **Conflitos financeiros**: Falta de clareza gera discussões sobre dinheiro
4. **Trabalho manual**: Planilhas desatualizadas, mensagens perdidas, notas fiscais extraviadas
5. **Privacidade comprometida**: Apps existentes não separam bem gastos pessoais de compartilhados

### 3.2 Cenários Típicos Resolvidos

**Cenário 1: O que é Meu**

- Hobbies, academia, roupas, lanches pessoais
- **Solução**: Transações privadas que só o usuário visualiza

**Cenário 2: O que é Seu**

- Gastos pessoais do parceiro(a)
- **Solução**: Total privacidade, sem acesso cruzado

**Cenário 3: O que é Nosso**

- Aluguel, mercado, internet, conta de luz
- **Solução**: Visibilidade mútua com divisão customizável e automação via Open Finance

---

## 4. Diferenciais Competitivos

1. **Híbrido por Design**: Contas individuais + entidade compartilhada virtual
2. **Open Finance Integrado**: Importação automática de transações (Pluggy)
3. **Flexibilidade de Divisão**: Desde 50/50 até divisões customizadas por transação
4. **Privacidade Respeitada**: Gastos pessoais permanecem invisíveis
5. **Gestão de Pendências**: Sistema calcula automaticamente quem deve para quem

---

## 5. Requisitos Funcionais do MVP

### 5.1 Gestão de Usuários

#### RF01 - Cadastro de Usuário

- Nome, email, senha
- Informações opcionais: renda mensal (privada)
- Autenticação segura

#### RF02 - Sistema de Convites

- Usuário A envia convite por email/link para Usuário B
- Convite válido por 1 dia
- Usuário B pode aceitar ou rejeitar
- Possibilidade de reenvio de convite
- Notificação de aceitação/rejeição

#### RF03 - Grupo de Compartilhamento

- Criado automaticamente após aceite do convite
- Máximo de 2 usuários por grupo (MVP)
- Nome do grupo editável (ex: "Casa João e Maria")
- Configuração de divisão padrão

#### RF04 - Desvinculação

- Qualquer usuário pode solicitar desvinculação
- Pendências financeiras são congeladas como histórico
- Transações passadas permanecem visíveis apenas como consulta
- Impossibilidade de novos lançamentos compartilhados após desvinculação

### 5.2 Gestão Financeira

#### RF05 - Cadastro de Transações Manuais

- Campos: valor, data, categoria, descrição, tipo (receita/despesa)
- Flag: "Esta despesa é compartilhada?"
- Se compartilhada: definir divisão (usar padrão ou customizar)
- Anexo de comprovante (opcional - futuro)

#### RF06 - Integração Open Finance (Pluggy)

- Usuário vincula suas contas bancárias
- Sincronização automática 2x ao dia
- Refresh manual permitido (1x ao dia)
- Transações importadas como "Pessoais" por padrão
- Usuário marca manualmente quais são compartilhadas

#### RF07 - Categorização

- Categorias pré-definidas pelo sistema:
  - Habitação, Alimentação, Transporte, Saúde, Lazer, Educação, Outros
- Usuário pode criar categorias customizadas:
  - Categorias pessoais (privadas)
  - Categorias compartilhadas (visíveis no grupo)
- Sem subcategorias no MVP

#### RF08 - Regras de Divisão

- **Divisão Global do Grupo**: Configurada ao criar o grupo
  - Valor customizado por usuário (ex: João 60%, Maria 40%)
  - Opção: "Proporcional à renda declarada" (automático)
- **Divisão por Transação**: Pode sobrescrever a regra global
  - Manual/customizado para cada despesa específica

#### RF09 - Transações Recorrentes

- Marcar transação como recorrente
- Definir frequência (mensal, semanal)
- Sistema envia lembrete para lançar
- Lançamento manual pelo usuário após lembrete

### 5.3 Dashboard e Visualizações

#### RF10 - Dashboard Híbrido

- **Chave Seletora**: Alternar entre "Minhas Finanças" e "Finanças em Conjunto"
- **Visão Pessoal**:
  - Receitas e despesas pessoais
  - Saldo individual
  - Gráficos por categoria (pessoal)
- **Visão Compartilhada**:
  - Receitas e despesas do grupo
  - Saldo compartilhado
  - Pendências entre usuários
  - Gráficos por categoria (compartilhada)

#### RF11 - Gestão de Pendências

- Cálculo automático de quem deve para quem
- Lista de pendências ativas
- Usuário marca manualmente quando quita pendência
- Histórico de quitações

#### RF12 - Filtros e Períodos

- Visualização padrão: mês corrente
- Filtros customizados por período
- Fechamento mensal automático

### 5.4 Notificações

#### RF13 - Sistema de Notificações

- Convite recebido
- Convite aceito/rejeitado
- Nova transação compartilhada criada
- Lembrete de transação recorrente
- Pendência registrada

---

## 6. Requisitos Não-Funcionais

### RNF01 - Segurança

- Autenticação JWT
- Criptografia de dados sensíveis (renda declarada)
- HTTPS obrigatório
- Conformidade LGPD

### RNF02 - Performance

- Carregamento de dashboard < 2s
- Sincronização Pluggy em background
- Suporte para até 1000 transações por usuário/mês

### RNF03 - Usabilidade

- Interface intuitiva e responsiva
- Mobile-first design
- Onboarding guiado

### RNF04 - Disponibilidade

- Uptime de 99% (MVP)
- Backup diário de dados

---

## 8. Fluxos Principais do MVP

### Fluxo 1: Onboarding e Vinculação

```
1. User A cria conta
2. User A envia convite para User B (email)
3. User B recebe email com link
4. User B cria conta e aceita convite
5. Sistema cria SharedGroup
6. User A define divisão padrão (ex: 50/50)
7. Ambos vinculam contas bancárias (Pluggy)
```

### Fluxo 2: Lançamento de Despesa Compartilhada

```
1. User A acessa dashboard
2. Cria nova transação: "Mercado R$ 500"
3. Marca como "compartilhada"
4. Define divisão (usa padrão 50/50)
5. Sistema calcula: User B deve R$ 250
6. User B recebe notificação
7. User B visualiza no dashboard compartilhado
8. Pendência fica registrada
```

### Fluxo 3: Importação via Open Finance

```
1. Sistema sincroniza 2x ao dia
2. Importa transações do banco de User A
3. Transações aparecem como "pessoais"
4. User A revisa e marca "Aluguel R$ 2000" como compartilhada
5. Define divisão customizada (70/30)
6. Sistema calcula pendência
```

### Fluxo 4: Quitação de Pendência

```
1. User B vê que deve R$ 250 para User A
2. User B transfere R$ 250 via PIX
3. User B marca pendência como "quitada"
4. Sistema atualiza saldo
5. Histórico registrado
```

### Fluxo 5: Desvinculação

```
1. User A solicita desvinculação
2. Sistema confirma ação
3. SharedGroup muda status para "dissolved"
4. Pendências congeladas como histórico
5. Transações passadas permanecem visíveis (readonly)
6. Novos lançamentos compartilhados bloqueados
```

---

---

## 13. Riscos e Mitigações

### Risco 1: Baixa adoção de Open Finance

- **Mitigação**: Lançamento manual robusto, onboarding educativo

### Risco 2: Complexidade de divisão confunde usuários

- **Mitigação**: UX simples, sugestão de 50/50 por padrão, tutoriais

### Risco 3: Privacidade mal compreendida

- **Mitigação**: Comunicação clara sobre o que é visível/invisível

### Risco 4: Conflitos financeiros entre usuários

- **Mitigação**: Sistema apenas registra, não julga; histórico imutável

---
