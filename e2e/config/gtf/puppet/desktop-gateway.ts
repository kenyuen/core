export class DesktopGateway {
    constructor(private readonly _port: number) { }

    public get port(): number {
        return this._port;
    }
}