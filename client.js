const net = require('net');
const fs = require("fs");
const port = 3000;
const host = 'localhost';
const client= new net.Socket();
client.setEncoding('binary');
function jsonPack(host="localhost",port=3000,urlpath="/",method="GET",message="")
{
    if(typeof message!="string")
    {
        message = JSON.stringify(message);
    }
    let data = `${method.toUpperCase()} ${urlpath}?a=1 HTTP/1.1\r\n`
    data += `Host: ${host}:${port}\r\n`
    data += `User-Agent: uart\r\n`
    data += `Accept: */*\r\n`
    data += `Content-Length: ${message.length}\r\n`
    data += `Content-Type: application/json\r\n`
    data += `\r\n\r\n${message}`
    return data;
}
function binaryPack(host="localhost",port=3000,urlpath="/",method="POST",buffer=null)
{
    let data = `${method.toUpperCase()} ${urlpath}?a=1 HTTP/1.1\r\n`
    data += `Host: ${host}:${port}\r\n`
    data += `User-Agent: uart\r\n`
    data += `Accept: */*\r\n`
    data += `Content-Length: ${buffer.length}\r\n`
    data += `Content-Type: application/octet-stream\r\n`
    data += `\r\n\r\n`
    let pack = Buffer.from(data);
    return Buffer.concat([pack,buffer]);
}
client.connect(port,host,function(){
    console.log("connected")
    // let data = jsonPack("localhost",3000,"/post","POST",{hello:"world"});
    // let data = binaryPack("localhost",3000,"/upload","POST",fs.readFileSync("./a.gif"));

    let data = jsonPack("localhost",3000,"/image","GET",{hello:"world"});
    client.write(data);
});
client.on('data',(data)=>{
    console.log(data);
    console.log(JSON.parse(data.split("\r\n\r\n").pop()));
});
client.on('error',(error)=>{
    console.log('error:'+error);
    client.destroy(error);
});
client.on('close',function(){
    console.log('closed');
});