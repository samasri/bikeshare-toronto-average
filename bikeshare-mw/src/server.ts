import express from 'express';
// import config from "config";
import mysql from "mysql2/promise";
import Routes from './routes';
import cors from "cors";
import config from "config";

let con: mysql.Connection;
const app = express();

app.use(
    cors({
      origin: config.get("feIp"),
      methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    })
);

app.listen(3000, async () => {
    console.log('The application is listening on port 3000!');
    for(let i = 0; i < 10; i++) {
        try {
            con = await mysql.createConnection({
                host: "db",
                user: "user",
                password: "password",
                database: "bikeshare_db"
            });
        } catch (e) {
            console.log(`Connection failed (${i + 1} time${i == 0 ? '' : 's'}). Trying again in 30 seconds...`);
            await new Promise( resolve => setTimeout(resolve, 30000) );
            continue;
        }
        break;
    }
    console.log("Connection established!");
    new Routes(app, con);
});

app.get('/', (req, res) => {
    res.send('<h1>Welcome to the MW!</h1>');
});

export default app;