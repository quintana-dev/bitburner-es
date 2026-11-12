import React, { useEffect } from "react";
import { find } from "lodash";
import { Box, Typography, Button, Container, Paper, Tooltip } from "@mui/material";
import { Check, Lock, Create } from "@mui/icons-material";

import { Player } from "@player";
import { CompletedProgramName } from "@enums";
import { Router } from "../../ui/GameRoot";
import { Page } from "../../ui/Router";
import { Settings } from "../../Settings/Settings";

import { Programs } from "../Programs";
import { CreateProgramWork, isCreateProgramWork } from "../../Work/CreateProgramWork";
import { useCycleRerender } from "../../ui/React/hooks";

export const ProgramsSeen = new Set<string>();

export function ProgramsRoot(): React.ReactElement {
  useCycleRerender();

  const programs = [...Object.values(Programs)]
    .filter((prog) => {
      const create = prog.create;
      if (create === null) return false;
      if (prog.name === CompletedProgramName.bitFlume) {
        return create.req();
      }
      return true;
    })
    .sort((a, b) => {
      if (Player.hasProgram(a.name)) return 1;
      if (Player.hasProgram(b.name)) return -1;
      return (a.create?.level ?? 0) - (b.create?.level ?? 0);
    });

  useEffect(() => {
    programs.forEach((p) => {
      ProgramsSeen.add(p.name);
    });
  });

  const getHackingLevelRemaining = (lvl: number): number => {
    return Math.ceil(Math.max(lvl - (Player.skills.hacking + Player.skills.intelligence / 2), 0));
  };

  const getProgCompletion = (name: string): number => {
    const programFile = find(Player.getHomeComputer().programs, (p) => {
      return p.startsWith(name) && p.endsWith("%-INC");
    });
    if (!programFile) return -1;

    const res = programFile.split("-");
    if (res.length != 3) return -1;
    const percComplete = Number(res[1].slice(0, -1));
    if (isNaN(percComplete) || percComplete < 0 || percComplete >= 100) {
      return -1;
    }
    return percComplete;
  };

  return (
    <Container disableGutters maxWidth="lg" sx={{ mx: 0, mb: 10 }}>
      <Typography variant="h4">Crear programa</Typography>
      <Typography>
        Esta página muestra los programas que puedes crear. Escribir el código de un programa toma tiempo, el cual
        varía según la complejidad del mismo. Si estás trabajando en la creación de un programa puedes cancelar en cualquier
        momento. Tu progreso se guardará para continuar más adelante.
      </Typography>

      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", my: 1 }}>
        {programs.map((program) => {
          const create = program.create;
          if (create === null) return <></>;
          const curCompletion = getProgCompletion(program.name);
          const hackingLevelRemaining = getHackingLevelRemaining(create.level);

          return (
            <Box
              component={Paper}
              sx={{ p: 1, opacity: Player.hasProgram(program.name) ? 0.75 : 1 }}
              key={program.name}
            >
              <>
                <Typography variant="h6" sx={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
                  {(Player.hasProgram(program.name) && <Check sx={{ mr: 1 }} />) ||
                    (create.req() && <Create sx={{ mr: 1 }} />) || <Lock sx={{ mr: 1 }} />}
                  {program.name}
                </Typography>
                {!Player.hasProgram(program.name) &&
                  create.req() &&
                  (isCreateProgramWork(Player.currentWork) && Player.currentWork.programName === program.name ? (
                    //Button if the program is currently being worked on
                    <Button
                      sx={{ my: 1, width: "100%" }}
                      onClick={(event) => {
                        if (!event.isTrusted) return;
                        Player.startFocusing();
                        Router.toPage(Page.Work);
                      }}
                    >
                      Reanudar enfoque
                    </Button>
                  ) : (
                    //Button if the program is not currently worked on
                    <Button
                      sx={{ my: 1, width: "100%" }}
                      onClick={(event) => {
                        if (!event.isTrusted) return;
                        if (isCreateProgramWork(Player.currentWork)) {
                          Player.finishWork(true);
                        }
                        Player.startWork(new CreateProgramWork({ singularity: false, programName: program.name }));
                        Player.startFocusing();
                        Router.toPage(Page.Work);
                      }}
                    >
                      Crear programa
                    </Button>
                  ))}
                {Player.hasProgram(program.name) || hackingLevelRemaining === 0 || (
                  <Tooltip title={<>Se desbloquea al subir {hackingLevelRemaining} niveles más de hackeo</>}>
                    <Typography color={Settings.theme.hack}>
                      <b>Se desbloquea al nivel de hackeo:</b> {Player.skills.hacking + hackingLevelRemaining}
                    </Typography>
                  </Tooltip>
                )}
                {curCompletion !== -1 && (
                  <Typography color={Settings.theme.infolight}>
                    <b>Progreso actual:</b> {curCompletion}%
                  </Typography>
                )}
                {/*Displays the current completion of the program currently being created*/}
                {isCreateProgramWork(Player.currentWork) && Player.currentWork.programName === program.name && (
                  <Typography color={Settings.theme.infolight}>
                    <b>Progreso actual:</b>{" "}
                    {((100 * Player.currentWork.unitCompleted) / Player.currentWork.unitNeeded()).toFixed(2)}%
                  </Typography>
                )}
                <Typography>{create.tooltip}</Typography>
              </>
            </Box>
          );
        })}
      </Box>
    </Container>
  );
}
