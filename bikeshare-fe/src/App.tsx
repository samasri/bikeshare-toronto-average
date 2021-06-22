import React, { useEffect, useState } from 'react';
import './App.css';
import { StatCard, StatCardWrapper } from './components/StatCard'
import { Map } from "./components/Map"
import InfoModal from "./components/InfoModal"
import { IStation } from './Interfaces';
import axios from 'axios';
import { middlewareIp } from './Utils';


function App() {
  const [stations, setStations] = useState<Array<IStation>>();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedStationId, setSelectedStationId] = useState<number>();
  const [selectedStation, setSelectedStation] = useState<IStation>();

  useEffect(() => {
    const getStations = async () => {
      const remoteStations = await axios.get(`${middlewareIp}/stations`);
      setStations(remoteStations.data);
    }
    getStations();
  }, []);

  useEffect(() => {
    stations?.forEach(station => {
      if(station.id === selectedStationId) {
        setSelectedStation(station);
        return;
      }
    });
  }, [stations,selectedStationId]);
  
  return (
    <>
    <h1 className="main-title">Toronto Bikeshare Dashboard</h1>
    <StatCardWrapper>
      <StatCard value={24} name='Bike Stations'/>
      <StatCard value={46}name='Electric Bikes'/>
      <StatCard value={46}name='Mechanical Bikes'/>
    </StatCardWrapper>
    <InfoModal
      show={modalVisible}
      hide={() => setModalVisible(false)}
      station={selectedStation}
    />
    <Map
      stations={stations ? stations : []}
      showModal={() => setModalVisible(true)}
      setStationId={setSelectedStationId}
    />
    </>
  );
}

export default App;
