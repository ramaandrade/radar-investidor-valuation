/**
 * Aplicação Fast Page - Passo 6: Radar do Investidor (Valuation)
 * Interatividade, Micro-tracking de Engajamento, Simuladores Didáticos e PWA
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elementos do DOM
  const cards = document.querySelectorAll('.modular-card');
  const toggleAllBtn = document.getElementById('toggle-all-btn');
  const progressFill = document.getElementById('reading-progress-fill');
  const progressText = document.getElementById('reading-progress-text');
  const stickyCta = document.getElementById('sticky-cta-btn');
  const ctaStatusBadge = document.getElementById('cta-progress-indicator');
  
  // Modais e Toasts
  const examModal = document.getElementById('exam-modal');
  const toastContainer = document.getElementById('fast-click-toast');
  const toastReviewBtn = document.getElementById('toast-review-btn');
  const toastProceedBtn = document.getElementById('toast-proceed-btn');
  const closeModalBtns = document.querySelectorAll('.close-modal-trigger');
  const startExamFinalBtn = document.getElementById('start-exam-final-btn');

  // Inspector do Professor
  const openInspectorBtn = document.getElementById('open-inspector-btn');
  const closeInspectorBtn = document.getElementById('close-inspector-btn');
  const inspectorModal = document.getElementById('inspector-modal');
  const copyMetricsBtn = document.getElementById('copy-metrics-btn');

  // Mini Widgets Interativos
  const gigoSlider = document.getElementById('gigo-slider');
  const gigoGrowthDisplay = document.getElementById('gigo-growth-display');
  const gigoValuationDisplay = document.getElementById('gigo-valuation-display');
  const gigoStatusDisplay = document.getElementById('gigo-status-display');
  const leverageButtons = document.querySelectorAll('.leverage-btn');
  const leverageResultText = document.getElementById('leverage-result-text');

  // Controle de Progresso dos Cards
  const exploredCards = new Set();
  const totalCards = cards.length;

  /**
   * Vibração tátil sutil para smartphone (Haptic Feedback)
   */
  const triggerHaptic = (ms = 15) => {
    if (navigator.vibrate) {
      try { navigator.vibrate(ms); } catch (e) {}
    }
  };

  /**
   * Atualização de Progresso de Leitura
   */
  const updateProgress = () => {
    const count = exploredCards.size;
    const percent = Math.round((count / totalCards) * 100);

    if (progressFill) progressFill.style.width = `${percent}%`;
    if (progressText) {
      progressText.textContent = `${count}/${totalCards} explorados`;
      if (count === totalCards) {
        progressText.style.color = 'var(--brand-emerald-glow)';
      }
    }

    if (ctaStatusBadge) {
      if (count === totalCards) {
        ctaStatusBadge.textContent = '100% Revisado';
        ctaStatusBadge.classList.add('badge-success');
      } else {
        ctaStatusBadge.textContent = `${count}/${totalCards} tópicos`;
      }
    }
  };

  // Inicializa cards abertos por padrão
  cards.forEach((card) => {
    const cardId = card.getAttribute('data-card-id');
    if (card.classList.contains('is-open')) {
      exploredCards.add(cardId);
    }
  });
  updateProgress();

  /**
   * Acordeão de Cards
   */
  cards.forEach((card) => {
    const header = card.querySelector('.card-header');
    const cardId = card.getAttribute('data-card-id') || 'card';
    const cardTitle = card.querySelector('.card-title')?.textContent?.trim() || '';

    header.addEventListener('click', () => {
      triggerHaptic(12);
      const isOpen = card.classList.contains('is-open');

      if (isOpen) {
        card.classList.remove('is-open');
        header.setAttribute('aria-expanded', 'false');
        window.valuationAnalytics.trackCardToggle(cardId, cardTitle, false);
      } else {
        card.classList.add('is-open');
        header.setAttribute('aria-expanded', 'true');
        exploredCards.add(cardId);
        updateProgress();
        window.valuationAnalytics.trackCardToggle(cardId, cardTitle, true);
      }
    });

    header.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        header.click();
      }
    });
  });

  /**
   * Expandir / Recolher Todos os Cards
   */
  if (toggleAllBtn) {
    toggleAllBtn.addEventListener('click', () => {
      triggerHaptic(18);
      const allOpen = Array.from(cards).every((c) => c.classList.contains('is-open'));

      cards.forEach((card) => {
        const header = card.querySelector('.card-header');
        const cardId = card.getAttribute('data-card-id');
        const cardTitle = card.querySelector('.card-title')?.textContent?.trim() || '';

        if (allOpen) {
          card.classList.remove('is-open');
          header.setAttribute('aria-expanded', 'false');
          window.valuationAnalytics.trackCardToggle(cardId, cardTitle, false);
        } else {
          card.classList.add('is-open');
          header.setAttribute('aria-expanded', 'true');
          exploredCards.add(cardId);
          window.valuationAnalytics.trackCardToggle(cardId, cardTitle, true);
        }
      });

      updateProgress();
      toggleAllBtn.textContent = allOpen ? 'Expandir todos' : 'Recolher todos';
      window.valuationAnalytics.logEvent('toggle_all_clicked', { state: allOpen ? 'collapsed' : 'expanded' });
    });
  }

  /**
   * 1. MINI SIMULADOR GIGO (Garbage In, Garbage Out)
   */
  if (gigoSlider && gigoGrowthDisplay && gigoValuationDisplay && gigoStatusDisplay) {
    const updateGigo = () => {
      const growth = parseInt(gigoSlider.value, 10);
      gigoGrowthDisplay.textContent = `${growth}% ao ano`;

      // Simulação didática de FCD simplificado (Preço Base R$ 25 * fator de crescimento cumulativo)
      // Base: WACC = 12%, Crescimento Terminal = 4%
      let fairValue = 0;
      if (growth <= 6) {
        fairValue = 28.50 + (growth * 2.1);
        gigoStatusDisplay.textContent = 'Estimativa Prudente';
        gigoStatusDisplay.className = 'sim-val-status status-safe';
      } else if (growth <= 15) {
        fairValue = 42.00 + (growth * 5.8);
        gigoStatusDisplay.textContent = 'Otimismo Moderado';
        gigoStatusDisplay.className = 'sim-val-status status-safe';
      } else if (growth <= 25) {
        fairValue = 75.00 + (growth * 11.2);
        gigoStatusDisplay.textContent = '⚠️ Alerta GIGO (Premissa Agressiva)';
        gigoStatusDisplay.className = 'sim-val-status status-bubble';
      } else {
        fairValue = 180.00 + (growth * 18.5);
        gigoStatusDisplay.textContent = '💥 ILUSÃO GIGO (Lixo Entrando, Lixo Saindo)';
        gigoStatusDisplay.className = 'sim-val-status status-bubble';
      }

      gigoValuationDisplay.textContent = `R$ ${fairValue.toFixed(2).replace('.', ',')}`;
    };

    gigoSlider.addEventListener('input', () => {
      updateGigo();
      window.valuationAnalytics.logEvent('gigo_slider_adjusted', { growthRate: gigoSlider.value });
    });
  }

  /**
   * 2. TERMÔMETRO DÍVIDA LÍQUIDA / EBITDA
   */
  leverageButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      triggerHaptic(12);
      leverageButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const ratio = btn.getAttribute('data-ratio');
      let explanation = '';

      if (ratio === '1.2') {
        explanation = '🟢 <strong>1,2x (Conservadora / Saudável):</strong> A empresa quita sua dívida com pouco mais de 1 ano de lucro operacional. Fica protegida caso a Selic suba.';
      } else if (ratio === '2.4') {
        explanation = '🟡 <strong>2,4x (Zona de Vigilância):</strong> Alavancagem aceitável em setores regulados e previsíveis (como saneamento ou energia), mas perigosa em varejo ou tecnologia.';
      } else if (ratio === '4.5') {
        explanation = '🔴 <strong>4,5x (Sinal Amarelo/Vermelho > 3x):</strong> ALERTA MÁXIMO! Dívida comendo a geração de caixa via despesas financeiras. Em tempos de juros altos, acelera risco de RJ ou calote.';
      }

      if (leverageResultText) {
        leverageResultText.innerHTML = explanation;
      }

      window.valuationAnalytics.logEvent('leverage_ratio_tested', { ratio });
    });
  });

  /**
   * Micro-tracking dos Links Externos do Toolkit
   */
  const toolLinks = document.querySelectorAll('.toolkit-link-btn');
  toolLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      triggerHaptic(10);
      const title = link.querySelector('.toolkit-link-title')?.textContent?.trim() || 'Link';
      const category = link.getAttribute('data-category') || 'Toolkit';
      const url = link.getAttribute('href');

      window.valuationAnalytics.trackToolClick(title, url, category);
    });
  });

  /**
   * Função para Exibir o Modal de Avaliação Formal
   */
  const openExamModal = (count) => {
    const modalNotice = document.getElementById('exam-modal-notice');
    if (modalNotice) {
      if (count < totalCards) {
        modalNotice.innerHTML = `
          <div class="modal-alert-box alert-warning">
            <span class="callout-icon">⚠️</span>
            <div>
              <strong>Revisão Parcial (${count} de ${totalCards} cartões)</strong>
              <p>Recomendamos expandir e ler todos os 3 cartões para fixar armadilhas de múltiplos e Dívida Líquida/EBITDA antes de responder as questões.</p>
            </div>
          </div>
        `;
      } else {
        modalNotice.innerHTML = `
          <div class="modal-alert-box alert-success">
            <span class="callout-icon">🎯</span>
            <div>
              <strong>100% dos Tópicos Explorados!</strong>
              <p>Você cobriu Mindset (Arte & Ciência + GIGO + Moat), Mecânica (FCL, Múltiplos e Dívida) e o Toolkit dos analistas profissionais.</p>
            </div>
          </div>
        `;
      }
    }

    if (examModal) {
      examModal.classList.add('is-active');
      document.body.style.overflow = 'hidden';
    }
  };

  /**
   * Disparo do CTA Sticky com Micro-tracking (< 5s exibe toast de aviso)
   */
  if (stickyCta) {
    stickyCta.addEventListener('click', () => {
      triggerHaptic(20);
      const count = exploredCards.size;
      const evaluation = window.valuationAnalytics.evaluateCtaClick(count, totalCards);

      // Requisito do PRD: "Se o aluno clicar em 'Iniciar Avaliação' em menos de 5 segundos,
      // o sistema pode exibir um toast leve: 'Tem certeza? Há dicas valiosas que você não leu!'.
      // Se ele confirmar, segue para a prova."
      if (evaluation.isFastClick) {
        showFastClickToast(evaluation.activeSeconds);
      } else {
        openExamModal(count);
      }
    });
  }

  /**
   * Toast de Leitura Rápida (< 5 segundos)
   */
  const showFastClickToast = (seconds) => {
    if (!toastContainer) return;

    window.valuationAnalytics.logEvent('fast_click_toast_displayed', { secondsOnPage: seconds });
    toastContainer.classList.add('is-active');

    // Auto-dismiss após 9s se o aluno não interagir
    clearTimeout(window.fastToastTimer);
    window.fastToastTimer = setTimeout(() => {
      toastContainer.classList.remove('is-active');
    }, 9000);
  };

  if (toastReviewBtn) {
    toastReviewBtn.addEventListener('click', () => {
      triggerHaptic(12);
      if (toastContainer) toastContainer.classList.remove('is-active');
      window.valuationAnalytics.logEvent('toast_action_chosen', { action: 'review_content' });

      // Rola suavemente até o primeiro card fechado ou até o topo
      window.scrollTo({ top: 120, behavior: 'smooth' });
    });
  }

  if (toastProceedBtn) {
    toastProceedBtn.addEventListener('click', () => {
      triggerHaptic(15);
      if (toastContainer) toastContainer.classList.remove('is-active');
      window.valuationAnalytics.logEvent('toast_action_chosen', { action: 'proceed_anyway' });
      openExamModal(exploredCards.size);
    });
  }

  /**
   * Fechamento de Modais
   */
  closeModalBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (examModal) examModal.classList.remove('is-active');
      if (inspectorModal) inspectorModal.classList.remove('is-active');
      document.body.style.overflow = '';
    });
  });

  window.addEventListener('click', (e) => {
    if (e.target === examModal) {
      examModal.classList.remove('is-active');
      document.body.style.overflow = '';
    }
    if (e.target === inspectorModal) {
      inspectorModal.classList.remove('is-active');
      document.body.style.overflow = '';
    }
  });

  /**
   * Confirmação Final de Início da Prova
   */
  if (startExamFinalBtn) {
    startExamFinalBtn.addEventListener('click', () => {
      triggerHaptic(30);
      window.valuationAnalytics.logEvent('exam_start_confirmed', {
        status: 'redirecting_to_evaluation',
        finalMetrics: {
          activeSeconds: window.valuationAnalytics.getActiveSeconds(),
          maxScroll: window.valuationAnalytics.maxScrollPercent
        }
      });

      const originalHtml = startExamFinalBtn.innerHTML;
      startExamFinalBtn.disabled = true;
      startExamFinalBtn.innerHTML = '⏳ Conectando à Avaliação Formal...';

      setTimeout(() => {
        alert('🎉 Transição Realizada com Sucesso!\n\nO aluno avançou para a Avaliação Formal de Valuation.\nTodas as métricas de tempo e engajamento foram registradas no sistema.');
        startExamFinalBtn.disabled = false;
        startExamFinalBtn.innerHTML = originalHtml;
        if (examModal) examModal.classList.remove('is-active');
        document.body.style.overflow = '';
      }, 700);
    });
  }

  /**
   * Painel de Telemetria do Professor
   */
  if (openInspectorBtn && inspectorModal) {
    openInspectorBtn.addEventListener('click', () => {
      window.valuationAnalytics.updateInspectorUI();
      inspectorModal.classList.add('is-active');
      document.body.style.overflow = 'hidden';
    });
  }

  if (closeInspectorBtn && inspectorModal) {
    closeInspectorBtn.addEventListener('click', () => {
      inspectorModal.classList.remove('is-active');
      document.body.style.overflow = '';
    });
  }

  if (copyMetricsBtn) {
    copyMetricsBtn.addEventListener('click', () => {
      const jsonReport = window.valuationAnalytics.getTelemetryReportJSON();
      navigator.clipboard.writeText(jsonReport).then(() => {
        triggerHaptic(20);
        const originalText = copyMetricsBtn.textContent;
        copyMetricsBtn.textContent = '✅ Relatório JSON Copiado!';
        setTimeout(() => {
          copyMetricsBtn.textContent = originalText;
        }, 2200);
      }).catch(() => {
        alert(jsonReport);
      });
    });
  }

  /**
   * Registro do Service Worker para PWA Offline
   */
  if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .then((reg) => console.log('SW ativo com sucesso:', reg.scope))
        .catch((err) => console.warn('SW registro ignorado no ambiente atual:', err));
    });
  }
});
