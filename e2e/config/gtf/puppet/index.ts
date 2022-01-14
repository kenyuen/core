import { DesktopGateway } from "./desktop-gateway";
import { GlueClient } from "./glue-client";
import { WebPlatform } from "./web-platform";
import { Glue42WebPlatform } from "../../../../packages/web-platform/platform.d";
import { HttpCommands, HttpBody, HttpResponse } from "./common/types";

export class GtfPuppet {
    private readonly puppetWsBridgeUrl = "ws://localhost:9997";
    private readonly puppetHttpBridgeUrl = "http://localhost:9997/command";
    private socket!: WebSocket;

    public start(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.socket = new WebSocket(this.puppetWsBridgeUrl);

            this.socket.addEventListener("message", (event) => {
                const parsedMessage = JSON.parse(event.data);

                this.handleBridgeMessage(parsedMessage);
            });

            this.socket.onopen = () => {
                this.sendWS({ gtf: true });
                resolve();
            };

            setTimeout(() => reject("GTF Puppet could not start."), 5000);
        })
    }

    public async startDesktopGateway(config: { port: number } = { port: 1000 }): Promise<DesktopGateway> {
        const startResponse = await this.sendHttp<"startGateway">("startGateway", { config });

        if (!startResponse.success) {
            throw new Error("The puppet bridge did not give the OK.");
        }

        const gwInstance = new DesktopGateway(config.port);

        return gwInstance;
    }

    public async stopDesktopGateway(gateway: DesktopGateway): Promise<void> {
        const stopResponse = await this.sendHttp<"stopGateway">("stopGateway", { config: { port: gateway.port } });

        if (!stopResponse.success) {
            throw new Error("The puppet bridge did not give the OK.");
        }
    }

    // public async startClient(): Promise<GlueClient> {
    //     //
    // }

    private handleBridgeMessage(message: any): void {
        //
    }

    private async sendHttp<T extends HttpCommands>(command: T, data: HttpBody[T]): Promise<HttpResponse[T]> {

        const rawResponse = await fetch(this.puppetHttpBridgeUrl, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            mode: "cors",
            cache: "no-cache",
            body: JSON.stringify({ command, data })
        });

        const content = await rawResponse.json();

        if (content && content.errMsg) {
            throw new Error(`Puppet Bridge Error: ${content.errMsg}`);
        }

        return content;
    }

    private sendWS(message: any): void {
        this.socket.send(JSON.stringify(message));
    }
}
