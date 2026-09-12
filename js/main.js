/* ==========================================================================
   ANIVERSARIO SUNAT 2026 — main.js
   ========================================================================== */

// ⚠️ Reemplaza esta URL por la de tu implementación de Google Apps Script
// (Implementar > Nueva implementación > Aplicación web). Debe terminar en /exec
const API_URL = 'https://script.google.com/macros/s/PEGA_AQUI_TU_ID_DE_IMPLEMENTACION/exec';

const PRECIO_PERSONA = 70;
const FECHA_EVENTO = new Date('2026-09-19T18:00:00-05:00');
const AREAS_LISTA = [
  'Intendencia', 'Auditoría', 'Control de la Deuda y Cobranza',
  'Servicios al Contribuyente', 'Soporte Administrativo', 'Aduanas', 'Insumos Químicos'
];

document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initAOS();
  initParticles();
  initNavScroll();
  initDarkMode();
  initMusicToggle();
  initBackToTop();
  initCountdown();
  initSwiperVenue();
  initLightbox();
  initPaymentCalculator();
  initFormSubmit();
  initQrCode();
  initPdfDownload();
  loadStats();
  setInterval(loadStats, 30000); // refresco cada 30s
});

/* -------------------------------------------------------------------- */
/* LOADER */
/* -------------------------------------------------------------------- */
function initLoader() {
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hide'), 500);
  });
  // Fallback por si 'load' tarda (recursos externos lentos)
  setTimeout(() => loader.classList.add('hide'), 3500);
}

/* -------------------------------------------------------------------- */
/* AOS */
/* -------------------------------------------------------------------- */
function initAOS() {
  if (window.AOS) {
    AOS.init({ duration: 700, easing: 'ease-out-cubic', once: true, offset: 60 });
  }
}

/* -------------------------------------------------------------------- */
/* PARTÍCULAS DECORATIVAS DEL HERO */
/* -------------------------------------------------------------------- */
function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  const total = window.innerWidth < 700 ? 18 : 34;
  for (let i = 0; i < total; i++) {
    const p = document.createElement('span');
    const left = Math.random() * 100;
    const duration = 8 + Math.random() * 10;
    const delay = Math.random() * 10;
    const drift = (Math.random() * 60 - 30) + 'px';
    p.style.left = left + '%';
    p.style.animationDuration = duration + 's';
    p.style.animationDelay = delay + 's';
    p.style.setProperty('--drift', drift);
    container.appendChild(p);
  }
}

/* -------------------------------------------------------------------- */
/* NAV */
/* -------------------------------------------------------------------- */
function initNavScroll() {
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  });
}

/* -------------------------------------------------------------------- */
/* DARK / LIGHT MODE */
/* -------------------------------------------------------------------- */
function initDarkMode() {
  const btn = document.getElementById('darkModeToggle');
  const icon = btn.querySelector('i');
  const saved = localStorage.getItem('sunat2026-theme');

  if (saved === 'light') {
    document.body.classList.add('light-mode');
    icon.className = 'fa-solid fa-sun';
  }

  btn.addEventListener('click', () => {
    const isLight = document.body.classList.toggle('light-mode');
    icon.className = isLight ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    localStorage.setItem('sunat2026-theme', isLight ? 'light' : 'dark');
  });
}

/* -------------------------------------------------------------------- */
/* MÚSICA AMBIENTE */
/* -------------------------------------------------------------------- */
function initMusicToggle() {
  const btn = document.getElementById('musicToggle');
  const audio = document.getElementById('bgMusic');
  const icon = btn.querySelector('i');
  let playing = false;

  btn.addEventListener('click', () => {
    if (!playing) {
      audio.play().catch(() => {
        Swal.fire({
          icon: 'info',
          title: 'Música no disponible',
          text: 'Agrega tu archivo en assets/musica-ambiente.mp3 para activar esta función.',
          confirmButtonColor: '#C9A227'
        });
      });
      icon.className = 'fa-solid fa-volume-high';
    } else {
      audio.pause();
      icon.className = 'fa-solid fa-music';
    }
    playing = !playing;
  });
}

/* -------------------------------------------------------------------- */
/* BOTÓN VOLVER ARRIBA */
/* -------------------------------------------------------------------- */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 600);
  });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* -------------------------------------------------------------------- */
/* CUENTA REGRESIVA (hero + sección completa) */
/* -------------------------------------------------------------------- */
function initCountdown() {
  const targets = [
    { d: 'cdDias', h: 'cdHoras', m: 'cdMinutos', s: 'cdSegundos' },
    { d: 'fcDias', h: 'fcHoras', m: 'fcMinutos', s: 'fcSegundos' }
  ];

  function tick() {
    const now = new Date();
    let diff = FECHA_EVENTO - now;
    if (diff < 0) diff = 0;

    const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutos = Math.floor((diff / (1000 * 60)) % 60);
    const segundos = Math.floor((diff / 1000) % 60);

    targets.forEach(t => {
      setText(t.d, pad(dias));
      setText(t.h, pad(horas));
      setText(t.m, pad(minutos));
      setText(t.s, pad(segundos));
    });
  }
  tick();
  setInterval(tick, 1000);
}
function pad(n) { return String(n).padStart(2, '0'); }
function setText(id, value) { const el = document.getElementById(id); if (el) el.textContent = value; }

/* -------------------------------------------------------------------- */
/* SWIPER GALERÍA DEL LOCAL */
/* -------------------------------------------------------------------- */
function initSwiperVenue() {
  if (!window.Swiper) return;
  new Swiper('.venueSwiper', {
    loop: true,
    autoplay: { delay: 4000, disableOnInteraction: false },
    pagination: { el: '.swiper-pagination', clickable: true },
    navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' }
  });
}

/* -------------------------------------------------------------------- */
/* LIGHTBOX SIMPLE */
/* -------------------------------------------------------------------- */
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const img = document.getElementById('lightboxImg');
  const closeBtn = document.getElementById('lightboxClose');

  document.querySelectorAll('[data-lightbox]').forEach(el => {
    el.addEventListener('click', () => {
      img.src = el.src;
      lightbox.classList.add('open');
    });
  });
  closeBtn.addEventListener('click', () => lightbox.classList.remove('open'));
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.classList.remove('open'); });
}

/* -------------------------------------------------------------------- */
/* CALCULADORA DE PAGO EN TIEMPO REAL */
/* -------------------------------------------------------------------- */
function initPaymentCalculator() {
  const form = document.getElementById('registroForm');
  if (!form) return;

  const numAcompEl = document.getElementById('numAcompanantes');
  const climaInputs = form.querySelectorAll('input[name="climaLaboral"]');

  function recalcular() {
    const acomp = parseInt(numAcompEl.value, 10) || 0;
    const climaSeleccionado = form.querySelector('input[name="climaLaboral"]:checked');
    const alDia = climaSeleccionado ? climaSeleccionado.value === 'Sí' : null;

    let costoTitular = alDia === true ? 0 : PRECIO_PERSONA;
    if (alDia === null) costoTitular = 0; // aún no responde, no asumir cobro

    const costoAcompanantes = acomp * PRECIO_PERSONA;
    const total = costoTitular + costoAcompanantes;

    setText('pTitular', 'S/ ' + costoTitular.toFixed(2));
    setText('pAcompCount', acomp);
    setText('pAcompanantes', 'S/ ' + costoAcompanantes.toFixed(2));
    setText('pBeneficio', alDia === true ? '100% titular' : (alDia === false ? 'No aplica' : '—'));
    setText('pTotal', 'S/ ' + total.toFixed(2));
  }

  numAcompEl.addEventListener('change', recalcular);
  climaInputs.forEach(i => i.addEventListener('change', recalcular));
  recalcular();
}

/* -------------------------------------------------------------------- */
/* ENVÍO DE FORMULARIO */
/* -------------------------------------------------------------------- */
function initFormSubmit() {
  const form = document.getElementById('registroForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombres = form.nombres.value.trim();
    const area = form.area.value;
    const telefono = form.telefono.value.trim();
    const asistira = form.asistira.value;
    const numAcompanantes = form.numAcompanantes.value;
    const climaEl = form.querySelector('input[name="climaLaboral"]:checked');
    const menuEl = form.querySelector('input[name="menu"]:checked');

    if (!nombres || !area || !telefono || !asistira || !climaEl || !menuEl) {
      Swal.fire({ icon: 'warning', title: 'Faltan datos', text: 'Por favor completa todos los campos obligatorios.', confirmButtonColor: '#C9A227' });
      return;
    }
    if (!/^[0-9+\s-]{6,15}$/.test(telefono)) {
      Swal.fire({ icon: 'warning', title: 'Teléfono inválido', text: 'Ingresa un número de teléfono válido.', confirmButtonColor: '#C9A227' });
      return;
    }

    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando…';

    const payload = {
      nombres, area, telefono, asistira,
      numAcompanantes, climaLaboral: climaEl.value, menu: menuEl.value
    };

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' }, // evita preflight CORS con Apps Script
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.ok) {
        launchConfetti();
        Swal.fire({
          icon: 'success',
          title: '¡Asistencia confirmada!',
          html: `Tu código de registro es <strong>${data.idRegistro}</strong><br>Total a pagar: <strong>S/ ${data.pago.total.toFixed(2)}</strong>`,
          confirmButtonColor: '#C9A227'
        });
        form.reset();
        window.__lastRegistro = data.idRegistro;
        loadStats();
      } else {
        Swal.fire({ icon: 'error', title: 'No se pudo registrar', text: data.error || 'Intenta nuevamente en unos minutos.', confirmButtonColor: '#C9A227' });
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error de conexión',
        text: 'No se pudo conectar con el servidor. Verifica tu conexión e inténtalo de nuevo.',
        confirmButtonColor: '#C9A227'
      });
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Confirmar mi asistencia';
    }
  });
}

function launchConfetti() {
  if (!window.confetti) return;
  confetti({ particleCount: 140, spread: 90, origin: { y: 0.6 }, colors: ['#C9A227', '#E8C766', '#C8102E', '#FFFFFF'] });
}

/* -------------------------------------------------------------------- */
/* ESTADÍSTICAS EN TIEMPO REAL */
/* -------------------------------------------------------------------- */
let chartAreasInstance = null;
let chartMenuInstance = null;

async function loadStats() {
  try {
    const res = await fetch(API_URL + '?action=stats');
    const stats = await res.json();
    renderStats(stats);
  } catch (err) {
    // Silencioso: si aún no se configuró el backend, se mantienen los valores en 0
    console.warn('No se pudieron cargar las estadísticas todavía:', err.message);
  }
}

function renderStats(stats) {
  setText('liveCount', stats.totalAsistentes || 0);
  setText('kpiTitulares', stats.totalTitulares || 0);
  setText('kpiAcompanantes', stats.totalAcompanantes || 0);
  setText('kpiTotal', stats.totalAsistentes || 0);
  setText('kpiSubvencionados', stats.subvencionados || 0);

  renderChartAreas(stats.porArea || {});
  renderChartMenu(stats.opcion1 || 0, stats.opcion2 || 0);
  renderRanking(stats.porArea || {});
}

function renderChartAreas(porArea) {
  const ctx = document.getElementById('chartAreas');
  if (!ctx || !window.Chart) return;
  const labels = AREAS_LISTA;
  const data = labels.map(a => (porArea[a] && porArea[a].total) || 0);

  if (chartAreasInstance) chartAreasInstance.destroy();
  chartAreasInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{ label: 'Asistentes', data, backgroundColor: '#C9A227', borderRadius: 8 }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: '#F5F1E8', font: { size: 10 } }, grid: { display: false } },
        y: { ticks: { color: '#F5F1E8' }, grid: { color: 'rgba(255,255,255,.08)' } }
      }
    }
  });
}

function renderChartMenu(opcion1, opcion2) {
  const ctx = document.getElementById('chartMenu');
  if (!ctx || !window.Chart) return;

  if (chartMenuInstance) chartMenuInstance.destroy();
  chartMenuInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Pollo Canga', 'Chicharrón de Chancho'],
      datasets: [{ data: [opcion1, opcion2], backgroundColor: ['#C9A227', '#C8102E'] }]
    },
    options: {
      responsive: true,
      plugins: { legend: { position: 'bottom', labels: { color: '#F5F1E8' } } }
    }
  });
}

function renderRanking(porArea) {
  const body = document.getElementById('rankingBody');
  if (!body) return;
  const rows = AREAS_LISTA.map(a => {
    const d = porArea[a] || { titulares: 0, acompanantes: 0, total: 0 };
    return `<tr><td>${a}</td><td>${d.titulares}</td><td>${d.acompanantes}</td><td>${d.total}</td></tr>`;
  }).join('');
  body.innerHTML = rows || '<tr><td colspan="4">Aún no hay registros.</td></tr>';
}

/* -------------------------------------------------------------------- */
/* QR DE LA INVITACIÓN */
/* -------------------------------------------------------------------- */
function initQrCode() {
  const container = document.getElementById('qrCode');
  if (!container || !window.QRCode) return;
  QRCode.toCanvas(document.createElement('canvas'), window.location.href, { width: 160, margin: 1 }, (err, canvas) => {
    if (!err) container.appendChild(canvas);
  });
}

/* -------------------------------------------------------------------- */
/* DESCARGA DE INVITACIÓN EN PDF */
/* -------------------------------------------------------------------- */
function initPdfDownload() {
  const btn = document.getElementById('downloadPdfBtn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    if (!window.jspdf) {
      Swal.fire({ icon: 'error', title: 'No disponible', text: 'No se pudo cargar el generador de PDF.', confirmButtonColor: '#C9A227' });
      return;
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: 'mm', format: 'a5' });

    doc.setFillColor(10, 31, 68);
    doc.rect(0, 0, 148, 210, 'F');

    doc.setTextColor(232, 199, 102);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('ANIVERSARIO', 74, 50, { align: 'center' });
    doc.text('SUNAT 2026', 74, 62, { align: 'center' });

    doc.setTextColor(245, 241, 232);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.text('"Celebrando juntos un año más de', 74, 80, { align: 'center' });
    doc.text('compromiso, integridad y servicio al país"', 74, 87, { align: 'center' });

    doc.setFontSize(10);
    doc.text('Organiza: ITI Madre de Dios', 74, 105, { align: 'center' });
    doc.text('Fecha: 19 de septiembre de 2026', 74, 113, { align: 'center' });
    doc.text('Lugar: La Finca de la Joya - Salón de Eventos', 74, 121, { align: 'center' });
    doc.text('Av. Aeropuerto con Calle Los Otorongos, Tambopata', 74, 128, { align: 'center' });

    if (window.__lastRegistro) {
      doc.setTextColor(201, 162, 39);
      doc.setFontSize(9);
      doc.text('Código de registro: ' + window.__lastRegistro, 74, 145, { align: 'center' });
    }

    doc.setTextColor(232, 199, 102);
    doc.setFontSize(9);
    doc.text('ITI Madre de Dios · SUNAT 2026', 74, 195, { align: 'center' });

    doc.save('Invitacion-Aniversario-SUNAT-2026.pdf');
  });
}
