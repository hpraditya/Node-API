const express = require('express');
const app = express();
const port = process.env.PORT || 9900;
const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const bodyParser = require('body-parser');
const cors = require('cors');

const mongourl = "mongodb+srv://admin:admin@cluster0.0y7ku.mongodb.net/restAppEdureka?retryWrites=true&w=majority";
let db;

// mendefinisikan body parser agar bisa post ke db
app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

// test connection
app.get('/',(req,res)=>{
    res.send("Connected");
});


// rest route 
app.get('/rest',(req,res)=>{
    var condition = {};
    // get restraurant based on mealtype and cost lower than upper limit and greater than lower limit
    if(req.query.mealtype && req.query.lcost && req.query.hcost){
        condition ={$and:[{"type.mealtype":req.query.mealtype},
                    {cost:{$lt:Number(req.query.hcost),$gt:Number(req.query.lcost)}}]}; 
    }

    // get restaurant based on mealtype AND cuisine
    else if(req.query.mealtype && req.query.cuisine){
        condition ={$and :[{"type.mealtype":req.query.mealtype},{"Cuisine.cuisine":req.query.cuisine}]}; 
    }

    // get restaurant based on meal type AND city
    else if(req.query.mealtype && req.query.city){
        condition ={$and :[{"type.mealtype":req.query.mealtype},{city:req.query.city}]}; 
    }

    // get restaurant based on mealtype
    else if(req.query.mealtype){
        condition ={"type.mealtype":req.query.mealtype}; 
    }

    // get restaurant based on city
    else if(req.query.city){
        condition ={city:req.query.city}; 
    }

    db.collection('restaurant').find(condition).toArray((err,result)=>{
        if(err) throw err;
        res.send(result);
    });
});

// rest per meal id route 
app.get('/restFilter/:mealId',(req,res)=>{
    var condition = {};
    // get restraurant based on mealtype and cost lower than upper limit and greater than lower limit
    if(req.query.mealtype && req.query.lcost && req.query.hcost){
        condition ={$and:[{"type.mealtype":req.query.mealtype},
                    {cost:{$lt:Number(req.query.hcost),$gt:Number(req.query.lcost)}}]}; 
    }

    // get restaurant based on mealtype AND cuisine
    else if(req.query.mealtype && req.query.cuisine){
        condition ={$and :[{"type.mealtype":req.params.mealId},{"Cuisine.cuisine":req.query.cuisine}]}; 
    }

    db.collection('restaurant').find(condition).toArray((err,result)=>{
        if(err) throw err;
        res.send(result);
    });
});

//rest details
app.get('/rest/:id',(req,res)=>{
    var id = req.params.id;
    db.collection('restaurant').find({_id:id}).toArray((err,result)=>{
        if(err) throw err;
        res.send(result);
    });
});


//city route
//sort based on city name asc=1 or desc=-1
app.get('/city',(req,res)=>{
    let limit = 100;
    let sortCondition = {city_name:1};
    if(req.query.sort && req.query.limit){
        sortCondition = {city_name: Number(req.query.sort)};
        limit = Number(req.query.limit);
    }
    else if(req.query.sort){
        sortCondition = {city_name: Number(req.query.sort)};
    }
    else if(req.query.limit){
        limit = Number(req.query.limit);
    }
    db.collection('city').find().sort(sortCondition).limit(limit).toArray((err,result)=>{
        if(err) throw err;
        res.send(result);
    });
});

//mealtype route
app.get('/mealtype',(req,res)=>{
    db.collection('mealtype').find().toArray((err,result)=>{
        if(err) throw err;
        res.send(result);
    });
});

//cuisine route
app.get('/cuisine',(req,res)=>{
    db.collection('cuisine').find().toArray((err,result)=>{
        if(err) throw err;
        res.send(result);
    });
});

//place order
app.post("/placeorder",(req,res)=>{
    db.collection('orders').insert(req.body, (err,result)=>{
        if(err) throw err;
        res.send("data added");
    });
});

// get all order
app.get("/orders",(req,res)=>{
    db.collection('orders').find({}).toArray((err,result)=>{
        if(err) throw err;
        res.send(result);
    });
});

MongoClient.connect(mongourl,(err,connection)=>{
    if(err) console.log(err);
    db = connection.db('restAppEdureka');

    app.listen(port,(err)=>{
        if(err) throw err;
        console.log(`Server is running on port ${port}`);
    });
});