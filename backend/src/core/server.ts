import express, { Express } from 'express';

import Config from '../constants/constants';

import { InitializeMiddleware } from './InitializeMiddleware';
import { InitializeRoutes } from './InitializeRoutes ';

export async function server() {
    let app: Express = express();

    let port = Config.PORT;

    await InitializeMiddleware.InitializeCommonMiddleware(app);
    await InitializeRoutes.Initialize(app);
    // await InitializeMiddleware.InitializeErrorHandlingMiddleware(app);

    const server = app.listen(port, () => {
        console.log(
            `Server  started listening on ${port} port.`
        )
    });

    process.on("SIGINT", () => {
        server.close();
        console.log("App finalizado");
    })

}