const express = require("express");
const upload =require("express-fileupload")
var bodyParser = require('body-parser');
const app = express();
var cors = require("cors");
const fs=require('fs');
const path = require("path");
const router = express.Router();
const lineReader = require('line-reader');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(upload());
app.use(cors());
app.use(express.static(__dirname));
router.get("/", (req, res) => {
  res.send("server running")
});

function sepolicy_permission(log){
    var s=log.search("scontext");
    var t=log.search("tcontext");
    var tc=log.search("tclass");
    var p=log.search("permissive");
    var open=log.search("{");
    var close=log.search("}")
    var scontext=log.substring(s+9,t-1);
    scontext=scontext.split(':');
    var tcontext=log.substring(t+9,tc-1);
    tcontext=tcontext.split(':')
    var tclass=log.substring(tc+7,p-1);
    var permission=log.substring(open+1,close);
    var result="allow"+" "+scontext[2]+" "+tcontext[2]+":"+tclass+" "+permission+";";
    return result;
}
function findpath(directory,result){
  var ans=""
  try{
    const filenames=fs.readdirSync(directory);
    filenames.forEach(function(file){
    try {
      const data = fs.readFileSync(directory+file, 'utf-8')
      if(data.indexOf(result)<0){
          ans=directory+file;
      }
      else
        ans=""
    } 
    catch (err) {
      console.log(err)
    }
    });  
  }
  catch(err){
    console.log(err);
  }
  return ans;
};

router.post("/submit", function(req, res){
    // let log =req.body.log;
    // console.log(log);
    // res.send(log);
    var log=req.body.log;
    console.log(log)
    
    // var store=[];
    // store.push(result);
    
    //For Exynos
    // var found1=findpath(__dirname+'/PROD_S/Exynos/',result);
    // if(found1.length!=0)
    // store.push(found1);
    // //For Qualcomm
    // var found2=findpath(__dirname+'/PROD_S/mediatek/',result);
    // if(found2.length!=0)
    // store.push(found2);
    // //For MediaTek
    // var found3=findpath(__dirname+'/PROD_S/qualcomm/',result);
    // if(found2.length!=0)
    // store.push(found3);

    // for(let i=0;i<store.length;i++)
    //   res.write(store[i]+'\n');

    // res.end();
 });

router.get("/get_submit/:txt",function(req,res){
  var log=req.params.txt;
  console.log(log);
  var result=sepolicy_permission(log);
  console.log(result);
  res.send(result);

})
router.post("/submit_file",function(req,res){
  if(req.files)
  {
    //console.log(req.files);
    var file=req.files.file;
    var filename=file.name;
    file.mv('./uploads/'+filename,function(err){
      if(err){
        res.write(err);
      }
    });
    lineReader.eachLine(__dirname+'/Log.txt', (line, last) => {
      if(line.includes('avc')){
        var log=line;
        //help(line);
        console.log(log);
        var result=sepolicy_permission(log);
        var store=[];
        store.push(result);
      
        //For Exynos
        var found1=findpath(__dirname+'/PROD_S/Exynos/',result);
        if(found1.length!=0)
        store.push(found1);
        //For Qualcomm
        var found2=findpath(__dirname+'/PROD_S/mediatek/',result);
        if(found2.length!=0)
        store.push(found2);
        //For MediaTek
        var found3=findpath(__dirname+'/PROD_S/qualcomm/',result);
        if(found2.length!=0)
        store.push(found3);


        for(let i=0;i<store.length;i++)
          res.write(store[i]+'\n');
      }
    });
    //res.write('completed');    
  }
  else{
    res.send('No file');
  }
  
});

app.use(bodyParser.urlencoded({extended: false}));
app.use("/", router);
app.use('/submit',router);
app.use("/get_submit/:txt",router);
app.use('/submit_file',router);
app.listen(process.env.port || 5000);

console.log("Running at Port 5000");