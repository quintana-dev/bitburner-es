import React from "react";

import Typography from "@mui/material/Typography";

import { Settings } from "../../Settings/Settings";

export function NoOpenScripts() {
  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <span style={{ color: Settings.theme.primary, fontSize: "20px", textAlign: "center" }}>
        <Typography variant="h4">No hay archivos abiertos</Typography>
        <Typography variant="h5">
          Usa <code>nano NOMBRE_ARCHIVO</code> en
          <br />
          la terminal para abrir archivos
        </Typography>
      </span>
    </div>
  );
}
