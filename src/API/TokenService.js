import { WS_RPC } from '@vite/vitejs-ws'
import { ViteAPI, utils, abi, accountBlock, wallet } from '@vite/vitejs';
import IPFSService from './IPFSService';
const { binary, off_chain, ABI, addr } = require('./config');
const { seed } = require('./secrets');


const connection = new WS_RPC('wss://buidl.vite.net/gvite/ws'); // testnet node
        const provider = new ViteAPI(connection, () => {
        console.log("client connected");

        
    });

const CONTRACT = {
    binary: binary,
    abi: ABI,
    offChain: off_chain,
    address: addr
}
const addresses = [
    wallet.getWallet(seed).deriveAddress(0),
    wallet.getWallet(seed).deriveAddress(1),
    wallet.getWallet(seed).deriveAddress(2)
]

const users = [{
    "name": "user1",
    "address": addresses[0].address
    },
    {
    "name": "user2",
    "address": addresses[1].address
    },
    {
    "name": "user3",
    "address": addresses[2].address
    },  
];

async function callContract(account, methodName, params, amount) {
    console.log(params);
    console.log('CALLCONTRACT');
    const block = accountBlock.createAccountBlock('callContract', {
        address: account.address,
        abi: CONTRACT.abi,
        methodName,
        amount,
        toAddress: CONTRACT.address,
        params
    }).setProvider(provider).setPrivateKey(account.privateKey);

    await block.autoSetPreviousAccountBlock();
    const result = await block.sign().send();
    console.log('call success', result);
}

async function callOffChain(methodName, params){
    
    const ehex = abi.encodeFunctionCall(CONTRACT.abi, params, methodName);
    const database64 = Buffer.from(ehex, 'hex').toString('base64');
    const code = Buffer.from(CONTRACT.offChain, 'hex').toString('base64');

    const res = await provider.request('contract_callOffChainMethod', {
        address: CONTRACT.address,
        code,
        data: database64
    }).then((result) => {
        return result;
    }).catch((err) => {
        console.warn(err);
});

    const hexbuf = Buffer.from(res, 'base64').toString('hex');
    const outputabi = CONTRACT.abi.find(x=>x.name===methodName).outputs
    const out = abi.decodeParameters(outputabi, hexbuf);
    return out;
}

async function getMetaData (id) {
    const result = await callOffChain('getTokenURI', [id]);
    const getData = await IPFSService.getData(result);
    getData.id = id;
    return getData;
  }

async function subscribeToEvent(address, eventName, detected){
    const filterParameters = {"addressHeightRange":{[address]:{"fromHeight":"0","toHeight":"0"}}}; 
    const subscription = await provider.subscribe("createVmlogSubscription", filterParameters);
    subscription.callback = (res) => {
    const sig = abi.encodeLogSignature(CONTRACT.abi, eventName);
        if (sig === res[0]['vmlog']['topics'][0]) {
            const topics = [res[0]['vmlog']['topics'][1], res[0]['vmlog']['topics'][2], res[0]['vmlog']['topics'][3]];
            const data = Buffer.from(res[0]['vmlog']['data'], 'base64').toString('hex');
            const log = abi.decodeLog(CONTRACT.abi, data, topics, eventName);
            console.log('event detected', log);
            detected(log);
        }
    };
    return subscription;
}


export default class TokenService {

    static async getUsers() {
            return users;
    }

    static async createToken(metadata, user, eventDetected) {
        await subscribeToEvent(CONTRACT.address, 'Transfer', eventDetected);
        const account = addresses.filter( acc => acc.address === user );
        return await callContract(account[0], 'createToken', [metadata])
    }


    static async getAllTokens() {
        const result = await callOffChain('getAllTokens', []);
        let tokens = [];
        for (let i = 0; i < result[0].length; i++) {
            let tokenMetadata = await getMetaData(result[0][i]);
            tokens.push(tokenMetadata)
        }
        return tokens;   
    }

    static async getTokensOf(user) {
        const account = addresses.filter( acc => acc.address === user );
        const result = await callOffChain('getTokensOf', [account[0].address]);
        let tokens = [];
        for (let i = 0; i < result[0].length; i++) {
          let tokenMetadata = await getMetaData(result[0][i]);
          tokens.push(tokenMetadata)
        }
       return tokens;   
    }

    static async transferToken(from, to, tokenId, eventDetected) {
        await subscribeToEvent(CONTRACT.address, 'Transfer', eventDetected);
        const account = addresses.filter( acc => acc.address === from );
        const owner = await callOffChain('getOwnerOf', [tokenId]);
        return await callContract(account[0], 'safeTransferFrom', [owner[0], to, tokenId]);
    }

    static async  approveToken(from, to, tokenId, eventDetected) {
        await subscribeToEvent(CONTRACT.address, 'Approval', eventDetected);
        const account = addresses.filter( acc => acc.address === from );
        return await callContract(account[0], 'approve',  [to, tokenId]);
    }

    static async  getApprovedTokens(user) {
        const account = addresses.filter( acc => acc.address === user );
        const result = await callOffChain('getAllTokens', []);
        let approvedTokens = [];
        for (let i = 0; i < result[0].length; i++) {
            const isApproved = await callOffChain('isCallerApproved', [account[0].address, result[0][i]]);
            if(isApproved[0] === "1") {
                let tokenMetadata = await getMetaData(result[0][i]);
                approvedTokens.push(tokenMetadata)
            }
        }
        return approvedTokens;
    }

    static async  getOwner(tokenId) {

        const owner = await callOffChain('getOwnerOf', [tokenId]);        
        return owner[0];
    }

    static async  isOwner(user, tokenId) {
        const account = addresses.filter( acc => acc.address === user );
        const owner = await callOffChain('getOwnerOf', [tokenId]);
        return owner[0] ===  account[0].address;
    }

    static async  getApprovedAddress(tokenId) {

        const approved = await callOffChain('getApprovedAddress', [tokenId]);
        if(approved[0] === "vite_0000000000000000000000000000000000000000a4f3a0cb58") {
            return  '';
        }
        return approved[0];
    }

    static async burnToken(user, tokenId, eventDetected) {
        await subscribeToEvent(CONTRACT.address, 'Transfer', eventDetected);
        const account = addresses.filter( acc => acc.address === user );
        return await callContract(account[0], 'burnToken',  [tokenId]);

    }
    

}
