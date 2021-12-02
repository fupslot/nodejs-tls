import os from "os";
import path from "path/posix";

function configFile(filename: string): string {
  const dir = process.env["CONFIG_DIR"];
  if (dir != null) {
    return path.join(dir, filename);
  }

  return path.join(os.homedir(), ".nodejs-tls", filename);
}

const CAFile = configFile("ca.pem");
const ServerCertFile = configFile("server.pem");
const ServerKeyFile = configFile("server-key.pem");
const PolicyFile = configFile("policy.csv");
const ModelFile = configFile("model.conf");

export default {
  CAFile,
  ServerCertFile,
  ServerKeyFile,
  PolicyFile,
  ModelFile,
};
