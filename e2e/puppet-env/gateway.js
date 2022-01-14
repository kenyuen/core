const { parentPort, workerData } = require("worker_threads");
const GW = require("@glue42/gateway-ws");

// const defaultGwURL = `ws://localhost:${port}/gw`;

const start = async () => {
    const gateway = GW.create({ port: workerData.port });

    GW.configure_logging({
        level: "info",
        appender: (logInfo) => {
            const message = logInfo.output;
            const ll = logInfo.level;

            switch (ll) {
                case "trace":
                    // tslint:disable-next-line:no-console
                    // console.info(message);
                    break;
                case "debug":
                    // tslint:disable-next-line:no-console
                    // console.info(message);
                    break;
                case "info":
                    parentPort.postMessage({ gw: message });
                    // tslint:disable-next-line:no-console
                    //console.info(message);
                    break;
                case "warn":
                    parentPort.postMessage({ gw: message });
                    // tslint:disable-next-line: no-console
                    // console.warn(message);
                    break;
                case "error":
                    parentPort.postMessage({ gw: message });
                    // tslint:disable-next-line:no-console
                    // console.error(message);
                    break;
            }
        }
    });

    await gateway.start();
}

// necessary, in order to call onError in the main thread
process.on('unhandledRejection', err => {
    throw err;
});

start().then(() => parentPort.postMessage({ success: true }));
