export declare class TimeService {
    private static publisher;
    static startPublisher(config?: {
        natsUrl?: string;
    }): Promise<void>;
    static shutdown(): Promise<void>;
    static isRunning(): boolean;
}
