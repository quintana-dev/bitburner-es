import React from "react";
import { Box, Button, Container, Paper, Table, TableBody, Tooltip, Typography } from "@mui/material";

import { Player } from "@player";
import { FactionWorkType, LocationName } from "@enums";

import { Money } from "./React/Money";
import { MoneyRate } from "./React/MoneyRate";
import { ProgressBar } from "./React/Progress";
import { Reputation } from "./React/Reputation";
import { ReputationRate } from "./React/ReputationRate";
import { StatsRow } from "./React/StatsRow";
import { useCycleRerender } from "./React/hooks";

import { Companies } from "../Company/Companies";
import { CONSTANTS } from "../Constants";
import { Locations } from "../Locations/Locations";
import { Settings } from "../Settings/Settings";
import { convertTimeMsToTimeElapsedString } from "../utils/StringHelperFunctions";
import { filterTruthy } from "../utils/helpers/ArrayHelpers";

import { isCrimeWork } from "../Work/CrimeWork";
import { isClassWork } from "../Work/ClassWork";
import { WorkStats } from "../Work/WorkStats";
import { isCreateProgramWork } from "../Work/CreateProgramWork";
import { isGraftingWork } from "../Work/GraftingWork";
import { isFactionWork } from "../Work/FactionWork";
import { isCompanyWork } from "../Work/CompanyWork";
import { Router } from "./GameRoot";
import { Page } from "./Router";
import { formatExp, formatPercent } from "./formatNumber";

const CYCLES_PER_SEC = 1000 / CONSTANTS.MilliPerCycle;

interface IWorkInfo {
  buttons: {
    cancel: () => void;
    unfocus?: () => void;
  };
  title: string | React.ReactElement;

  description?: string | React.ReactElement;
  gains?: React.ReactElement[];
  progress?: {
    elapsed?: number;
    remaining?: number;
    percentage?: number;
  };

  stopText: string;
  stopTooltip?: string | React.ReactElement;
}

function ExpRows(rate: WorkStats): React.ReactElement[] {
  return filterTruthy([
    rate.hackExp > 0 && (
      <StatsRow
        key="hack"
        name="EXP de Hackeo"
        color={Settings.theme.hack}
        data={{
          content: `${formatExp(rate.hackExp * CYCLES_PER_SEC)} / seg`,
        }}
      />
    ),
    rate.strExp > 0 && (
      <StatsRow
        key="str"
        name="EXP de Fuerza"
        color={Settings.theme.combat}
        data={{
          content: `${formatExp(rate.strExp * CYCLES_PER_SEC)} / seg`,
        }}
      />
    ),
    rate.defExp > 0 && (
      <StatsRow
        key="def"
        name="EXP de Defensa"
        color={Settings.theme.combat}
        data={{
          content: `${formatExp(rate.defExp * CYCLES_PER_SEC)} / seg`,
        }}
      />
    ),
    rate.dexExp > 0 && (
      <StatsRow
        key="dex"
        name="EXP de Destreza"
        color={Settings.theme.combat}
        data={{
          content: `${formatExp(rate.dexExp * CYCLES_PER_SEC)} / seg`,
        }}
      />
    ),
    rate.agiExp > 0 && (
      <StatsRow
        key="agi"
        name="EXP de Agilidad"
        color={Settings.theme.combat}
        data={{
          content: `${formatExp(rate.agiExp * CYCLES_PER_SEC)} / seg`,
        }}
      />
    ),
    rate.chaExp > 0 && (
      <StatsRow
        key="cha"
        name="EXP de Carisma"
        color={Settings.theme.cha}
        data={{
          content: `${formatExp(rate.chaExp * CYCLES_PER_SEC)} / seg`,
        }}
      />
    ),
  ]);
}

/* Because crime exp is given all at once at the end, we don't care about the cycles per second. */
function CrimeExpRows(rate: WorkStats): React.ReactElement[] {
  return filterTruthy([
    rate.hackExp > 0 && (
      <StatsRow
        key="hack"
        name="EXP de Hackeo"
        color={Settings.theme.hack}
        data={{
          content: `${formatExp(rate.hackExp)}`,
        }}
      />
    ),
    rate.strExp > 0 && (
      <StatsRow
        key="str"
        name="EXP de Fuerza"
        color={Settings.theme.combat}
        data={{
          content: `${formatExp(rate.strExp)}`,
        }}
      />
    ),
    rate.defExp > 0 && (
      <StatsRow
        key="def"
        name="EXP de Defensa"
        color={Settings.theme.combat}
        data={{
          content: `${formatExp(rate.defExp)}`,
        }}
      />
    ),
    rate.dexExp > 0 && (
      <StatsRow
        key="dex"
        name="EXP de Destreza"
        color={Settings.theme.combat}
        data={{
          content: `${formatExp(rate.dexExp)}`,
        }}
      />
    ),
    rate.agiExp > 0 && (
      <StatsRow
        key="agi"
        name="EXP de Agilidad"
        color={Settings.theme.combat}
        data={{
          content: `${formatExp(rate.agiExp)}`,
        }}
      />
    ),
    rate.chaExp > 0 && (
      <StatsRow
        key="cha"
        name="EXP de Carisma"
        color={Settings.theme.cha}
        data={{
          content: `${formatExp(rate.chaExp)}`,
        }}
      />
    ),
  ]);
}

export function WorkInProgressRoot(): React.ReactElement {
  useCycleRerender();

  let workInfo: IWorkInfo = {
    buttons: {
      cancel: () => undefined,
    },
    title: "",
    stopText: "",
  };

  if (Player.currentWork === null) {
    setTimeout(() => {
      /**
       * We must check again before routing to the Terminal page. The player might have started an action right before
       * the callback of setTimeout is called.
       */
      if (Player.currentWork === null) {
        Router.toPage(Page.Terminal);
      }
    });
    return <></>;
  }

  if (isCrimeWork(Player.currentWork)) {
    const crime = Player.currentWork.getCrime();
    const completion = (Player.currentWork.unitCompleted / crime.time) * 100;
    const gains = Player.currentWork.earnings();
    const successChance = crime.successRate(Player);
    workInfo = {
      buttons: {
        cancel: () => {
          Router.toPage(Page.Location, { location: Locations[LocationName.Slums] });
          Player.finishWork(true);
        },
        unfocus: () => {
          Router.toPage(Page.City);
        },
      },
      title: `Estás intentando: ${crime.workName}`,

      gains: [
        <tr key="header">
          <td>
            <Typography>Probabilidad de éxito: {formatPercent(successChance)}</Typography>
            <Typography>Ganancias (si tiene éxito)</Typography>
          </td>
        </tr>,
        <StatsRow key="money" name="Dinero:" color={Settings.theme.money}>
          <Typography>
            <Money money={gains.money} />
          </Typography>
        </StatsRow>,
        ...CrimeExpRows(gains),
      ],
      progress: {
        remaining: crime.time - Player.currentWork.unitCompleted,
        percentage: completion,
      },

      stopText: "Detener delito",
    };
  }

  if (isClassWork(Player.currentWork)) {
    const classWork = Player.currentWork;

    let stopText = "";
    if (classWork.isGym()) {
      stopText = "Detener entrenamiento";
    } else {
      stopText = "Detener curso";
    }

    const rates = classWork.calculateRates();
    workInfo = {
      buttons: {
        cancel: () => {
          Player.finishWork(true);
          Router.toPage(Page.Location, { location: Locations[classWork.location] });
        },
        unfocus: () => {
          Router.toPage(Page.Location, { location: Locations[classWork.location] });
        },
      },
      title: (
        <>
          Actualmente estás <b>{classWork.getClass().youAreCurrently}</b>
        </>
      ),

      gains: [
        <StatsRow key="totalCost" name="Costo Total" color={Settings.theme.money}>
          <Typography>
            <Money money={classWork.earnings.money} /> (<MoneyRate money={rates.money * CYCLES_PER_SEC} />)
          </Typography>
        </StatsRow>,
        ...ExpRows(rates),
      ],
      progress: {
        elapsed: classWork.cyclesWorked * CONSTANTS.MilliPerCycle,
      },

      stopText: stopText,
    };
  }

  if (isCreateProgramWork(Player.currentWork)) {
    const create = Player.currentWork;
    const completion = (create.unitCompleted / create.unitNeeded()) * 100;
    const remainingTime = ((create.unitNeeded() - create.unitCompleted) / create.unitRate) * CONSTANTS.MilliPerCycle;
    workInfo = {
      buttons: {
        cancel: () => {
          Player.finishWork(true);
          Router.toPage(Page.Terminal);
        },
        unfocus: () => {
          Router.toPage(Page.Terminal);
        },
      },
      title: (
        <>
          Actualmente estás programando <b>{create.programName}</b>
        </>
      ),

      progress: {
        remaining: remainingTime,
        percentage: completion,
      },

      stopText: "Detener creación de programa",
      stopTooltip: "Tu progreso se guardará y podrás continuar más tarde.",
    };
  }

  if (isGraftingWork(Player.currentWork)) {
    const graftWork = Player.currentWork;
    const remainingTime =
      ((graftWork.unitNeeded() - graftWork.unitCompleted) / graftWork.unitRate) * CONSTANTS.MilliPerCycle;
    workInfo = {
      buttons: {
        cancel: () => {
          Player.finishWork(true);
          Router.toPage(Page.Terminal);
        },
        unfocus: () => {
          Router.toPage(Page.Terminal);
        },
      },
      title: (
        <>
          Actualmente estás injertando <b>{graftWork.augmentation}</b>
        </>
      ),

      progress: {
        remaining: remainingTime,
        percentage: (graftWork.unitCompleted / graftWork.unitNeeded()) * 100,
      },

      stopText: "Detener injerto",
      stopTooltip: (
        <>
          Si cancelas, tu progreso <b>no</b> se guardará y el dinero gastado <b>no</b> será devuelto.
        </>
      ),
    };
  }

  if (isFactionWork(Player.currentWork)) {
    const faction = Player.currentWork.getFaction();
    if (!faction) {
      workInfo = {
        buttons: {
          cancel: () => Router.toPage(Page.Factions),
        },
        title:
          `No te has unido a ${Player.currentWork.factionName || "(Facción no encontrada)"} en este momento,` +
          " por favor intenta nuevamente si crees que esto debería haber funcionado",

        stopText: "Volver a Facciones",
      };
    }

    const description = {
      [FactionWorkType.hacking]: "realizando contratos de hackeo",
      [FactionWorkType.field]: "realizando misiones de campo",
      [FactionWorkType.security]: "realizando trabajo de seguridad",
    };

    const exp = Player.currentWork.getExpRates();

    workInfo = {
      buttons: {
        cancel: () => {
          Router.toPage(Page.Faction, { faction });
          Player.finishWork(true);
        },
        unfocus: () => {
          Router.toPage(Page.Faction, { faction });
        },
      },
      title: (
        <>
          Actualmente estás {description[Player.currentWork.factionWorkType]} para <b>{faction.name}</b>
        </>
      ),

      description: (
        <>
          Reputación de Facción actual: <Reputation reputation={faction.playerReputation} /> (
          <ReputationRate reputation={Player.currentWork.getReputationRate() * CYCLES_PER_SEC} />)
        </>
      ),
      gains: ExpRows(exp),
      progress: {
        elapsed: Player.currentWork.cyclesWorked * CONSTANTS.MilliPerCycle,
      },

      stopText: "Detener trabajo de Facción",
    };
  }

  if (isCompanyWork(Player.currentWork)) {
    const comp = Companies[Player.currentWork.companyName];
    if (comp) {
      workInfo = {
        buttons: {
          cancel: () => Router.toPage(Page.Terminal),
        },
        title:
          `No puedes trabajar para ${Player.currentWork.companyName} en este momento,` +
          " por favor intenta nuevamente",

        stopText: "Volver a Terminal",
      };
    }

    const companyRep = comp.playerReputation;

    const position = Player.jobs[Player.currentWork.companyName];
    if (!position) return <></>;
    const gains = Player.currentWork.getGainRates(position);
    workInfo = {
      buttons: {
        cancel: () => {
          Player.finishWork(true);
          Router.toPage(Page.Job);
        },
        unfocus: () => {
          Router.toPage(Page.Job);
        },
      },
      title: (
        <>
          Actualmente estás trabajando como <b>{position}</b> en <b>{Player.currentWork.companyName}</b>
        </>
      ),

      description: (
        <>
          Reputación de Empresa actual: <Reputation reputation={companyRep} />
        </>
      ),
      gains: [
        <StatsRow key="money" name="Dinero" color={Settings.theme.money}>
          <Typography>
            <MoneyRate money={gains.money * CYCLES_PER_SEC} />
          </Typography>
        </StatsRow>,
        <StatsRow key="reputation" name="Reputación de Empresa" color={Settings.theme.rep}>
          <Typography>
            <ReputationRate reputation={gains.reputation * CYCLES_PER_SEC} />
          </Typography>
        </StatsRow>,
        ...ExpRows(gains),
      ],
      progress: {
        elapsed: Player.currentWork.cyclesWorked * CONSTANTS.MilliPerCycle,
      },

      stopText: "Dejar de trabajar",
    };
  }

  if (workInfo.title === "") {
    return <></>;
  }

  const tooltipInfo =
    typeof workInfo.stopTooltip === "string" ? (
      <Typography>{workInfo.stopTooltip}</Typography>
    ) : (
      workInfo.stopTooltip || <></>
    );

  return (
    <Container
      maxWidth="md"
      sx={{ display: "flex", flexDirection: "column", justifyContent: "center", height: "calc(100vh - 16px)" }}
    >
      <Paper sx={{ p: 1, mb: 1 }}>
        <Typography variant="h6">{workInfo.title}</Typography>
        <Typography>{workInfo.description}</Typography>
        {workInfo.gains && (
          <Table sx={{ mt: 1 }}>
            <TableBody>{workInfo.gains}</TableBody>
          </Table>
        )}
      </Paper>
      <Paper sx={{ mb: 1, p: 1 }}>
        {workInfo.progress !== undefined && (
          <Box sx={{ mb: 1 }}>
            <Box
              display="grid"
              sx={{
                gridTemplateColumns: `repeat(${Object.keys(workInfo.progress).length}, 1fr)`,
                width: "100%",
                justifyItems: "center",
                textAlign: "center",
              }}
            >
              {workInfo.progress.elapsed !== undefined && (
                <Typography>{convertTimeMsToTimeElapsedString(workInfo.progress.elapsed)} transcurrido</Typography>
              )}
              {workInfo.progress.remaining !== undefined && (
                <Typography>{convertTimeMsToTimeElapsedString(workInfo.progress.remaining)} restante</Typography>
              )}
              {workInfo.progress.percentage !== undefined && (
                <Typography>{workInfo.progress.percentage.toFixed(2)}% completado</Typography>
              )}
            </Box>
            {workInfo.progress.percentage !== undefined && (
              <ProgressBar variant="determinate" value={workInfo.progress.percentage} color="primary" />
            )}
          </Box>
        )}

        <Box display="grid" sx={{ gridTemplateColumns: `repeat(${Object.keys(workInfo.buttons).length}, 1fr)` }}>
          {workInfo.stopTooltip ? (
            <Tooltip title={tooltipInfo}>
              <Button onClick={workInfo.buttons.cancel}>{workInfo.stopText}</Button>
            </Tooltip>
          ) : (
            <Button onClick={workInfo.buttons.cancel}>{workInfo.stopText}</Button>
          )}
          {workInfo.buttons.unfocus && (
            <Button onClick={workInfo.buttons.unfocus}>Hacer otra cosa simultáneamente</Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
}
