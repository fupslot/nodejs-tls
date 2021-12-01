import { readFileSync, existsSync } from "fs";
import { EventEmitter } from "stream";
import tls from "tls";
import logger from "./logger";
import { Peer } from "./peer";

export interface TLSConfig {
  CAFile?: string;
  CertFile?: string;
  KeyFile?: string;
  Address: string;
  Port: number;
}

interface ServerOptions extends tls.TlsOptions {
  Address: string;
  Port: number;
}

const Init = (opts: TLSConfig): ServerOptions => {
  const config: ServerOptions = {
    Address: opts.Address,
    Port: opts.Port,
  };

  if (opts.CAFile != null) {
    config.ca = readByteContent(opts.CAFile);
  }

  if (opts.CertFile != null && opts.KeyFile != null) {
    config.cert = readByteContent(opts.CertFile);
    config.key = readByteContent(opts.KeyFile);
    config.requestCert = true;
  }

  return config;
};

const NewServer = (opts: ServerOptions, ln: Listener): Server => {
  const s = tls.createServer(opts, ln);
  return new Server(s, opts);
};

class Server extends EventEmitter {
  protected l: typeof logger;
  protected peers: Map<string, Peer>;

  constructor(protected s: tls.Server, protected opts: ServerOptions) {
    super();
    this.l = this.setupLog();
    this.peers = new Map<string, Peer>();
  }

  protected setupLog() {
    return logger.child({ module: "server" });
  }

  join(peer: Peer): void {
    this.peers.set(peer.ID, peer);
    this.l.info(`peer: ${peer.ID} JOIN`);
    peer.once("close", () => {
      this.l.info(`peer: ${peer.ID} LEAVE`);
      this.peers.delete(peer.ID);
    });
  }

  listen(): tls.Server {
    return this.s.listen(this.opts.Port, this.opts.Address);
  }
}

function readByteContent(filepath: string): Buffer {
  if (!existsSync(filepath)) {
    throw new Error(`file not found: ${filepath}`);
  }

  return readFileSync(filepath);
}

export type Listener = (socket: tls.TLSSocket) => void;

export default {
  Init,
  NewServer,
};
