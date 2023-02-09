const express = require('express')
const path = require('path')
const { MongoClient } = require("mongodb");
const app = express()
const util = require('util')
const port = 3000
var db;
var client;
var CATEGORIES = [];
var ITEMS = [];
var CONFIG = [];

var dbUrl ="mongodb+srv://admin:ilovemillie123@project.cib5r.mongodb.net/?retryWrites=true&w=majority";

async function connectMongo(){
	(async () => {
        client = await MongoClient.connect(dbUrl,
            { useNewUrlParser: true });

        db = client.db('project');
        try {
    		CONFIG = await db.collection("config").find({}).toArray();
			CATEGORIES = await db.collection("categories").find({}).toArray();
			ITEMS = await db.collection("items").find({}).toArray();		
        }
        finally {
            console.log("all loaded");
    		app.set("view engine", "ejs");
			app.use(express.static(path.join(__dirname, "public")));

			app.listen(port, () => {
			  console.log(`Example app listening on port ${port}`)
			});

    		app.get("/", (req, res) => {
				res.render("index", { categories: CATEGORIES})
			});

			app.get("/browse", (req, res) => {
				refreshItems();
				res.render("browse", {categories: CATEGORIES, items : ITEMS})
			});

			app.get("/order", (req, res) => {
				res.render("order", { categories: CATEGORIES, items: ITEMS})
			});

			app.post("/payment", (req, res) => {
				res.render("payment")
			});




			// GET FULL CATEGORY OBJECT
			app.get('/category/:id', (req, res)=>{
				console.log('req is ' + req);
				var category_id = parseInt(req.params.id);
				console.log('try to find category ' + category_id);
				db.collection("categories").findOne({"id": category_id}, function(error, categoriesResult) {
					db.collection("items").find({}).toArray(function(error, itemsResult){
						if(categoriesResult == null) return;
						var categoryAddons = categoriesResult.addons;
						var categoryIncluded = categoriesResult.included;
						console.log('add ons ' + categoryAddons + ' included ' + categoryIncluded);
						var finalIncludedArray = [];
						var finalAddonsArray = [];
						for(var i=0;i<itemsResult.length;i++){
							console.log(' from items array. id ' + itemsResult[i].id);
							if(categoryAddons != null && categoryAddons.includes(itemsResult[i].id)){
								finalAddonsArray.push(itemsResult[i]);
								console.log('adding ' + itemsResult[i].id + ' to array');
							}else if (categoryIncluded != null && categoryIncluded.includes(itemsResult[i].id)){
								finalIncludedArray.push(itemsResult[i]);
							}
						}
						console.log('# included ' + finalIncludedArray.length + ' # add on ' + finalAddonsArray.length);
						console.log('category: ' + categoriesResult);
						categoriesResult.included = finalIncludedArray;
						categoriesResult.addons = finalAddonsArray;
						res.json({"IsSuccess" : true, "category" : categoriesResult});
					});
				});
			});


			// GET CATEGORIES
			app.get('/categories', (req, res)=>{
				db.collection("categories").find({}).toArray(function(error, result) {
				    if (error) throw error;
			    	res.json({"IsSuccess" : true, "categories" : result})	
					console.log('categories: ' + result);
				});
			});


			// GET CATEGORIES
			app.get('/themes', (req, res)=>{
				db.collection("themes").find({}).toArray(function(error, result) {
				    if (error) throw error;
			    	res.json({"IsSuccess" : true, "themes" : result})	
				});
			});


			// GET TAGS
			app.get('/tags', (req, res)=>{
				db.collection("tags").findOne({}, function(error, result) {
				    if (error) throw error;
			    	res.json({"IsSuccess" : true, "tags" : result.tags})	
					console.log('tags list' + result + "error " + error);
				});
			});


			// GET ITEMS
			app.get('/items', (req, res)=>{
				db.collection("items").find({}).toArray(function(error, result) {
				    if (error) throw error;
			    	res.json({"IsSuccess" : true, "items" : result})	
			    	console.log('items length: ' + result.length)
				});
			});


        }
    })()
        .catch(err => console.error(err));
}

connectMongo();


async function refreshItems(){
	console.log('refresh items');
	ITEMS = await db.collection("items").find({}).toArray();
}
