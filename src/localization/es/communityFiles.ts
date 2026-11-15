import { Server } from "../../Server/Server";
import { ContentFilePath } from "../../Paths/ContentFile";

export const GUIA_INICIO_TXT = `============================================================
           BIENVENIDO A BITBURNER EN ESPAÑOL
                 por quintana.dev
============================================================

¡Hola, hacker! Bienvenido al mundo de Bitburner.
Esta edición en español incluye la interfaz y lore traducidos
con comandos de terminal nativos en inglés para máxima
compatibilidad con la API de Netscript.

--- COMANDOS ESENCIALES DE TERMINAL ---
* help                - Muestra la lista de comandos disponibles.
* scan                - Lista los servidores inmediatamente conectados.
* scan-analyze [d]    - Análisis detallado de servidores hasta distancia 'd'.
* connect [servidor]  - Conecta a un servidor remoto (ej: connect n00dles).
* analyze             - Información detallada del servidor actual.
* run NUKE.exe        - Abre acceso ROOT en el servidor si cumple los puertos.
* ls                  - Muestra los archivos del servidor actual.
* nano [archivo.js]   - Abre el editor de scripts para crear o modificar código.
* run [script.js]     - Ejecuta un script en el servidor actual.
* ps                  - Lista los scripts que se están ejecutando.
* kill [pid/nombre]   - Detiene un script en ejecución.
* free                - Muestra el uso de memoria RAM de la máquina actual.
* home                - Regresa de inmediato a tu computadora central 'home'.

--- SCRIPTS DE EJEMPLO INCLUIDOS EN 'HOME' ---
1. 'cat hack-basico.js'
   Un script didáctico comentado paso a paso que hackea n00dles
   equilibrando el dinero con 'grow', la seguridad con 'weaken'
   y cosechando ganancias con 'hack'.

2. 'cat auto-hack.js'
   Un script automatizado con argumentos dinámicos que abre
   root si tienes NUKE.exe y ataca automáticamente el objetivo.

Para ejecutarlos:
  run hack-basico.js
  run auto-hack.js foodnstuff

¡Mucho éxito en la red!
Para actualizaciones y proyectos visita: https://quintana.dev.ar
============================================================
`;

export const HACK_BASICO_JS = `/**
 * Script de inicio: hack-basico.js
 * Desarrollado para la versión en español de Bitburner por quintana.dev
 *
 * @param {NS} ns
 */
export async function main(ns) {
  // Servidor objetivo (n00dles es el servidor inicial más fácil)
  const target = "n00dles";

  // Umbrales óptimos para maximizar ganancias
  // Hackeamos solo cuando el dinero está al 75% o más del máximo posible
  const moneyThresh = ns.getServerMaxMoney(target) * 0.75;

  // Y mantenemos el nivel de seguridad bajo para hackear más rápido
  const securityThresh = ns.getServerMinSecurityLevel(target) + 5;

  ns.tprint(\`Iniciando hack-basico.js contra el objetivo: \${target}\`);

  // Bucle infinito: ejecuta continuamente la mejor acción
  while (true) {
    if (ns.getServerSecurityLevel(target) > securityThresh) {
      // Si la seguridad del servidor es alta, debilitamos sus defensas
      await ns.weaken(target);
    } else if (ns.getServerMoneyAvailable(target) < moneyThresh) {
      // Si el servidor tiene poco dinero, inflamos su cuenta bancaria
      await ns.grow(target);
    } else {
      // Cuando la seguridad es baja y el dinero es alto, ¡cosechamos las ganancias!
      await ns.hack(target);
    }
  }
}
`;

export const AUTO_HACK_JS = `/**
 * Script avanzado: auto-hack.js
 * Automatización con argumentos dinámicos por quintana.dev
 *
 * Uso:
 *   run auto-hack.js [nombreServidor]
 * Ejemplo:
 *   run auto-hack.js foodnstuff
 *
 * @param {NS} ns
 */
export async function main(ns) {
  // Si pasas un argumento (ej: run auto-hack.js joesguns), usa ese servidor.
  // De lo contrario, por defecto ataca a "n00dles".
  const target = ns.args[0] ? String(ns.args[0]) : "n00dles";

  if (!ns.serverExists(target)) {
    ns.tprint(\`ERROR: El servidor '\${target}' no existe.\`);
    return;
  }

  // Si tenemos NUKE.exe y aún no tenemos root, intentamos abrirlo
  if (!ns.hasRootAccess(target)) {
    if (ns.fileExists("NUKE.exe", "home")) {
      ns.nuke(target);
      ns.tprint(\`Acceso ROOT obtenido en \${target} mediante NUKE.exe\`);
    } else {
      ns.tprint(\`AVISO: No tienes acceso root en \${target}.\`);
    }
  }

  const maxMoney = ns.getServerMaxMoney(target);
  const minSec = ns.getServerMinSecurityLevel(target);

  ns.tprint(\`[auto-hack] Objetivo fijado en: \${target} (Max Dinero: $\${ns.formatNumber(maxMoney)}, Min Seg: \${minSec})\`);

  while (true) {
    const currentSec = ns.getServerSecurityLevel(target);
    const currentMoney = ns.getServerMoneyAvailable(target);

    if (currentSec > minSec + 3) {
      await ns.weaken(target);
    } else if (currentMoney < maxMoney * 0.8) {
      await ns.grow(target);
    } else {
      await ns.hack(target);
    }
  }
}
`;

export function seedSpanishCommunityFiles(home: Server): void {
  if (!home) return;
  try {
    const guiaPath = "guia-inicio.txt" as ContentFilePath;
    const hackPath = "hack-basico.js" as ContentFilePath;
    const autoPath = "auto-hack.js" as ContentFilePath;

    if (!home.getContentFile(guiaPath)) {
      home.writeToContentFile(guiaPath, GUIA_INICIO_TXT);
    }
    if (!home.getContentFile(hackPath)) {
      home.writeToContentFile(hackPath, HACK_BASICO_JS);
    }
    if (!home.getContentFile(autoPath)) {
      home.writeToContentFile(autoPath, AUTO_HACK_JS);
    }
  } catch (err) {
    console.warn("Could not seed Spanish community files:", err);
  }
}
