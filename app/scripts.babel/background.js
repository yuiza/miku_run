'use strict';

// chrome.runtime.onInstalled.addListener(details => {
//   console.log('previousVersion', details.previousVersion);
// });
const avtInfo = {};
let previousTab;

const serverInfo = {
  uri : null,
  ws : null,
};

//serverInfo.uri = 'ws://localhost:3000';

const ws_init = () => {
  if(serverInfo.ws === null){
    serverInfo.ws = new WebSocket(serverInfo.uri);
    
    serverInfo.ws.onopen = (ev) => {
      console.log('websocket open');
    }
    
    serverInfo.ws.onmessage = (message) => {
      console.log('websocket recived', message.data);
      const json = JSON.parse(JSON.parse(message.data));      
      contentScript(json);
    }
    
    serverInfo.ws.onclose = (ev) => {
      console.log('close', ev);
    }
    
    serverInfo.ws.onerror = (err) => {
      console.log('error', err);
    }
  }
}

var isJSON = function(arg) {
    arg = (typeof arg === 'function') ? arg() : arg;
    if (typeof arg  !== 'string') {
        return false;
    }
    try {
    arg = (!JSON) ? eval('(' + arg + ')') : JSON.parse(arg);
        return true;
    } catch (e) {
        return false;
    }
};

chrome.runtime.onMessage.addListener(function(req, sender, res){
  console.log(req);
  switch(req.type){
    case 'ip':
      serverInfo.uri = 'ws://' + req.server;
      break;
    case 'ws':
      if(!serverInfo.ws){
        ws_init();
      }
      break;
      // 接続と同時にミク
    case 'miku':
      contentScript({type:req.type});
      break;
    case 'haku':
      contentScript({type:req.type});
      break;
    case 'forward':
      if(serverInfo.ws.readyState === WebSocket.OPEN){
        const msg = JSON.stringify(req);
        serverInfo.ws.send(msg);
      }else{
        contentScript(req);
        //res(req);
      }
      break;
    case 'update':
      console.log(req.type);
      avtInfo[req.id] = {top: req.top, left: req.left};
      console.log(avtInfo[req.id]);
      //res('update ok');
      break;
    default:
      console.log('unknown type');
      break;
  }
  return true;
});

chrome.tabs.onActivated.addListener((tabInfo)=>{
    if( !(previousTab === tabInfo.tabId) && previousTab ){
      chrome.tabs.sendMessage(previousTab, {type: 'get'}, (res) =>{        
        const msg = {
          type: 'update',
          info: res
        }
        
        // send new tab
        chrome.tabs.sendMessage(tabInfo.tabId, msg, function(){});
        
        previousTab = tabInfo.tabId;
      });
    }else if(!previousTab){
      previousTab = tabInfo.tabId;
    } 
});

const contentScript = (message) => {
  console.log('contentScript',message);
  
  const queryTarget = {
    active: true,
    windowId: chrome.windows.WINDOW_ID_CURRENT
  };
  
  chrome.tabs.query(queryTarget, (result) => {
    //get the head tab info
    console.log('DEBUG', result);
    const target = result.shift();
    
    // send to current tab
    chrome.tabs.sendMessage(target.id, message, function(){});
  });
}

// get app root
// const getMiku = () => {
//   return new Promise((resolve) => {
//     chrome.runtime.getPackageDirectoryEntry((root)=>{
//         root.getDirectory('images', {create: false}, (dir) => {
//           dir.getFile('miku.gif', {create: false}, (gif) => {
//             gif.file((data) => {
//               const reader = new FileReader;
//               reader.onload = (e) => {
//                 //result
//                 resolve(e.target.result);
//               }
//               reader.readAsDataURL(data);
//             });
//           }, (e) => {
//             console.log(e);
//           });
//         }, (e) => {
//           console.log(e);
//         });
//     });
//   });
// }