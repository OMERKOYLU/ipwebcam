const oran=1920/1080;
const fs=require('fs');
const remote=require('electron').remote;
const path=require('path');
//var url='';
const configFile = path.join(__dirname, 'sources','config.txt');
console.log(configFile);

window.onresize=boyutlandir;
window.onload=init;
var camID=0;
var list;
var state=false;

function changeID(i) {
    camID=i;
    for(var s=0;s<4;s++) {
        var imgSelected=document.getElementById("cam"+(s+1).toString());
        imgSelected.setAttribute("class","notSelected");
    }
    var imgSelected=document.getElementById("cam"+(i+1).toString());
    imgSelected.setAttribute("class","selected");
    var img=document.getElementById("goruntu");
    checkAndConnect(img,camID);
    var thumbs = document.getElementById("thumbs");
    thumbs.style.visibility="hidden";
}

function selectCam() {
   if (!state) {
        var thumbs=document.getElementById("thumbs");
        thumbs.style.visibility="visible";
        state=true;
        for (var i=0;i<list.length;i++) {
            var img=document.getElementById("cam"+(i+1).toString());
            checkAndConnect(img,i,false);
        }
    } else {
        var thumbs=document.getElementById("thumbs");
        thumbs.style.visibility="hidden";
        state=false;
    }
}

function showSplash() {
    var x=document.getElementById("loading");
    if (x.style.visibility==="hidden");
        x.style.visibility = "visible";
    console.log("x görünür:"+x);
}

function hideSplash() {
    var x=document.getElementById("loading");
    if (x.style.visibility==="visible")
        x.style.visibility = "hidden";
    console.log("x görünmez:"+x);
}

function switchCam(i) {
    var str=list[i];
    var end;
    str=str.substring(7,str.length);
    return str;
}

function checkAndConnect(img,camID,alertError=true) {
    var url=switchCam(camID);
    console.log(url);
            let req = new XMLHttpRequest();
            req.onload= () => {
                if (req.status===200) {
                    setImage(true,img,url);
                    req.abort();
                    return;
                    }
                if (req.readyState===4) {
                    setImage(false,img,url);
                    req.abort();
                    return;
                    }
            }
            req.onerror= () => {
                setImage(false,img,url);
                req.abort();
                if (alertError) {
                    alert("Check your network connection and configuration!\nAfter reset program");
                }
                return;
            }
            if (url!="") {
            showSplash();
                var checkURL=url.substring(0,url.length-6);
                console.log("server bu=>"+checkURL);
                req.open('GET',checkURL, true);
                req.send();
            } else {
                setImage(false,img,url);
                alert("Empty camera configuration!");
            }
    return;

}


function boyutlandir(event) {
    var g=document.getElementById("goruntu");
    var genislik=window.innerWidth;
    var yukseklik=window.innerHeight;
    if (yukseklik<genislik*(1/oran)) {
        g.setAttribute("class","x1");
    } else {
        g.setAttribute("class","x2");      
    }
}

function init(event) {
    console.log("merhaba");
    boyutlandir();
    var img=document.getElementById("goruntu");
    readConfiguration();
    checkAndConnect(img,camID);
    console.log("test başarılı");
}

function readConfiguration() {
    var data = fs.readFileSync(configFile);
    var s = data.toString();
    console.log(s);
    list = s.split("\n");
}

function setImage(condition,img,url) {
    console.log(condition);
    //var g=document.getElementById("goruntu");
    hideSplash();
    if (condition) {
        img.setAttribute("src",url);
    }  else {
        img.setAttribute("src","./notfound.png");
    }
}

function configure() {
        let win = new remote.BrowserWindow({
          parent: remote.getCurrentWindow(),
          modal: true,
          show: false,
          width:400,
          height:240,
          menubar:false,
          webPreferences: {
            nodeIntegration: true
          }
        })
        win.on('closed',()=> {
            console.log("pencere kapandı selectCam çalışıyor...");
            readConfiguration();
            state=false;
            selectCam();
        });
        win.setResizable(false);
        win.setMenuBarVisibility(false);
        win.loadFile("./configform.html");
        win.once('ready-to-show', () => {
            win.show ()
            });
}