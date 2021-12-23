import { Peer } from "./lib/peer";
import config from "./lib/config";
import logger from "./lib/logger";
import tls, { ServerOptions } from "./lib/server";

const defaultServerOptions: ServerOptions = {
  CAFile: config.CAFile,
  CertFile: config.ServerCertFile,
  KeyFile: config.ServerKeyFile,
  ACLModelFile: config.ModelFile,
  ACLPolicyFile: config.PolicyFile,
  Address: "localhost",
  Port: 1111,
};

export default async function main(
  argOptions: Partial<ServerOptions>
): Promise<unknown> {
  const serverOptions = defaultServerOptions;

  if (argOptions.Port) {
    serverOptions.Port = argOptions.Port;
  }

  if (argOptions.Address) {
    serverOptions.Address = argOptions.Address;
  }

  const server = await tls.NewServer(
    serverOptions,
    async (socket): Promise<void> => {
      socket.on("error", (error: Error) => {
        logger.error(error.message);
      });

      if (!socket.authorized) {
        return socket.destroy();
      }

      // Verifying with the ACL policy whether or not the incoming peer allow to connect
      const peerCert = socket.getPeerCertificate();
      if (!(await server.allow(peerCert.subject.CN, "tcp", "connect"))) {
        return socket.destroy();
      }

      server.join(Peer.NewPeer(socket));

      // socket.pipe(socket);
    }
  );

  return new Promise(() => {
    server.listen();
  });
}
