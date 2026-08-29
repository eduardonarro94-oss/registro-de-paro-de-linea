/**
 * Antigravity Quality System - Registro de Paro de Línea
 * Formato Oficial: F-BX-CAL-61-01 Rev. D (Enero 06, 2026)
 * Lógica principal del formulario, cálculos e interacciones.
 */

const STORAGE_KEY = 'F-BX-CAL-61-01_Draft_Data';

document.addEventListener('DOMContentLoaded', () => {
  // Inicializar firmas digitales
  if (window.signatureManager) {
    window.signatureManager.init();
  }

  // Establecer fecha actual por defecto si no hay valor
  const dateInput = document.getElementById('fecha');
  if (dateInput && !dateInput.value) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
  }

  // Escuchadores para cálculo automático de tiempo de paro
  const horaParoInput = document.getElementById('hora_paro');
  const horaArranqueInput = document.getElementById('hora_arranque');

  if (horaParoInput && horaArranqueInput) {
    horaParoInput.addEventListener('input', calculateDowntime);
    horaArranqueInput.addEventListener('input', calculateDowntime);
  }

  // Inicializar Acordeón Ishikawa 6M
  initIshikawaAccordion();

  // Escuchadores para la matriz de purgas y contadores
  initPurgeMatrixCalculations();

  // Botones de acción principales
  document.getElementById('btn-save')?.addEventListener('click', saveFormData);
  document.getElementById('btn-load')?.addEventListener('click', loadFormData);
  document.getElementById('btn-clear-all')?.addEventListener('click', clearFormData);
  document.getElementById('btn-print')?.addEventListener('click', () => window.print());

  // Intentar cargar borrador previo automáticamente si existe
  if (localStorage.getItem(STORAGE_KEY)) {
    loadFormData(false); // Silent auto-load on start
  } else {
    calculateDowntime();
  }
});

/**
 * Cálculo de Minutos Totales Sin Producir (Soporta cruce de medianoche)
 */
function calculateDowntime() {
  const horaParo = document.getElementById('hora_paro')?.value;
  const horaArranque = document.getElementById('hora_arranque')?.value;

  const displayEl = document.getElementById('total_minutos_display');
  const textFormattedEl = document.getElementById('tiempo_formateado_display');
  const badgeEl = document.getElementById('downtime_badge');

  if (!horaParo || !horaArranque) {
    if (displayEl) displayEl.textContent = '0';
    if (textFormattedEl) textFormattedEl.textContent = 'Ingrese ambas horas';
    if (badgeEl) {
      badgeEl.className = 'px-3 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-600 border border-slate-200';
      badgeEl.textContent = 'Sin datos';
    }
    return;
  }

  const [h1, m1] = horaParo.split(':').map(Number);
  const [h2, m2] = horaArranque.split(':').map(Number);

  let startTotalMins = h1 * 60 + m1;
  let endTotalMins = h2 * 60 + m2;

  // Si la hora de arranque es menor que la de paro, cruzó la medianoche (agregar 24h = 1440 min)
  if (endTotalMins < startTotalMins) {
    endTotalMins += 1440;
  }

  const diffMinutes = endTotalMins - startTotalMins;

  // Formato horas y minutos
  const hours = Math.floor(diffMinutes / 60);
  const remainingMins = diffMinutes % 60;
  let formattedStr = `${diffMinutes} minutos`;

  if (hours > 0) {
    formattedStr += ` (${hours}h ${remainingMins}m)`;
  }

  if (displayEl) displayEl.textContent = diffMinutes;
  if (textFormattedEl) textFormattedEl.textContent = formattedStr;

  // Estilo visual según severidad del tiempo de paro
  if (badgeEl) {
    if (diffMinutes < 30) {
      badgeEl.className = 'px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700 border border-blue-300';
      badgeEl.textContent = 'Paro Menor (< 30m)';
    } else if (diffMinutes <= 60) {
      badgeEl.className = 'px-3 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800 border border-amber-300';
      badgeEl.textContent = 'Paro Moderado (30-60m)';
    } else {
      badgeEl.className = 'px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700 border border-red-300 animate-pulse';
      badgeEl.textContent = '⚠️ PARO CRÍTICO (> 60m)';
    }
  }
}

/**
 * Acordeón interactivo para la Guía Ishikawa 6M
 */
function initIshikawaAccordion() {
  const toggleBtn = document.getElementById('btn-toggle-ishikawa');
  const content = document.getElementById('ishikawa-accordion-content');
  const icon = document.getElementById('ishikawa-chevron');

  if (toggleBtn && content) {
    toggleBtn.addEventListener('click', () => {
      const isOpen = content.classList.contains('active');
      if (isOpen) {
        content.classList.remove('active');
        if (icon) icon.style.transform = 'rotate(0deg)';
        toggleBtn.setAttribute('aria-expanded', 'false');
      } else {
        content.classList.add('active');
        if (icon) icon.style.transform = 'rotate(180deg)';
        toggleBtn.setAttribute('aria-expanded', 'true');
      }
    });
  }
}

/**
 * Cálculos automáticos de la matriz de purgas por estación
 */
function initPurgeMatrixCalculations() {
  const purgeInputs = document.querySelectorAll('.purge-inspeccionadas, .purge-rechazadas');
  purgeInputs.forEach(input => {
    input.addEventListener('input', calculatePurgeTotals);
  });
}

function calculatePurgeTotals() {
  let totalInspeccionadas = 0;
  let totalRechazadas = 0;

  document.querySelectorAll('.purge-inspeccionadas').forEach(inp => {
    totalInspeccionadas += Number(inp.value) || 0;
  });

  document.querySelectorAll('.purge-rechazadas').forEach(inp => {
    totalRechazadas += Number(inp.value) || 0;
  });

  const totalInspEl = document.getElementById('total_purge_inspeccionadas');
  const totalRechEl = document.getElementById('total_purge_rechazadas');

  if (totalInspEl) totalInspEl.textContent = totalInspeccionadas;
  if (totalRechEl) totalRechEl.textContent = totalRechazadas;

  // Auto-actualizar unidades inspeccionadas de contención si no ha sido editado manualmente
  const unidadesInspInput = document.getElementById('unidades_inspeccionadas');
  if (unidadesInspInput && totalInspeccionadas > 0 && !unidadesInspInput.dataset.manualEdit) {
    unidadesInspInput.value = totalInspeccionadas;
  }
}

/**
 * Guardar datos del formulario en localStorage
 */
function saveFormData() {
  try {
    const formData = {};

    // Guardar todos los inputs, selects y textareas por ID o Name
    const elements = document.querySelectorAll('input, select, textarea');
    elements.forEach(el => {
      if (el.id) {
        if (el.type === 'checkbox') {
          formData[el.id] = el.checked;
        } else if (el.type === 'radio') {
          if (el.checked) formData[el.name] = el.value;
        } else {
          formData[el.id] = el.value;
        }
      }
    });

    // Guardar firmas digitales
    if (window.signatureManager) {
      formData.signatures = window.signatureManager.getAllSignatures();
    }

    formData.timestamp = new Date().toISOString();

    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    showToast('✓ Registro guardado localmente con éxito');
  } catch (err) {
    console.error('Error al guardar datos:', err);
    showToast('❌ Error al guardar datos en el navegador');
  }
}

/**
 * Cargar datos guardados desde localStorage
 */
function loadFormData(showToastNotice = true) {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      if (showToastNotice) showToast('ℹ️ No se encontró ningún borrador guardado');
      return;
    }

    const formData = JSON.parse(saved);

    Object.keys(formData).forEach(key => {
      if (key === 'signatures') {
        if (window.signatureManager) {
          window.signatureManager.loadAllSignatures(formData.signatures);
        }
        return;
      }

      const el = document.getElementById(key);
      if (el) {
        if (el.type === 'checkbox') {
          el.checked = formData[key];
        } else {
          el.value = formData[key];
        }
      } else {
        // Tratar radios por name
        const radios = document.getElementsByName(key);
        radios.forEach(radio => {
          if (radio.value === formData[key]) {
            radio.checked = true;
          }
        });
      }
    });

    // Recalcular campos dinámicos
    calculateDowntime();
    calculatePurgeTotals();

    if (showToastNotice) {
      const dateStr = formData.timestamp ? new Date(formData.timestamp).toLocaleTimeString() : '';
      showToast(`✓ Borrador cargado (${dateStr})`);
    }
  } catch (err) {
    console.error('Error al cargar datos:', err);
    if (showToastNotice) showToast('❌ Error al restaurar el borrador');
  }
}

/**
 * Limpiar todo el formulario
 */
function clearFormData() {
  if (!confirm('¿Está seguro de que desea limpiar todo el formulario y restablecer las firmas?')) {
    return;
  }

  // Reset inputs
  const formElements = document.querySelectorAll('input, select, textarea');
  formElements.forEach(el => {
    if (el.type === 'checkbox' || el.type === 'radio') {
      el.checked = false;
    } else {
      el.value = '';
    }
  });

  // Limpiar firmas
  if (window.signatureManager) {
    window.signatureManager.clearAll();
  }

  // Restablecer fecha actual
  const dateInput = document.getElementById('fecha');
  if (dateInput) {
    dateInput.value = new Date().toISOString().split('T')[0];
  }

  // Limpiar localStorage
  localStorage.removeItem(STORAGE_KEY);

  // Recalcular
  calculateDowntime();
  calculatePurgeTotals();

  showToast('🧹 Formulario limpiado correctamente');
}

/**
 * Notificación Toast Flotante
 */
function showToast(message) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}
