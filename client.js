const net = require('net');
const port = 3000;
const host = 'localhost';
const client= new net.Socket();
client.setEncoding('binary');
function pack(host="localhost",port=3000,urlpath="/",method="GET",message="")
{
    if(typeof message!="string")
    {
        message = JSON.stringify(message);
    }
    let data = `${method.toUpperCase()} ${urlpath}?a=1 HTTP/1.1\n`
    data += `Host: ${host}:${port}\n`
    data += `User-Agent: uart\n`
    data += `Accept: */*\n`
    data += `Content-Length: ${message.length}\n`
    data += `Content-Type: application/json\n`
    data += `\r\n${message}`
    return data;
}
client.connect(port,host,function(){
    console.log("connected")
    let data = pack("localhost",3000,"/post","POST",{hello:"world"});
    client.write(data);
});
client.on('data',(data)=>{
    console.log('from server:'+ data);
});
client.on('error',function(error){
    console.log('error:'+error);
    client.destory();
});
client.on('close',function(){
    console.log('closed');
});