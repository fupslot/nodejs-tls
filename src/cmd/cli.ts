#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import serve from "../serve";
import connect from "../connect";

type Arguments = {
  port?: number;
  address?: string;
};

yargs(hideBin(process.argv))
  .command<Arguments>(
    "serve [port] [address]",
    "Start TCP/TLS server listening on [port]",
    (args) => {
      return args
        .positional("port", {
          desc: "Listening port",
          default: 1111,
        })
        .positional("address", {
          desc: "Address",
          default: "localhost",
        });
    },
    async (argv) => {
      await serve({
        Port: argv.port,
        Address: argv.address,
      });
    }
  )
  .command<Arguments>(
    "connect [port] [address]",
    "Start a client connecting to TLS server",
    (args) => {
      return args
        .positional("address", {
          desc: "Server host",
          default: "localhost",
        })
        .positional("port", {
          desc: "Server port",
          default: 1111,
        });
    },
    async (argv) => {
      await connect({
        Port: argv.port,
        Address: argv.address,
      });
    }
  )
  .help()
  .parse();
