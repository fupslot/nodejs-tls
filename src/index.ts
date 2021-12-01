import { Peer } from "./lib/peer";
import config from "./lib/config";
import logger from "./lib/logger";
import tls from "./lib/server";

async function main(): Promise<unknown> {
  logger.info("main");

  const opts = tls.Init({
    CAFile: config.CAFile,
    CertFile: config.ServerCertFile,
    KeyFile: config.ServerKeyFile,
    Address: "localhost",
    Port: 1111,
  });

  const server = tls.NewServer(opts, (socket): void => {
    socket.on("error", (error: Error) => {
      logger.error(error.message);
    });

    if (!socket.authorized) {
      return socket.destroy();
    }

    // const peerCert = socket.getPeerCertificate();
    // if (!server.enforcer.Allow(peerCert.subject.CN)) // drop connection
    server.join(Peer.NewPeer(socket));

    socket.pipe(socket);
  });

  server.listen();

  return Promise.resolve();
}

main().catch(console.error);
