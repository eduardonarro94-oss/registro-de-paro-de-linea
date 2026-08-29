/**
 * Módulo de Captura y Gestión de Firmas Digitales en Canvas
 * F-BX-CAL-61-01 Rev. D
 */

class SignaturePadManager {
  constructor() {
    this.pads = {};
    this.canvasIds = [
      'canvas-calidad',
      'canvas-procesos',
      'canvas-estacion',
      'canvas-ssyma',
      'canvas-rohs'
    ];
  }

  init() {
    this.canvasIds.forEach(id => {
      const canvas = document.getElementById(id);
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      this.setupCanvasResolution(canvas, ctx);

      const state = {
        canvas: canvas,
        ctx: ctx,
        isDrawing: false,
        hasDrawn: false,
        lastX: 0,
        lastY: 0
      };

      this.pads[id] = state;

      // Listeners para Pointer Events (Soporta Mouse, Touch y Stylus)
      canvas.addEventListener('pointerdown', (e) => this.startDrawing(e, state));
      canvas.addEventListener('pointermove', (e) => this.draw(e, state));
      canvas.addEventListener('pointerup', () => this.stopDrawing(state));
      canvas.addEventListener('pointerleave', () => this.stopDrawing(state));
      canvas.addEventListener('pointercancel', () => this.stopDrawing(state));

      // Botón Limpiar específico
      const clearBtn = document.getElementById(`btn-clear-${id.replace('canvas-', '')}`);
      if (clearBtn) {
        clearBtn.addEventListener('click', () => this.clear(id));
      }
    });

    // Reajustar resolución en resize de ventana
    window.addEventListener('resize', () => {
      this.canvasIds.forEach(id => {
        const state = this.pads[id];
        if (state) {
          const currentData = this.getSignatureData(id);
          this.setupCanvasResolution(state.canvas, state.ctx);
          if (currentData) {
            this.loadSignatureData(id, currentData);
          }
        }
      });
    });
  }

  setupCanvasResolution(canvas, ctx) {
    const rect = canvas.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;

    // Asignar dimensiones reales de píxeles
    canvas.width = rect.width * ratio;
    canvas.height = rect.height * ratio;

    // Escalar contexto
    ctx.scale(ratio, ratio);
    ctx.lineWidth = 2.2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#0f172a'; // Azul/Negro industrial profundo
  }

  getCoordinates(e, canvas) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }

  startDrawing(e, state) {
    e.preventDefault();
    state.canvas.setPointerCapture(e.pointerId);
    state.isDrawing = true;
    const pos = this.getCoordinates(e, state.canvas);
    state.lastX = pos.x;
    state.lastY = pos.y;
  }

  draw(e, state) {
    if (!state.isDrawing) return;
    e.preventDefault();

    const pos = this.getCoordinates(e, state.canvas);

    state.ctx.beginPath();
    state.ctx.moveTo(state.lastX, state.lastY);
    state.ctx.lineTo(pos.x, pos.y);
    state.ctx.stroke();

    state.lastX = pos.x;
    state.lastY = pos.y;
    state.hasDrawn = true;

    state.canvas.classList.add('has-signature');
    this.updateStatusBadge(state.canvas.id, true);
  }

  stopDrawing(state) {
    if (state.isDrawing) {
      state.isDrawing = false;
    }
  }

  clear(id) {
    const state = this.pads[id];
    if (!state) return;

    const rect = state.canvas.getBoundingClientRect();
    state.ctx.clearRect(0, 0, rect.width, rect.height);
    state.hasDrawn = false;
    state.canvas.classList.remove('has-signature');
    this.updateStatusBadge(id, false);
  }

  clearAll() {
    this.canvasIds.forEach(id => this.clear(id));
  }

  getSignatureData(id) {
    const state = this.pads[id];
    if (!state || !state.hasDrawn) return null;
    return state.canvas.toDataURL('image/png');
  }

  loadSignatureData(id, dataUrl) {
    if (!dataUrl) return;
    const state = this.pads[id];
    if (!state) return;

    const img = new Image();
    img.onload = () => {
      const rect = state.canvas.getBoundingClientRect();
      state.ctx.clearRect(0, 0, rect.width, rect.height);
      state.ctx.drawImage(img, 0, 0, rect.width, rect.height);
      state.hasDrawn = true;
      state.canvas.classList.add('has-signature');
      this.updateStatusBadge(id, true);
    };
    img.src = dataUrl;
  }

  updateStatusBadge(canvasId, isSigned) {
    const key = canvasId.replace('canvas-', '');
    const badge = document.getElementById(`badge-status-${key}`);
    if (badge) {
      if (isSigned) {
        badge.textContent = '✓ Firmado';
        badge.className = 'text-xs px-2 py-0.5 rounded font-semibold bg-emerald-100 text-emerald-700 border border-emerald-300';
      } else {
        badge.textContent = 'Pendiente';
        badge.className = 'text-xs px-2 py-0.5 rounded font-semibold bg-slate-100 text-slate-500 border border-slate-200';
      }
    }
  }

  getAllSignatures() {
    const data = {};
    this.canvasIds.forEach(id => {
      data[id] = this.getSignatureData(id);
    });
    return data;
  }

  loadAllSignatures(data) {
    if (!data) return;
    this.canvasIds.forEach(id => {
      if (data[id]) {
        this.loadSignatureData(id, data[id]);
      }
    });
  }
}

// Instancia global del manager
window.signatureManager = new SignaturePadManager();
