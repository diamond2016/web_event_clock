export declare class TimePublisherService {
    private readonly config;
    private nc_;
    private timers;
    private baseTime;
    private subjectOffsets;
    private isSimulated;
    private isCounterRunning;
    private counterStartTime;
    constructor(config: {
        natsUrl: string;
    });
    start(): Promise<void>;
    private setupRequestReply;
    private startDefaultPublishing;
    private startPublishing;
    private getCurrentTimeISO;
    private handleSetClock;
    private handleStartCounter;
    private handleStopCounter;
    private sendResponse;
    shutdown(): Promise<void>;
}
