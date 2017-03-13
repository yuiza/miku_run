(() => {
   const miku = document.getElementById('miku');
   const haku = document.getElementById('haku');
   const ws = document.getElementById('ws');
   const set = document.getElementById('set');
   
   miku.addEventListener('click',() => {
        chrome.runtime.sendMessage({type:'miku'}, (res) => {
            console.log(res);
        });
    });
    
    haku.addEventListener('click',() => {
        chrome.runtime.sendMessage({type:'haku'}, (res) => {
            console.log(res);
        });
    });
    
    ws.addEventListener('click', () =>{
        chrome.runtime.sendMessage({type:'ws'}, (res) => {
            console.log(res);
        });
    });
    
    set.addEventListener('click', () => {
        const ip = document.getElementById('ip').value;
        if(ip === '')
            alert('^^;');
        
        chrome.runtime.sendMessage({type:'ip', server: ip}, (res) => {
            console.log(res);
        });
    });
})();