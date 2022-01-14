export type HttpCommands = "startGateway" | "stopGateway";

export interface HttpBody {
    startGateway: {
        config: { port: number }
    },
    stopGateway: {
        config: { port: number }
    }
};

export interface HttpResponse {
    startGateway: {
        success: boolean
    },
    stopGateway: {
        success: boolean
    }
};
