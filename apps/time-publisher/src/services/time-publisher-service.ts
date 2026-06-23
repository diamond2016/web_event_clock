// time-publisher.service.ts
import { connect, NatsConnection, Msg } from '@nats-io/transport-node';// Import Msg type
import { 
  ClockEvent, 
  SetRequestPayload, 
  SetResponsePayload, 
  ResponsePayload 
} from '@web-event-clock/shared';

export class TimePublisherService {
  private nc_: NatsConnection | null = null; // Use NatsConnection and allow null
  private timers = new Map<string, ReturnType<typeof setInterval>>();

  // Modalità ora di sistema
  private baseTime = Date.now();
  // Modified variables to track separate offsets for each subject
  private subjectOffsets = {
    hhmm: 0,
    hhmmss: 0
  };
  private isSimulated = false;

  // Modalità Cronometro
  private isCounterRunning = false;
  private counterStartTime = 0;

  constructor(private readonly config: { natsUrl: string }) {}

  async start(): Promise<void> {
    try {
      this.nc_ = await connect({ servers: [this.config.natsUrl] }) as NatsConnection;
      console.log('✅ TimePublisher connected to NATS');

      this.setupRequestReply();
      this.startDefaultPublishing();
    } catch (error: any) {
      console.error('❌ Failed to connect to NATS:', error.message);
      throw error; // Re-throw to allow TimeService to catch it
    }
  }

  private setupRequestReply() {
    if (!this.nc_) return; // Ensure connection is established

    this.nc_.subscribe('set.clock', {
      callback: (err: Error | null, msg?: Msg) =>  this.handleSetClock(msg, 'set.clock') // Use Msg type
    });

    this.nc_.subscribe('start.timer', {
      callback: (err: Error | null, msg?: Msg) =>  this.handleStartTimer(msg, 'start.timer')
    });

    this.nc_.subscribe('stop.timer', {
      callback: (err: Error | null, msg?: Msg) =>  this.handleStopTimer(msg, 'stop.timer')
    });
  }

  private startDefaultPublishing() {
    this.startPublishing('hhmm', 60000);
    this.startPublishing('hhmmss', 1000);
  }

  private startPublishing(subject: 'hhmm' | 'hhmmss', intervalMs: number) {
    if (this.timers.has(subject)) {
      clearInterval(this.timers.get(subject)!);
    }

    const tick = () => {
      if (!this.nc_) return; // Don't publish if not connected

      const payload: ClockEvent = {
        channel: subject,
        time: this.getCurrentTimeISO(subject)
      };
      //console.log(`publish ${ JSON.stringify(payload) }`);
      this.nc_.publish(subject, JSON.stringify(payload));  

      // Update the offset for next iteration
      this.subjectOffsets[subject] += intervalMs;
    };
    
    tick(); // pubblicazione immediata
    const timer = setInterval(tick, intervalMs);
    this.timers.set(subject, timer);
  }

  private getCurrentTimeISO(currentSubject: 'hhmm' | 'hhmmss'): string {
    const pad = (num: number) => String(num).padStart(2, '0');

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
    const options: Intl.DateTimeFormatOptions = {
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

  private handleSetClock(msg: Msg | undefined, currentSubject: 'set.clock') {
      console.log(`handleSetClock() - message ${msg}`);
      try {
        if (msg) {
          // Ensure msg.data is treated as a string before parsing
          const payload = JSON.parse(msg.data.toString()); 
          
          const req: SetRequestPayload = {
            time: payload.time, // e.g., '11:01:00'
            mode: payload.mode, // e.g., 'absolute'
          };
      
          if (req.time) {
            this.baseTime = new Date(req.time).getTime();
            this.subjectOffsets['hhmm'] = 0;
            this.subjectOffsets['hhmmss'] = 0;
            this.isSimulated = true;
          }

          this.sendResponse(msg, true, 'Clock set successfully', currentSubject);
        }
      } catch (e: any) {
        // Ensure the error message is a string before passing it
        const errorMessage = typeof e === 'string' ? e : e.message || 'Unknown error';
        this.sendResponse(msg, false, `Failed to set clock: ${errorMessage}`, currentSubject);
      }
    }

  private handleStartTimer(msg: Msg | undefined, currentSubject: 'start.timer') {
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
    } catch (e: any) {
      // Corrected: pass error message to sendResponse
      this.sendResponse(msg, false, `start.counter ${e.message}`,currentSubject);
    }
  }

  private handleStopTimer(msg: Msg | undefined, currentSubject: 'stop.timer') {
    try {
      this.isCounterRunning = false;
      // Reset baseTime so publishing resumes from current system time
      this.baseTime = Date.now();
      this.subjectOffsets['hhmm'] = 0;
      this.subjectOffsets['hhmmss'] = 0;
      this.counterStartTime = 0;
      console.log('⏱️ chrono stop → back to system time');
      this.sendResponse(msg, true, 'stop.counter', currentSubject);
    } catch (e: any) {
      // Corrected: pass error message to sendResponse
      this.sendResponse(msg, false, `stop.counter ${e.message}`, currentSubject);
    }
  }

  private sendResponse(
    msg: Msg | undefined, 
    success: boolean,
    message: string, 
    subject: 'set.clock' | 'start.timer' | 'stop.timer'
  ) {
    if (!this.nc_) return; 

    const response: SetResponsePayload = {
      success: success,
      message: message, 
    };

    if (msg && msg.reply) {
        console.log("Sending response:", JSON.stringify(response));
        msg.respond(JSON.stringify(response));
    } else {
        console.warn("Received message without reply subject, cannot send response directly.");
    }
  }

  async shutdown(): Promise<void> {
    this.timers.forEach(clearInterval);
    this.timers.clear();
    await this.nc_?.close().catch(() => {}); // Safely close connection
    this.nc_ = null; // Clear the connection
  }
}