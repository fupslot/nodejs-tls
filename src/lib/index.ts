import { readFileSync, existsSync } from "fs";

export function readByteContent(filepath: string): Buffer {
  if (!existsSync(filepath)) {
    throw new Error(`file not found: ${filepath}`);
  }

  return readFileSync(filepath);
}

export default {
  readByteContent,
};
