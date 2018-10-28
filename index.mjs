/**
 *  Node JS Master class 1 
 *  Using ES 6 Syntax
 *  Create a basic server
 * 
 */

 import http from 'http';
 import https from 'https';
 import url from 'url';
 import * as config from './config.mjs';
 import fs from 'fs';


 /**
  * Environment Handlers
  */

const {port, envName, httpsPort } = config.envtoPass;

 /**
  *  Router Handler
  */
const handlers = {
    sample: (data, callback) => {
        callback(200, { 'sample': 'I am a sample handler' })
    },
    notFound: (data, callback) => {
        callback(400)
    },
    ping: (data, callback) => {
        callback(200)
    },
    helloWorld : (data, callback) => {
        callback(200, {"message":"Hello World API"})
    }
};
 /**
  * Router configuration
  */
 const router = {
      'sample': handlers.sample,
      'ping': handlers.ping,
      'helloworld': handlers.helloWorld
 }

 const server = http.createServer((req,res) => {
    unifiedServer(req, res);
 });



 var httpsServerOptions = {
     'key': fs.readFileSync('./https/key.pem'),
     'cert': fs.readFileSync('./https/cert.pem')
 };

 const httpsServer = http.createServer(httpsServerOptions, (req,res) => {
    unifiedServer(req, res);
 })

const listener = server.listen(port, () => {
     console.log(`Server is running on port no ${listener.address().port} and environment is ${envName}`);
 })

const httpsListener = httpsServer.listen(httpsPort, () => {
    console.log(`Server is running on port no ${httpsListener.address().port} and environment is ${envName}`);
}) 

 const unifiedServer = ( req, res ) => {
    const parsedUrl = url.parse(req.url, true);
    const { pathname, query: querySTringObject } = parsedUrl;
    const trimmedPath = pathname.replace(/^\/+|\/+$/g,'');
    const { method, headers } = req;
    
   let buffer = '';

   req.on('data', data => {
       buffer +=data
   });

   req.on('end',() => { 
       const chooseHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;
       const data = {
          trimmedPath,
          querySTringObject,
          method,
          headers,
          'payload': buffer
       }
       chooseHandler(data, (statusCode, payload)=> {
            const response = typeof(payload) === 'object' ? payload : {"message":"not found"};
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(JSON.stringify(response));
       });
   });
 }