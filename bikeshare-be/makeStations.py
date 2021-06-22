#!/usr/bin/env python3

import json

station_info = open("data/station_information").read()
station_info = json.loads(station_info)
stations = station_info['data']['stations']
max_id_len = -1
max_name_len = -1
max_lat = -1
max_lon = -1
max_address_len = -1
max_capacity_len = -1
sql_stmts = []
for station in stations:
    stmt = 'INSERT INTO Stations VALUES (%s,"%s",%s,%s,"%s","%s");' % (
        station['station_id'],
        station['name'],
        station['lat'],
        station['lon'],
        station['address'],
        station['capacity']
    )
    sql_stmts.append(stmt)
    max_id_len = max(max_id_len,len(str(station['station_id'])))
    max_name_len = max(max_name_len,len(str(station['name'])))
    max_lat = max(max_lat,len(str(station['lat'])))
    max_lon = max(max_lon,len(str(station['lon'])))
    max_address_len = max(max_address_len,len(str(station['address'])))
    max_capacity_len = max(max_capacity_len,len(str(station['capacity'])))


header = '''CREATE TABLE Stations (
    id INT(%d) PRIMARY KEY,
    station_name VARCHAR(%d) NOT NULL,
    lat DECIMAL(17,15) NOT NULL,
    lon DECIMAL(17,15) NOT NULL,
    station_address VARCHAR(%d) NOT NULL,
    capacity INT(%d) NOT NULL
);''' % (max_id_len,max_name_len,max_address_len,max_capacity_len)

out = open('stations.sql','w')
out.write("USE  bikeshare_db;\n")
out.write(header + "\n")
for stmt in sql_stmts: out.write(stmt + "\n")