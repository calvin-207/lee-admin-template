import { ElNotification as message } from "element-plus";
import { getToken } from "@/utils/util";
import sysConfig from "@/config";
import { useLeewebsocket } from "@/store/websocket";

function getJWTAuthorization() {
  const token = getToken();
  const jwt = "JWTlee" + token;
  return jwt;
}

const leeWebSocket = {
  websocket: null,
  socketOpen: false,
  hearbeatTimer: null,
  hearbeatInterval: 10 * 1000,
  isReconnect: true,
  reconnectCount: 3,
  reconnectCurrent: 1,
  reconnectTimer: null,
  reconnectInterval: 5 * 1000,
  onReceive: null,
  reconnectEnabled: true,

  initWebSocket(revMessage) {
    if (typeof revMessage === "function") {
      this.onReceive = revMessage;
    }
    this.reconnectEnabled = true;
    if (this.websocket && [WebSocket.CONNECTING, WebSocket.OPEN].includes(this.websocket.readyState)) {
      return this.websocket;
    }
    if (!("WebSocket" in window)) {
      message.warning("该浏览器不支持WebSocket");
      return null;
    }
    const token = getToken();
    if (!token) return null;
    const apiHost = sysConfig.API_HOST;
    const origin = new URL(
      apiHost.startsWith("http") ? apiHost : window.location.protocol + "//" + apiHost,
      window.location.origin
    );
    origin.protocol = origin.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = new URL("/ws/msg/", origin).toString();
    clearTimeout(this.reconnectTimer);
    const socket = new WebSocket(wsUrl, ["JWTLEEADMIN", getJWTAuthorization()]);
    this.websocket = socket;

    socket.onmessage = (event) => this.onReceive?.(event);
    socket.onopen = () => {
      this.socketOpen = true;
      this.reconnectCurrent = 0;
      useLeewebsocket().setWebSocketState(true);
      this.startHeartbeat();
    };
    socket.onclose = () => {
      if (this.websocket !== socket) return;
      clearInterval(this.hearbeatTimer);
      this.hearbeatTimer = null;
      this.websocket = null;
      this.socketOpen = false;
      useLeewebsocket().setWebSocketState(false);
      if (this.reconnectEnabled && this.reconnectCurrent < this.reconnectCount) {
        this.reconnectCurrent++;
        this.reconnectTimer = setTimeout(() => this.initWebSocket(), this.reconnectInterval);
      }
    };
    socket.onerror = () => {};
    return socket;
  },
  startHeartbeat() {
    clearInterval(this.hearbeatTimer);
    this.hearbeatTimer = setInterval(() => {
      if (this.websocket?.readyState === WebSocket.OPEN) {
        this.sendWebSocketMessage({ time: Date.now() });
      }
    }, this.hearbeatInterval);
  },
  sendWebSocketMessage(data, callback = null) {
    if (
      leeWebSocket.websocket &&
      leeWebSocket.websocket.readyState === leeWebSocket.websocket.OPEN
    ) {
      leeWebSocket.websocket.send(JSON.stringify(data));
      callback && callback();
    } else {
      clearInterval(leeWebSocket.hearbeatTimer);
      leeWebSocket.socketOpen = false;
      useLeewebsocket().setWebSocketState(leeWebSocket.socketOpen);
    }
  },
  closeWebSocket() {
    this.reconnectEnabled = false;
    clearTimeout(this.reconnectTimer);
    clearInterval(this.hearbeatTimer);
    this.reconnectTimer = null;
    this.hearbeatTimer = null;
    const socket = this.websocket;
    this.websocket = null;
    socket?.close();
    this.socketOpen = false;
    useLeewebsocket().setWebSocketState(false);
  },
  reconnectWebSocket() {
    this.closeWebSocket();
    this.reconnectCurrent = 0;
    return this.initWebSocket();
  },
};

export default leeWebSocket;
