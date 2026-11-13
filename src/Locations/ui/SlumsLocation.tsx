/**
 * React Subcomponent for displaying a location's UI, when that location is a slum
 *
 * This subcomponent renders all of the buttons for committing crimes
 */
import React from "react";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";

import { Crimes } from "../../Crime/Crimes";

import { formatPercent } from "../../ui/formatNumber";
import { Router } from "../../ui/GameRoot";
import { Page } from "../../ui/Router";
import { Player } from "@player";
import { Box } from "@mui/material";
import { Crime } from "../../Crime/Crime";
import { useRerender } from "../../ui/React/hooks";

const crimeNames: Record<string, string> = {
  shoplift: "Hurtar en tienda",
  robStore: "Robar una tienda",
  mug: "Asaltar a un transeúnte",
  larceny: "Hurto mayor",
  dealDrugs: "Vender drogas",
  traffickArms: "Traficar armas",
  homicide: "Homicidio",
  grandTheftAuto: "Robo de vehículos (GTA)",
  kidnap: "Secuestro",
  assassination: "Asesinato por encargo",
  heist: "Atraco a gran escala",
  bondForgery: "Falsificación de bonos",
};

export function SlumsLocation(): React.ReactElement {
  useRerender(1000);
  const crimes = Object.values(Crimes);

  function doCrime(e: React.MouseEvent<HTMLElement>, crime: Crime) {
    if (!e.isTrusted) return;
    crime.commit();
    Router.toPage(Page.Work);
    Player.focus = true;
  }

  return (
    <Box sx={{ display: "grid", width: "fit-content" }}>
      {crimes.map((crime) => (
        <Tooltip key={crime.workName} title={crime.tooltipText}>
          <Button onClick={(e) => doCrime(e, crime)}>
            {(crimeNames[crime.type] ?? crime.type)} ({formatPercent(crime.successRate(Player))} de probabilidad de éxito)
          </Button>
        </Tooltip>
      ))}
    </Box>
  );
}
