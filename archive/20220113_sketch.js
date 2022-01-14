let endpoint = '/play';

let introSound;
let clickSound;

let plan;
let back;
let agentSize = 15;
let count;
let xOffset;
let yOffset;
let userData;
let gameData;
let gameOn = false;
let userName = "";
let gameId;
let fileName = "mv2";
let myFont;
let rowId;
let nComp;
let compX;
let compY;
let nDoors;
let doorX;
let doorY;
let nSeats;
let seatX;
let seatY;
let rowList = [];
let rowN;
let startTime;
let timer = 10;

let sceneIdData = [];
let sceneCountData = [];
let datasetData = [];
let userNameData = [];
let gameIdData = [];
let userXData = [];
let userYData = [];
let responseTimeData = [];

function preload (){
  
//read gameData
  gameData = loadTable("gamedata/"+fileName+".csv", "header");
  
  plan = loadImage("assets/plan_1.png");
  
  soundFormats('mp3', 'ogg');
  introSound = loadSound('assets/intro');
  clickSound = loadSound('assets/click')
  
}

function setup()
{

  //fullScreen();
  createCanvas(1550, 800);
  back = loadImage("assets/back.png");
  background(255);

  xOffset = (width/2)-(plan.width/2);
  yOffset = (height/2)-(plan.height/2);

  //initialize gamedata rowList
  for (i = 0; i < gameData.getRowCount(); i++) {
    rowList.push(i);
  }
  //pick random row
  
  rowN = rowList[Math.floor(random(rowList.length))];

  //initialize userData table
  userData = new p5.Table();
  userData.addColumn("sceneId");
  userData.addColumn("sceneCount");
  userData.addColumn("dataset");
  userData.addColumn("userName");
  userData.addColumn("gameId");
  userData.addColumn("userX");
  userData.addColumn("userY");
  userData.addColumn("responseTime");
  userData.addColumn("nComp");
  userData.addColumn("compX");
  userData.addColumn("compY");
  userData.addColumn("nSeats");
  userData.addColumn("seatX");
  userData.addColumn("seatY");
  userData.addColumn("nDoors");
  userData.addColumn("doorX");
  userData.addColumn("doorY");
  userData.addColumn("planWidth");
  userData.addColumn("planHeight");

  count = 0;

}

function draw()
{
  if (!gameOn) {
    background(255);

    imageMode(CENTER);
    image(back, width/2, height/2);

    //display title
    //myFont = createFont("consolas", 32);
    textFont("Courier New");
    fill(0);
    textSize(50);
    textAlign(CENTER);
    text("The Subway Game!", width/2, 0.2*height);

    //display intro
    fill(0);
    textSize(25);
    textAlign(CENTER);
    text("You enter a subway coach, tired after a hard day's work. All seats are occupied.\n Where would want to stand, so you could grab a seat soon?", width/2, 0.3*height);

    //draw plan
    imageMode(CORNER);
    image(plan, xOffset, yOffset);

    let row = gameData.getRow(rowN);

    //draw seatPoints
    fill(50);
    seatX = row.getString("seatX");
    seatY = row.getString("seatY");
    nSeats = row.getNum("nSeats");
    seatXList = seatX.split(";", nSeats);
    seatYList = seatY.split(";", nSeats);

    for (i = 0; i < nSeats; i++) {
      ellipse(int(seatXList[i])+xOffset, int(seatYList[i])+yOffset, agentSize, agentSize);
    }

    //display name prompt
    fill(0);
    textSize(30);
    textAlign(CENTER);
    text("To begin, type your name and hit Enter", width/2, 0.7*height);

    //display name
    fill(0);
    textSize(30);
    textAlign(CENTER);
    text(userName, width/2, 0.8*height);
  }

  //mainLoop
  if (gameOn) {

    background(255);
    imageMode(CENTER);
    image(back, width/2, height/2);

    //draw plan
    imageMode(CORNER);
    image(plan, xOffset, yOffset);

    //display title
    fill(0);
    textSize(50);
    textAlign(CENTER);
    text("The Subway Game!", width/2, 0.2*height);


    //display intro
    fill(0);
    textSize(25);
    textAlign(CENTER);
    text("Each of the images below depict a configuration of co-passengers in your subway coach. \n\n Click on the position where you would want to stand to maximize your chances of getting a seat.", width/2, 0.3*height);


    //display time prompt
    fill(0);
    if (timer-((millis()-startTime)/1000)<=3) {
      fill(255, 0, 0);
    }
    textSize(25);
    textAlign(CENTER);
    remTime = timer-(millis()-startTime)/1000;
    text("Do not give yourself more than 10s per image. \n Time remaining: "+Math.ceil(remTime).toString(), width/2, 0.7*height);

    textSize(25);
    textAlign(CENTER);
    text((count+1).toString()+" / "+ (gameData.getRowCount().toString()), width/2, 0.9*height);

    //draw cursor
    fill(255, 0, 0);
    noStroke();
    ellipse(mouseX, mouseY, agentSize, agentSize);

    //get data from gameData
    //to sequentialize
    //TableRow row = gameData.getRow(count);
    //to randomize
    row = gameData.getRow(rowN);
    //print(rowList);
    //print(rowN);
    //print (count);
    //print (gameData.getRowCount()-1);

    //draw compPoints
    fill(50);
    compX = row.getString("compX");
    compY = row.getString("compY");
    nComp = row.getNum("nComp");
    compXList = compX.split(";", nComp);
    compYList = compY.split(";", nComp);

    for (i = 0; i < nComp; i++) {
      ellipse(int(compXList[i])+xOffset, int(compYList[i])+yOffset, agentSize, agentSize);
    }

    //draw seatPoints
    fill(50);
    seatX = row.getString("seatX");
    seatY = row.getString("seatY");
    nSeats = row.getNum("nSeats");
    seatXList = seatX.split(";", nSeats);
    seatYList = seatY.split(";", nSeats);

    for (i = 0; i < nSeats; i++) {
      ellipse(int(seatXList[i])+xOffset, int(seatYList[i])+yOffset, agentSize, agentSize);
    }

    //get doorPoints
    doorX = row.getString("doorX");
    doorY = row.getString("doorY");
    nDoors = row.getNum("nDoors");

    //get rowId
    rowId = row.getNum("id");
  }
}

function mouseClicked() {
  if (gameOn) {

    //update userData
    //
    newRow = userData.addRow();
    newRow.setNum("sceneId", rowId);
    newRow.setNum("sceneCount", count);
    newRow.setString("dataset", fileName);
    newRow.setString("userName", userName);
    newRow.setString("gameId", gameId);
    newRow.setNum("userX", mouseX-xOffset);
    newRow.setNum("userY", mouseY-yOffset);
    newRow.setNum("responseTime",(timer-remTime));
    newRow.setNum("nComp", nComp);
    newRow.setString("compX", compX);
    newRow.setString("compY", compY);
    newRow.setNum("nSeats", nSeats);
    newRow.setString("seatX", seatX);
    newRow.setString("seatY", seatY);
    newRow.setNum("nDoors", nDoors);
    newRow.setString("doorX", doorX);
    newRow.setString("doorY", doorY);
    newRow.setNum("planWidth", plan.width);
    newRow.setNum("planHeight", plan.height);
    //

    //send user data to backend
    //
    post(endpoint,{
      sceneId:rowId,
      sceneCount:count,
      dataset:fileName,
      userName: userName,
      gameId: gameId,
      userX: (mouseX-xOffset),
      userY: (mouseY-yOffset),
      responseTime:(timer-remTime),
      nComp:nComp,
      compX:compX,
      compY:compY,
      nSeats:nSeats,
      seatX:seatX,
      seatY:seatY,
      nDoors:nDoors,
      doorX:doorX,
      doorY:doorY,
      planWidth:plan.width,
      planHeight:plan.height,
    });
    console.log(count.toString()+"th Post");
    //

    startTime = millis();

    clickSound.play();

    count = count+1;
    if (count>gameData.getRowCount()-1) {
      thankYou();
    }
    //update indicies and index
    for( var i = 0; i < rowList.length; i++){ 
      if ( rowList[i] === rowN) { 
          rowList.splice(i, 1); 
      }
    }
    if (rowList.length>0) {
      rowN = rowList[Math.floor(random(rowList.length))];
    }
  }
}

function thankYou() {
  noLoop();
  background(255);
  fill(0);
  textSize(50);
  textAlign(CENTER);
  text("Thank You "+userName+" !", width/2, height/2);

  introSound.play();
  //console.log('Before save data');

  //save userData
  saveTable(userData, "output/"+gameId+".csv");
  console.log('Data saved');

  remove();
}

function keyPressed() {
  if (!gameOn) {
    if (key=='Enter') {
      gameOn = true;
      startTime = millis();
      gameId = userName+hour().toString()+minute().toString()+second().toString();
      introSound.play();
    } else if (key =='Backspace'){
      userName = userName.slice(0,-1);      
    } else if (key =='Shift'){
      userName = userName;      
    } else {
      userName+=key;
    }
  }
}

// convert a fetch result to a JSON object with error handling for fetch and json errors
function convertToJSON(res) {
  if (!res.ok) {
    throw `API request failed with response status ${res.status} and text: ${res.statusText}`;
  }

  return res
    .clone() // clone so that the original is still readable for debugging
    .json() // start converting to JSON object
    .catch((error) => {
      // throw an error containing the text that couldn't be converted to JSON
      return res.text().then((text) => {
        throw `API request's result could not be converted to a JSON object: \n${text}`;
      });
    });
}

function post(endpoint, params = {squirrel : 'timothy'}) {
  console.log('In post function frontend')
  return fetch(endpoint, {
    method: "post",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(params),
  })
    .then(convertToJSON) // convert result to JSON object
    .catch((error) => {
      // give a useful error message
      console.log('In error');
      throw `POST request to ${endpoint} failed with error:\n${error}`;
    });
}
