import React from "react";
import { constructorsForReviver, Generic_toJSON, Generic_fromJSON, IReviverValue } from "../utils/JSONReviver";
import { CONSTANTS } from "../Constants";
import { formatExp } from "../ui/formatNumber";
import { ClassType, GymType, LocationName, UniversityClassType } from "@enums";
import { dialogBoxCreate } from "../ui/React/DialogBox";
import { Money } from "../ui/React/Money";
import { convertTimeMsToTimeElapsedString } from "../utils/StringHelperFunctions";
import { Player } from "@player";
import { calculateClassEarnings as calculateClassEarningsRate } from "./Formulas";
import { PlayerBaseWork, WorkType } from "./Work";
import { applyWorkStats, newWorkStats, sumWorkStats, WorkStats } from "./WorkStats";
import { findEnumMember } from "../utils/helpers/enum";
import { isMember } from "../utils/EnumHelper";

export interface Class {
  type: ClassType;
  youAreCurrently: string;
  earnings: WorkStats;
}

export const Classes: Record<ClassType, Class> = {
  [UniversityClassType.computerScience]: {
    type: UniversityClassType.computerScience,
    youAreCurrently: `estudiando Ciencias de la Computación`,
    earnings: newWorkStats({ hackExp: 0.5, intExp: 0.01 }),
  },
  [UniversityClassType.dataStructures]: {
    type: UniversityClassType.dataStructures,
    youAreCurrently: "tomando un curso de Estructuras de Datos",
    earnings: newWorkStats({ money: -40, hackExp: 1, intExp: 0.01 }),
  },
  [UniversityClassType.networks]: {
    type: UniversityClassType.networks,
    youAreCurrently: "tomando un curso de Redes",
    earnings: newWorkStats({ money: -80, hackExp: 2, intExp: 0.01 }),
  },
  [UniversityClassType.algorithms]: {
    type: UniversityClassType.algorithms,
    youAreCurrently: "tomando un curso de Algoritmos",
    earnings: newWorkStats({ money: -320, hackExp: 4, intExp: 0.01 }),
  },
  [UniversityClassType.management]: {
    type: UniversityClassType.management,
    youAreCurrently: "tomando un curso de Gestión",
    earnings: newWorkStats({ money: -160, chaExp: 2, intExp: 0.01 }),
  },
  [UniversityClassType.leadership]: {
    type: UniversityClassType.leadership,
    youAreCurrently: "tomando un curso de Liderazgo",
    earnings: newWorkStats({ money: -320, chaExp: 4, intExp: 0.01 }),
  },
  [GymType.strength]: {
    type: GymType.strength,
    youAreCurrently: "entrenando tu fuerza en el gimnasio",
    earnings: newWorkStats({ money: -120, strExp: 1 }),
  },
  [GymType.defense]: {
    type: GymType.defense,
    youAreCurrently: "entrenando tu defensa en el gimnasio",
    earnings: newWorkStats({ money: -120, defExp: 1 }),
  },
  [GymType.dexterity]: {
    type: GymType.dexterity,
    youAreCurrently: "entrenando tu destreza en el gimnasio",
    earnings: newWorkStats({ money: -120, dexExp: 1 }),
  },
  [GymType.agility]: {
    type: GymType.agility,
    youAreCurrently: "entrenando tu agilidad en el gimnasio",
    earnings: newWorkStats({ money: -120, agiExp: 1 }),
  },
};

interface ClassWorkParams {
  classType: ClassType;
  location: LocationName;
  singularity: boolean;
}

export const isClassWork = (w: PlayerBaseWork | null): w is ClassWork => w !== null && w.type === WorkType.CLASS;
export class ClassWork extends PlayerBaseWork {
  classType: ClassType;
  location: LocationName;
  earnings = newWorkStats();

  constructor(params?: ClassWorkParams) {
    super(WorkType.CLASS, params?.singularity ?? true);
    this.classType = params?.classType ?? UniversityClassType.computerScience;
    this.location = params?.location ?? LocationName.Sector12RothmanUniversity;
  }

  isGym(): boolean {
    return isMember("GymType", this.classType);
  }

  getClass(): Class {
    return Classes[this.classType];
  }

  calculateRates(): WorkStats {
    return calculateClassEarningsRate(Player, this.classType, this.location);
  }

  process(cycles: number): boolean {
    this.cyclesWorked += cycles;
    const rate = this.calculateRates();
    const earnings = applyWorkStats(Player, rate, cycles, "class");
    this.earnings = sumWorkStats(this.earnings, earnings);
    return false;
  }

  finish(__cancelled: boolean, suppressDialog?: boolean): void {
    if (!this.singularity && !suppressDialog) {
      dialogBoxCreate(
        <>
          Después de {this.getClass().youAreCurrently} durante{" "}
          {convertTimeMsToTimeElapsedString(this.cyclesWorked * CONSTANTS.MilliPerCycle)}, <br />
          gastaste un total de <Money money={-this.earnings.money} />. <br />
          <br />
          Ganaste un total de: <br />
          {formatExp(this.earnings.hackExp)} EXP de hackeo <br />
          {formatExp(this.earnings.strExp)} EXP de fuerza <br />
          {formatExp(this.earnings.defExp)} EXP de defensa <br />
          {formatExp(this.earnings.dexExp)} EXP de destreza <br />
          {formatExp(this.earnings.agiExp)} EXP de agilidad <br />
          {formatExp(this.earnings.chaExp)} EXP de carisma
          <br />
        </>,
      );
    }
    this.resolveNextCompletion();
  }

  APICopy() {
    return {
      type: WorkType.CLASS as const,
      cyclesWorked: this.cyclesWorked,
      classType: this.classType,
      location: this.location,
      nextCompletion: this.nextCompletion,
    };
  }

  /** Serialize the current object to a JSON save state. */
  toJSON(): IReviverValue {
    return Generic_toJSON("ClassWork", this);
  }

  /** Initializes a ClassWork object from a JSON save state. */
  static fromJSON(value: IReviverValue): ClassWork {
    const classWork = Generic_fromJSON(ClassWork, value.data);
    classWork.classType =
      findEnumMember(UniversityClassType, classWork.classType) ??
      findEnumMember(GymType, classWork.classType) ??
      UniversityClassType.computerScience;
    return classWork;
  }
}

constructorsForReviver.ClassWork = ClassWork;
