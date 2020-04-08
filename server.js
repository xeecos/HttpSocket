const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
app.get('/', (req, res) => {
    res.json({msg:'Hello World!',query:req.query})
})
app.post('/post',(req,res)=>{
    res.json({"err":0,params:req.body,query:req.query})
})
app.listen(port, () => console.log(`server listening at http://localhost:${port}`));