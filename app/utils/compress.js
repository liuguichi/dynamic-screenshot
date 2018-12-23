const tinify = require("tinify");
const log = console.log;

tinify.key = "qGhhjp985hBnJ32D7K2SzKp1pfJ0Gm1k";

async function compress(pathName) {
    log(`[Image ${pathName} compress start...]`);
    const source = tinify.fromFile(pathName);
    await source.toFile(pathName)
        .then(() => {
            log(`[Image ${pathName} compress was successfully finished]`);
        })
        .catch((e) => {
            console.log(`[Image ${pathName} compress was failed, caused by \n ${JSON.stringify(e)}]`);
        });
}

module.exports = compress;