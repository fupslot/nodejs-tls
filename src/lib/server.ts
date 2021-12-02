import { readFileSync, existsSync } from "fs";
import { EventEmitter } from "stream";
import tls from "tls";
import logger from "./logger";
import { Peer } from "./peer";
import { NewEnforcer } from "./enforcer";

type Await<T> = T extends PromiseLike<infer U> ? U : T;
type Enforcer = Await<ReturnType<typeof NewEnforcer>>;

export type Listener = (socket: tls.TLSSocket) => Promise<void>;

export interface ServerOptions {
  CAFile?: string;
  CertFile?: string;
  KeyFile?: string;
  Address: string;
  Port: number;
  ACLModelFile?: string;
  ACLPolicyFile?: string;
}

class Server extends EventEmitter {
  protected l: typeof logger;
  protected peers: Map<string, Peer>;

  constructor(
    protected s: tls.Server,
    protected opts: ServerOptions,
    protected acl?: Enforcer
  ) {
    super();
    this.l = this.setupLog();
    this.peers = new Map<string, Peer>();

    if (acl) {
      this.acl = acl;
    }
  }

  protected setupLog() {
    return logger.child({
      module: "server",
      address: this.opts.Address,
      port: this.opts.Port,
    });
  }

  async allow(sub: string, obj: string, act: string): Promise<boolean> {
    if (!this.acl) {
      return Promise.resolve(true);
    }

    const effect = await this.acl.enforce(sub, obj, act);
    this.l.info({ event: "acl", sub, obj, act, effect });
    return effect;
  }

  join(peer: Peer): void {
    this.peers.set(peer.ID, peer);
    this.l.info({ event: "join", peer: { id: peer.ID } });

    peer.once("close", () => {
      this.l.info({ event: "leave", peer: { id: peer.ID } });
      this.peers.delete(peer.ID);
    });
  }

  listen(): tls.Server {
    this.s.on("listening", () => {
      this.l.info({
        event: "listen",
      });
    });
    return this.s.listen(this.opts.Port, this.opts.Address);
  }
}

function readByteContent(filepath: string): Buffer {
  if (!existsSync(filepath)) {
    throw new Error(`file not found: ${filepath}`);
  }

  return readFileSync(filepath);
}

const NewServer = async (
  opts: ServerOptions,
  ln: Listener
): Promise<Server> => {
  const config: tls.TlsOptions = {
    // Address: opts.Address,
    // Port: opts.Port,
  };

  if (opts.CAFile != null) {
    config.ca = readByteContent(opts.CAFile);
  }

  if (opts.CertFile != null && opts.KeyFile != null) {
    config.cert = readByteContent(opts.CertFile);
    config.key = readByteContent(opts.KeyFile);
    config.requestCert = true;
  }
  const s = tls.createServer(config, (socket) => {
    ln(socket).catch((error) => logger.error(error.message));
  });

  let acl: Enforcer | undefined;

  if (opts.ACLModelFile != null && opts.ACLPolicyFile != null) {
    acl = await NewEnforcer({
      ModelFile: opts.ACLModelFile,
      PolicyFile: opts.ACLPolicyFile,
    });
  }

  return new Server(s, opts, acl);
};

export default {
  NewServer,
};
