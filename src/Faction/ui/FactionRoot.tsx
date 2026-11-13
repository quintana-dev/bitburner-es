/**
 * Root React Component for displaying a Faction's UI.
 * This is the component for displaying a single faction's UI, not the list of all
 * accessible factions
 */
import React from "react";

import { DonateOption } from "./DonateOption";
import { Info } from "./Info";
import { Option } from "./Option";

import { Faction } from "../Faction";

import { Router } from "../../ui/GameRoot";
import { Page } from "../../ui/Router";
import { Player } from "@player";
import { Typography, Button } from "@mui/material";

import { FactionWorkType } from "@enums";
import { FactionWork } from "../../Work/FactionWork";
import { useCycleRerender } from "../../ui/React/hooks";
import { favorNeededToDonate } from "../formulas/donation";
import { knowAboutBitverse } from "../../BitNode/BitNodeUtils";

type FactionRootProps = {
  faction: Faction;
};

// Info text for all options on the UI
const hackingContractsInfo =
  "Completa contratos de hackeo para tu facción. " +
  "Tu efectividad, que determina cuánta " +
  "reputation ganas para esta facción, se basa enteramente en tu habilidad de hackeo. " +
  "Ganarás exp de hackeo.";
const fieldWorkInfo =
  "Lleva a cabo misiones de campo para tu facción. " +
  "Tu efectividad, que determina cuánta " +
  "reputación ganas para esta facción, se basa equitativamente en todos tus atributos. " +
  "Ganarás exp para todos tus atributos.";
const securityWorkInfo =
  "Sirve en destacamentos de seguridad para tu facción. " +
  "Tu efectividad, que determina cuánta " +
  "reputación ganas para esta facción, se basa en tus estadísticas de combate y habilidad de hackeo. " +
  "Ganarás exp en todas las estadísticas de combate y en hackeo.";
const augmentationsInfo =
  "A medida que aumente tu reputación con esta facción " +
  "desbloquearás aumentos, que puedes comprar para potenciar " +
  "tus habilidades.";

interface IMainProps {
  faction: Faction;
  rerender: () => void;
  onAugmentations: () => void;
}

function MainPage({ faction, rerender, onAugmentations }: IMainProps): React.ReactElement {
  const factionInfo = faction.getInfo();

  function startWork(): void {
    Player.startFocusing();
    Router.toPage(Page.Work);
  }

  function startFieldWork(faction: Faction): void {
    Player.startWork(
      new FactionWork({
        singularity: false,
        faction: faction.name,
        factionWorkType: FactionWorkType.field,
      }),
    );
    startWork();
  }

  function startHackingContracts(faction: Faction): void {
    Player.startWork(
      new FactionWork({
        singularity: false,
        faction: faction.name,
        factionWorkType: FactionWorkType.hacking,
      }),
    );
    startWork();
  }

  function startSecurityWork(faction: Faction): void {
    Player.startWork(
      new FactionWork({
        singularity: false,
        faction: faction.name,
        factionWorkType: FactionWorkType.security,
      }),
    );
    startWork();
  }

  // We have a special flag for whether this faction is the player's
  // gang faction because if the player has a gang, they cannot do any other action
  const isPlayersGang = Player.gang && Player.getGangName() === faction.name;

  // Flags for whether special options (gang, sleeve purchases, donate, etc.)
  // should be shown
  const favorToDonate = favorNeededToDonate();
  const canDonate = faction.favor >= favorToDonate;

  return (
    <>
      <Button onClick={() => Router.toPage(Page.Factions)}>Volver</Button>
      <Typography variant="h4" color="primary">
        {faction.name}
      </Typography>
      <Info faction={faction} factionInfo={factionInfo} />
      {!isPlayersGang && (
        <>
          {factionInfo.offersWork() && (
            <Typography>
              ¡Realiza trabajos y misiones para tu facción para apoyar su causa! Al hacerlo, ganarás reputación
              para tu facción. También ganarás reputación pasivamente a lo largo del tiempo, aunque a un ritmo muy lento.&nbsp;
              {knowAboutBitverse() && <>Ten en cuenta que la ganancia pasiva de reputación está desactivada en algunos BitNodes. </>}
              Ganar reputación te permitirá comprar aumentos cibernéticos a través de esta facción, que son poderosas
              mejoras para potenciar tus capacidades.
            </Typography>
          )}
          {factionInfo.offerHackingWork && (
            <Option
              buttonText={"Contratos de Hackeo"}
              infoText={hackingContractsInfo}
              onClick={() => startHackingContracts(faction)}
            />
          )}
          {factionInfo.offerFieldWork && (
            <Option buttonText={"Trabajo de Campo"} infoText={fieldWorkInfo} onClick={() => startFieldWork(faction)} />
          )}
          {factionInfo.offerSecurityWork && (
            <Option
              buttonText={"Trabajo de Seguridad"}
              infoText={securityWorkInfo}
              onClick={() => startSecurityWork(faction)}
            />
          )}
          {factionInfo.offersWork() && (
            <DonateOption faction={faction} rerender={rerender} favorToDonate={favorToDonate} disabled={!canDonate} />
          )}
        </>
      )}
      <Option buttonText={"Comprar Aumentos"} infoText={augmentationsInfo} onClick={onAugmentations} />
    </>
  );
}

export function FactionRoot({ faction }: FactionRootProps): React.ReactElement {
  const rerender = useCycleRerender();

  if (!Player.factions.includes(faction.name)) {
    return (
      <>
        <Typography variant="h4" color="primary">
          ¡Aún no te has unido a {faction.name}!
        </Typography>
        <Button onClick={() => Router.toPage(Page.Factions)}>Volver a Facciones</Button>
      </>
    );
  }

  return (
    <MainPage
      rerender={rerender}
      faction={faction}
      onAugmentations={() => Router.toPage(Page.FactionAugmentations, { faction })}
    />
  );
}
