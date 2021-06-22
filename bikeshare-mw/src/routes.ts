import express from 'express';
import mysql, { RowDataPacket } from "mysql2/promise";
import { average } from './Utils';

interface IStation extends mysql.OkPacket {
    id: number,
    station_name: string,
    lat: number,
    lon: number,
    station_address: string,
    capacity: string
}

interface IInstance extends mysql.OkPacket {
    station_id: number;
    time_stamp: string;
    available_mec: number;
    available_elec: number;
}

interface IStationHourData {
    [hour: string]: Array<number>;
}

interface IStationHourAvg {
    [hour: number]: number;
}

class Routes {
    private router: express.Express;
    private db: mysql.Connection;
    private total_bikes: number = 0;
    constructor(router: express.Express, db: mysql.Connection) {
        this.router = router;
        this.db = db;
        this.exposeAPIs();
    }

    private exposeAPIs(): void {
        this.getStation();
        this.getStationDayAverages();
        this.getStations();
        this.getTotalMecBikes();
    }

    private getStations(): void {
        this.router.get('/stations', async (req, res) => {
            const [rows,fields] = await this.db.query<IStation[]>("Select * FROM Stations;");
            res.send(rows);
        });
    }

    private getStation(): void {
        this.router.get('/station/:station_id', async (req, res) => {
            const query = `Select * FROM Stations WHERE id=${req.params.station_id};`;
            const [rows,fields] = await this.db.query<IInstance[]>(query);
            if(rows.length > 1) {
                res.status(500);
                res.send("Error occurred");
                throw Error(`Database has multiple stations with the same ID: ${req.params.station_id}`);
            }
            res.send(rows[0]);
        });
    }

    private static makeBaseStation() {
        const baseStation: IStationHourData = {}
        const hourArray = Array.from(Array(24).keys());
        for (const hour in hourArray) baseStation[hour] = [];
        return baseStation;
    }

    private getStationDayAverages(): void {
        this.router.get('/stationAverages/:station_id', async (req, res) => {
            const query = `Select * FROM Instances WHERE station_id=${req.params.station_id};`;
            const [instances,fields] = await this.db.query<IInstance[]>(query);

            const stationMecData: IStationHourData = Routes.makeBaseStation();
            const stationElecData: IStationHourData = Routes.makeBaseStation();
            instances.forEach(instance => {
                const date = new Date(instance.time_stamp);
                const hour = "" + date.getHours();
                
                stationMecData[hour].push(instance.available_mec);
                stationElecData[hour].push(instance.available_elec);
            });

            const stationMecAvg: IStationHourAvg = {}
            const stationElecAvg: IStationHourAvg = {}
            for (const hourRaw in Array.from(Array(24).keys())) {
                const hour = parseInt(hourRaw);
                stationMecAvg[hour] = average(stationMecData[hour]);
                stationElecAvg[hour] = average(stationElecData[hour]);
            }
            res.send([stationMecAvg, stationElecAvg]);
        });
    }

    private getTotalMecBikes() {
        this.router.get('/totalMecBikes/', async (req, res) => {
            let query = `Select id FROM Stations;`;
            const [ids,fields] = await this.db.query<RowDataPacket[]>(query);
            let total_bikes = 0;
            let counter = 0;
            for (const id of ids) {
                counter += 1;
                query = `Select available_mec FROM Instances where station_id=${id.id};`;
                const [bikeCounts,fields2] = await this.db.query<RowDataPacket[]>(query);
                const lastBikeCount = parseInt(bikeCounts.slice(-1).pop()?.available_mec);
                total_bikes += lastBikeCount;
                console.log(`Adding: ${lastBikeCount}; ${counter}/${ids.length}`);
            }
            console.log(`${total_bikes}: total_bikes`);
            res.send("" + total_bikes);
        });
    }
}

export default Routes;