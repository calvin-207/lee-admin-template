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

  initWebSocket(revMessage) {
    let domain = sysConfig.API_HOST;
    if (!("WebSocket" in window)) {
      message.warning("该浏览器不支持WebSocket");
      return null;
    }

    const token = getToken();
    if (!token) {
      return null;
    }

    const wsUrl =
      (window.location.protocol === "http:" ? "ws://" : "wss://") +
      `${domain}/ws/msg/`;
    leeWebSocket.websocket = new WebSocket(wsUrl, [
      "JWTLEEADMIN",
      getJWTAuthorization(),
    ]);

    leeWebSocket.websocket.onmessage = (e) => {
      if (revMessage) {
        revMessage(e);
      }
    };

    leeWebSocket.websocket.onclose = (e) => {
      leeWebSocket.socketOpen = false;
      useLeewebsocket().setWebSocketState(leeWebSocket.socketOpen);

      if (leeWebSocket.isReconnect) {
        leeWebSocket.reconnectTimer = setTimeout(() => {
          if (leeWebSocket.reconnectCurrent > leeWebSocket.reconnectCount) {
            clearTimeout(leeWebSocket.reconnectTimer);
            leeWebSocket.isReconnect = false;
            leeWebSocket.socketOpen = false;
            useLeewebsocket().setWebSocketState(leeWebSocket.socketOpen);
            return;
          }

          leeWebSocket.reconnectCurrent++;
          leeWebSocket.reconnectWebSocket(revMessage); // 传递 revMessage 参数
        }, leeWebSocket.reconnectInterval);
      }
    };

    leeWebSocket.websocket.onopen = () => {
      leeWebSocket.socketOpen = true;
      useleeWebSocket().setWebSocketState(leeWebSocket.socketOpen);
      leeWebSocket.isReconnect = true;
      leeWebSocket.startHeartbeat();
    };

    leeWebSocket.websocket.onerror = (e) => {};
  },
  startHeartbeat() {
    if (leeWebSocket.hearbeatTimer) {
      clearInterval(leeWebSocket.hearbeatTimer);
    }

    leeWebSocket.hearbeatTimer = setInterval(() => {
      const data = {
        time: new Date().getTime(),
      };
      leeWebSocket.sendWebSocketMessage(data);
    }, leeWebSocket.hearbeatInterval);
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
      useleeWebSocket().setWebSocketState(leeWebSocket.socketOpen);
    }
  },
  closeWebSocket() {
    leeWebSocket.isReconnect = false;
    leeWebSocket.websocket && leeWebSocket.websocket.close();
    leeWebSocket.websocket = null;
    leeWebSocket.socketOpen = false;
    useleeWebSocket().setWebSocketState(leeWebSocket.socketOpen);
  },
  reconnectWebSocket() {
    if (leeWebSocket.websocket && !leeWebSocket.isReconnect) {
      leeWebSocket.closeWebSocket();
    }
    leeWebSocket.initWebSocket(null);
  },
};

export default leeWebSocket;
