const fs = require('fs');
const remote = require('electron').remote;
const path=require('path');
const configFile = path.join(__dirname, 'sources','config.txt');
var lines;

window.onload=function() {
    let read=fs.readFileSync(configFile);
    let dataString=read.toString();
    lines=dataString.split("\n");
    document.getElementById("cam1").checked=true;
    var values=resolve(0);
    document.getElementById("ip").value=values.address;
    document.getElementById("port").value=values.port;
    console.log(values);
}

function setValues(i) {
    var values=resolve(i);
    document.getElementById("ip").value=values.address;
    document.getElementById("port").value=values.port;
    console.log(values);
}

function resolve(i) {
    var s=lines[i];
    s=s.substring(14,s.length);
    console.log(s);
    var IPAddress=s.substring(0,s.indexOf(":"));
    var portNumber=s.substring(s.indexOf(":")+1,s.indexOf("/"));
    var ret={
        address:IPAddress,
        port:portNumber
    };
    return ret;
}

function save() {
    console.log(lines);
    let cam1=document.getElementById("cam1");
    let cam2=document.getElementById("cam2");
    let cam3=document.getElementById("cam3");
    let cam4=document.getElementById("cam4");
    let preRecord="";
    if (cam1.checked) preRecord="Cam 1:";
    if (cam2.checked) preRecord="Cam 2:";
    if (cam3.checked) preRecord="Cam 3:";
    if (cam4.checked) preRecord="Cam 4:";   
    let ip=document.getElementById("ip").value;
    let port=document.getElementById("port").value;
    let url="http://"+ip+":"+port+"/video";
    switch (preRecord) {
        case "Cam 1:":
            lines[0]=">"+preRecord+url;
            break;
        case "Cam 2:":
            lines[1]=">"+preRecord+url;
        case "Cam 3:":
            lines[2]=">"+preRecord+url;
            break;
        case "Cam 4:":
            lines[3]=">"+preRecord+url;
            break;
        default:
            break;
    }
    let data="";
    lines.forEach(l => {
        l+="\n";
        data+=l;
    });
    data=data.trimRight();
    console.log(data);
    fs.writeFileSync(configFile,data,"utf-8");
    // fs.writeFile("./config.txt",url,(err)=>{
    //     if (err) console.log(err.message);
    //     else {
    //         var w=remote.getCurrentWindow();
    //         w.close();
    //     }
    // });
    console.log("kaydet tıklandı...");
    var w=remote.getCurrentWindow();
    w.close();
    return;
}