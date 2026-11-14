/**
 * React Component for the Hacknet Node UI
 *
 * Displays general information about Hacknet Nodes
 */
import React from "react";
import Typography from "@mui/material/Typography";

interface IProps {
  hasHacknetServers: boolean;
}

export function GeneralInfo(props: IProps): React.ReactElement {
  return (
    <>
      <Typography>
        La Hacknet es una red global y descentralizada de máquinas. Es utilizada por hackers de todo el mundo para
        compartir potencia informática de forma anónima y realizar ciberataques distribuidos sin temor a ser rastreados.
      </Typography>
      <br />
      {!props.hasHacknetServers ? (
        <>
          <Typography>
            {`Aquí puedes comprar un Nodo de Hacknet, una máquina especializada que puede conectarse ` +
              `y aportar sus recursos a la red Hacknet. Esto te permite obtener ` +
              `un pequeño porcentaje de las ganancias de los hackeos realizados en la red. En esencia, ` +
              `estás alquilando la potencia de cálculo de tu Nodo.`}
          </Typography>
          <Typography>
            {`Cada Nodo de Hacknet que compres te generará dinero pasivamente. Cada Nodo de Hacknet ` +
              `se puede mejorar para aumentar su potencia informática y, con ello, ` +
              `las ganancias que obtienes de él.`}
          </Typography>
        </>
      ) : (
        <>
          <Typography>
            {`Aquí puedes comprar un Servidor de Hacknet, una versión mejorada del Nodo de Hacknet. ` +
              `Los Servidores de Hacknet realizarán cálculos y operaciones en la red, ganando ` +
              `hashes. Los hashes se pueden gastar en una variedad de mejoras diferentes.`}
          </Typography>
          <Typography>
            {`Los Servidores de Hacknet también se pueden utilizar para ejecutar scripts. Sin embargo, ejecutar scripts ` +
              `en un servidor reducirá su tasa de hashes (hashes generados por segundo). La tasa de hashes de un Servidor de Hacknet ` +
              `se reducirá según el porcentaje de RAM que ese Servidor esté utilizando para ejecutar ` +
              `scripts.`}
          </Typography>
        </>
      )}
    </>
  );
}
