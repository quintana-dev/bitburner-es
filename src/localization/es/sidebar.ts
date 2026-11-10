import { ComplexPage, SimplePage } from "../../ui/Enums";

export const sidebarTranslations: Record<string, string> = {
  // Secciones del acordeón
  Hacking: "Hacking",
  Character: "Personaje",
  World: "Mundo",
  Help: "Ayuda",

  // Páginas del menú
  [SimplePage.Terminal]: "Terminal",
  [ComplexPage.ScriptEditor]: "Editor de Scripts",
  [SimplePage.ActiveScripts]: "Scripts Activos",
  [SimplePage.RecentlyKilledScripts]: "Scripts Finalizados",
  [SimplePage.RecentErrors]: "Errores Recientes",
  [SimplePage.CreateProgram]: "Crear Programa",
  [SimplePage.StaneksGift]: "Regalo de Stanek",

  [SimplePage.Stats]: "Estadísticas",
  [SimplePage.Factions]: "Facciones",
  [ComplexPage.Faction]: "Facción",
  [SimplePage.Augmentations]: "Aumentos",
  [ComplexPage.FactionAugmentations]: "Aumentos de Facción",
  [SimplePage.Hacknet]: "Hacknet",
  [SimplePage.Sleeves]: "Mangas / Clones",
  [SimplePage.Grafting]: "Injertos",

  [SimplePage.City]: "Ciudad",
  [ComplexPage.Location]: "Ubicación",
  [SimplePage.Travel]: "Viajar",
  [SimplePage.Job]: "Empleo",
  [SimplePage.Work]: "Trabajo",
  [SimplePage.StockMarket]: "Bolsa de Valores",
  [SimplePage.Bladeburner]: "Bladeburner",
  [SimplePage.Corporation]: "Corporación",
  [SimplePage.Gang]: "Pandilla",
  [SimplePage.Go]: "Subred IPvGO",
  [SimplePage.DarkNet]: "Dark Net",

  [SimplePage.Milestones]: "Hitos",
  [ComplexPage.Documentation]: "Documentación",
  [SimplePage.Achievements]: "Logros",
  [ComplexPage.Options]: "Opciones",
  [SimplePage.ThemeBrowser]: "Temas Visuales",
  [SimplePage.DevMenu]: "Menú Dev",
  [ComplexPage.BitVerse]: "BitVerse",
  [ComplexPage.ImportSave]: "Importar Partida",
};

export function translateSidebar(key: string): string {
  return sidebarTranslations[key] ?? key;
}
