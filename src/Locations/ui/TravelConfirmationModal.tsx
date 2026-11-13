import React from "react";
import { CONSTANTS } from "../../Constants";
import { Money } from "../../ui/React/Money";
import { Modal } from "../../ui/React/Modal";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

interface IProps {
  city: string;
  travel: () => void;

  open: boolean;
  onClose: () => void;
}

export function TravelConfirmationModal(props: IProps): React.ReactElement {
  function travel(): void {
    props.travel();
  }

  return (
    <Modal open={props.open} onClose={props.onClose}>
      <Typography>
        ¿Deseas viajar a {props.city}? El viaje costará{" "}
        <Money money={CONSTANTS.TravelCost} forPurchase={true} />.
      </Typography>
      <br />
      <br />
      <Button onClick={travel}>
        <Typography>Viajar</Typography>
      </Button>
      <Button onClick={() => props.onClose()}>Cancelar</Button>
    </Modal>
  );
}
