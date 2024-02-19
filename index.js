const express=require("express");
const cors=require("cors");

const app=new express();
const multer=require('multer');
const storage=multer.memoryStorage();
const upload=multer({storage:storage});
const Moviemodel=require('./model/Movie');
const Loginmodel=require('./model/Login');


app.use(express.urlencoded({extended:true}))
app.use(express.json());
app.use(cors());


app.get('/',(request,response)=>{
    response.send("hoi")
})

 
app.post('/new',upload.single('image1'),async(request,response)=>{
    // try{
        console.log(request.body)
        console.log(request.file)
        const{MovieId,MovieName,Discription,Language,Genre}=request.body
        const newdata=Moviemodel({
            MovieId,MovieName,Language,Discription,Genre,
            image1:{
                data:request.file.buffer,
                contentType:request.file.mimetype,
            }
        })
        console.log("New data:",newdata);
        await newdata.save();
        
        response.status(200).json({message:'record saved'});
    // }
    // catch(error)
    // {
    //     response.status(500).json({error:'internal server error'})
    // }
})

 app.get('/view',async(request,response)=>{
    var data=await Moviemodel.find();
    response.send(data)
})
app.put('/edit/:id',async(request,response)=>{
    let id=request.params.id;
    await Moviemodel.findByIdAndUpdate(id,request.body)
    response.send("record updated")
})

app.listen(3005,(request,response)=>{
    console.log("port is runnig in 3005")
})

app.post('/Loginsearch',async(request,response)=>{
    const {username,password}=request.body;
    try{ const user=await Loginmodel.findOne({username,password})
    console.log(user)
if(user)
{response.json({success:true,message:'Login successfully'});}
else
{response.json({success:false,message:'Invalid Username or email'});}
}
catch(error)
{
    response.status(500).json({success:false,message:'Error'})
}
})
app.listen(3006,(request,response)=>{
    console.log("port ok")
})