import React, {
  AsyncStorage
} from 'react-native';
const buffer = require('buffer');

const authKey = 'auth';
const userKey = 'user';

class AuthService {
  getAuthInfo(cb){
    AsyncStorage.multiGet([authKey, userKey], (err, val) => {
      if(err){
        return cb(err);
      }
      if(!val){
        return cb();
      }

      let zippedObj = {};
      for(let i = 0; i < val.length; i++){
        zippedObj[val[i][0]] = val[i][1];
      }

      if(!zippedObj[authKey]){
        return cb();
      }
      let authInfo = {
        header: {
          Authorization: 'Basic ' + zippedObj[authKey]
        },
        user: JSON.parse(zippedObj[userKey])
      }

      return cb(null, authInfo);
    });
  }

  login(creds, cb){
    let b = new buffer.Buffer(creds.username + ':' + creds.password);
    let encodedAuth =  b.toString('base64');
    fetch('https://api.github.com/user', {
      headers: {
        'Authorization' : 'Basic ' + encodedAuth
      }
    })
      .then((response) => {
        if(response.status >= 200 && response.status < 300) {
          return response;
        }

        throw {
          badCredentials: response.status == 401,
          unknownError: response.status != 401
        }
      })
      .then((response) => {
        return response.json();
      })
      .then((results) => {
        AsyncStorage.multiSet([
          [authKey, encodedAuth],
          [userKey, JSON.stringify(results)]
        ], (err) => {
          if(err){
            throw err;
          }
          return cb({success: true})
        })
      })
      .catch((err) => {
        return cb(err);
      });
      // .finally(()=>{
      //   return cb({showProgress: false});
      // });
  }
}

module.exports = new AuthService();
