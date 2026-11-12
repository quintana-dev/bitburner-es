import { Paper, Table, TableBody, Box, IconButton, Typography, Container, Tooltip } from "@mui/material";
import { MoreHoriz, Info } from "@mui/icons-material";
import React, { useState } from "react";
import { BitNodes } from "../BitNode/BitNode";
import { currentNodeMults } from "../BitNode/BitNodeMultipliers";
import { BitNodeMultipliersDisplay } from "../BitNode/ui/BitnodeMultipliersDescription";
import { HacknetServerConstants } from "../Hacknet/data/Constants";
import { getCloudServerLimit } from "../Server/ServerPurchases";
import { Settings } from "../Settings/Settings";
import { MoneySourceTracker } from "../utils/MoneySourceTracker";
import { convertTimeMsToTimeElapsedString } from "../utils/StringHelperFunctions";
import { Player } from "@player";
import { formatPercent, formatNumber } from "./formatNumber";
import { Modal } from "./React/Modal";
import { Money } from "./React/Money";
import { StatsRow } from "./React/StatsRow";
import { StatsTable } from "./React/StatsTable";
import { useCycleRerender } from "./React/hooks";
import { getMaxRep } from "../Go/effects/effect";
import { canAccessBitNodeFeature, getBitNodeLevel, knowAboutBitverse } from "../BitNode/BitNodeUtils";

interface EmployersModalProps {
  open: boolean;
  onClose: () => void;
}

const EmployersModal = ({ open, onClose }: EmployersModalProps): React.ReactElement => {
  return (
    <Modal open={open} onClose={onClose}>
      <>
        <Typography variant="h5">Todos los Empleadores</Typography>
        <ul>
          {Object.keys(Player.jobs).map((j) => (
            <Typography key={j}>* {j}</Typography>
          ))}
        </ul>
      </>
    </Modal>
  );
};

interface IMultRow {
  // The name of the multiplier
  mult: string;

  // The player's raw multiplier value
  value: number;

  // The player's effective multiplier value, affected by BitNode mults
  effValue?: number;

  // The text color for the row
  color?: string;

  // Whether to format as percent or scalar
  isNumber?: boolean;
}

interface MultTableProps {
  rows: IMultRow[];
  color: string;
  noMargin?: boolean;
}

function MultiplierTable(props: MultTableProps): React.ReactElement {
  return (
    <Table sx={{ display: "table", width: "100%", mb: props.noMargin ? 0 : 2 }}>
      <TableBody>
        {props.rows.map((data) => {
          const { mult, value, effValue = null, color = props.color } = data;

          if (effValue !== null && effValue !== value && canAccessBitNodeFeature(5)) {
            return (
              <StatsRow key={mult} name={mult} color={color} data={{}}>
                <>
                  <Typography color={color}>
                    {data.isNumber ? (
                      formatNumber(value, 0)
                    ) : (
                      <>
                        <span style={{ opacity: 0.5 }}>{formatPercent(value)}</span> {formatPercent(effValue)}
                      </>
                    )}
                  </Typography>
                </>
              </StatsRow>
            );
          }
          return (
            <StatsRow
              key={mult}
              name={mult}
              color={color}
              data={{ content: data.isNumber ? formatNumber(value, 0) : formatPercent(value) }}
            />
          );
        })}
      </TableBody>
    </Table>
  );
}

function CurrentBitNode(): React.ReactElement {
  if (knowAboutBitverse()) {
    const index = "BitNode" + Player.bitNodeN;
    return (
      <Paper sx={{ mb: 1, p: 1 }}>
        <Typography variant="h5">
          BitNode {Player.bitNodeN}: {BitNodes[index].name} (Level {getBitNodeLevel()})
        </Typography>
        <Typography component="div" sx={{ whiteSpace: "pre-wrap", overflowWrap: "break-word" }}>
          {BitNodes[index].info}
        </Typography>
      </Paper>
    );
  }

  return <></>;
}

interface IMoneyModalProps {
  open: boolean;
  onClose: () => void;
}

function MoneyModal({ open, onClose }: IMoneyModalProps): React.ReactElement {
  function convertMoneySourceTrackerToString(src: MoneySourceTracker): React.ReactElement {
    const parts: [string, JSX.Element][] = [[`Total:`, <Money key="total" money={src.total} />]];
    if (src.augmentations) {
      parts.push([`Aumentos:`, <Money key="aug" money={src.augmentations} />]);
    }
    if (src.bladeburner) {
      parts.push([`Bladeburner:`, <Money key="blade" money={src.bladeburner} />]);
    }
    if (src.casino) {
      parts.push([`Casino:`, <Money key="casino" money={src.casino} />]);
    }
    if (src.codingcontract) {
      parts.push([`Contratos de Programación:`, <Money key="coding-contract" money={src.codingcontract} />]);
    }
    if (src.work) {
      parts.push([`Trabajo en Empresa:`, <Money key="company-work" money={src.work} />]);
    }
    if (src.class) {
      parts.push([`Cursos y Clases:`, <Money key="class" money={src.class} />]);
    }
    if (src.corporation) {
      parts.push([`Corporación:`, <Money key="corp" money={src.corporation} />]);
    }
    if (src.crime) {
      parts.push([`Crímenes:`, <Money key="crime" money={src.crime} />]);
    }
    if (src.darknet) {
      parts.push([`Darknet:`, <Money key="darknet" money={src.darknet} />]);
    }
    if (src.gang) {
      parts.push([`Pandilla:`, <Money key="gang" money={src.gang} />]);
    }
    if (src.gang_expenses) {
      parts.push([`Gastos de Pandilla:`, <Money key="gang-expenses" money={src.gang_expenses} />]);
    }
    if (src.hacking) {
      parts.push([`Hackeo:`, <Money key="hacking" money={src.hacking} />]);
    }
    if (src.hacknet) {
      parts.push([`Hacknet:`, <Money key="hacknet" money={src.hacknet} />]);
    }
    if (src.hacknet_expenses) {
      parts.push([`Gastos de Hacknet:`, <Money key="hacknet-expenses" money={src.hacknet_expenses} />]);
    }
    if (src.hospitalization) {
      parts.push([`Hospitalización:`, <Money key="hospital" money={src.hospitalization} />]);
    }
    if (src.infiltration) {
      parts.push([`Infiltración:`, <Money key="infiltration" money={src.infiltration} />]);
    }
    if (src.servers) {
      parts.push([`Servidores:`, <Money key="servers" money={src.servers} />]);
    }
    if (src.stock) {
      parts.push([`Bolsa de Valores:`, <Money key="market" money={src.stock} />]);
    }
    if (src.sleeves) {
      parts.push([`Mangas / Clones:`, <Money key="sleeves" money={src.sleeves} />]);
    }
    if (src.other) {
      parts.push([`Otros:`, <Money key="other" money={src.other} />]);
    }

    return <StatsTable rows={parts} wide />;
  }

  let content = (
    <>
      <Typography variant="h6" color="primary">
        Dinero ganado desde la última instalación de Aumentos
      </Typography>
      <br />
      {convertMoneySourceTrackerToString(Player.moneySourceA)}
    </>
  );
  if (knowAboutBitverse()) {
    content = (
      <>
        {content}
        <br />
        <br />
        <Typography variant="h6" color="primary">
          Dinero ganado en este BitNode
        </Typography>
        <br />
        {convertMoneySourceTrackerToString(Player.moneySourceB)}
      </>
    );
  }

  return (
    <Modal open={open} onClose={onClose}>
      {content}
    </Modal>
  );
}

export function CharacterStats(): React.ReactElement {
  const [moneyOpen, setMoneyOpen] = useState(false);
  const [employersOpen, setEmployersOpen] = useState(false);
  useCycleRerender();

  const timeRows = [
    ["Desde la última instalación de Aumentos", convertTimeMsToTimeElapsedString(Player.playtimeSinceLastAug)],
  ];
  if (knowAboutBitverse()) {
    timeRows.push(["Desde el último BitNode destruido", convertTimeMsToTimeElapsedString(Player.playtimeSinceLastBitnode)]);
  }
  timeRows.push(["Total", convertTimeMsToTimeElapsedString(Player.totalPlaytime)]);

  return (
    <Container maxWidth="lg" disableGutters sx={{ mx: 0 }}>
      <Typography variant="h4">Estadísticas</Typography>
      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", minWidth: "fit-content", mb: 1, gap: 1 }}>
        <Paper sx={{ p: 1 }}>
          <Typography variant="h5">General</Typography>
          <Table>
            <TableBody>
              <StatsRow name="Ciudad Actual" color={Settings.theme.primary} data={{ content: Player.city }} />
              <StatsRow name="Dinero" color={Settings.theme.money} data={{}}>
                <>
                  <Money money={Player.money} />
                  <IconButton onClick={() => setMoneyOpen(true)} sx={{ p: 0 }}>
                    <MoreHoriz color="info" />
                  </IconButton>
                </>
              </StatsRow>

              {Player.jobs && Object.keys(Player.jobs).length !== 0 ? (
                <StatsRow name="Todos los Empleadores" color={Settings.theme.primary} data={{}}>
                  <>
                    <span style={{ color: Settings.theme.primary }}>{Object.keys(Player.jobs).length} total</span>
                    <IconButton onClick={() => setEmployersOpen(true)} sx={{ p: 0 }}>
                      <MoreHoriz color="info" />
                    </IconButton>
                  </>
                </StatsRow>
              ) : (
                <></>
              )}
              <StatsRow
                name="Servidores en la Nube"
                color={Settings.theme.primary}
                data={{ content: `${Player.purchasedServers.length} / ${getCloudServerLimit()}` }}
              />
              <StatsRow
                name={`Hacknet ${canAccessBitNodeFeature(9) ? "Servidores" : "Nodos"}`}
                color={Settings.theme.primary}
                data={{
                  content: `${Player.hacknetNodes.length}${
                    canAccessBitNodeFeature(9) ? ` / ${HacknetServerConstants.MaxServers}` : ""
                  }`,
                }}
              />
              <StatsRow
                name="Aumentos Instalados"
                color={Settings.theme.primary}
                data={{ content: String(Player.augmentations.length) }}
              />
              <StatsRow name="Karma" color={Settings.theme.primary} data={{ content: formatNumber(Player.karma, 3) }} />
            </TableBody>
          </Table>
        </Paper>
        <Paper sx={{ p: 1 }}>
          <Typography variant="h5">Habilidades</Typography>
          <Table>
            <TableBody>
              <StatsRow
                name="Hackeo"
                color={Settings.theme.hack}
                data={{ level: Player.skills.hacking, exp: Player.exp.hacking }}
              />
              <StatsRow
                name="Fuerza"
                color={Settings.theme.combat}
                data={{ level: Player.skills.strength, exp: Player.exp.strength }}
              />
              <StatsRow
                name="Defensa"
                color={Settings.theme.combat}
                data={{ level: Player.skills.defense, exp: Player.exp.defense }}
              />
              <StatsRow
                name="Destreza"
                color={Settings.theme.combat}
                data={{ level: Player.skills.dexterity, exp: Player.exp.dexterity }}
              />
              <StatsRow
                name="Agilidad"
                color={Settings.theme.combat}
                data={{ level: Player.skills.agility, exp: Player.exp.agility }}
              />
              <StatsRow
                name="Carisma"
                color={Settings.theme.cha}
                data={{ level: Player.skills.charisma, exp: Player.exp.charisma }}
              />
              {Player.skills.intelligence > 0 && canAccessBitNodeFeature(5) && (
                <StatsRow
                  name="Inteligencia"
                  color={Settings.theme.int}
                  data={{ level: Player.skills.intelligence, exp: Player.exp.intelligence }}
                />
              )}
            </TableBody>
          </Table>
        </Paper>
      </Box>

      <Paper sx={{ p: 1, mb: 1 }}>
        <Typography variant="h5" color="primary" sx={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
          Multiplicadores
          {canAccessBitNodeFeature(5) && (
            <Tooltip
              title={
                <Typography>
                  Muestra tus multiplicadores actuales.
                  <br />
                  <br />
                  Cuando hay un número atenuado junto a un multiplicador, significa que está afectado por los
                  multiplicadores del BitNode.
                  <br />
                  <br />
                  El número atenuado es el multiplicador base, y el número brillante es el multiplicador efectivo impuesto
                  por el BitNode.
                </Typography>
              }
            >
              <Info sx={{ ml: 1, mb: 0.5 }} color="info" />
            </Tooltip>
          )}
        </Typography>
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
          <Box>
            <MultiplierTable
              rows={[
                {
                  mult: "Probabilidad de Hackeo",
                  value: Player.mults.hacking_chance,
                },
                {
                  mult: "Velocidad de Hackeo",
                  value: Player.mults.hacking_speed,
                  effValue: Player.mults.hacking_speed * currentNodeMults.HackingSpeedMultiplier,
                },
                {
                  mult: "Dinero por Hackeo",
                  value: Player.mults.hacking_money,
                  effValue: Player.mults.hacking_money * currentNodeMults.ScriptHackMoney,
                },
                {
                  mult: "Crecimiento por Hackeo",
                  value: Player.mults.hacking_grow,
                  effValue: Player.mults.hacking_grow * currentNodeMults.ServerGrowthRate,
                },
              ]}
              color={Settings.theme.hack}
            />
            <MultiplierTable
              rows={[
                {
                  mult: "Nivel de Hackeo",
                  value: Player.mults.hacking,
                  effValue: Player.mults.hacking * currentNodeMults.HackingLevelMultiplier,
                },
                {
                  mult: "Experiencia de Hackeo",
                  value: Player.mults.hacking_exp,
                  effValue: Player.mults.hacking_exp * currentNodeMults.HackExpGain,
                },
              ]}
              color={Settings.theme.hack}
            />
            <MultiplierTable
              rows={[
                {
                  mult: "Nivel de Fuerza",
                  value: Player.mults.strength,
                  effValue: Player.mults.strength * currentNodeMults.StrengthLevelMultiplier,
                },
                {
                  mult: "Experiencia de Fuerza",
                  value: Player.mults.strength_exp,
                },
              ]}
              color={Settings.theme.combat}
            />
            <MultiplierTable
              rows={[
                {
                  mult: "Nivel de Defensa",
                  value: Player.mults.defense,
                  effValue: Player.mults.defense * currentNodeMults.DefenseLevelMultiplier,
                },
                {
                  mult: "Experiencia de Defensa",
                  value: Player.mults.defense_exp,
                },
              ]}
              color={Settings.theme.combat}
            />
            <MultiplierTable
              rows={[
                {
                  mult: "Nivel de Destreza",
                  value: Player.mults.dexterity,
                  effValue: Player.mults.dexterity * currentNodeMults.DexterityLevelMultiplier,
                },
                {
                  mult: "Experiencia de Destreza",
                  value: Player.mults.dexterity_exp,
                },
              ]}
              color={Settings.theme.combat}
            />
            <MultiplierTable
              rows={[
                {
                  mult: "Nivel de Agilidad",
                  value: Player.mults.agility,
                  effValue: Player.mults.agility * currentNodeMults.AgilityLevelMultiplier,
                },
                {
                  mult: "Experiencia de Agilidad",
                  value: Player.mults.agility_exp,
                },
              ]}
              color={Settings.theme.combat}
            />
            <MultiplierTable
              rows={[
                {
                  mult: "Nivel de Carisma",
                  value: Player.mults.charisma,
                  effValue: Player.mults.charisma * currentNodeMults.CharismaLevelMultiplier,
                },
                {
                  mult: "Experiencia de Carisma",
                  value: Player.mults.charisma_exp,
                },
              ]}
              color={Settings.theme.cha}
              noMargin
            />
          </Box>

          <Box>
            <MultiplierTable
              rows={[
                {
                  mult: "Producción de Hacknet",
                  value: Player.mults.hacknet_node_money,
                  effValue: Player.mults.hacknet_node_money * currentNodeMults.HacknetNodeMoney,
                },
                {
                  mult: "Coste de Compra Hacknet",
                  value: Player.mults.hacknet_node_purchase_cost,
                },
                {
                  mult: "Coste de Mejora de RAM Hacknet",
                  value: Player.mults.hacknet_node_ram_cost,
                },
                {
                  mult: "Coste de Núcleos Hacknet",
                  value: Player.mults.hacknet_node_core_cost,
                },
                {
                  mult: "Coste de Niveles Hacknet",
                  value: Player.mults.hacknet_node_level_cost,
                },
              ]}
              color={Settings.theme.primary}
            />
            <MultiplierTable
              rows={[
                {
                  mult: "Ganancia de Reputación en Empresas",
                  value: Player.mults.company_rep,
                  effValue: Player.mults.company_rep * currentNodeMults.CompanyWorkRepGain,
                  color: Settings.theme.rep,
                },
                {
                  mult: "Ganancia de Reputación en Facciones",
                  value: Player.mults.faction_rep,
                  effValue: Player.mults.faction_rep * currentNodeMults.FactionWorkRepGain,
                  color: Settings.theme.rep,
                },
                {
                  mult: "Salario",
                  value: Player.mults.work_money,
                  effValue: Player.mults.work_money * currentNodeMults.CompanyWorkMoney,
                  color: Settings.theme.money,
                },
              ]}
              color={Settings.theme.money}
            />
            <MultiplierTable
              rows={[
                {
                  mult: "Probabilidad de Éxito en Crímenes",
                  value: Player.mults.crime_success,
                  effValue: Player.mults.crime_success * currentNodeMults.CrimeSuccessRate,
                },
                {
                  mult: "Dinero por Crímenes",
                  value: Player.mults.crime_money,
                  effValue: Player.mults.crime_money * currentNodeMults.CrimeMoney,
                  color: Settings.theme.money,
                },
              ]}
              color={Settings.theme.combat}
            />
            <MultiplierTable
              rows={[
                {
                  mult: "Dinero de Darknet",
                  value: Player.mults.dnet_money,
                  effValue: Player.mults.dnet_money * currentNodeMults.DarknetMoneyMultiplier,
                },
              ]}
              color={Settings.theme.money}
            />
            {Player.canAccessBladeburner() && currentNodeMults.BladeburnerRank > 0 && (
              <MultiplierTable
                rows={[
                  {
                    mult: "Bladeburner Success Chance",
                    value: Player.mults.bladeburner_success_chance,
                  },
                  {
                    mult: "Bladeburner Max Stamina",
                    value: Player.mults.bladeburner_max_stamina,
                  },
                  {
                    mult: "Bladeburner Stamina Gain",
                    value: Player.mults.bladeburner_stamina_gain,
                  },
                  {
                    mult: "Bladeburner Field Analysis",
                    value: Player.mults.bladeburner_analysis,
                  },
                ]}
                color={Settings.theme.primary}
                noMargin={!canAccessBitNodeFeature(14)}
              />
            )}
            {canAccessBitNodeFeature(14) && (
              <MultiplierTable
                rows={[
                  {
                    mult: "IPvGO Node Power bonus",
                    value: Player.activeSourceFileLvl(14) ? 2 * currentNodeMults.GoPower : currentNodeMults.GoPower,
                  },
                  {
                    mult: "IPvGO Max Rep Converted to Favor",
                    value: getMaxRep(),
                    isNumber: true,
                  },
                ]}
                color={Settings.theme.combat}
                noMargin
              />
            )}
          </Box>
        </Box>
      </Paper>

      <Paper sx={{ p: 1, mb: 1 }}>
        <Typography variant="h5">Tiempo Jugado</Typography>
        <Table>
          <TableBody>
            {timeRows.map(([name, content]) => (
              <StatsRow key={name} name={name} color={Settings.theme.primary} data={{ content: content }} />
            ))}
          </TableBody>
        </Table>
      </Paper>

      <CurrentBitNode />

      {canAccessBitNodeFeature(5) && (
        <Paper sx={{ p: 1, mb: 1 }}>
          <Typography variant="h5">Multiplicadores del BitNode</Typography>
          <BitNodeMultipliersDisplay n={Player.bitNodeN} hideMultsIfCannotAccessFeature={true} />
        </Paper>
      )}

      <MoneyModal open={moneyOpen} onClose={() => setMoneyOpen(false)} />
      <EmployersModal open={employersOpen} onClose={() => setEmployersOpen(false)} />
    </Container>
  );
}
