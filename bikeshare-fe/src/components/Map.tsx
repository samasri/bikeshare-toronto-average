import React from 'react';
import { LatLngExpression } from 'leaflet';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { IStation } from '../Interfaces';
import MarkerClusterGroup from "react-leaflet-cluster";

interface IMarkerPosition {
  id: number;
  lat: number;
  lng: number;
}

interface IMapProps {
  stations: Array<IStation>,
  showModal: () => void;
  setStationId: (stationId: number) => void;
}

export const Map = (props: IMapProps) => {

  const StationMarker = (station: IMarkerPosition) => {
    const rand = Math.random() * (100);
    const marker_key = station.lat + ":" + station.lng + ":" + rand;
    return (
    <Marker
      position={{ lat: station.lat, lng: station.lng }}
      key={marker_key}
      eventHandlers={{
        click: (e: any) => {
          props.setStationId(station.id);
          props.showModal();
        }
      }}
    >
    {/* <Popup>
      <p>Blo bla</p>
      <p>Bla bloe</p>
      <Graph />
    </Popup> */}
    </Marker>
    );
  }

  const markers: Array<JSX.Element> = [];
  for (const station_raw of props.stations) {
    const station: IStation = station_raw;
    const markerConfig = {
      id: station.id,
      lat: station.lat,
      lng: station.lon
    }
    markers.push(
      StationMarker(markerConfig)
    );
  }

  const initial_position: LatLngExpression = {
    lat: 43.6484038,
    lng: -79.3881403
  }

  return (
    <>
      <MapContainer
        style={{ height: "500px" }}
        center={initial_position}
        zoom={13}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MarkerClusterGroup>
          {markers}
        </MarkerClusterGroup>
      </MapContainer>
    </>
  )
}

export default Map;