import React, { useEffect } from "react";

import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { ITutorialEvents } from "./ITutorialEvents";
import { CopyableText } from "../React/CopyableText";

import ListItem from "@mui/material/ListItem";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import LastPageIcon from "@mui/icons-material/LastPage";
import HelpIcon from "@mui/icons-material/Help";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import StorageIcon from "@mui/icons-material/Storage";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import { Theme } from "@mui/material/styles";
import { makeStyles } from "tss-react/mui";

import {
  iTutorialPrevStep,
  iTutorialNextStep,
  ITutorial,
  iTutorialSteps,
  iTutorialEnd,
} from "../../InteractiveTutorial";
import { useRerender } from "../React/hooks";
import { Settings } from "../../Settings/Settings";
import { DocumentationLink } from "../React/DocumentationLink";
import { defaultNsApiPage } from "../React/Documentation";

interface IContent {
  content: React.ReactElement;
  canNext: boolean;
}

const useStyles = makeStyles()((theme: Theme) => ({
  textfield: {
    borderBottom: "1px solid " + theme.palette.primary.main,
  },
  code: {
    whiteSpace: "pre",
    backgroundColor: theme.palette.background.paper,
  },
}));

export function InteractiveTutorialRoot(): React.ReactElement {
  const { classes } = useStyles();
  const rerender = useRerender();

  const tutorialScriptName = `n00dles.js`;

  const contents: Record<string, IContent | undefined> = {
    [iTutorialSteps.Start as number]: {
      content: (
        <>
          <Typography>
            ¡Te damos la bienvenida a Bitburner, un juego de rol incremental de temática cyberpunk! El juego se desarrolla en un
            futuro oscuro y distópico... El año es 2077...
            <br />
            <br />
            Este tutorial te mostrará los fundamentos del juego. Puedes omitirlo en cualquier momento.
            <br />
            <br />
            Puedes repetir este tutorial cuando quieras yendo a la pestaña de Opciones y seleccionando "Reiniciar tutorial".
            <br />
            <br />
            También puedes colapsar este panel para ocultar el tutorial temporalmente.
          </Typography>
        </>
      ),
      canNext: true,
    },
    [iTutorialSteps.GoToCharacterPage as number]: {
      content: (
        <>
          <Typography>Empecemos dirigiéndonos a la página de Estadísticas. Haz clic en</Typography>
          <ListItem>
            <EqualizerIcon color={"error"} />
            <Typography color={"error"}>Estadísticas</Typography>
          </ListItem>

          <Typography>en el menú de navegación principal (en el lateral izquierdo de la pantalla)</Typography>
        </>
      ),
      canNext: false,
    },
    [iTutorialSteps.CharacterPage as number]: {
      content: (
        <>
          <ListItem>
            <EqualizerIcon color={"primary"} />
            <Typography color={"primary"}>Estadísticas</Typography>
          </ListItem>
          <Typography>
            muestra información crucial sobre tu progreso, como tus habilidades, dinero y multiplicadores de bonificación.
          </Typography>
        </>
      ),
      canNext: true,
    },
    [iTutorialSteps.CharacterGoToTerminalPage as number]: {
      content: (
        <>
          <Typography>Vamos a la terminal de tu computadora haciendo clic en</Typography>
          <ListItem>
            <LastPageIcon color={"error"} />
            <Typography color={"error"}>Terminal</Typography>
          </ListItem>
          <Typography>en el menú de navegación principal.</Typography>
        </>
      ),
      canNext: false,
    },
    [iTutorialSteps.TerminalIntro as number]: {
      content: (
        <>
          <ListItem>
            <LastPageIcon color={"primary"} />
            <Typography color={"primary"}>Terminal</Typography>
          </ListItem>
          <Typography>
            se utiliza para comunicarte con tu computadora local así como con el resto de servidores del mundo.
          </Typography>
        </>
      ),
      canNext: true,
    },
    [iTutorialSteps.TerminalHelp as number]: {
      content: (
        <>
          <Typography>Vamos a probarla. Empieza ingresando:</Typography>
          <Typography classes={{ root: classes.textfield }}>{"[home /]> help"}</Typography>
          <Typography>(No olvides pulsar Enter tras escribir el comando)</Typography>
        </>
      ),
      canNext: false,
    },
    [iTutorialSteps.TerminalLs as number]: {
      content: (
        <>
          <Typography classes={{ root: classes.textfield }}>{"[home /]> help"}</Typography>
          <Typography>
            muestra una lista de todos los comandos de terminal disponibles, cómo utilizarlos y una descripción de su función.{" "}
            <br />
            <br />
            Probemos otro comando. Ingresa:
          </Typography>

          <Typography classes={{ root: classes.textfield }}>{"[home /]> ls"}</Typography>
          <Typography>
            <br />( "ls" es la abreviatura de "list" )
          </Typography>
        </>
      ),
      canNext: false,
    },
    [iTutorialSteps.TerminalScan as number]: {
      content: (
        <>
          <Typography classes={{ root: classes.textfield }}>{"[home /]> ls"}</Typography>
          <Typography>
            {" "}
            es un comando básico que lista los archivos del equipo. Ahora mismo muestra que tienes un programa llamado{" "}
            NUKE.exe en tu computadora. En breve veremos qué hace. <br />
            <br />
            Usando la terminal de tu máquina local, puedes conectarte a otros equipos en todo el mundo. Vamos a hacerlo
            ahora ingresando:
          </Typography>
          <Typography classes={{ root: classes.textfield }}>{"[home /]> scan"}</Typography>
        </>
      ),
      canNext: false,
    },
    [iTutorialSteps.TerminalScanAnalyze1 as number]: {
      content: (
        <>
          <Typography classes={{ root: classes.textfield }}>{"[home /]> scan"}</Typography>
          <Typography>
            muestra todas las conexiones de red disponibles. En otras palabras, lista los servidores a los que te puedes
            conectar directamente desde tu máquina actual. Cada servidor se identifica por su nombre de host (hostname). <br />
            <br />
            Eso está muy bien, pero hay demasiados servidores. ¿A cuál deberías dirigirte?{" "}
          </Typography>

          <Typography classes={{ root: classes.textfield }}>{"[home /]> scan-analyze"}</Typography>
          <Typography>ofrece información más detallada sobre los servidores en la red. ¡Pruébalo ahora!</Typography>
        </>
      ),
      canNext: false,
    },
    [iTutorialSteps.TerminalScanAnalyze2 as number]: {
      content: (
        <>
          <Typography classes={{ root: classes.textfield }}>{"[home /]> scan-analyze"}</Typography>
          <Typography>
            muestra información detallada sobre cada servidor al que puedes conectarte (servidores a una distancia de
            un nodo). <br />
            <br /> También es posible ejecutar scan-analyze con mayor profundidad de red. Probemos con una profundidad de dos
            mediante el comando:{" "}
          </Typography>

          <Typography classes={{ root: classes.textfield }}>{"[home /]> scan-analyze 2"}</Typography>
        </>
      ),
      canNext: false,
    },
    [iTutorialSteps.TerminalConnect as number]: {
      content: (
        <>
          <Typography>
            Ahora puedes ver información sobre todos los servidores a una distancia de hasta dos nodos, además de entender cómo
            llegar a ellos a través de la red. Solo puedes conectarte directamente a un servidor que esté a un nodo de distancia. Para
            conectarte a un equipo, utiliza:
          </Typography>
          <Typography classes={{ root: classes.textfield }}>{"[home /]> connect hostname"}</Typography>

          <Typography>A partir de los resultados de </Typography>
          <Typography classes={{ root: classes.textfield }}>{"[home /]> scan-analyze 2"}</Typography>

          <Typography>
            {" "}
            podemos ver que el servidor n00dles está a solo un nodo de distancia. Conectémonos a él ahora usando:
          </Typography>

          <Typography classes={{ root: classes.textfield }}>{"[home /]> connect n00dles"}</Typography>
        </>
      ),
      canNext: false,
    },
    [iTutorialSteps.TerminalAnalyze as number]: {
      content: (
        <>
          <Typography>
            ¡Ya estás conectado a otra máquina! ¿Qué podemos hacer ahora? ¡Hackearla!
            <br />
            <br /> En el año 2077, el dinero se ha digitalizado y descentralizado por completo. Las personas y las corporaciones
            almacenan sus fondos en servidores y computadoras. Empleando tus habilidades de hackeo, puedes penetrar en los servidores
            para sustraer dinero y ganar experiencia. <br />
            <br />
            Antes de intentar hackear un servidor, conviene ejecutar un diagnóstico con:{" "}
          </Typography>
          <Typography classes={{ root: classes.textfield }}>{"[n00dles /]> analyze"}</Typography>
        </>
      ),
      canNext: false,
    },
    [iTutorialSteps.TerminalNuke as number]: {
      content: (
        <>
          <Typography>Cuando </Typography>
          <Typography classes={{ root: classes.textfield }}>{"[n00dles /]> analyze"}</Typography>

          <Typography>
            termine de ejecutarse mostrará información clave para hackear el servidor. <br />
            <br /> Para este servidor, el nivel de habilidad de hackeo requerido es de solo 1, lo que significa que puedes hackearlo
            ahora mismo. Sin embargo, para hackear un servidor primero necesitas obtener acceso root (administrador). El programa NUKE.exe
            que vimos antes en tu computadora local es un virus que te otorgará acceso root a la máquina si cuenta con suficientes puertos abiertos.
          </Typography>
          <Typography classes={{ root: classes.textfield }}>{"[n00dles /]> analyze"}</Typography>

          <Typography>
            {" "}
            indica que en esta máquina no se requiere ningún puerto abierto para que el virus NUKE funcione, así que adelante y
            ejecútalo con:{" "}
          </Typography>
          <Typography classes={{ root: classes.textfield }}>{"[n00dles /]> run NUKE.exe"}</Typography>

          <Typography></Typography>
        </>
      ),
      canNext: false,
    },
    [iTutorialSteps.TerminalManualHack as number]: {
      content: (
        <>
          <Typography>¡Ahora tienes acceso root! Puedes hackear el servidor usando: </Typography>
          <Typography classes={{ root: classes.textfield }}>{"[n00dles /]> hack"}</Typography>

          <Typography> Inténtalo ahora.</Typography>
        </>
      ),
      canNext: true,
    },
    [iTutorialSteps.TerminalHackingMechanics as number]: {
      content: (
        <Typography component="div">
          Ahora estás hackeando el servidor. Realizar un hackeo requiere tiempo y tiene una probabilidad de éxito determinada.
          Tanto el tiempo como la probabilidad dependen de varios factores, principalmente tu habilidad de hackeo y el nivel de seguridad
          del servidor.
          <br />
          <br />
          Si el intento de hackeo tiene éxito, robarás un porcentaje del dinero total del servidor. Dicho porcentaje depende de tu
          habilidad y de la seguridad del objetivo.
          <br />
          <br />
          El dinero en un servidor no es infinito. Si hackeas constantemente un servidor hasta vaciarlo, experimentarás rendimientos decrecientes.
          Para contrarrestarlo, necesitarás usar:{" "}
          <Typography classes={{ root: classes.textfield }}>{"[n00dles /]> grow"}</Typography>
          que engaña a la corporación para que inyecte más fondos en su servidor, y:{" "}
          <Typography classes={{ root: classes.textfield }}>{"[n00dles /]> weaken"}</Typography>
          que reduce la seguridad del servidor y acelera la velocidad de hack y grow.
        </Typography>
      ),
      canNext: true,
    },
    [iTutorialSteps.TerminalGoHome as number]: {
      content: (
        <>
          <Typography>Desde cualquier servidor puedes volver a tu equipo local usando:</Typography>
          <Typography classes={{ root: classes.textfield }}>{"[n00dles /]> home"}</Typography>

          <Typography>¡Regresemos a casa antes de crear nuestro primer script!</Typography>
        </>
      ),
      canNext: false,
    },
    [iTutorialSteps.TerminalCreateScript as number]: {
      content: (
        <>
          <Typography>
            El hackeo es la mecánica principal del juego y es indispensable para progresar. Sin embargo, no vas a querer
            hackear manualmente todo el tiempo. ¡Puedes automatizar todo el proceso programando scripts!
            <br />
            <br />
            Para crear un script nuevo o modificar uno existente, utiliza:{" "}
          </Typography>
          <Typography classes={{ root: classes.textfield }}>{"[home /]> nano"}</Typography>

          <Typography>
            Los scripts deben terminar con una extensión válida (.js, .jsx, .ts, .tsx). Creemos un script ahora escribiendo:
          </Typography>
          <Typography classes={{ root: classes.textfield }}>{`[home /]> nano ${tutorialScriptName}`}</Typography>
        </>
      ),
      canNext: false,
    },
    [iTutorialSteps.TerminalEditScript as number]: {
      content: (
        <>
          <Typography>
            Este es el editor de scripts. Puedes usarlo para programar tus herramientas. Haz clic sobre este código para copiarlo y
            luego pégalo en el editor:
          </Typography>
          <br />
          <Typography component="div" classes={{ root: classes.code }}>
            {
              <CopyableText
                value={`/** @param {NS} ns */
export async function main(ns) {
  while (true) {
    await ns.hack("n00dles");
  }
}`}
              />
            }
          </Typography>
          <br />
          <Typography>
            Para cualquier persona con nociones elementales de programación, este código resultará directo. Este script hackeará en bucle continuo el servidor n00dles.
            <br />
            <br />
            Usa la herramienta de búsqueda en la parte inferior para consultar rápidamente la documentación de cualquier API de NS.
            <br />
            <br />
            Para consultar la <DocumentationLink page={defaultNsApiPage}>documentación de la API de NS</DocumentationLink>, pulsa el enlace en la parte inferior.
            <br />
            <br />
            Para guardar y cerrar el editor de scripts, presiona el botón inferior.
          </Typography>
        </>
      ),
      canNext: false,
    },
    [iTutorialSteps.TerminalFree as number]: {
      content: (
        <>
          <Typography>
            Ahora ejecutaremos el script. Los scripts requieren cierta cantidad de memoria RAM para operar, y pueden correr en cualquier
            máquina donde tengas acceso root. Distintos servidores disponen de diferentes cantidades de RAM. También puedes comprar más RAM
            para tu servidor local (home).
            <br />
            <br />
            Para comprobar cuánta memoria RAM libre hay en esta máquina, ingresa:
          </Typography>
          <Typography classes={{ root: classes.textfield }}>{"[home /]> free"}</Typography>
        </>
      ),
      canNext: false,
    },
    [iTutorialSteps.TerminalRunScript as number]: {
      content: (
        <>
          <Typography>
            Disponemos de 8 GB de RAM libre en esta máquina, lo cual es suficiente para correr nuestro script. Ejecutémoslo con:
          </Typography>
          <Typography classes={{ root: classes.textfield }}>{`[home /]> run ${tutorialScriptName}`}</Typography>
        </>
      ),
      canNext: false,
    },
    [iTutorialSteps.TerminalGoToActiveScriptsPage as number]: {
      content: (
        <>
          <Typography>
            ¡Tu script ya se está ejecutando! Operará continuamente en segundo plano y se detendrá solo si el código llega a concluir
            (el script {tutorialScriptName} nunca terminará porque ejecuta un bucle infinito). <br />
            <br />
            Estos scripts te generarán ingresos y experiencia de hackeo de forma pasiva. Además, continuarán ganando dinero y
            experiencia mientras estés desconectado del juego, aunque a una tasa ligeramente menor. <br />
            <br />
            Revisemos las estadísticas de nuestros scripts en ejecución haciendo clic en:{" "}
          </Typography>
          <ListItem>
            <StorageIcon color={"error"} />
            <Typography color={"error"}>Scripts Activos</Typography>
          </ListItem>
        </>
      ),
      canNext: false,
    },
    [iTutorialSteps.ActiveScriptsPage as number]: {
      content: (
        <>
          <Typography>
            Esta pantalla muestra información sobre todos los scripts que tienes en funcionamiento a lo largo de cada servidor. Puedes
            emplearla para medir el rendimiento de tus automatizaciones.
            <br />
            <br />
            Haz clic en Home para visualizar los scripts que corren en él.
            <br />
            <br />
            Luego haz clic en n00dles.js para consultar la información del script.
            <br />
            <br />
            Regresemos a la:
          </Typography>
          <ListItem>
            <LastPageIcon color={"error"} />
            <Typography color={"error"}>Terminal</Typography>
          </ListItem>
        </>
      ),
      canNext: false,
    },
    [iTutorialSteps.ActiveScriptsToTerminal as number]: {
      content: (
        <>
          <Typography>
            Un último detalle sobre los scripts: cada proceso activo genera un registro (log) que detalla sus operaciones. Podemos
            consultar estos registros usando el comando tail. Hazlo ahora para el script que acabamos de iniciar escribiendo:{" "}
          </Typography>
          <Typography classes={{ root: classes.textfield }}>{`[home /]> tail ${tutorialScriptName}`}</Typography>
        </>
      ),
      canNext: false,
    },
    [iTutorialSteps.TerminalTailScript as number]: {
      content: (
        <>
          <Typography>
            El registro de este script mostrará muy poco por el momento (o podría estar vacío) dado que acaba de comenzar a ejecutarse...
            ¡pero vuelve a revisarlo en un par de minutos! <br />
            <br />
            Esto cubre los fundamentos del hackeo. Para aprender más sobre programación de scripts, selecciona:
          </Typography>
          <ListItem>
            <HelpIcon color={"primary"} />
            <Typography color={"primary"}>Documentación</Typography>
          </ListItem>
          <Typography>
            en el menú de navegación principal para consultar las guías.
            <br />
            <br />
            ¡Por ahora, pasemos a explorar otras áreas!
          </Typography>
        </>
      ),
      canNext: true,
    },
    [iTutorialSteps.GoToHacknetNodesPage as number]: {
      content: (
        <>
          <Typography>
            El hackeo no es la única vía para obtener dinero. Otra forma pasiva de generar ingresos es adquiriendo y mejorando
            Nodos de Hacknet. Dirígete a:
          </Typography>
          <ListItem>
            <AccountTreeIcon color={"error"} />
            <Typography color={"error"}>Hacknet</Typography>
          </ListItem>
          <Typography>a través del menú de navegación principal.</Typography>
        </>
      ),
      canNext: false,
    },
    [iTutorialSteps.HacknetNodesIntroduction as number]: {
      content: (
        <Typography>
          Aquí puedes comprar nuevos Nodos de Hacknet y mejorar los que ya posees. Adquiramos uno nuevo ahora.
        </Typography>
      ),
      canNext: true,
    },
    [iTutorialSteps.HacknetNodesGoToWorldPage as number]: {
      content: (
        <>
          <Typography>
            ¡Acabas de adquirir un Nodo de Hacknet! Este nodo te generará dinero pasivamente con el tiempo, tanto dentro del juego como
            desconectado. Cuando acumules suficientes fondos, podrás mejorar tu nodo abajo.
            <br />
            <br />
            Dirijámonos a:
          </Typography>
          <ListItem>
            <LocationCityIcon color={"error"} />
            <Typography color={"error"}>Ciudad</Typography>
          </ListItem>
        </>
      ),
      canNext: false,
    },
    [iTutorialSteps.WorldDescription as number]: {
      content: (
        <>
          <Typography>
            Esta página enumera todas las ubicaciones a las que puedes viajar actualmente. Cada lugar ofrece actividades e
            interacciones específicas. Hay una enorme cantidad de contenido en el mundo, ¡asegúrate de explorar y descubrir!
            <br />
            <br />
            Por último, haz clic en:
          </Typography>
          <ListItem>
            <HelpIcon color={"error"} />
            <Typography color={"error"}>Documentación</Typography>
          </ListItem>
        </>
      ),
      canNext: false,
    },
    [iTutorialSteps.DocumentationPageInfo as number]: {
      content: (
        <Typography component="div">
          Esta sección alberga numerosa documentación sobre las mecánicas y contenidos del juego. Sabemos que es mucha información,
          pero te recomendamos encarecidamente leerla (o al menos darle un vistazo) antes de sumergirte de lleno. Algunas páginas están
          bloqueadas al inicio y se irán desbloqueando a medida que progreses.
          <br />
          <br />
          Si haces clic en un enlace de estas páginas manteniendo pulsada la tecla Ctrl (tecla Control en teclados Mac), se abrirá en
          una pestaña nueva. Si juegas a la versión de Steam, el enlace se abrirá en tu navegador predeterminado.
          <br />
          <br />
          Te recomendamos consultar en especial las siguientes secciones:
          <ul>
            <li>
              La <DocumentationLink page="help/getting_started.md">Guía para principiantes</DocumentationLink> orienta a los nuevos
              jugadores a través de la mayor parte del juego temprano.
            </li>
            <li>
              La <DocumentationLink page={defaultNsApiPage}>documentación de la API de NS</DocumentationLink> contiene las referencias
              técnicas de todas las funciones de Netscript.
            </li>
            <li>
              Las <DocumentationLink page="help/faq.md">Preguntas frecuentes (FAQ)</DocumentationLink> resuelven las dudas más comunes
              al comenzar.
            </li>
          </ul>
          <Typography fontWeight="fontWeightBold">
            Esta página de documentación es el mejor lugar para obtener información actualizada, sobre todo si te quedas atascado. Si
            tienes dudas y no encuentras la solución aquí, no dudes en consultarnos en Discord.
          </Typography>
          <br />
          <Typography color={Settings.theme.warning}>
            La documentación en readthedocs está desactualizada y no recibe mantenimiento. ¡No la utilices!
          </Typography>
          <br />
          ¡Este es el final del tutorial! ¡Esperamos que disfrutes al máximo de Bitburner!
        </Typography>
      ),
      canNext: true,
    },
    [iTutorialSteps.End as number]: {
      content: <Typography></Typography>,
      canNext: true,
    },
  };

  useEffect(() => {
    return ITutorialEvents.subscribe(rerender);
  }, [rerender]);

  const step = ITutorial.currStep;
  const content = contents[step];
  if (content === undefined) throw new Error("error in the tutorial");
  return (
    <>
      <Paper square sx={{ maxWidth: "70vw", p: 2 }}>
        {content.content}
        <br />
        {step !== iTutorialSteps.DocumentationPageInfo && (
          <>
            {step !== iTutorialSteps.Start && (
              <Button onClick={iTutorialPrevStep} aria-label="previous" style={{ marginRight: "1em" }}>
                Anterior
              </Button>
            )}
            {(content.canNext || ITutorial.stepIsDone[step]) && (
              <Button onClick={iTutorialNextStep} aria-label="next">
                Siguiente
              </Button>
            )}
          </>
        )}
        <br />
        <br />
        <Button onClick={iTutorialEnd}>
          {step !== iTutorialSteps.DocumentationPageInfo ? "Salir del Tutorial" : "Finalizar Tutorial"}
        </Button>
      </Paper>
    </>
  );
}
