import logger from "./lib/logger";
import { NewAgent, AgentOptions } from "./lib/agent";
import config from "./lib/config";

async function main(): Promise<void> {
  const opts: AgentOptions = {
    CAFile: config.CAFile,
    CertFile: config.ClientCertFile,
    KeyFile: config.ClientKeyFile,
    Address: "localhost",
    Port: 1111,
  };

  const agent = await NewAgent(opts);
}

main().catch((error) => logger.error({ message: error.message }));
