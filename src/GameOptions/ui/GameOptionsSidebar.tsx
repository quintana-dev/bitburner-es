import {
  BugReport,
  Chat,
  Download,
  LibraryBooks,
  Palette,
  Fingerprint,
  Reddit,
  Save,
  Upload,
} from "@mui/icons-material";
import { Box, Button, List, ListItemButton, Paper, Tooltip, Typography } from "@mui/material";
import { default as React, useRef, useState } from "react";
import { FileDiagnosticModal } from "../../Diagnostic/FileDiagnosticModal";
import { ImportData, saveObject } from "../../SaveObject";
import { StyleEditorButton } from "../../Themes/ui/StyleEditorButton";
import { ThemeEditorButton } from "../../Themes/ui/ThemeEditorButton";
import { ConfirmationModal } from "../../ui/React/ConfirmationModal";
import { CreditsModal } from "./CreditsModal";
import { DeleteGameButton } from "../../ui/React/DeleteGameButton";
import { SnackbarEvents } from "../../ui/React/Snackbar";
import { ToastVariant } from "@enums";
import { SoftResetButton } from "../../ui/React/SoftResetButton";
import { Router } from "../../ui/GameRoot";
import { Page } from "../../ui/Router";
import { convertTimeMsToTimeElapsedString } from "../../utils/StringHelperFunctions";
import { OptionsTabName } from "./GameOptionsRoot";
import { Player } from "@player";
import { OptionSwitch } from "../../ui/React/OptionSwitch";

interface IProps {
  tab: OptionsTabName;
  setTab: (tab: OptionsTabName) => void;
  save: () => void;
  export: () => void;
  forceKill: () => void;
  softReset: () => void;
  reactivateTutorial: () => void;
}

interface ITabProps {
  sideBarProps: IProps;
  tabName: OptionsTabName;
}

const tabNamesSpanish: Record<string, string> = {
  System: "Sistema",
  Interface: "Interfaz",
  "Numeric Display": "Visualización Numérica",
  Gameplay: "Jugabilidad",
  Misc: "Varios",
  "Remote API": "API Remota",
  "Key Binding": "Atajos de Teclado",
};

const SideBarTab = (props: ITabProps): React.ReactElement => {
  return (
    <ListItemButton
      selected={props.sideBarProps.tab === props.tabName}
      onClick={() => props.sideBarProps.setTab(props.tabName)}
    >
      <Typography>{tabNamesSpanish[props.tabName] || props.tabName}</Typography>
    </ListItemButton>
  );
};

export const GameOptionsSidebar = (props: IProps): React.ReactElement => {
  const importInput = useRef<HTMLInputElement>(null);

  const [diagnosticOpen, setDiagnosticOpen] = useState(false);
  const [importSaveOpen, setImportSaveOpen] = useState(false);
  const [importData, setImportData] = useState<ImportData | null>(null);
  const [syncSteamAchievements, setSyncSteamAchievements] = useState(true);

  const [confirmResetOpen, setConfirmResetOpen] = useState(false);
  const [creditsOpen, setCreditsOpen] = useState(false);

  function startImport(): void {
    if (!window.File || !window.FileReader || !window.FileList || !window.Blob) return;
    const ii = importInput.current;
    if (ii === null) throw new Error("import input should not be null");
    ii.click();
  }

  async function onImport(event: React.ChangeEvent<HTMLInputElement>): Promise<void> {
    try {
      const saveData = await saveObject.getSaveDataFromFile(event.target.files);
      const data = await saveObject.getImportDataFromSaveData(saveData);
      setImportData(data);
      setImportSaveOpen(true);
      setSyncSteamAchievements(data.playerData?.syncSteamAchievements ?? true);
    } catch (e: unknown) {
      console.error(e);
      SnackbarEvents.emit(String(e), ToastVariant.ERROR, 5000);
    } finally {
      // Re-trigger if we import the same save
      event.target.value = "";
    }
  }

  async function confirmedImportGame(): Promise<void> {
    if (!importData) return;

    try {
      let overrideSettings = undefined;
      if (syncSteamAchievements !== importData.playerData?.syncSteamAchievements) {
        overrideSettings = {
          SyncSteamAchievements: syncSteamAchievements,
        };
      }
      await saveObject.importGame(importData.saveData, overrideSettings);
    } catch (e: unknown) {
      console.error(e);
      SnackbarEvents.emit(String(e), ToastVariant.ERROR, 5000);
    }

    setImportSaveOpen(false);
    setImportData(null);
  }

  function compareSaveGame(): void {
    if (!importData) return;
    Router.toPage(Page.ImportSave, { saveData: importData.saveData });
    setImportSaveOpen(false);
    setImportData(null);
  }

  return (
    <Box>
      <Paper sx={{ height: "fit-content", mb: 1 }}>
        <List>
          <SideBarTab sideBarProps={props} tabName="System" />
          <SideBarTab sideBarProps={props} tabName="Gameplay" />
          <SideBarTab sideBarProps={props} tabName="Interface" />
          <SideBarTab sideBarProps={props} tabName="Numeric Display" />
          <SideBarTab sideBarProps={props} tabName="Misc" />
          <SideBarTab sideBarProps={props} tabName="Remote API" />
          <SideBarTab sideBarProps={props} tabName="Key Binding" />
        </List>
      </Paper>
      <Box
        sx={{
          display: "grid",
          width: "100%",
          height: "fit-content",
          gridTemplateAreas: `"save   delete"
      "export import"
      "kill   kill"
      "reset  diagnose"
      "browse browse"
      "theme  style"
      "links  links"
      "devs   devs"`,
          gridTemplateColumns: "1fr 1fr",
        }}
      >
        <Button onClick={() => props.save()} startIcon={<Save />} sx={{ gridArea: "save" }}>
          Guardar Partida
        </Button>
        <Box sx={{ gridArea: "delete", "& .MuiButton-root": { height: "100%", width: "100%" } }}>
          <DeleteGameButton />
        </Box>
        <Tooltip title={<Typography>Exporta tu partida a un archivo de texto.</Typography>}>
          <Button onClick={() => props.export()} startIcon={<Download />} sx={{ gridArea: "export" }}>
            Exportar Partida
          </Button>
        </Tooltip>
        <Tooltip
          title={
            <Typography>
              Importa tu partida desde un archivo de texto.
              <br />
              ¡Esto <strong>sobrescribirá</strong> tu partida actual! Haz una copia de seguridad primero.
            </Typography>
          }
        >
          <Button onClick={startImport} startIcon={<Upload />} sx={{ gridArea: "import" }}>
            Importar Partida
            <input
              ref={importInput}
              id="import-game-file-selector"
              type="file"
              hidden
              onChange={(event) => {
                onImport(event).catch((error) => {
                  console.error(error);
                });
              }}
            />
          </Button>
        </Tooltip>
        <ConfirmationModal
          open={importSaveOpen}
          onClose={() => setImportSaveOpen(false)}
          onConfirm={() => {
            confirmedImportGame().catch((error) => {
              console.error(error);
            });
          }}
          additionalButton={<Button onClick={compareSaveGame}>Compare Save</Button>}
          confirmationText={
            <>
              Importing a new game will <strong>completely wipe</strong> the current data!
              <br />
              <br />
              Make sure to have a backup of your current save file before importing.
              <br />
              The file you are attempting to import seems valid.
              {(importData?.playerData?.lastSave ?? 0) > 0 && (
                <>
                  <br />
                  <br />
                  The export date of the save file is{" "}
                  <strong>{new Date(importData?.playerData?.lastSave ?? 0).toLocaleString()}</strong>
                </>
              )}
              {(importData?.playerData?.totalPlaytime ?? 0) > 0 && (
                <>
                  <br />
                  <br />
                  Total play time of imported game:{" "}
                  {convertTimeMsToTimeElapsedString(importData?.playerData?.totalPlaytime ?? 0)}
                </>
              )}
              <br />
              <br />
              <OptionSwitch
                checked={syncSteamAchievements}
                onChange={(newValue) => setSyncSteamAchievements(newValue)}
                text="Sync Steam achievements"
                tooltip={
                  <>
                    This setting is only used in the Steam app. If this setting is enabled, the game will automatically
                    sync your unlocked Steam achievements to Steam Cloud.
                  </>
                }
              />
              <br />
            </>
          }
        />
        <Tooltip
          title={
            <Typography>
              Forcefully kill all active running scripts, in case there is a bug or some unexpected issue with the game.
              After using this, save the game and then reload the page. This is different than normal kill in that
              normal kill will tell the script to shut down while force kill just removes the references to it (and it
              should crash on its own). This will not remove the files on your computer, just forcefully kill all
              running instances of all scripts.
            </Typography>
          }
        >
          <Button onClick={() => props.forceKill()} sx={{ gridArea: "kill" }}>
            Forzar detención de scripts activos
          </Button>
        </Tooltip>
        <Box sx={{ gridArea: "reset", "& .MuiButton-root": { height: "100%", width: "100%" } }}>
          <SoftResetButton onTriggered={props.softReset} />
        </Box>
        <Tooltip
          title={
            <Typography>
              If your save file is extremely big you can use this button to view a map of all the files on every server.
              Be careful: there might be spoilers.
            </Typography>
          }
        >
          <Button onClick={() => setDiagnosticOpen(true)} sx={{ gridArea: "diagnose" }}>
            Diagnosticar archivos
          </Button>
        </Tooltip>
        <Tooltip title="Visita el explorador de temas para ver temas prediseñados.">
          <Button startIcon={<Palette />} onClick={() => Router.toPage(Page.ThemeBrowser)} sx={{ gridArea: "browse" }}>
            Explorador de Temas
          </Button>
        </Tooltip>
        <Box sx={{ gridArea: "theme", "& .MuiButton-root": { height: "100%", width: "100%" } }}>
          <ThemeEditorButton />
        </Box>
        <Box sx={{ gridArea: "style", "& .MuiButton-root": { height: "100%", width: "100%" } }}>
          <StyleEditorButton />
        </Box>

        <Box
          sx={{
            gridArea: "links",
            display: "grid",
            gridTemplateAreas: `"credits credits"
            "bug bug"
        "discord reddit"
        "tut tut"`,
            gridTemplateColumns: "1fr 1fr",
            my: 1,
          }}
        >
          <Tooltip title={<Typography>¡Abre un reporte en GitHub para ayudar a resolver errores!</Typography>}>
            <Button
              startIcon={<BugReport />}
              href="https://github.com/bitburner-official/bitburner-src/issues/new"
              target="_blank"
              sx={{ gridArea: "bug" }}
            >
              Reportar Error
            </Button>
          </Tooltip>
          <Button startIcon={<Fingerprint />} onClick={() => setCreditsOpen(true)} sx={{ gridArea: "credits" }}>
            Créditos
          </Button>
          <CreditsModal open={creditsOpen} onClose={() => setCreditsOpen(false)} />
          <Button startIcon={<LibraryBooks />} onClick={() => setConfirmResetOpen(true)} sx={{ gridArea: "tut" }}>
            Reiniciar tutorial
          </Button>
          <Button startIcon={<Chat />} href="https://discord.gg/TFc3hKD" target="_blank" sx={{ gridArea: "discord" }}>
            Discord
          </Button>
          <Button
            startIcon={<Reddit />}
            href="https://www.reddit.com/r/bitburner"
            target="_blank"
            sx={{ gridArea: "reddit" }}
          >
            Reddit
          </Button>
        </Box>
        <Box sx={{ mt: 2, mb: 1, textAlign: "center" }}>
          <Typography variant="caption" sx={{ color: "#6e7681", display: "block", mb: 0.5, letterSpacing: "0.5px" }}>
            TRADUCCIÓN AL ESPAÑOL POR
          </Typography>
          <a href="https://quintana.dev.ar" rel="noopener" target="_blank" style={{ textDecoration: "none" }}>
            <div
              style={{
                fontSize: "22px",
                fontWeight: 800,
                color: "#e6edf3",
                letterSpacing: "-0.5px",
                padding: "6px 16px",
                borderRadius: "6px",
                display: "inline-block",
                border: "1px solid rgba(184, 69, 255, 0.4)",
                backgroundColor: "rgba(184, 69, 255, 0.08)",
                boxShadow: "0 0 15px rgba(184, 69, 255, 0.15)",
                fontFamily: "inherit",
              }}
            >
              quintana<span style={{ color: "#b845ff", textShadow: "0 0 10px rgba(184, 69, 255, 0.7)" }}>.dev</span>
            </div>
          </a>
        </Box>
      </Box>
      <Typography>Save ID: {Player.identifier}</Typography>
      <FileDiagnosticModal open={diagnosticOpen} onClose={() => setDiagnosticOpen(false)} />

      <ConfirmationModal
        open={confirmResetOpen}
        onClose={() => setConfirmResetOpen(false)}
        onConfirm={props.reactivateTutorial}
        confirmationText={"¿Reiniciar el tutorial? Se detendrán los scripts en ejecución."}
        additionalButton={<Button onClick={() => setConfirmResetOpen(false)}>Cancelar</Button>}
      />
    </Box>
  );
};
