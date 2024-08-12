import axios from "react-native-axios";
const qs = require('qs');
import { base_url,base_url1 } from '../apiHelper/APIs.json';
import RNFetchBlob from 'rn-fetch-blob';

export const GET = (url, callBack) => {
    axios.get(base_url + url)
        .then(function (response) {
            let responseData = response.data;
            callBack({ status: responseData.status ? '0' : '1', responseData });
        })
        .catch(function (error) {
            if (error.response) {
                console.log(error.response.data);
            } else {
                console.log('Error', error.message);
            }
            callBack({ status: '1', error });
        });
}

export const POST = (url, requestBody, callBack) => {
    console.log("url",url,requestBody)
    axios.post(base_url + url, qs.stringify(requestBody))
        .then(function (response) {
            console.log("response",response)
            let responseData = response.data;
            callBack({ status: responseData.status ? '0' : '1', responseData });
        })
        .catch(function (error) {
            if (error.response) {
                console.log(error.response.data);
            } else {
                console.log('Error', error.message);
            }
            callBack({ status: '1', error });
        });
}

export const AXIOS_ALL = (function1, function2, callBack) => {
    axios.all([function1, function2])
        .then(axios.spread(function (acct, perms) {
            // Both requests are now complete
        }));
}