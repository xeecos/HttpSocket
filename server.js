const net = require('net');
const fs = require("fs");
const port = 3000;
const host = 'localhost';
function jsonPack(msg)
{
    if(typeof msg=="object")
    {
      msg = JSON.stringify(msg)
    }
   let data = `HTTP/1.1 200 OK\r\n`
      data+=`Content-Type: application/json; charset=utf-8\r\n`
      data+=`Content-Length: ${msg.length}\r\n`
      data+=`Date: ${new Date()}\r\n`
      data+=`Connection: keep-alive\r\n\r\n`
      data+=`${msg}`
    return data;
}

function binaryPack(mime,buffer)
{
    let data = `HTTP/1.1 200 OK\r\n`
      data+=`Content-Type: ${mime};\r\n`
      data+=`Content-Length: ${buffer.length}\r\n`
      data+=`Date: ${new Date()}\r\n`
      data+=`Connection: keep-alive\r\n\r\n`
    let pack = Buffer.from(data);
    return Buffer.concat([pack,buffer]);
}
const server = net.createServer((socket)=>{
  let header = "";
  let body = [];
  let isHeader = true;
  let headerObj = null;
  socket.on('data', (data)=>{
    let headerEnd = data.indexOf('\r\n\r\n');
    if(isHeader)
    {
      if(headerEnd>-1){
        header+=data.slice(0,headerEnd).toString();
        isHeader = false;
      }else{
        header+=data.toString();
      }
    }
    if(!isHeader&&!headerObj)
    {
      headerObj = {};
      headers = header.split('\r\n').filter((v)=>{return v!=''});
      headers.forEach((item,index)=>{
        if(index==0){
          let arr = item.split(" ");
          headerObj.method = arr[0];
          headerObj.url = arr[1];
          headerObj.http = arr[2];
        }else{
          let arr = item.split(" ");
          let key = arr[0];
          arr.shift();
          let value = arr.join(" ");
          headerObj[key.split(":").join("")] = value;
        }
      })
      if(headerObj['Content-Length']){
        headerObj['Content-Length'] = Number(headerObj['Content-Length']);
      }
      body.push(data.slice(headerEnd+2,data.length));
    }else if(!isHeader)
    {
      body.push(data.slice(0,data.length));
    }
    if(headerObj){
      let bodyLength = 0;
      for(let i=0,len=body.length;i<len;i++)
      {
        bodyLength+=body[i].length;
      }
      if(headerObj.method=="GET"||bodyLength==headerObj['Content-Length'])
      {
        switch(headerObj.method){
          case "POST":
            {
              if(headerObj.url.indexOf("/post")){
                socket.write(jsonPack({err:0}));
              }else if(headerObj.url.indexOf("/upload")){
      // fs.writeFileSync("./uploads/tmp.gif",file);
                let file = Buffer.concat(body)
                socket.write(jsonPack({err:0}));
              }
            }
            break;
            case "GET":
            {
              if(headerObj.url.indexOf("/image")>-1){
                socket.write(binaryPack("image/gif",fs.readFileSync("a.gif")));
              }
            }
            break;
        }
      }
    }
  });
  socket.on('close', ()=>{
  });
});
server.listen(port, host, ()=>{
  console.log(`server listening at http://${host}:${port}`);
});