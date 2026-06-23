"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimePublisherService = void 0;
// time-publisher.service.ts
const transport_node_1 = require("@nats-io/transport-node"); // Import Msg type
class TimePublisherService {
    config;
    nc_ = null; // Use NatsConnection and allow null
    timers = new Map();
    // Modalità ora di sistema
    baseTime = Date.now();
    // Modified variables to track separate offsets for each subject
    subjectOffsets = {
        hhmm: 0,
        hhmmss: 0
    };
    isSimulated = false;
    // Modalità Cronometro
    isCounterRunning = false;
    counterStartTime = 0;
    constructor(config) {
        this.config = config;
    }
    async start() {
        try {
            this.nc_ = await (0, transport_node_1.connect)({ servers: [this.config.natsUrl] });
            console.log('✅ TimePublisher connected to NATS');
            this.setupRequestReply();
            this.startDefaultPublishing();
        }
        catch (error) {
            console.error('❌ Failed to connect to NATS:', error.message);
            throw error; // Re-throw to allow TimeService to catch it
        }
    }
    setupRequestReply() {
        if (!this.nc_)
            return; // Ensure connection is established
        this.nc_.subscribe('set.clock', {
            callback: (err, msg) => this.handleSetClock(msg, 'hhmmss') // Use Msg type
        });
        this.nc_.subscribe('start.timer', {
            callback: (err, msg) => this.handleSetClock(msg, 'hhmmss')
        });
        this.nc_.subscribe('stop.timer', {
            callback: (err, msg) => this.handleSetClock(msg, 'hhmmss')
        });
    }
    startDefaultPublishing() {
        this.startPublishing('hhmm', 60000);
        this.startPublishing('hhmmss', 1000);
    }
    startPublishing(subject, intervalMs) {
        if (this.timers.has(subject)) {
            clearInterval(this.timers.get(subject));
        }
        const tick = () => {
            if (!this.nc_)
                return; // Don't publish if not connected
            const payload = {
                channel: subject,
                time: this.getCurrentTimeISO(subject)
            };
            this.nc_.publish(subject, JSON.stringify(payload));
            // Update the offset for next iteration
            this.subjectOffsets[subject] += intervalMs;
        };
        tick(); // pubblicazione immediata
        const timer = setInterval(tick, intervalMs);
        this.timers.set(subject, timer);
    }
    getCurrentTimeISO(currentSubject) {
        const pad = (num) => String(num).padStart(2, '0');
        // 1) Counter is running -> show elapsed time relative to start
        if (this.isCounterRunning) {
            const elapsedMs = Date.now() - this.counterStartTime;
            const totalSeconds = Math.floor(elapsedMs / 1000);
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;
            if (currentSubject === 'hhmm') {
                return `${pad(hours)}:${pad(minutes)}`;
            }
            return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
        }
        // 2) Counter NOT running -> show local time (Europe/Rome) based on
        //    baseTime + offset (baseTime is captured when publishing started
        //    or when simulation/set is applied). This ensures time isn't taken
        //    from system on every tick but from the initial baseTime plus offsets.
        const options = {
            timeZone: 'Europe/Rome',
            hour: '2-digit',
            minute: '2-digit',
            second: currentSubject === 'hhmmss' ? '2-digit' : undefined,
            hour12: false
        };
        const now = new Date(this.baseTime + this.subjectOffsets[currentSubject]);
        return now.toLocaleTimeString('it-IT', options);
    }
    // ====================== REQUEST / REPLY ======================
    handleSetClock(msg, currentSubject) {
        try {
            if (msg) {
                const req = JSON.parse(msg.data.toString()); // Parse JSON string
                if (req.time) {
                    this.baseTime = new Date(req.time).getTime();
                    this.subjectOffsets['hhmm'] = 0;
                    this.subjectOffsets['hhmmss'] = 0;
                    this.isSimulated = true;
                }
                this.sendResponse(msg, true, 'set.clock', currentSubject);
            }
        }
        catch (e) {
            // Corrected: pass error message to sendResponse
            this.sendResponse(msg, false, `set.clock ${e.message}`, currentSubject);
        }
    }
    handleStartCounter(msg, currentSubject) {
        try {
            this.isCounterRunning = true;
            this.counterStartTime = Date.now();
            // Reset baseTime and offsets so ticks start from now
            this.baseTime = Date.now();
            this.subjectOffsets['hhmm'] = 0;
            this.subjectOffsets['hhmmss'] = 0;
            console.log('⏱️ chrono start');
            // Corrected: use 'msg' instead of 'MediaSourceHandle'
            this.sendResponse(msg, true, 'start.counter', currentSubject);
        }
        catch (e) {
            // Corrected: pass error message to sendResponse
            this.sendResponse(msg, false, `start.counter ${e.message}`, currentSubject);
        }
    }
    handleStopCounter(msg, currentSubject) {
        try {
            this.isCounterRunning = false;
            // Reset baseTime so publishing resumes from current system time
            this.baseTime = Date.now();
            this.subjectOffsets['hhmm'] = 0;
            this.subjectOffsets['hhmmss'] = 0;
            this.counterStartTime = 0;
            console.log('⏱️ chrono stop → back to system time');
            this.sendResponse(msg, true, 'stop.counter', currentSubject);
        }
        catch (e) {
            // Corrected: pass error message to sendResponse
            this.sendResponse(msg, false, `stop.counter ${e.message}`, currentSubject);
        }
    }
    sendResponse(msg, // Use Msg type
    success, message, // This is the intended message string
    subject) {
        if (!this.nc_)
            return; // Cannot respond if not connected
        const response = {
            success: success,
            message: message, // Corrected: use the passed message string
            currentTime: this.getCurrentTimeISO(subject)
        };
        // Use msg.respond if available, otherwise use nc_.publish with reply subject
        if (msg && msg.reply) {
            msg.respond(JSON.stringify(response));
        }
        else {
            // Fallback if msg.respond is not directly available on Msg or if it's not a request/reply
            // This part might need adjustment based on @nats-io/transport-node specifics
            console.warn("Received message without reply subject, cannot send response directly.");
        }
    }
    async shutdown() {
        this.timers.forEach(clearInterval);
        this.timers.clear();
        await this.nc_?.close().catch(() => { }); // Safely close connection
        this.nc_ = null; // Clear the connection
    }
}
exports.TimePublisherService = TimePublisherService;
