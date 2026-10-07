# 📡 Passo 6 — Radar do Investidor: Avaliação de Empresas (Valuation)

> 📱 **Formato:** App Web Mobile (*Single-Page Scroller*) Mobile-First & Fast Page  
> 🧭 **Posição na Trilha:** Passo 6 de 6 (Etapa final antes da avaliação formal)  
> 🏛️ **Público-Alvo:** Estudantes de Finanças Corporativas, Ciências Contábeis, Administração e Mercado de Capitais  
> 🎨 **Identidade Visual:** Verde Institucional (`#059669` / `#10B981`), alto contraste (WCAG AAA) e blocos de cor alternados  
> ⚡ **Performance:** FCP < 500ms, Zero dependências externas bloqueantes, PWA com Service Worker offline  

---

## 🎯 1. Visão Geral e Alinhamento com o PRD

Este projeto implementa integralmente os requisitos do **Documento de Requisitos de Produto (PRD)** para a disciplina de Mercado de Capitais e Finanças Corporativas.

O objetivo é conectar a teoria acadêmica de finanças corporativas à prática implacável do mercado real, tirando o estudante das planilhas teóricas e colocando-o na cadeira de um analista de *equity research* ou investidor institucional.

---

## 📱 2. Especificações de UI/UX Implementadas

* **Layout *Fast Page*:** Estrutura vertical limpa (*single-page scroller*), otimizada para toque com uma mão em telas de smartphones (360px a 500px). Uso de **blocos de cor alternados** sutis (`#0F172A`, `#131E33`, `#0F1928`) para separar os temas sem a necessidade de linhas divisórias pesadas.
* **Cards Expansíveis (Acordeões):** Conceitos densos organizados em acordeões ergonômicos com títulos provocativos. O aluno expande apenas o que deseja ler, mantendo a tela inicial enxuta e focada.
* **Hierarquia Visual para *Skimming*:** Termos-chave como **Moat**, **EBITDA**, **FCD**, **DFC**, **FCL**, **P/L**, **EV/EBITDA** e **Dívida Líquida / EBITDA** destacados em negrito e com o tom de **verde institucional** (`#34D399` / `#10B981`) para rápida leitura visual.
* **Sticky Footer (CTA Permanente):** Barra de ação fixa no rodapé com o botão *"Estou Pronto: Iniciar Avaliação"* e indicador de progresso dinâmico em tempo real.
* **Tipografia Dinâmica:** Funções CSS fluídas `clamp()` ajustam automaticamente tamanhos de fonte e entrelinhas tanto na orientação vertical (**Retrato**) quanto horizontal (**Paisagem**), eliminando a necessidade de *pinch-to-zoom*.

---

## 📚 3. Conteúdo Curado: O "Aulão" de Valuation

### 🧠 Card A: O Mindset (Comportamento e Visão)
1. **Valuation é Arte e Ciência:** Uma planilha não prevê o futuro. O Valuation é 50% matemática (modelagem) e 50% história (narrativa, vantagens competitivas e gestão). Uma boa avaliação exige que os números confirmem a história.
2. **Garbage In, Garbage Out (GIGO):** No Fluxo de Caixa Descontado (**FCD**), premissas infladas geram valores irreais. Inclui **Mini Simulador Interativo GIGO**, onde o aluno mexe no slider de crescimento e vê a distorção do valor justo em tempo real.
3. **O "Fosso Econômico" (Moat):** Por que a empresa não será engolida amanhã? Apresenta os 3 tipos de fossos duráveis: Marca Forte (ex: *Apple*), Custo de Troca Alto (ex: *SAP/TOTVS*) e Efeito de Rede (ex: *WhatsApp*).

### ⚙️ Card B: A Mecânica Prática (Ações do Analista)
1. **Cuidado com o "Lucro Contábil":** Lucro no papel não paga dívida; o que paga é Geração de Caixa. Foco no Fluxo de Caixa Livre (**FCL = FCO - Capex**) na Demonstração dos Fluxos de Caixa (**DFC**).
2. **A Armadilha dos Múltiplos:** **P/L** e **EV/EBITDA** nunca devem comparar maçãs com laranjas. Um P/L de 20x pode ser barato para uma startup SaaS crescendo 40% ao ano, mas caríssimo para uma siderúrgica tradicional estagnada.
3. **Dívida é uma Lupa:** A alavancagem amplifica ganhos na bonança, mas acelera a falência com juros altos. Inclui **Termômetro Interativo de Dívida Líquida / EBITDA** (destacando o sinal de alerta acima de 3x).

### 🛠️ Card C: Toolkit da Internet (As Ferramentas de Campo)
Apresentados como botões largos e fáceis de tocar:
* **Sites de RI (Relações com Investidores):** A fonte primária da verdade para ler Releases de Resultados trimestrais e ouvir *Conference Calls*.
* **Simply Wall St:** Ferramenta visual com gráfico em floco de neve (*Snowflake*) que sintetiza relatórios complexos de valuation e saúde financeira.
* **Status Invest / Fundamentus:** O "feijão com arroz" do investidor brasileiro para histórico de múltiplos, dividendos e margens.
* **O Blog do Damodaran (Musings on Markets):** Artigos gratuitos do "Papa do Valuation" (Aswath Damodaran) avaliando empresas reais (Nvidia, Uber, Tesla) em tempo real.

---

## ⚡ 4. Requisitos Técnicos & Micro-tracking de Engajamento

### ⏱️ Micro-tracking do Tempo de Leitura (< 5 segundos)
Conforme exigido pelo PRD:
* O sistema mede o tempo ativo de permanência do aluno na página via `js/analytics.js`.
* Se o aluno clicar em *"Estou Pronto: Iniciar Avaliação"* em **menos de 5 segundos**, o app intercepta e exibe um **Toast leve de conscientização pedagógica**:
  > *"Tem certeza? Há dicas valiosas que você não leu! Revisar o Fosso Econômico (Moat) e o termômetro de Dívida Líquida / EBITDA vai blindar sua nota nas pegadinhas da prova."*
* O aluno tem a escolha de clicar em *"Revisar Dicas"* ou confirmar *"Avançar Mesmo Assim"*.
* Se o aluno clicar após 5 segundos, o modal abre diretamente com o resumo pré-prova.

### 📊 Painel de Telemetria do Docente
No canto superior direito, o botão com o ícone de gráfico abre o painel do professor, exibindo:
* Profundidade máxima de scroll (25%, 50%, 75%, 100%);
* Tempo ativo vs. tempo total da sessão;
* Log de eventos de interação por cartão;
* Botão para **Copiar Relatório JSON para o LMS** (Canvas, Google Classroom, Moodle).

---

## 💻 5. Como Executar Localmente

```bash
# Navegue até o diretório do projeto:
cd C:\Users\ramal\.gemini\antigravity\scratch\radar-investidor-valuation

# Inicie o servidor local:
python serve.py
```

Abra no navegador do celular ou desktop:  
👉 **http://localhost:8087/index.html**

---

## 🚀 6. Implementação Equivalente em Next.js (SSR / App Router)

Caso deseje empacotar este recurso dentro de uma infraestrutura corporativa Next.js (com SSR para garantir First Contentful Paint < 1s), o código da página (`app/valuation-radar/page.tsx`) segue o padrão:

```tsx
// app/valuation-radar/page.tsx
import { Metadata } from 'next';
import ValuationRadarClient from './ValuationRadarClient';

export const metadata: Metadata = {
  title: 'Passo 6: Radar do Investidor - Valuation',
  description: 'Fast Page mobile para avaliação de empresas e blindagem contra ilusões contábeis.',
};

export default function ValuationRadarPage() {
  // Renderizado instantaneamente no servidor (SSR), zerando o tempo de tela em branco
  return (
    <main className="min-h-screen bg-[#080D1A] text-slate-100 flex justify-center pb-28">
      <ValuationRadarClient />
    </main>
  );
}
```
