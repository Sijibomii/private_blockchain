const SHA256 = require('crypto-js/sha256');
const hex2ascii = require('hex2ascii');

class Block {
	constructor(data){
		this.hash = null;                                          
		this.height = 0;                                            
		this.body = Buffer(JSON.stringify(data)).toString('hex');   
		this.time = 0;                                              
		this.previousBlockHash = null;                              
    }
    
    validate() {
        let self = this;
        return new Promise((resolve, reject) => {
            // Save in auxiliary variable the current block hash
            let currHash= self.hash;
            // Recalculate the hash of the Block
            let newHash = SHA256(hex2ascii(self));//i'm not sure if i'm to convert this back to string
            // Comparing if the hashes changed
            if(newHash !== currHash){
                // Returning the Block is not valid
                reject(Error('Block has been tampered with'))
            }
            // Returning the Block is valid
            resolve(currHash)
        });
    }
    getBData() {
        let self = this;
        return new Promise((resolve, reject) => {
            let data= self.body;
            data= JSON.parse(hex2ascii(data));
            if(self.previousBlockHash== null){
                reject(Error('cannot return data for genesis block'));
            }
            resolve(data);
        });
    }

}

module.exports.Block = Block;     