const {google} = require('googleapis');
let oauth2Client;
const fs = require('fs');
const url = require('url');
const { method } = require('bluebird');
const { resolve } = require('path');
const scopes = [
    'https://www.googleapis.com/auth/youtube.force-ssl'
];
function return_data(){
    return new Promise((resolve, reject) => {fs.readFile('secret.json', 'utf-8', function (err, data) {
        if (err) throw err;

        var obj = JSON.parse(data);
        console.log(obj.web.redirect_uris[0]);

        let YOUR_CLIENT_ID = obj.web.client_id;
        let YOUR_CLIENT_SECRET = obj.web.client_secret;
        let YOUR_REDIRECT_URL = obj.web.redirect_uris
        ;
            resolve([YOUR_CLIENT_ID, YOUR_CLIENT_SECRET, YOUR_REDIRECT_URL]);
    })});

}

async function maketokenrefresh(refresh_token, ws){
    const data = await return_data();
    const header = new Headers({
        'Content-Type': 'application/x-www-form-urlencoded',

    });
    const body = {
        client_id:data[0],
        client_secret:data[1],
        refresh_token:refresh_token,
        grant_type:"refresh_token"
    };

    const response = new Promise((resolve) =>  resolve(fetch(`https://oauth2.googleapis.com/token?client_id=${data[0]}&client_secret=${data[1]}&refresh_token=${refresh_token}&grant_type=refresh_token`,{
        method: 'POST'
    }
    ))).then((value) =>{
        new Promise((resolve) => resolve(value.json())).then((result) =>
{
    ws.send(JSON.stringify(result));
})});
        
        
    }
async function makeauth() {
    const data = await return_data();
    oauth2Client = new google.auth.OAuth2(
        data[0],
        data[1],
        data[2][0]
    );
}

function get_autorizationURL(){

    return oauth2Client.generateAuthUrl({
        // 'online' (default) or 'offline' (gets refresh_token)
        access_type: 'offline',
        /** Pass in the scopes array defined above.
         * Alternatively, if only one scope is needed, you can pass a scope URL as a string */
        scope: scopes,
        // Enable incremental authorization. Recommended as a best practice.
        include_granted_scopes: true
    });

}
 async function get_token(authorise, ws){
    //console.log(oauth2Client);
     //console.log(authorise);
     let q = await url.parse(authorise, true).query;
     //console.log(q.code);
     let token_generator = new Promise((resolve) => {

         try{
                      resolve(oauth2Client.getToken(q.code))}catch (e){
             console.log(e);
             
         }
     });
     //console.log(ws);
     await token_generator.then((value) => {
       ws.send(JSON.stringify(value))});


     //oauth2Client.setCredentials(token);
    // console.log(oauth2Client);
   //  console.log(token);


}

module.exports.return_data = return_data;
module.exports.makeauth = makeauth;
module.exports.get_autorizationURL = get_autorizationURL;
module.exports.get_token = get_token;
module.exports.maketokenrefresh = maketokenrefresh;