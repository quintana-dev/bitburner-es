<div align="center">

# ⚡ Bitburner en Español (Spanish Edition)

[![Versión](https://img.shields.io/badge/Bitburner-v3.0.1-00ff9d?style=for-the-badge&logo=electron)](https://store.steampowered.com/app/1812820/Bitburner/)
[![Autor](https://img.shields.io/badge/Por-quintana.dev-9f25f0?style=for-the-badge&logo=firefox)](https://quintana.dev.ar)
[![Licencia](https://img.shields.io/badge/Licencia-Apache_2.0_Commons_Clause-blue?style=for-the-badge)](./license.txt)
[![Steam](https://img.shields.io/badge/Steam-Compatible-171a21?style=for-the-badge&logo=steam)](https://store.steampowered.com/app/1812820/Bitburner/)

**La edición definitiva en español de [Bitburner](https://github.com/bitburner-official/bitburner-src), el RPG de simulación cyberpunk y hacking basado en JavaScript.**

[🌐 Sitio Web Oficial](https://quintana.dev.ar) • [📦 Descargar Versión Steam](#-instalación-en-steam-1-clic) • [🎮 Jugar en el Navegador](#-jugar-en-el-navegador) • [📖 Guía de Inicio](#-guía-rápida-de-comandos)

</div>

---

## 🚀 Características Principales

- 🌐 **Traducción Integral al Español:**
  - Menús, interfaz de usuario y navegación lateral.
  - Tutorial interactivo completo para nuevos jugadores.
  - Lore, mensajes cifrados, saltadores de red (*jumpers*) y lore cyberpunk.
  - Páginas de **Estadísticas**, **Crear Programas**, **Facciones**, **Aumentos**, **Trabajos en Progreso**, **Hacknet**, **Editor de Scripts** y **Ajustes**.
- 💻 **Terminal y Código 100% en Inglés:**
  - Todos los comandos de terminal (`scan`, `hack`, `grow`, `weaken`, `run`, `nano`, `cat`, etc.) y la API Netscript de JavaScript (`ns.*`) se mantienen intactos en inglés para garantizar **compatibilidad total con cualquier script, guía o biblioteca de la comunidad**.
- 🎨 **Tema Exclusivo «Cyber Quintana»:**
  - Paleta cyberpunk preinstalada en el explorador de temas con fondos grafito (`#0d0c15`), acentos violeta neón (`#9f25f0` / `#b845ff`) y alto contraste terminal.
- 📁 **Scripts y Guías en Español en `home`:**
  - `guia-inicio.txt`: Manual rápido de primeros pasos y comandos.
  - `hack-basico.js`: Script didáctico con bucle infinito de hackeo comentado paso a paso en español.
  - `auto-hack.js`: Script automatizado multihilo con apertura de acceso ROOT automática mediante `NUKE.exe`.
- ⚡ **Instalador de 1-Clic para Steam (`instalar-español.bat`):**
  - Detecta automáticamente la instalación de Steam, crea un respaldo seguro del juego original y despliega la traducción en segundos.
- 🔓 **Easter Egg Secreto:**
  - Incluye funciones de depuración y sincronización directa con Steamworks API.

---

## 📦 Instalación en Steam (1-Clic)

### Método 1: Con el instalador automático (Recomendado)
1. Descarga el archivo comprimido `.zip` desde [Releases](../../releases).
2. Extrae el contenido en cualquier carpeta.
3. Haz doble clic en **`instalar-español.bat`**.
4. ¡Listo! Abre **Bitburner** desde Steam y disfruta del juego en español.

> [!NOTE]
> El instalador crea automáticamente una copia de seguridad del juego original en la carpeta `dist_backup`.

### Método 2: Instalación Manual
1. Ve a tu carpeta de instalación de Steam (habitualmente `C:\Program Files (x86)\Steam\steamapps\common\Bitburner\resources\app\dist`).
2. Haz una copia de respaldo de tu archivo `main.bundle.js` actual.
3. Copia el archivo `main.bundle.js` de este repositorio dentro de `resources\app\dist\main.bundle.js`.
4. Inicia Bitburner desde Steam.

---

## 🎮 Jugar en el Navegador

Bitburner es una aplicación web completa. No requiere descargas para ser disfrutado:
- Juega directamente en línea desde tu navegador en **[GitHub Pages](https://quintana-dev.github.io/bitburner-es/)**.
- Todos los guardados y scripts se almacenan localmente en tu navegador (`LocalStorage` / `IndexedDB`).

---

## 📖 Guía Rápida de Comandos

| Comando | Descripción |
| :--- | :--- |
| `help [comando]` | Muestra la ayuda general o la ayuda de un comando específico. |
| `scan` | Escanea los servidores directamente conectados a tu red. |
| `scan-analyze [d]` | Análisis detallado de servidores hasta una distancia `d`. |
| `connect [servidor]` | Conecta con una máquina remota (ej: `connect n00dles`). |
| `analyze` | Proporciona estadísticas detalladas del servidor actual. |
| `run NUKE.exe` | Obtiene acceso ROOT en el servidor actual si cumple los requisitos. |
| `nano [script.js]` | Abre el editor de código para crear o modificar un script. |
| `run [script.js]` | Ejecuta un script en el servidor actual. |
| `ps` | Muestra la lista de scripts en ejecución y sus PIDs. |
| `kill [pid/script]` | Detiene un script en ejecución. |
| `free` | Muestra la memoria RAM disponible y en uso en la máquina. |
| `home` | Regresa de inmediato a tu servidor central `home`. |

---

## 🛠️ Compilación desde el Código Fuente

Si deseas clonar y compilar el proyecto tú mismo:

```bash
# 1. Clonar el repositorio
git clone https://github.com/quintana-dev/bitburner-es.git
cd bitburner-es

# 2. Instalar dependencias
npm install

# 3. Compilar el paquete de producción
npm run build
```

El paquete generado se ubicará en la carpeta `dist/`.

---

## 📜 Licencia y Atribución

Este proyecto es una adaptación y traducción independiente basada en el código fuente oficial de [Bitburner](https://github.com/bitburner-official/bitburner-src), distribuido bajo la licencia **Apache 2.0 with Commons Clause** (ver [license.txt](./license.txt)).

- **Juego original:** Desarrollado por [danielyxie](https://github.com/danielyxie) y la comunidad de Bitburner.
- **Traducción y edición en español:** Desarrollada y mantenida por [Ramiro Quintana (quintana.dev)](https://quintana.dev.ar).
