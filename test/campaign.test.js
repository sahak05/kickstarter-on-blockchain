import assert from 'assert'
import ganache from 'ganache'
import {Web3} from 'web3'
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read compiled artifacts
const Campaign = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../ethereum/build/Campaign.json'), 'utf-8')
);
const CampaignFactory = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../ethereum/build/CampaignFactory.json'), 'utf-8')
);

const web3 = new Web3(ganache.provider())

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts()

    factory = await new web3.eth.Contract(CampaignFactory.abi).deploy(
        {data: CampaignFactory.bytecode}
    ).send({
        from: accounts[0], gas: '1000000'
    })

    await factory.methods.createCampaign('100').send({
        from: accounts[0],
        gas: '1000000'
    })

    const addresses = await factory.methods.getDeployedCampaigns().call()
    campaignAddress = addresses[0]

    // Retrieve the campaign from the address
    campaign = await new web3.eth.Contract(Campaign.abi, campaignAddress)
})


describe('Campaign', () => {
    it('Deploys a factory and a campaign', () => {
        assert.ok(factory.options.address)
        assert.ok(campaign.options.address)
    })

    it('Validate the manager of the campaign is the caller', async () => {
        const manager = await campaign.methods.manager().call()
        assert.equal(manager, accounts[0])
    })

    it('allows people to contribute money', async () => {
        await campaign.methods.contribute().send({
            value: '200',
            from: accounts[1]
        })

        const isAnApprover = await campaign.methods.approvers(accounts[1]).call()
        assert(isAnApprover)
    })

    it('requires a minimum contribution', async () => {
        try {
            await campaign.methods.contribute().send({
                value: '50',
                from: accounts[2]
            })
            assert(false)
        } catch(err) {
            assert(err)
        }
    })

})