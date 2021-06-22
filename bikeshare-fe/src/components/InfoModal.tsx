import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import { IStation } from '../Interfaces';
import Graph from "./Graph"
import { middlewareIp } from '../Utils';

interface InfoModalProps {
  show: boolean,
  hide: () => void;
  station: IStation | undefined;
}

const InfoModal = (props: InfoModalProps) => {
  const [mecBikeAvail, setMecBikeAvail] = useState<number[]>([]);
  const [elecBikeAvail, setElecBikeAvail] = useState<number[]>([]);

  const hourArray = Array.from(Array(24).keys());

  useEffect(() => {
    const hourArray = Array.from(Array(24).keys());
    const getStationAverages = async () => {
      if(props.station) {
        const resp = await axios.get(`${middlewareIp}/stationAverages/${props.station.id}`);
        const [mecBikeData, elecBikeData]: [number[],number[]] = resp.data;
        setMecBikeAvail(hourArray.map(hour => { return mecBikeData[hour]; }));
        setElecBikeAvail(hourArray.map(hour => { return elecBikeData[hour]; }));
      }
    }
    getStationAverages();
  }, [props.station]);

  return (
    <Modal
        show={props.show}
        onHide={(e: any) => props.hide()}
        backdrop="static"
        keyboard={true}
      >
        <Modal.Header closeButton>
          <Modal.Title>{props.station?.station_name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Address: {props.station?.station_address}</p>
          <p>Station capacity: {props.station?.capacity}</p>
          <p>Mechanical Bikes Availability:</p>
          <Graph 
            labels={hourArray}
            data={mecBikeAvail}
          />
          <p>Electrical Bikes Availability:</p>
          <Graph 
            labels={hourArray}
            data={elecBikeAvail}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={(e: any) => props.hide()}>
            Close
          </Button>
          <Button variant="primary">Understood</Button>
        </Modal.Footer>
      </Modal>
  )
}

export default InfoModal;