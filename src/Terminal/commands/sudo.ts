import { Terminal } from "../../Terminal";
import { Player } from "@player";
import { achievements } from "../../Achievements/Achievements";
import { Settings } from "../../Settings/Settings";
import { activateSteamAchievements } from "../../Electron";
import { saveObject } from "../../SaveObject";
import type { BaseServer } from "../../Server/BaseServer";

export function sudo(args: (string | number | boolean)[], __server: BaseServer): void {
  const arg1 = String(args[0] || "").toLowerCase();
  const arg2 = String(args[1] || "").toLowerCase();

  if ((arg1 === "quintana.dev" || arg1 === "quintana") && arg2 === "unlock") {
    Terminal.print("============================================================");
    Terminal.print("[ROOT / SUPERUSER ACCESS GRANTED] quintana.dev");
    Terminal.print("Iniciando secuencia de desbloqueo total de logros...");

    let newUnlocked = 0;
    const allAchievements = Object.values(achievements);

    for (const ach of allAchievements) {
      if (!Player.achievements.some((pa) => pa.ID === ach.ID)) {
        Player.achievements.push({ ID: ach.ID, unlockedOn: Date.now() });
        newUnlocked++;
      }
    }

    const steamIds = Player.achievements
      .map((a) => a.ID)
      .filter((name) => achievements[name] && !achievements[name].NotInSteam);

    if (Settings.SyncSteamAchievements) {
      try {
        activateSteamAchievements(steamIds);
        Terminal.print(`✓ Sincronizados ${steamIds.length} logros con Steamworks API.`);
      } catch (e) {
        Terminal.error(`Error al conectar con Steam: ${String(e)}`);
      }
    } else {
      Terminal.print("Aviso: 'Sync Steam achievements' está desactivado en Opciones.");
    }

    Terminal.print(`✓ Total de logros en perfil: ${Player.achievements.length} (+${newUnlocked} nuevos).`);
    Terminal.print("✓ Partida guardada automáticamente.");
    Terminal.print("Desbloqueo completado con éxito. ¡Gracias por usar la versión de quintana.dev!");
    Terminal.print("============================================================");

    saveObject.saveGame(true).catch((err) => console.error(err));
  } else {
    Terminal.error("Acceso denegado. Uso correcto: sudo quintana.dev unlock");
  }
}
