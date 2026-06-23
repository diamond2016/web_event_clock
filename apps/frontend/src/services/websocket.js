/* tslint:disable */
/* eslint-disable */
import { io } from "socket.io-client";
/**
 * Socket.io Service to handle real-time clock updates.
 */
class WebSocketService {
    static instance;
    socket = null;
    listeners = new Map();
    constructor() { this.listeners = new Map(); }
    static getInstance() {
        if (!WebSocketService.instance) {
            WebSocketService.instance = new WebSocketService();
        }
        return WebSocketService.instance;
    }
    connect() {
        if (this.socket && this.socket.connected)
            return;
        // Use the socket.io client to connect to the backend
        // Note: We use the port 3001 where your backend is running
        this.socket = io("http://0.0.0.0:3001", {
            transports: ["websocket"],
            reconnectionAttempts: 5,
        });
        this.socket.on("connect", () => {
            console.log("Socket.io connected:", this.socket?.id);
        });
        this.socket.on("disconnect", (reason) => {
            console.log("Socket.io disconnected:", reason);
        });
        this.socket.on("connect_error", (error) => {
            console.error("Socket.io connection error:", error.message);
        });
        // Listen for messages
        // In Socket.io, you usually listen for specific events.
        // If your backend emits 'clock_update_hhmm', we listen for that.
        const channels = ["clock_update_hhmm", "clock_update_hhmmss"];
        channels.forEach(channel => {
            if (this.socket) {
                this.socket.on(channel, (payload) => {
                    //console.log("ALL KEYS IN MAP:", Array.from(this.listeners.keys()));
                    // Parsing robusto
                    const data = typeof payload === 'string' ? JSON.parse(payload) : payload;
                    const channelKey = data.channel;
                    const callbacks = this.listeners.get(channelKey);
                    //console.log("KEY:", channelKey);
                    //console.log("CALLBACKS :", callbacks)
                    //console.log(`[WS_RECEIVE] Channel: ${channel}, Payload:`, payload);
                    // FIX: Use payload.channel instead of the socket event name (channel)
                    // to look up the registered callbacks.
                    const internalChannel = payload.channel;
                    //const callbacks = this.listeners.get(internalChannel);
                    //this.listeners.forEach((callbacks, channel) => {
                    //  console.log(`[WS_KEY] Canale: ${channel}`);
                    //  console.log(`[WS_VALUE] Numero callback: ${callbacks.length}`);
                    //});
                    if (callbacks) {
                        console.log(`callbacks.length ${callbacks.length} for ${internalChannel}`);
                    }
                    if (callbacks) {
                        console.log(`[WS_CALLBACK] Channel: ${internalChannel}, Payload:`, payload);
                        callbacks.forEach(callback => callback(data));
                    }
                });
            }
        });
    } // connect
    subscribe(channel, callback) {
        console.log(`Socket.io - request subscribe ${channel}`);
        if (!this.listeners.has(channel)) {
            this.listeners.set(channel, []);
        }
        const callbacks = this.listeners.get(channel);
        if (callbacks) {
            // Evita di aggiungere duplicati se la stessa funzione viene passata più volte
            if (!callbacks.includes(callback)) {
                callbacks.push(callback);
                console.log(`added callback for channel ${channel}`);
            }
        }
        if (!this.socket || !this.socket.connected) {
            this.connect();
        }
    }
    unsubscribe(channel, callback) {
        const callbacks = this.listeners.get(channel);
        console.log(`unsubscribe, with channel ${channel}`);
        if (callbacks) {
            const filtered = callbacks.filter(cb => cb !== callback);
            this.listeners.set(channel, filtered);
        }
    }
}
export const wsService = WebSocketService.getInstance();
