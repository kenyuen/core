import ServerProtocol from "./server";
import ClientProtocol from "./client";
import { Glue42Core } from "../../../../glue";
import ClientRepository from "../../client/repository";
import ServerRepository from "../../server/repository";
import Interop from "../../interop";
import { Protocol, InteropSettings } from "../../types";
import Connection from "../../../connection/connection";

export default function (instance: Glue42Core.AGM.Instance, connection: Connection, clientRepository: ClientRepository, serverRepository: ServerRepository, libConfig: InteropSettings, interop: Interop): Promise<Protocol> {
    const logger = libConfig.logger.subLogger("gw3-protocol");
    let resolveReadyPromise: ((p: Protocol) => void) | undefined;

    const readyPromise = new Promise<Protocol>((resolve) => {
        resolveReadyPromise = resolve;
    });

    // start domain join handshake
    const session = connection.domain("agm", ["subscribed"]);

    const server = new ServerProtocol(session, clientRepository, serverRepository, logger.subLogger("server"));
    const client = new ClientProtocol(session, clientRepository, logger.subLogger("client"));

    async function handleReconnect(): Promise<void> {
        // we're reconnecting
        logger.info("reconnected - will replay registered methods and subscriptions");

        const existingSubscriptions = client.drainSubscriptions();
        for (const sub of existingSubscriptions) {
            const methodInfo = sub.method;
            const params = Object.assign({}, sub.params);
            // remove handlers, otherwise they will be added twice
            logger.info(`trying to re-subscribe to method ${methodInfo.name}`);
            await interop.client.subscribe(methodInfo, params, undefined, undefined, sub);
        }

        // server side
        const registeredMethods = serverRepository.getList();
        serverRepository.reset();

        // replay server methods
        for (const method of registeredMethods) {
            const def = method.definition;
            logger.info(`re-publishing method ${def.name}`);
            if (method.stream) {
                // streaming method
                await interop.server.createStream(def, method.streamCallbacks, undefined, undefined, method.stream);
            } else if (method.theFunction && method.theFunction.userCallback) {
                await interop.register(def, method.theFunction.userCallback);
            } else if (method.theFunction && method.theFunction.userCallbackAsync) {
                await interop.registerAsync(def, method.theFunction.userCallbackAsync);
            }
        }
    }

    function handleInitialJoin() {
        if (resolveReadyPromise) {
            resolveReadyPromise({
                client,
                server,
            });

            resolveReadyPromise = undefined;
        }
    }

    session.onJoined((reconnect) => {
        // add our server to the client repository
        clientRepository.addServer(instance, connection.peerId);

        if (reconnect) {
            handleReconnect().then(() => connection.setLibReAnnounced({ name: "interop" }));
        } else {
            handleInitialJoin();
        }
    });

    session.onLeft(() => {
        // reset the client repository when the connection is down
        clientRepository.reset();
    });

    session.join();

    return readyPromise;
}
