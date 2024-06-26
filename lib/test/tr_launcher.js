#!/usr/bin/env node
/**
 * lib/test/tr_launcher.js
 *
 * Read the .vscode/launch.json file and run the matching tests.
 */
"use strict";

const fs = require('node:fs');
const { spawn } = require('child_process');
const colors = require('colors');

// testProg is a string to match in the launch configuration.program property.
let testProg = process.env[ "LAUNCH_PROGRAM" ] || process.env[ "TEST_PROGRAM" ] || "/test/";

// testName is a string to match in the launch configuration.name property.
let testName = process.argv.length > 2 ? process.argv[ 2 ] : "";

(async () => {
  try {
    let l = fs.readFileSync("./.vscode/launch.json", "utf8");
    let lj = l.replace(/\/\/.*/g, "");  // remove comments
    var launch = JSON.parse(lj);
    var cwd = process.cwd();

    for (let config of launch.configurations) {
      if (!testName || config.name?.includes(testName)) {
        if ((config.type === "node" || config.type === "pwa-node")
          && config.request === "launch"
          && (config.program?.includes(testProg))) {

          console.log(config.name.bgBlue);
          let script = config.program.replace("${workspaceFolder}", ".");

          if (Object.hasOwn(config, "cwd")) {
            let wd = config.cwd.replace("${workspaceFolder}", ".");
            process.chdir(wd);
          }

          let args = config.runtimeArgs || [];
          args.push( script );
          if (config.args) {
            for (let arg of config.args) {
              arg = arg.replace("${workspaceFolder}", ".");
              args.push(arg);
            }
          }

          let exitcode = await runTest(args);
          if (exitcode !== 0)
            break;

          if (Object.hasOwn(config, "cwd")) {
            process.chdir(cwd);
          }
        }
      }
    }
  }
  catch (err) {
    console.log(err.message.bgRed);
    process.exitCode = 1;
  }
})();

async function runTest(args) {
  return new Promise((resolve, reject) => {
    const program = spawn('node', args);

    program.stdout.on('data', (data) => {
      if (data[ data.length - 1 ] === 10 && data[ data.length - 2 ] === 13)
        console.log(`${data.slice(0, data.length - 2)}`);
      else
        console.log(`${data}`);
    });

    program.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });

    program.on('close', (code) => {
      if (code === 0)
        console.log(`child process close with code ${code}`.blue);
      else
        console.log(`child process close with code ${code}`.bgRed);
      resolve(code);
    });

    program.on('disconnect', () => {
      console.log(`child process disconnect`);
      resolve(0);
    });

    program.on('error', (error) => {
      console.log(`child process error ${error.message}`.bgRed);
      resolve(1);
    });
    /*
        program.on('exit', (code) => {
          console.log(`child process exit with code ${code}`);
          resolve(code);
        });
    */
  });
}
