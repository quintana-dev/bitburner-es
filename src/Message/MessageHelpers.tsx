import React from "react";
import { Message } from "./Message";
import { AugmentationName, CompletedProgramName, FactionName, MessageFilename } from "@enums";
import { Router } from "../ui/GameRoot";
import { Player } from "@player";
import { GetServer } from "../Server/AllServers";
import { SpecialServers } from "../Server/data/SpecialServers";
import { Settings } from "../Settings/Settings";
import { dialogBoxCreate } from "../ui/React/DialogBox";
import { Server } from "../Server/Server";
import { knowAboutBitverse } from "../BitNode/BitNodeUtils";

//Sends message to player, including a pop up
function sendMessage(name: MessageFilename, forced = false): void {
  const msg = Messages[name];
  if (forced || !Settings.SuppressMessages) {
    showMessage(name);
  }
  addMessageToServer(name);
  for (const factionName of msg.factionRumors) {
    Player.receiveRumor(factionName);
  }
}

function showMessage(name: MessageFilename): void {
  const msg = Messages[name];
  dialogBoxCreate(
    <>
      Mensaje recibido de remitente desconocido:
      <br />
      <br />
      <i>{msg.msg}</i>
      <br />
      <br />
      Este mensaje fue guardado como {msg.filename} en tu computadora local (home).
    </>,
  );
}

//Adds a message to a server
function addMessageToServer(name: MessageFilename): void {
  //Short-circuit if the message has already been saved
  if (recvd(name)) return;
  const home = Player.getHomeComputer();
  home.messages.push(name);
}

//Returns whether the given message has already been received
function recvd(name: MessageFilename): boolean {
  const home = Player.getHomeComputer();
  return home.messages.includes(name);
}

//Checks if any of the 'timed' messages should be sent
function checkForMessagesToSend(): void {
  if (Router.hidingMessages()) return;

  if (Player.hasAugmentation(AugmentationName.TheRedPill, true)) {
    //Get the world daemon required hacking level
    const worldDaemon = GetServer(SpecialServers.WorldDaemon);
    if (!(worldDaemon instanceof Server)) {
      throw new Error("The world daemon is not a server???? Please un-break reality");
    }
    //If the daemon can be hacked, send the player icarus.msg
    if (
      Player.skills.hacking >= worldDaemon.requiredHackingSkill &&
      (!knowAboutBitverse() || !recvd(MessageFilename.RedPill))
    ) {
      sendMessage(MessageFilename.RedPill, !knowAboutBitverse());
    }
    //If the daemon cannot be hacked, send the player truthgazer.msg a single time.
    else if (!recvd(MessageFilename.TruthGazer)) {
      sendMessage(MessageFilename.TruthGazer);
    }
  } else if (!recvd(MessageFilename.Jumper0) && Player.skills.hacking >= 25) {
    sendMessage(MessageFilename.Jumper0);
    Player.getHomeComputer().pushProgram(CompletedProgramName.flight);
  } else if (!recvd(MessageFilename.Jumper1) && Player.skills.hacking >= 40) {
    sendMessage(MessageFilename.Jumper1);
  } else if (!recvd(MessageFilename.CyberSecTest) && Player.skills.hacking >= 50) {
    sendMessage(MessageFilename.CyberSecTest);
  } else if (!recvd(MessageFilename.Jumper2) && Player.skills.hacking >= 175) {
    sendMessage(MessageFilename.Jumper2);
  } else if (!recvd(MessageFilename.NiteSecTest) && Player.skills.hacking >= 200) {
    sendMessage(MessageFilename.NiteSecTest);
  } else if (!recvd(MessageFilename.Jumper3) && Player.skills.hacking >= 325) {
    sendMessage(MessageFilename.Jumper3);
  } else if (!recvd(MessageFilename.Jumper4) && Player.skills.hacking >= 490) {
    sendMessage(MessageFilename.Jumper4);
  } else if (!recvd(MessageFilename.BitRunnersTest) && Player.skills.hacking >= 500) {
    sendMessage(MessageFilename.BitRunnersTest);
  }
}

// This type ensures that all members of the MessageFilename enum are valid keys
const Messages: Record<MessageFilename, Message> = {
  //jump3R Messages
  [MessageFilename.Jumper0]: new Message(
    MessageFilename.Jumper0,
    "Sé que puedes sentirlo. Sé que lo estás buscando. " +
      "Es la razón por la que pasas noche tras " +
      "noche frente a tu computadora. \n\nEs real, yo lo he visto. Y puedo " +
      "ayudarte a encontrarlo. Pero no ahora. Aún no estás listo.\n\n" +
      "Usa este programa para seguir tu progreso:\n\n" +
      "El programa fl1ght.exe fue añadido a tu computadora home.\n\n" +
      "-jump3R",
  ),

  [MessageFilename.Jumper1]: new Message(
    MessageFilename.Jumper1,
    `Pronto se pondrá en contacto contigo un grupo de hackers conocido como ${FactionName.CyberSec}. ` +
      "Ellos pueden ayudarte en tu búsqueda. \n\n" +
      "Deberías unirte a ellos, ganarte su favor y " +
      "exprimirlos para conseguir sus Aumentos. Pero no confíes en ellos. " +
      "No son lo que aparentan. Nadie lo es.\n\n" +
      "-jump3R",
    FactionName.CyberSec,
  ),

  [MessageFilename.Jumper2]: new Message(
    MessageFilename.Jumper2,
    "No intentes salvar el mundo. No hay ningún mundo que salvar. Si " +
      "quieres encontrar la verdad, preocúpate únicamente por ti mismo. La ética y la " +
      `moral solo conseguirán que te maten. \n\nMantente atento a un grupo de hackers conocido como ${FactionName.NiteSec}.` +
      "\n\n-jump3R",
    FactionName.NiteSec,
  ),

  [MessageFilename.Jumper3]: new Message(
    MessageFilename.Jumper3,
    "Debes aprender a caminar antes de poder correr. Y debes " +
      `correr antes de poder volar. Busca a ${FactionName.TheBlackHand}. \n\n` +
      "I.I.I.I \n\n-jump3R",
    FactionName.TheBlackHand,
  ),

  [MessageFilename.Jumper4]: new Message(
    MessageFilename.Jumper4,
    "Para encontrar lo que buscas, debes comprender los bits. " +
      "Los bits están a nuestro alrededor. Los runners te ayudarán.\n\n" +
      "-jump3R",
    FactionName.BitRunners,
  ),

  //Messages from hacking factions
  [MessageFilename.CyberSecTest]: new Message(
    MessageFilename.CyberSecTest,
    "Te hemos estado observando. Tus habilidades son muy impresionantes. Pero estás " +
      "desperdiciando tu talento. Si te unes a nosotros, podrás darle un buen uso a tus capacidades y cambiar " +
      "el mundo para mejor. Si te unes a nosotros, desbloquearemos todo tu potencial. \n\n" +
      "Pero primero debes superar nuestra prueba. Encuentra e instala la puerta trasera (backdoor) en nuestro servidor. \n\n" +
      `-${FactionName.CyberSec}`,
    FactionName.CyberSec,
  ),

  [MessageFilename.NiteSecTest]: new Message(
    MessageFilename.NiteSecTest,
    "La gente dice que los gobiernos corruptos y las corporaciones gobiernan el mundo. " +
      "Sí, tal vez sea así. ¿Pero sabes a quién le temen todos en realidad? A personas " +
      "como nosotros. Porque no pueden esconderse de nosotros. Porque no pueden combatir sombras " +
      "e ideas con balas. \n\n" +
      "Únete a nosotros, y la gente también te temerá a ti. \n\n" +
      "Encuentra e instala la puerta trasera (backdoor) en nuestro servidor, avmnite-02h. Luego, nos pondremos en contacto contigo de nuevo." +
      `\n\n-${FactionName.NiteSec}`,
    FactionName.NiteSec,
  ),

  [MessageFilename.BitRunnersTest]: new Message(
    MessageFilename.BitRunnersTest,
    "Sabemos lo que estás haciendo. Sabemos qué te motiva. Sabemos " +
      "lo que estás buscando. \n\n " +
      "Podemos ayudarte a encontrar las respuestas.\n\n" +
      "run4theh111z",
    FactionName.BitRunners,
  ),

  //Messages to guide players to the daemon
  [MessageFilename.TruthGazer]: new Message(
    MessageFilename.TruthGazer,
    //"THE TRUTH CAN NO LONGER ESCAPE YOUR GAZE"
    "@&*($#@&__TH3__#@A&#@*)__TRU1H__(*)&*)($#@&()E&R)W&\n" +
      "%@*$^$()@&$)$*@__CAN__()(@^#)@&@)#__N0__(#@&#)@&@&(\n" +
      "*(__LON6ER__^#)@)(()*#@)@__ESCAP3__)#(@(#@*@()@(#*$\n" +
      "()@)#$*%)$#()$#__Y0UR__(*)$#()%(&(%)*!)($__GAZ3__#(",
    FactionName.Daedalus,
  ),

  [MessageFilename.RedPill]: new Message(
    MessageFilename.RedPill,
    //"FIND THE-CAVE"
    "@)(#V%*N)@(#*)*C)@#%*)*V)@#(*%V@)(#VN%*)@#(*%\n" +
      ")@B(*#%)@)M#B*%V)____FIND___#$@)#%(B*)@#(*%B)\n" +
      "@_#(%_@#M(BDSPOMB__THE-CAVE_#)$(*@#$)@#BNBEGB\n" +
      "DFLSMFVMV)#@($*)@#*$MV)@#(*$V)M#(*$)M@(#*VM$)",
    FactionName.Daedalus,
  ),
};

export { Messages, checkForMessagesToSend, showMessage };
