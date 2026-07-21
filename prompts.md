# AI Transparency & Technical Prompts Log

This document details the design decisions, debugging paths, and prompt strategies used during the development of the **Live Ops Helpdesk** real-time ticket locking features.

---

## 1. Socket Listener Duplicate Firing (React Strict Mode)

### Problem:
In development mode, React Strict Mode mounts, unmounts, and remounts components in quick succession to catch lifecycle bugs. This causes Socket.io connections to double-emit connection handshakes and register duplicate event listeners, resulting in ticket updates firing twice or state variables getting out of sync.

### Prompt / Debug Strategy:
"How do we prevent duplicate event listener registration in Socket.io-client when using React 18 in Strict Mode?"

### Solution:
* **Cleanup on Unmount**: In `TicketContext.jsx` and `TicketDetails.jsx`, we clean up event listeners inside the `useEffect` cleanup return functions using `socket.off('event_name')`.
* **Central Provider**: Built a central `SocketContext` that initializes a single Socket.io connection instance on mount and distributes it throughout the application, preventing multiple client connections.

---

## 2. In-Memory Lock Map Structure

### Problem:
Traditional database queries (Mongoose/MongoDB) are too slow and resource-heavy to handle rapid lock verification and high-frequency real-time locking events. 

### Prompt / Debug Strategy:
"Design a highly efficient, thread-safe memory lock manager in Node.js for tracking user locks on database items mapped by socket IDs."

### Solution:
* **JS Map Structure**: Implemented an in-memory `Map` registry:
  ```javascript
  const activeLocks = new Map(); // key: ticketId -> value: { userId, socketId, expiresAt }
  ```
* **Performance**: Read and write operations run in $O(1)$ constant time, bypassing the database for validation while asynchronously syncing state back to MongoDB for fallback storage.

---

## 3. Ghost Disconnect & Lease Expiry

### Problem:
If an agent locks a ticket and immediately closes their browser tab or goes offline, they never emit an explicit `unlock_ticket` event. This leaves the ticket locked indefinitely.

### Prompt / Debug Strategy:
"How do we handle connection loss or abrupt tab closure in Socket.io to release locks associated with a disconnected client's socket ID?"

### Solution:
* **Disconnect Handler**: Registered a listener inside `socket.on('disconnect')` on the backend. When a client socket drops, the server retrieves the client's `socket.id`, scans the in-memory Map for matching holds, releases them, and immediately broadcasts the release to all other connected agents.
