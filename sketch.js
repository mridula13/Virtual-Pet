var database;

var dog, happyDog;
var foodStock, foodS;
var feedTime, lastFed;
var feedBtn, addFoodBtn;
var foodObj;
var milkImg, milk;
var nameInput, nameRef;
var petName = "";

function preload() {
  dogImg = loadImage("Dog.png");
  happyDogImg = loadImage("happy_dog.png");
  milkImg = loadImage("Milk.png");
}

function setup() {
  createCanvas(1000, 400);

  database = firebase.database();
  foodObj = new Food();

  foodStock = database.ref("Food");
  foodStock.on("value", readStock);

  feedTime = database.ref("FeedTime");
  feedTime.on("value", (data) => {
    lastFed = data.val();
  });

  dog = createSprite(800, 200);
  dog.addImage(dogImg);
  dog.scale = 0.15;

  nameInput = createInput("Enter Name");
  nameInput.position(230, 95);

  nameRef = database.ref("Name");
  nameRef.on("value", (data) => {
    petName = data.val();
    if (petName) nameInput.value(petName);
  });

  let saveNameBtn = createButton("Save Name");
  saveNameBtn.position(230, 125);
  saveNameBtn.mousePressed(() => {
    nameRef.set(nameInput.value());
  });

  // Buttons
  feedBtn = createButton("Feed the dog");
  feedBtn.position(700, 95);
  feedBtn.mousePressed(feedDog);

  addFoodBtn = createButton("Add Food");
  addFoodBtn.position(820, 95);
  addFoodBtn.mousePressed(addFood);
}

function draw() {
  background(46, 139, 87);

  foodObj.display();

  // Pet name
  if (petName) {
    fill(255);
    textSize(18);
    textAlign(CENTER);
    text(petName, dog.position.x, dog.position.y + 100);
  }

  fill(255);
  textSize(15);
  textAlign(LEFT);

  if (lastFed !== undefined) {
    let time = lastFed % 12 || 12;
    let ampm = lastFed >= 12 ? "PM" : "AM";
    text("Last Feed : " + time + " " + ampm, 350, 30);
  }

  drawSprites();
}

function readStock(data) {
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

function feedDog() {
  if (foodObj.getFoodStock() <= 0) return;

  dog.addImage(happyDogImg);

  if (milk) milk.remove();

  milk = createSprite(720, 220);
  milk.addImage(milkImg);
  milk.scale = 0.1;

  foodObj.updateFoodStock(foodObj.getFoodStock() - 1);

  database.ref("/").update({
    Food: foodObj.getFoodStock(),
    FeedTime: hour()
  });
}

function addFood() {
  let currentFood = foodObj.getFoodStock() || 0;

  database.ref("/").update({
    Food: currentFood + 1
  });
}
