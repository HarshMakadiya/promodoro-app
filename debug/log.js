const fs = require('fs')
async function LOG(val){
    fs.writeFileSync("log.txt",val.toString());
}

module.exports = LOG