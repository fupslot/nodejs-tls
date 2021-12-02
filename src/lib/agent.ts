import tls from "tls";
import lib from "./";

export interface AgentOptions {
  CAFile?: string;
  CertFile?: string;
  KeyFile?: string;
  Address: string;
  Port: number;
}

class Agent {
  constructor(protected opts: AgentOptions, protected socket: tls.TLSSocket) {}
}

export async function NewAgent(opts: AgentOptions): Promise<Agent> {
  const config: tls.ConnectionOptions = {};

  if (opts.CAFile != null) {
    config.ca = lib.readByteContent(opts.CAFile);
  }

  if (opts.CertFile != null && opts.KeyFile != null) {
    config.cert = lib.readByteContent(opts.CertFile);
    config.key = lib.readByteContent(opts.KeyFile);
  }

  config.host = opts.Address;
  config.port = opts.Port;

  return new Promise((resolve) => {
    const socket = tls.connect(config, () => {
      resolve(new Agent(opts, socket));
    });
  });
}
