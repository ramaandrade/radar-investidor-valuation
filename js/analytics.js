/**
 * Módulo de Analytics & Micro-tracking de Engajamento
 * Passo 6 - Radar do Investidor: Avaliação de Empresas (Valuation)
 * 
 * Funcionalidades:
 * - Medição do tempo ativo de página (focado vs desfocado)
 * - Micro-tracking do CTA (< 5s dispara toast de conscientização pedagógica)
 * - Profundidade de scroll (25%, 50%, 75%, 100%)
 * - Tempo ativo e expansão em cada Card (Mindset, Mecânica Prática, Toolkit)
 * - Rastreio de cliques nas ferramentas externas
 * - Painel do docente para auditoria rápida com exportação JSON para LMS
 */

class ValuationAnalytics {
  constructor() {
    this.sessionStartTime = Date.now();
    this.totalActiveTimeMs = 0;
    this.lastFocusTime = Date.now();
    this.isPageFocused = !document.hidden;

    this.scrollMilestones = {
      25: false,
      50: false,
      75: false,
      100: false
    };

    this.cardEngagement = {
      'card-a': { title: 'O Mindset (Comportamento e Visão)', opened: true, timeMs: 0, lastOpenedTime: Date.now() },
      'card-b': { title: 'A Mecânica Prática (Ações do Analista)', opened: false, timeMs: 0, lastOpenedTime: null },
      'card-c': { title: 'Toolkit da Internet (As Ferramentas de Campo)', opened: false, timeMs: 0, lastOpenedTime: null }
    };

    this.eventsLog = [];
    this.maxScrollPercent = 0;

    this.initVisibilityTracking();
    this.initScrollTracking();
    this.logEvent('session_start', { userAgent: navigator.userAgent });
  }

  /**
   * Retorna o tempo decorrido desde o carregamento em segundos
   */
  getElapsedSeconds() {
    return Math.floor((Date.now() - this.sessionStartTime) / 1000);
  }

  /**
   * Retorna o tempo com foco ativo (tempo que o aluno realmente esteve na aba)
   */
  getActiveSeconds() {
    let currentSession = this.totalActiveTimeMs;
    if (this.isPageFocused) {
      currentSession += (Date.now() - this.lastFocusTime);
    }
    return Math.floor(currentSession / 1000);
  }

  /**
   * Registra um evento de telemetria no histórico e console
   */
  logEvent(eventName, eventData = {}) {
    const elapsedSeconds = this.getElapsedSeconds();
    const activeSeconds = this.getActiveSeconds();

    const event = {
      id: 'evt_' + Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      elapsedSeconds,
      activeSeconds,
      event: eventName,
      data: eventData
    };

    this.eventsLog.push(event);

    try {
      sessionStorage.setItem('radar_valuation_events', JSON.stringify(this.eventsLog));
    } catch (e) {
      // Falha silenciosa de storage
    }

    console.info(
      `%c[VALUATION RADAR]%c ${eventName} (ativo: ${activeSeconds}s | total: ${elapsedSeconds}s)`,
      'background: #059669; color: #ffffff; font-weight: bold; padding: 2px 6px; border-radius: 4px;',
      'color: #10B981; font-weight: bold;',
      eventData
    );

    // Notifica listeners externos (ex: integração com LMS / Canvas / Moodle)
    window.dispatchEvent(new CustomEvent('radar_valuation_metric', { detail: event }));

    this.updateInspectorUI();
  }

  /**
   * Acompanhamento de foco da aba para garantir métricas confiáveis
   */
  initVisibilityTracking() {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.isPageFocused = false;
        this.totalActiveTimeMs += (Date.now() - this.lastFocusTime);
        this.logEvent('tab_blur', { activeSecondsSoFar: Math.floor(this.totalActiveTimeMs / 1000) });
      } else {
        this.isPageFocused = true;
        this.lastFocusTime = Date.now();
        this.logEvent('tab_focus');
      }
    });

    window.addEventListener('beforeunload', () => {
      this.logEvent('session_exit', {
        totalTimeSeconds: this.getElapsedSeconds(),
        activeTimeSeconds: this.getActiveSeconds(),
        maxScroll: this.maxScrollPercent
      });
    });
  }

  /**
   * Monitoramento de Profundidade de Scroll (25%, 50%, 75%, 100%)
   */
  initScrollTracking() {
    let ticking = false;

    const checkScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;

      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollPercent = Math.min(100, Math.round((scrollTop / docHeight) * 100));

      if (scrollPercent > this.maxScrollPercent) {
        this.maxScrollPercent = scrollPercent;
      }

      [25, 50, 75, 100].forEach((milestone) => {
        if (scrollPercent >= milestone && !this.scrollMilestones[milestone]) {
          this.scrollMilestones[milestone] = true;
          this.logEvent('scroll_depth_reached', {
            milestone: `${milestone}%`,
            actualPercent: scrollPercent
          });
        }
      });

      // Atualiza badge no cabeçalho se existir
      const badge = document.getElementById('telemetry-scroll-badge');
      if (badge) {
        badge.textContent = `${this.maxScrollPercent}%`;
      }

      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(checkScroll);
        ticking = true;
      }
    }, { passive: true });
  }

  /**
   * Rastreio de abertura e tempo por Card
   */
  trackCardToggle(cardId, cardTitle, isOpen) {
    const card = this.cardEngagement[cardId];
    if (card) {
      if (isOpen) {
        card.opened = true;
        card.lastOpenedTime = Date.now();
        this.logEvent('card_expanded', { cardId, title: cardTitle });
      } else {
        if (card.lastOpenedTime) {
          card.timeMs += (Date.now() - card.lastOpenedTime);
          card.lastOpenedTime = null;
        }
        this.logEvent('card_collapsed', {
          cardId,
          title: cardTitle,
          cumulativeSeconds: Math.floor(card.timeMs / 1000)
        });
      }
    }
  }

  /**
   * Rastreio de cliques no Toolkit
   */
  trackToolClick(toolName, url, category) {
    this.logEvent('toolkit_clicked', {
      toolName,
      url,
      category,
      timeBeforeClickSeconds: this.getActiveSeconds()
    });
  }

  /**
   * Avaliação do CTA de conclusão e verificação de leitura relâmpago (< 5s)
   */
  evaluateCtaClick(cardsExploredCount, totalCards) {
    const activeSeconds = this.getActiveSeconds();
    const isFastClick = activeSeconds < 5;

    this.logEvent('cta_iniciar_avaliacao_clicked', {
      activeSeconds,
      cardsExploredCount,
      totalCards,
      isFastClick,
      maxScroll: this.maxScrollPercent
    });

    return {
      activeSeconds,
      isFastClick,
      cardsExploredCount,
      totalCards,
      maxScroll: this.maxScrollPercent
    };
  }

  /**
   * Atualização do painel do professor (inspector modal)
   */
  updateInspectorUI() {
    const maxScrollEl = document.getElementById('inspector-max-scroll');
    const eventsCountEl = document.getElementById('inspector-events-count');
    const sessionTimeEl = document.getElementById('inspector-session-time');
    const eventsListEl = document.getElementById('inspector-events-list');

    if (maxScrollEl) maxScrollEl.textContent = `${this.maxScrollPercent}%`;
    if (eventsCountEl) eventsCountEl.textContent = this.eventsLog.length;
    if (sessionTimeEl) sessionTimeEl.textContent = `${this.getActiveSeconds()}s`;

    if (eventsListEl) {
      if (this.eventsLog.length === 0) {
        eventsListEl.innerHTML = '<p class="empty-events-text">Nenhum evento registrado ainda.</p>';
      } else {
        const recent = this.eventsLog.slice(-15).reverse();
        eventsListEl.innerHTML = recent.map((e) => `
          <div class="event-row">
            <span class="event-tag">${e.event}</span>
            <span class="event-time">+${e.activeSeconds}s</span>
            <span class="event-info">${JSON.stringify(e.data || {})}</span>
          </div>
        `).join('');
      }
    }
  }

  /**
   * Exporta relatório condensado para o LMS do professor
   */
  getTelemetryReportJSON() {
    return JSON.stringify({
      alunoMeta: {
        plataforma: 'Radar do Investidor - Valuation',
        passo: 6,
        dataHora: new Date().toISOString()
      },
      metricasEngajamento: {
        tempoAtivoSegundos: this.getActiveSeconds(),
        tempoTotalSegundos: this.getElapsedSeconds(),
        maxScrollDepth: `${this.maxScrollPercent}%`,
        milestonesAlcancados: this.scrollMilestones,
        cardsExplorados: this.cardEngagement
      },
      historicoEventos: this.eventsLog
    }, null, 2);
  }
}

// Inicializa a instância global
window.valuationAnalytics = new ValuationAnalytics();
