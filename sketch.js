var database;

var dog, sadDog, happyDog;
var foodS, foodStock;
var fedTime, lastFed;
var feed, addFood;
var foodObj;
var milkImg, milk;
var nameI;    
var nameRef;  
var Name = "";

function preload() {
  dogImg = loadImage("Dog.png");
  milkImg = loadImage("Milk.png");
  happyDogImg = loadImage("happy dog.png");
  garden = loadImage("Garden.png");
  washroom = loadImage("Wash Room.png");
  bedroom = loadImage("Bed Room.png");
}


function setup() {
  createCanvas(1000,400);

  database = firebase.database();
  foodObj = new Food();

  foodStock = database.ref('Food');
  foodStock.on("value", readStock);

  fedTime = database.ref('FeedTime');
  fedTime.on("value", function(data){
    lastFed = data.val();
  });

  dog = createSprite(800, 200, 150, 150);
  dog.addImage(dogImg);
  dog.scale = 0.15;

  nameI = createInput("Enter Name");
  nameI.position(230, 95);

  nameRef = database.ref("Name");

  nameRef.on("value", function(data) {
    Name = data.val();
    if (Name) {
      nameI.value(Name);
    }
  });

  let saveName = createButton("Save Name");
  saveName.position(230, 120);
  saveName.mousePressed(() => {
    nameRef.set(nameI.value());
  });

  feed = createButton("Feed the dog");
  feed.position(700, 95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(800, 95);
  addFood.mousePressed(addFoods);
}


function draw() {
  background(46,139,87);

  foodObj.display();

  if (Name) {
    fill(255);
    textSize(18);
    textAlign(CENTER);

    text(Name, dog.position.x, dog.position.y + 100);
  }


  fill(255);
  textSize(15);

  if (lastFed >= 12) {
    text("Last Feed : " + (lastFed % 12 || 12) + " PM", 350, 30);
  } else {
    text("Last Feed : " + lastFed + " AM", 350, 30);
  }

  drawSprites();
}


function readStock(data)
{
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

function feedDog()
{
  dog.addImage(happyDogImg);

  milk = createSprite( 720, 220, 10, 10);
  milk.addImage(milkImg);
  milk.scale = 0.1;

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);

  database.ref('/').update({
    
    Food: foodObj.getFoodStock(),

    FeedTime: hour()
  })
}

function addFoods()
{
  foodS++;
  database.ref('/').update({
    Food:foodS
  })

}


