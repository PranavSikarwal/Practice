const axios = require('axios');
const HttpError = require('../models/http-error');
require('dotenv').config();
const API_Key = process.env.GEOENCODING_KEY; //tom tom geocoding api key

const geoEncoding = async(address)=>{
    const result  = await axios.get(`https://api.tomtom.com/search/2/geocode/${address}.json?key=${API_Key}`);
    if(result.data.results.length==0){
        throw new HttpError("Place can not be GeoCoded" ,400);
    }
    const coords = result.data.results[0].position;
    return {lat:coords.lat, lng:coords.lon};
};
module.exports = geoEncoding;