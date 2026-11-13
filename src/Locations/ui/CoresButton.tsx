import React from "react";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import { Player } from "@player";

import { Money } from "../../ui/React/Money";
import MathNotation from "../../Documentation/data/MathNotation.json";
import { MathNotationOutput } from "../../Documentation/ui/MathNotationOutput";

interface IProps {
  rerender: () => void;
}

export function CoresButton(props: IProps): React.ReactElement {
  const homeComputer = Player.getHomeComputer();
  const reachMaxCore = Player.bitNodeOptions.restrictHomePCUpgrade || homeComputer.cpuCores >= 8;

  const cost = Player.getUpgradeHomeCoresCost();

  function buy(): void {
    // Do NOT reuse reachMaxCore - it is cached (and possibly stale) at button creation time
    if (Player.bitNodeOptions.restrictHomePCUpgrade || homeComputer.cpuCores >= 8) {
      return;
    }
    if (!Player.canAfford(cost)) {
      return;
    }
    Player.loseMoney(cost, "servers");
    homeComputer.cpuCores++;
    props.rerender();
  }

  return (
    <Tooltip title={<MathNotationOutput notation={MathNotation.CoreCost} />}>
      <span>
        <br />
        <Typography>
          <i>"Los núcleos aumentan la efectividad de grow() y weaken() en 'home'"</i>
        </Typography>
        <br />
        <Button disabled={!Player.canAfford(cost) || reachMaxCore} onClick={buy}>
          Mejorar núcleos de 'home'&nbsp;
          {reachMaxCore ? (
            "- Máx"
          ) : (
            <>
              ({homeComputer.cpuCores} -&gt; {homeComputer.cpuCores + 1}) -&nbsp;
              <Money money={cost} forPurchase={true} />
            </>
          )}
        </Button>
      </span>
    </Tooltip>
  );
}
