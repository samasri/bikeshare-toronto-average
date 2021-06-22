#!/usr/bin/env python3

import json
from os import listdir
from os.path import isfile, join

onlyfiles = []
for f in listdir("./data/data"):
    path = join("./data/data", f)
    if isfile(path) and ".status" in path: onlyfiles.append(path)

onlyfiles.sort()
sql_stmts = []
for f in onlyfiles:
    f = open(f).read()
    f = json.loads(f)
    data_points = f["data"]
    max_station_id = -1
    max_timestamp = -1
    max_available_mec = -1
    max_available_elec = -1
    for data_point in data_points:
        stmt = 'INSERT IGNORE INTO Instances VALUES (%s,"%s",%s,%s);' % (
            data_point['station_id'],
            data_point['timestamp'],
            data_point['available_mech_bikes'],
            data_point['available_electric_bikes']
        )
        sql_stmts.append(stmt)
        max_station_id = max(len(data_point['station_id']), max_station_id)
        max_timestamp = max(len(data_point['timestamp']), max_timestamp)
        max_available_mec = max(len(data_point['available_mech_bikes']), max_available_mec)
        max_available_elec = max(len(data_point['available_electric_bikes']), max_available_elec)
        


header = '''CREATE TABLE Instances (
    station_id INT(%d),
    time_stamp VARCHAR(%d),
    available_mec INT(%d),
    available_elec INT(%d),
    CONSTRAINT station_id FOREIGN KEY (station_id) REFERENCES Stations(id)
);''' % (max_station_id,max_timestamp, max_available_mec, max_available_elec)

out = open('instances.sql','w')
out.write("USE  bikeshare_db;\n")
out.write(header + "\n")
for stmt in sql_stmts: out.write(stmt + "\n")