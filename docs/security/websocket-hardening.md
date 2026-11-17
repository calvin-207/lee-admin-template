# WebSocket Hardening — Review Notes

## Confirmed defects

- The browser offered `JWTLEEADMIN`, while the server expected and selected `JWTLYADMIN`; corrected to the same value.
- The old middleware used `UntypedToken` and manually decoded the JWT, making it possible to authenticate with a cryptographically valid refresh token. It now uses SimpleJWT's `AccessToken` validation.
- Invalid handshakes previously returned without sending an ASGI rejection; now they explicitly close the handshake.
- Socket handshake now uses Channels' `AllowedHostsOriginValidator`.
- The notification unread count helper is now called with the user's primary key.
- The client preserves its handler when reconnecting, cleans timers on close and avoids duplicate live sockets.

## Tests

`cd backend && pytest tests/test_websocket_auth.py -q`

Existing tests: `cd backend && pytest -q`.

Use `cp config.py_template config.py` and configure the local database, Redis and secrets first as described by the project. The tests in this PR have **not been executed in a complete Django environment** during remote GitHub review; they must run in CI or locally before merging.

## Remaining review items (not changed here)

- Replace `InMemoryChannelLayer` for deployments with multiple Daphne/ASGI instances; the default only works within one process.
- Review `ValidationApi` and API permission path matching for regex overmatching.
- Revisit sensitive API logging and production HTTPS/host configuration.
- Review runtime dependencies, DB migrations, object permissions and tenant isolation end-to-end.
- The WebSocket subprotocol currently carries the JWT in the handshake; confirm reverse proxy/header logging redacts it, or migrate to a safer short-lived ticket or secure cookie-based flow.
