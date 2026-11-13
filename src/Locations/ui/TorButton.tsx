import React from "react";
import Button from "@mui/material/Button";

import { dialogBoxCreate } from "../../ui/React/DialogBox";

import { CONSTANTS } from "../../Constants";
import { Player } from "@player";

import { Money } from "../../ui/React/Money";
import { getTorRouter } from "../../Server/ServerHelpers";

/** Attempt to purchase a TOR router using the button. */
export function purchaseTorRouter(): void {
  if (Player.hasTorRouter()) {
    dialogBoxCreate(`¡Ya tienes un Router TOR!`);
    return;
  }
  if (!Player.canAfford(CONSTANTS.TorRouterCost)) {
    dialogBoxCreate("¡No tienes suficiente dinero para comprar el router TOR!");
    return;
  }
  Player.loseMoney(CONSTANTS.TorRouterCost, "other");

  getTorRouter();
  dialogBoxCreate(
    "¡Has comprado un router TOR!\n" +
      "Ahora tienes acceso a la dark web desde tu computadora 'home'.\n" +
      `Usa el comando "buy" en la terminal para comprar programas.`,
  );
}

interface IProps {
  rerender: () => void;
}

export function TorButton(props: IProps): React.ReactElement {
  function buy(): void {
    purchaseTorRouter();
    props.rerender();
  }

  const hasTorRouter = Player.hasTorRouter();

  return (
    <Button disabled={!Player.canAfford(CONSTANTS.TorRouterCost) || hasTorRouter} onClick={buy}>
      Comprar router TOR -&nbsp;
      {hasTorRouter ? "Comprado" : <Money money={CONSTANTS.TorRouterCost} forPurchase={true} />}
    </Button>
  );
}
