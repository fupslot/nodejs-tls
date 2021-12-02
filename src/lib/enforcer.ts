import { newEnforcer } from "casbin";

interface Config {
  ModelFile: string;
  PolicyFile: string;
}

export async function NewEnforcer(c: Config) {
  const e = await newEnforcer(c.ModelFile, c.PolicyFile);

  return Promise.resolve(e);
}

export default {
  NewEnforcer,
};
