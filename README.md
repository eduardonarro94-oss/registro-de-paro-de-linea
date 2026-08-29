# 🏭 Registro de Paro de Línea (F-BX-CAL-61-01 Rev. D)

> **Sistema web interactivo y responsivo para la digitalización del registro de paro de línea y análisis de causa raíz en manufactura electrónica e industrial.**

[![Licencia](https://img.shields.io/badge/Licencia-MIT-blue.svg)](LICENSE)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)](https://developer.mozilla.org/es/docs/Web/HTML)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![JavaScript](https://img.shields.io/badge/Vanilla_JS-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/es/docs/Web/JavaScript)
[![GitHub Pages](https://img.shields.io/badge/Deploy-GitHub_Pages-22c55e?style=flat&logo=github)](https://TU-USUARIO.github.io/registro-paro-de-linea)

---

## 🌐 Demo en Vivo

Puedes acceder a la versión interactiva publicada en GitHub Pages a través del siguiente enlace:

👉 **[https://TU-USUARIO.github.io/registro-paro-de-linea](https://TU-USUARIO.github.io/registro-paro-de-linea)** *(Sustituye `TU-USUARIO` por tu nombre de usuario de GitHub)*

---

## 📌 Descripción General

Este proyecto digitaliza de manera oficial el formato **"F-BX-CAL-61-01 Rev. D: Registro de Paro de Línea" (Vigencia: Enero 06, 2026)** utilizado en entornos de manufactura de alta precisión. 

Proporciona a ingenieros de procesos, supervisores de producción y auditores de calidad una interfaz tipo tablero industrial para documentar paros de producción, calcular minutos de inactividad, ejecutar análisis de causa raíz y firmar digitalmente sin requerir software externo ni dependencias de backend.

---

## 🚀 Características Principales

- **📄 Formato Digital Oficial**: Diseñado siguiendo los estándares de auditoría y control de calidad industrial (**F-BX-CAL-61-01 Rev. D**).
- **⏱️ Cálculo Automático de Tiempo Muerto**: Cálculo en tiempo real de los minutos totales sin producir al ingresar la *Hora de Paro* y *Hora de Arranque*. Soporta automáticamente **cambios de turno nocturnos que cruzan la medianoche** (ejemplo: 23:30 a 01:15 = 105 min / 1h 45m).
- **📊 Análisis de Discrepancia 5W2H**: Campos estructurados en cuadrícula para *What, Where, Who, When, Why, How* y *How Many*, complementados con No. de Parte, Serie y Contenedor.
- **🔍 Matriz de Contención y Purgas (BX-CAL-72)**: Alerta visual obligatoria para la norma de purga de materiales. Matriz interactiva por estación (*OBA, BKD, SMT, Embarques, Reparaciones, Otros*) con sumatoria automática de piezas inspeccionadas y rechazadas.
- **💡 Guía Interactiva Ishikawa 6M**: Acordeón desplegable de consulta rápida con las 6 categorías de manufactura (*Medio Ambiente, Método, Maquinaria, Material, Medición, Mano de Obra*).
- **🎯 Análisis de Causa Raíz (CFT & 5 Porqués)**: Formulario secuencial numerado del *Why 1* al *Why 5* y campo para la *Causa Raíz Final*.
- **✍️ Firmas Digitales en Canvas**: 5 lienzos interactivos con tecnología Pointer Events (soporte para mouse, lápiz óptico y pantallas táctiles) para:
  - Responsable de Calidad
  - Procesos
  - Área / Estación
  - SSyMA (Seguridad, Salud y Medio Ambiente)
  - RoHS (Cumplimiento Ambiental)
- **🖨️ Exportación e Impresión en PDF**: Reglas `@media print` que ocultan botones de navegación, expanden automáticamente la guía Ishikawa y ajustan los elementos a un reporte limpio en formato PDF de 1 a 2 páginas.
- **💾 Persistencia de Datos**: Almacenamiento local mediante `localStorage` (*Guardar Registro*, *Cargar Borrador*, *Limpiar Formulario*) con notificaciones visuales Toast.

---

## 🛠️ Tecnologías Utilizadas

- **HTML5**: Estructura semántica moderna.
- **Tailwind CSS (CDN)**: Estilizado responsivo con paleta de colores industrial.
- **Vanilla JavaScript (ES6+)**: Lógica limpia sin frameworks ni compiladores adicionales.
- **HTML5 Canvas API**: Trazado suave de firmas digitales con escalado DPI para alta resolución.
- **Lucide / Feather SVG Icons**: Iconografía técnica vectorial de alta claridad.

---

## 💻 Instrucciones de Instalación y Uso Local

No se requiere `Node.js`, `npm` ni ningún servidor de desarrollo complejo.

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/TU-USUARIO/registro-paro-de-linea.git
   ```
2. **Navegar a la carpeta del proyecto**:
   ```bash
   cd registro-paro-de-linea
   ```
3. **Abrir en el navegador**:
   - En Windows: Simplemente haz doble clic en `index.html` o ejecuta en la terminal:
     ```bash
     start index.html
     ```
   - En macOS / Linux:
     ```bash
     open index.html   # macOS
     xdg-open index.html # Linux
     ```

---

## 📤 Guía Paso a Paso para Publicar en GitHub y GitHub Pages

### Paso 1: Crear el repositorio en GitHub
1. Ingresa a [GitHub - New Repository](https://github.com/new).
2. Asigna el nombre: `registro-paro-de-linea`.
3. Selecciona la visibilidad **Público (Public)**.
4. **IMPORTANTE**: Deja desmarcadas las opciones de inicializar con README, .gitignore o Licencia (ya los tenemos creados).
5. Haz clic en **Create repository**.

### Paso 2: Comandos de Git en la Terminal Local
Ejecuta la siguiente secuencia exacta de comandos en la carpeta de tu proyecto:

```bash
# 1. Inicializar el repositorio Git local
git init

# 2. Agregar todos los archivos al área de preparación
git add .

# 3. Realizar el primer commit
git commit -m "feat: digitalizacion de formato F-BX-CAL-61-01 Rev. D"

# 4. Asegurar que la rama principal se llame main
git branch -M main

# 5. Conectar con tu repositorio en GitHub (reemplaza TU-USUARIO con tu usuario de GitHub)
git remote add origin https://github.com/TU-USUARIO/registro-paro-de-linea.git

# 6. Subir el código a GitHub
git push -u origin main
```

---

### Paso 3: Activar GitHub Pages para compartir el enlace web

Una vez subidos los archivos:

1. Ve a tu repositorio en GitHub: `https://github.com/TU-USUARIO/registro-paro-de-linea`.
2. Dirígete a la pestaña **Settings** (Configuración) $\rightarrow$ **Pages** (en el menú lateral izquierdo).
3. En la sección **Build and deployment**:
   - **Source**: Selecciona `Deploy from a branch`.
   - **Branch**: Selecciona la rama `main` y la carpeta `/ (root)`.
4. Haz clic en el botón **Save**.
5. En unos 30-60 segundos, GitHub generará tu enlace público oficial:
   
   🌐 **`https://TU-USUARIO.github.io/registro-paro-de-linea`**

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Siéntete libre de utilizarlo y adaptarlo a los estándares de calidad de tu planta industrial.
