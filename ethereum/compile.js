import path from 'path';
import solc from 'solc';
import fs from 'fs-extra'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename);

const build_path = path.resolve(__dirname, 'build')
fs.removeSync(build_path)

const campaign_path = path.resolve(__dirname, 'contracts', 'Campaign.sol');
const source = fs.readFileSync(campaign_path, 'utf-8')

// Standard JSON input (required for 0.8.x)
const input = {
  language: 'Solidity',
  sources: {
    'Campaign.sol': { content: source },
  },
  settings: {
    optimizer: { enabled: true, runs: 200 },
    outputSelection: {
      '*': {
        '*': ['abi', 'evm.bytecode.object', 'evm.deployedBytecode.object', 'metadata']
      }
    }
  }
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));

if (output.errors) {
  // Show all errors and warnings
  for (const e of output.errors) {
    console.log(e.severity.toUpperCase(), e.formattedMessage);
  }
  // If there is any error (not just warning), stop
  const hasError = output.errors.some(e => e.severity === 'error');
  if (hasError) process.exit(1);
}

fs.ensureDirSync(build_path);

// Write each compiled contract to build/
for (const [fileName, contracts] of Object.entries(output.contracts)) {
  for (const [name, data] of Object.entries(contracts)) {
    const outFile = path.resolve(build_path, `${name}.json`);
    fs.outputJSONSync(outFile, {
      abi: data.abi,
      bytecode: data.evm.bytecode.object,
      deployedBytecode: data.evm.deployedBytecode.object,
      metadata: data.metadata
    }, { spaces: 2 });
    console.log(`Wrote ${name} -> ${outFile}`);
  }
}