import { EventEmitter } from "stream";
import { TLSSocket } from "tls";
import logger from "./logger";

interface PeerEvents {
  on(event: "close", listener: () => void): this;
}

export class Peer extends EventEmitter {
  protected l: typeof logger;

  constructor(protected id: string, protected socket: TLSSocket) {
    super();
    this.l = logger.child({ module: "peer", peer: { id } });
  }

  get ID(): string {
    return this.id;
  }

  logError(msg: string) {
    this.l.error(msg);
  }

  static NewPeer(s: TLSSocket): Peer {
    const p = new Peer(Date.now().toString(), s);
    s.once("close", () => p.emit("close", p));
    s.once("error", () => p.emit("close", p));
    return p;
  }
}

export default {
  Peer,
};
