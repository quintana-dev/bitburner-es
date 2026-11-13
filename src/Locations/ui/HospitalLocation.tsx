/**
 * React Subcomponent for displaying a location's UI, when that location is a hospital
 *
 * This subcomponent renders all of the buttons for hospital options
 */
import * as React from "react";
import Button from "@mui/material/Button";

import { Player } from "@player";
import { getHospitalizationCost } from "../../Hospital/Hospital";

import { Money } from "../../ui/React/Money";

import { dialogBoxCreate } from "../../ui/React/DialogBox";
import { useCycleRerender } from "../../ui/React/hooks";

export function HospitalLocation(): React.ReactElement {
  /** Stores button styling that sets them all to block display */
  const btnStyle = { display: "block" };
  const rerender = useCycleRerender();

  function getHealed(e: React.MouseEvent<HTMLElement>): void {
    if (!e.isTrusted) {
      return;
    }

    if (Player.hp.current < 0) {
      Player.hp.current = 0;
    }
    if (Player.hp.current >= Player.hp.max) {
      return;
    }

    const cost = getHospitalizationCost();
    Player.loseMoney(cost, "hospitalization");
    Player.hp.current = Player.hp.max;

    // This just forces a re-render to update the cost
    rerender();

    dialogBoxCreate(
      <>
        ¡Te has curado por completo! El hospital te ha facturado <Money money={cost} />
      </>,
    );
  }

  return (
    <Button onClick={getHealed} style={btnStyle}>
      Recibir tratamiento para heridas - <Money money={getHospitalizationCost()} forPurchase={true} />
    </Button>
  );
}
