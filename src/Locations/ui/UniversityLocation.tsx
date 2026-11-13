/**
 * React Subcomponent for displaying a location's UI, when that location is a university
 *
 * This subcomponent renders all of the buttons for studying/taking courses
 */
import * as React from "react";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";

import { Location } from "../Location";

import { Money } from "../../ui/React/Money";
import { Router } from "../../ui/GameRoot";
import { Page } from "../../ui/Router";
import { Player } from "@player";
import { Box } from "@mui/material";

import { ClassWork, Classes } from "../../Work/ClassWork";
import { calculateCost } from "../../Work/Formulas";
import { UniversityClassType } from "@enums";

interface IProps {
  loc: Location;
}

export function UniversityLocation(props: IProps): React.ReactElement {
  function take(classType: UniversityClassType): void {
    Player.startWork(
      new ClassWork({
        classType: classType,
        location: props.loc.name,
        singularity: false,
      }),
    );
    Player.startFocusing();
    Router.toPage(Page.Work);
  }

  const dataStructuresCost = calculateCost(Classes[UniversityClassType.dataStructures], props.loc);
  const networksCost = calculateCost(Classes[UniversityClassType.networks], props.loc);
  const algorithmsCost = calculateCost(Classes[UniversityClassType.algorithms], props.loc);
  const managementCost = calculateCost(Classes[UniversityClassType.management], props.loc);
  const leadershipCost = calculateCost(Classes[UniversityClassType.leadership], props.loc);

  const earnHackingExpTooltip = `¡Gana experiencia de hackeo!`;
  const earnCharismaExpTooltip = `¡Gana experiencia de carisma!`;

  return (
    <Box sx={{ display: "grid", width: "fit-content" }}>
      <Tooltip title={earnHackingExpTooltip}>
        <Button onClick={() => take(UniversityClassType.computerScience)}>Estudiar Ciencias de la Computación (gratis)</Button>
      </Tooltip>
      <Tooltip title={earnHackingExpTooltip}>
        <Button onClick={() => take(UniversityClassType.dataStructures)}>
          Tomar curso de Estructuras de Datos (
          <Money money={dataStructuresCost} forPurchase={true} /> / seg)
        </Button>
      </Tooltip>
      <Tooltip title={earnHackingExpTooltip}>
        <Button onClick={() => take(UniversityClassType.networks)}>
          Tomar curso de Redes (
          <Money money={networksCost} forPurchase={true} /> / seg)
        </Button>
      </Tooltip>
      <Tooltip title={earnHackingExpTooltip}>
        <Button onClick={() => take(UniversityClassType.algorithms)}>
          Tomar curso de Algoritmos (
          <Money money={algorithmsCost} forPurchase={true} /> / seg)
        </Button>
      </Tooltip>
      <Tooltip title={earnCharismaExpTooltip}>
        <Button onClick={() => take(UniversityClassType.management)}>
          Tomar curso de Gestión (
          <Money money={managementCost} forPurchase={true} /> / seg)
        </Button>
      </Tooltip>
      <Tooltip title={earnCharismaExpTooltip}>
        <Button onClick={() => take(UniversityClassType.leadership)}>
          Tomar curso de Liderazgo (
          <Money money={leadershipCost} forPurchase={true} /> / seg)
        </Button>
      </Tooltip>
    </Box>
  );
}
