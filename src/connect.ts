import { NewAgent, AgentOptions } from "./lib/agent";
import config from "./lib/config";

const defaultAgentOptions: AgentOptions = {
  CAFile: config.CAFile,
  CertFile: config.ClientCertFile,
  KeyFile: config.ClientKeyFile,
  Address: "localhost",
  Port: 1111,
};

export default async function main(
  argOptions: Partial<AgentOptions>
): Promise<void> {
  const agentOptions = defaultAgentOptions;

  if (argOptions.Port) {
    agentOptions.Port = argOptions.Port;
  }

  if (argOptions.Address) {
    agentOptions.Address = argOptions.Address;
  }

  await NewAgent(agentOptions);
}
