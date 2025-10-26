import HDWalletProvider from '@truffle/hdwallet-provider';
import { Web3 } from 'web3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CampaignFactory = JSON.parse(
  fs.readFileSync(path.join(__dirname, './build/CampaignFactory.json'), 'utf-8')
);

 
provider = new HDWalletProvider(
  'YOUR_MNEMONIC',
  'YOUR_INFURA_URL'
);
 
const web3 = new Web3(provider);
 
const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
 
  console.log('Attempting to deploy from account', accounts[0]);
 
  const result = await new web3.eth.Contract(CampaignFactory.abi)
    .deploy({ data: CampaignFactory.bytecode, arguments: ['Hi there!'] })
    .send({ gas: '1000000', from: accounts[0] });
 
  console.log('Contract deployed to', result.options.address);
  provider.engine.stop();
};
 
deploy();