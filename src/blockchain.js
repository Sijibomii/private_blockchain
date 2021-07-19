
const SHA256 = require('crypto-js/sha256');
const BlockClass = require('./block.js');
const bitcoinMessage = require('bitcoinjs-message');

class Blockchain {
    constructor() {
        this.chain = [];
        this.height = -1;
        this.initializeChain();
    }
    async initializeChain() {
        if( this.height === -1){
            let block = new BlockClass.Block({data: 'Genesis Block'});
            await this._addBlock(block);
        }
    }

    /**
     * Utility method that return a Promise that will resolve with the height of the chain
     */
    getChainHeight() {
        return new Promise((resolve, reject) => {
            resolve(this.height);
        });
    }
    _addBlock(block) {
        let self = this;
        return new Promise(async (resolve, reject) => {
            try{
            let initChainHeight= self.height;
            let prevHash;
            if (initChainHeight === -1){
                prevHash=null
            }
            else{
               let prevBlock= self.chain[initChainHeight];
               prevHash=prevBlock.hash
            }
            block.time= new Date()
            block.height=initChainHeight++;
            self.height++;
            block.hash= SHA256(block);
            self.chain.push(block);
        }
        catch(e){
            reject(e)
        }
           resolve(block)
        });
    }
    requestMessageOwnershipVerification(address) {
        return new Promise((resolve) => {
            resolve(`${address}:${new Date().getTime().toString().slice(0,-3)}:starRegistry`)
        });
    }

    submitStar(address, message, signature, star) {
        let self = this;
        return new Promise(async (resolve, reject) => {
            let time= parseInt(message.split(':')[1]);
            const currentTime=  parseInt(new Date().getTime().toString().slice(0, -3));
            const expectedTime = time + 500;
            if(expectedTime > currentTime ){
                //under five minutes
                if(bitcoinMessage.verify(message, address, signature)){
                    //true
                    let block = new BlockClass.Block({ data: star});
                    block=await self._addBlock(block);
                    reslove(block);
                }else{
                    reject(Error('Wrong signature!'))
                }

            }else{
                reject(Error('Five minutes has elapsed!'));
            }
        });
    }

    getBlockByHash(hash) {
        let self = this;
        return new Promise((resolve, reject) => {
            const block = self.chain.filter(bl => bl.hash === hash)[0];
            if(block) resolve(block);
            resolve(null);
        });
    }
    getBlockByHeight(height) {
        let self = this;
        return new Promise((resolve, reject) => {
            let block = self.chain.filter(p => p.height === height)[0];
            if(block){
                resolve(block);
            } else {
                resolve(null);
            }
        });
    }
     getStarsByWalletAddress (address) {
        let self = this;
        let stars = [];
        return new Promise((resolve, reject) => {
            const chain = self.chain;
            chain.map((ch)=>{
              const block= ch.getBData();
                if (block && block.address === address){
                    stars.push(block);
                }
            });
            resolve(stars)
        });
    }

    /**
     * This method will return a Promise that will resolve with the list of errors when validating the chain.
     * Steps to validate:
     * 1. You should validate each block using `validateBlock`
     * 2. Each Block should check the with the previousBlockHash
     */
    validateChain() {
        let self = this;
        let errorLog = [];
        return new Promise(async (resolve, reject) => {
            
        });
    }

}

module.exports.Blockchain = Blockchain;   