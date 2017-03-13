'use strict';

//画像格納用
const avt = {};

//表示中アバター
const avt_list = {};

//get image
avt['miku'] = chrome.extension.getURL('/images/miku.gif');
avt['haku'] = chrome.extension.getURL('/images/haku.gif');

const randomPosition = () => {
    // 0 ~ 10 ~ 100
    let r = (Math.floor(Math.random()*10)) * 10;
    
    return r;
}

const avtId = () => {
    const char = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let ret = '';
    for(let i = 0; i < 8; i++){
        ret += char[Math.floor(Math.random()*char.length)]
    };
    return ret;
}

// const setAvt = (uniqName, top) => {
const setAvt = (config) => {
    if(!config.id)
        config.id = avtId();
    if(!config.top)
        config.top = randomPosition() + 'vh';
    if(!config.left)
        config.left = window.innerWidth + 'px';

    const div = document.createElement('div');
    
    avt_list[config.id] = config.avt;
    
    div.id = config.id;
    // set div style
    div.className = config.id;
    div.style.width = '120px';
    div.style.top = config.top;
    div.style.left = config.left;
    div.style.position = 'fixed';
    div.style.zIndex = '100000';   
    
    //div in img tag
    div.innerHTML = '<img src = ' + avt[config.avt] + '>';

    //add DOM
    const dom = document.getElementsByTagName('body')[0];
    dom.appendChild(div);
    
    //const anime = new 
    animation_start(div);
}

const animation_start = (dom) => {
    const time =  Math.floor( (parseInt(dom.style.left) /  window.innerWidth) * 10);
    //console.log(time);
    
    TweenMax.to('.' + dom.id, time, {
        left:'-105px',
        ease: Power0.easeNone,
        onComplete : (el) => {
            animation_end(dom);
        }
    });
}

const animation_end = (dom) => {
    const message = {
        type: 'forward',
        id: dom.id,
        top: dom.style.top,
        avt: avt_list[dom.id]
    }
  
    //sendMessage -> background.js -> server
    chrome.runtime.sendMessage(message,(res)=>{
        // console.log('forward', res);
    });
   
    // remove avter info
    delete avt_list[dom.id];
    dom.parentNode.removeChild(dom);
}


/** Main Script */
chrome.runtime.onMessage.addListener((req, sender, res) => {
    //const msg = {id: undefined, avt: undefined, top: undefined, left: undefined}
    switch(req.type){
        case 'miku':
            setAvt({id: undefined, avt: req.type, top: undefined, left: undefined});
            break;
        case 'haku':
            setAvt({id: undefined, avt: req.type, top: undefined, left: undefined});
            break;
        case 'get':
            let returnInfo = {};
            if(Object.keys(avt_list).length === 0)
                return;
                
            for(let key in avt_list){
                const dom = document.getElementById(key);
                const values = {
                    id: key,
                    avt: avt_list[key],
                    top: dom.style.top,
                    left: dom.style.left
                }
                returnInfo[key] = values;
                
                // delete Tween Animations 
                TweenMax.killAll();
                // remove avt_info
                delete avt_list[dom.id];
                //remove dom
                dom.parentNode.removeChild(dom);
            }
            res(returnInfo);
            break;
        case 'forward':
            console.log(req.id);
            const id = req.id;
            avt_list[req.id] = req.avt;
            setAvt({id: id, avt: req.avt, top: req.top, left: undefined});
            break;
        case 'update':
            for(let id in req.info){
                avt_list[id] = id.avt;
                setAvt({id: id, avt: req.info[id].avt, top: req.info[id].top, left: req.info[id].left});
            }
            break;
                    
        default:
            console.log(req);
            break;
    }
    return true;
});