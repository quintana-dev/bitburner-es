/**
 * Root React component for the Augmentations UI page that display all of your
 * owned and purchased Augmentations and Source-Files.
 */
import React, { useState } from "react";

import { InstalledAugmentations } from "./InstalledAugmentations";
import { PlayerMultipliers } from "./PlayerMultipliers";
import { PurchasedAugmentations } from "./PurchasedAugmentations";
import { SourceFilesElement } from "./SourceFiles";

import { canGetBonus } from "../../ExportBonus";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";
import { Settings } from "../../Settings/Settings";
import { ConfirmationModal } from "../../ui/React/ConfirmationModal";
import { Player } from "@player";
import { AugmentationName } from "@enums";
import { Augmentations } from "../Augmentations";
import { CONSTANTS } from "../../Constants";
import { formatNumberNoSuffix } from "../../ui/formatNumber";
import { Info } from "@mui/icons-material";
import { Link } from "@mui/material";
import { AlertEvents } from "../../ui/React/AlertManager";
import { useCycleRerender } from "../../ui/React/hooks";

const NeuroFluxDisplay = (): React.ReactElement => {
  const level = Player.augmentations.find((e) => e.name === AugmentationName.NeuroFluxGovernor)?.level ?? 0;

  const openBloodDonation = () => {
    AlertEvents.emit(
      <>
        <Typography variant="h5">Bitburner blood donation community program</Typography>
        <Typography>
          The blood donation program is a continuous real life event started on 2022-04-01. To participate, simply go
          donate blood, plasma, or platelets to a local organization and take a picture as proof (hide your personal
          information). Then, send the proof to hydroflame on reddit or discord.
        </Typography>
        <Typography>Currently accumulated {CONSTANTS.Donations} donations.</Typography>
      </>,
    );
  };
  return level > 0 ? (
    <Paper sx={{ p: 1 }}>
      <Typography variant="h5" color={Settings.theme.info}>
        NeuroFlux Governor - Level {level}
      </Typography>
      <Typography color={Settings.theme.info} whiteSpace={"pre-wrap"}>
        {Augmentations[AugmentationName.NeuroFluxGovernor].stats}
      </Typography>
      <Typography color={Settings.theme.info}>
        The power of {AugmentationName.NeuroFluxGovernor} increases with blood donations from players in real life.
        Learn more <Link onClick={openBloodDonation}>here</Link>
      </Typography>
    </Paper>
  ) : (
    <></>
  );
};

const EntropyDisplay = (): React.ReactElement => {
  return Player.entropy > 0 ? (
    <Paper sx={{ p: 1 }}>
      <Typography variant="h5" color={Settings.theme.error}>
        Entropy Virus - Level {Player.entropy}
      </Typography>
      <Typography color={Settings.theme.error}>
        <b>All multipliers decreased by:</b>{" "}
        {formatNumberNoSuffix((1 - CONSTANTS.EntropyEffect ** Player.entropy) * 100, 3)}% (multiplicative)
      </Typography>
    </Paper>
  ) : (
    <></>
  );
};

interface IProps {
  exportGameFn: () => void;
  installAugmentationsFn: () => void;
}

export function AugmentationsRoot(props: IProps): React.ReactElement {
  const [installOpen, setInstallOpen] = useState(false);
  const rerender = useCycleRerender();

  function doExport(): void {
    props.exportGameFn();
    rerender();
  }

  function exportBonusStr(): string {
    if (canGetBonus()) return "(+1 favor to all factions)";
    return "";
  }

  function doInstall(): void {
    if (!Settings.SuppressBuyAugmentationConfirmation) {
      setInstallOpen(true);
    } else {
      props.installAugmentationsFn();
    }
  }

  return (
    <Container disableGutters maxWidth="lg" sx={{ mx: 0 }}>
      <Typography variant="h4">Aumentos</Typography>
      <Box sx={{ mb: 1 }}>
        <Paper sx={{ p: 1 }}>
          <Typography variant="h5" color="primary" sx={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
            Aumentos Comprados
            <Tooltip
              title={
                <>
                  <Typography>
                    A continuación se muestra una lista de todos los Aumentos que has comprado pero aún no has instalado.
                    Haz clic en el botón inferior para instalarlos.
                  </Typography>
                  <Typography>
                    ADVERTENCIA: Instalar tus Aumentos reinicia la mayor parte de tu progreso, incluyendo:
                  </Typography>
                  <br />
                  <Typography>- Niveles de atributos, habilidades y Experiencia</Typography>
                  <Typography>- Dinero</Typography>
                  <Typography>- Scripts en todos los equipos excepto en tu servidor home</Typography>
                  <Typography>- Servidores en la nube</Typography>
                  <Typography>- Hacknet</Typography>
                  <Typography>- Reputación de Facción y Empresa</Typography>
                  <Typography>- Acciones en la bolsa</Typography>
                  <br />
                  <Typography>
                    Instalar Aumentos te permite renacer con las ventajas y multiplicadores otorgados por todos los Aumentos
                    que hayas instalado alguna vez. Además, conservarás tus scripts y mejoras de RAM/Núcleos de home
                    (pero perderás los programas adicionales además de NUKE.exe).
                  </Typography>
                </>
              }
            >
              <Info sx={{ ml: 1, mb: 0.5 }} color="info" />
            </Tooltip>
          </Typography>
          <ConfirmationModal
            open={installOpen}
            onClose={() => setInstallOpen(false)}
            onConfirm={props.installAugmentationsFn}
            confirmationText={
              <>
                La instalación reiniciará:
                <br />
                <br />- dinero
                <br />- habilidades / experiencia
                <br />- todos los servidores excepto home
                <br />- facciones y reputación
                <br />- actividad de trabajo actual
                <br />
                <br />
                Conservarás:
                <br />
                <br />- Todos los scripts en home
                <br />- Memoria RAM y núcleos de home
                <br />
                <br />
                Se recomienda instalar varios Aumentos a la vez.
              </>
            }
          />
          <Box sx={{ display: "grid", width: "100%", gridTemplateColumns: "1fr 1fr" }}>
            <Tooltip title={<Typography>'Nunca pedí esto'</Typography>}>
              <span>
                <Button sx={{ width: "100%" }} disabled={Player.queuedAugmentations.length === 0} onClick={doInstall}>
                  Instalar Aumentos
                </Button>
              </span>
            </Tooltip>
            <Tooltip title={<Typography>¡Siempre es recomendable respaldar / exportar tu partida!</Typography>}>
              <Button sx={{ width: "100%", color: Settings.theme.successlight }} onClick={doExport}>
                Respaldar Partida {exportBonusStr()}
              </Button>
            </Tooltip>
          </Box>
        </Paper>
        {Player.queuedAugmentations.length > 0 ? (
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 3fr" }}>
            <PurchasedAugmentations />
            <PlayerMultipliers />
          </Box>
        ) : (
          <Paper sx={{ p: 1 }}>
            <Typography>Aún no se ha comprado ningún Aumento</Typography>
          </Paper>
        )}
      </Box>

      <Box
        sx={{
          my: 1,
          display: "grid",
          gridTemplateColumns: `repeat(${
            +!!((Player.augmentations.find((e) => e.name === AugmentationName.NeuroFluxGovernor)?.level ?? 0) > 0) +
            +!!(Player.entropy > 0)
          }, 1fr)`,
          gap: 1,
        }}
      >
        <NeuroFluxDisplay />
        <EntropyDisplay />
      </Box>

      <Box>
        <InstalledAugmentations />
      </Box>
      <SourceFilesElement />
    </Container>
  );
}
