const axios = require('axios');

module.exports = async (url) => {

    console.log(`Called with ${url}`);

    let result = {};
    
    try {
        const ret = await axios(url);
        result = ret.data.trim();
    } catch (err) {
        console.log(err);
        return err;
    }

    return result;

 };