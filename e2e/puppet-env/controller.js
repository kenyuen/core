const { Worker } = require('worker_threads');

const gateways = [];

const startGateway = (data) => {
    return new Promise((resolve, reject) => {
        const port = data.config.port;

        if (gateways.some((gw) => gw.port === port)) {
            throw new Error(`Cannot start a gateway at port: ${port}, because there is already a running gateway there`);
        }

        // this path is relative to the repo root
        const worker = new Worker("./e2e/puppet-env/gateway.js", { workerData: { port } });

        worker.on('message', (msg) => {

            if (msg && msg.success) {
                gateways.push({ worker, port });

                resolve({ success: true });

                return;
            }

            if (msg && msg.gw) {
                console.log(msg.gw);
                return;
            }
        });

        worker.on('error', reject);

    });
};

const stopGateway = async (data) => {
    const port = data.config.port;

    if (gateways.some((gw) => gw.port !== port)) {
        throw new Error(`Cannot stop a gateway at port: ${port}, because there is no running gateway at that port`);
    }

    const foundWorker = gateways.find((gw) => gw.port === port).worker;

    await foundWorker.terminate();

    return { success: true };
}

const commands = {
    "startGateway": { execute: startGateway },
    "stopGateway": { execute: stopGateway }
};

const handleHttpCommand = async (command, data) => {

    const foundCommand = commands[command];

    if (!foundCommand) {
        throw new Error(`Unrecognized command: ${command}`);
    }

    const commandResult = await foundCommand.execute(data);

    return commandResult;
};

module.exports = {
    handleHttpCommand
}