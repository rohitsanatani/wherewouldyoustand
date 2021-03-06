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
let randomRow = 10;
let startTime;
let timer = 10;

let compColor = 200;
let agentColor = 'red';
let textColor = 255;
let accentColor = '#ff4040'
let titleTextSize = 40;
let bodyTextSize = 20;
let actionTextSize = 30;

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
  createCanvas(1530, 850);
  back = loadImage("assets/back.png");
  background(255);
  
  //check display resolution and alert user
  if(windowWidth<width){
    window.alert("Your browser resolution is less than the suggested game resolution.\nPlease zoom out within your browser to fit page to screen");
  }

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
    fill(accentColor);
    textSize(titleTextSize);
    textAlign(CENTER);
    text("Where Would You Stand On The Subway?", width/2, 0.1*height);

    //display intro
    fill(textColor);
    textSize(bodyTextSize);
    textAlign(CENTER);
    text("If all seats in a coach are occupied, where would want to stand, so you could grab a seat soon?", width/2, 0.2*height);
    text("You will be presented with multiple co-passenger configurations as shown below. \n For each scene, click on your preffered standing position anywhere within the coach. \n Try not to spend more than 10s per scene.", width/2, 0.25*height);
    
    //draw plan
    imageMode(CORNER);
    image(plan, xOffset, yOffset);

    let row = gameData.getRow(rowN);

    //draw seatPoints
    fill(compColor);
    seatX = row.getString("seatX");
    seatY = row.getString("seatY");
    nSeats = row.getNum("nSeats");
    seatXList = seatX.split(";", nSeats);
    seatYList = seatY.split(";", nSeats);

    for (i = 0; i < nSeats; i++) {
      ellipse(int(seatXList[i])+xOffset, int(seatYList[i])+yOffset, agentSize, agentSize);
    }

    //draw compPoints
    let compRow = gameData.getRow(randomRow);
    fill(compColor);
    compX = compRow.getString("compX");
    compY = compRow.getString("compY");
    nComp = compRow.getNum("nComp");
    compXList = compX.split(";", nComp);
    compYList = compY.split(";", nComp);

    for (i = 0; i < nComp; i++) {
      ellipse(int(compXList[i])+xOffset, int(compYList[i])+yOffset, agentSize, agentSize);
    }

//update randomRow every 60 frames
    if(frameCount%60==0){
      randomRow = Math.floor(random(0,gameData.getRowCount()));
    }

    //display name prompt
    fill(accentColor);
    textSize(bodyTextSize);
    textAlign(CENTER);
    text("To begin, type your name and hit Enter", width/2, 0.7*height);

    //display name
    fill(textColor);
    textSize(bodyTextSize);
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
    fill(accentColor);
    textSize(titleTextSize);
    textAlign(CENTER);
    text("Where Would You Stand On The Subway?", width/2, 0.1*height);


    //display intro
    fill(textColor);
    textSize(bodyTextSize);
    textAlign(CENTER);
    text("Each of the images below depict a configuration of co-passengers in your subway coach. \n\n Click on the position where you would want to stand to maximize your chances of getting a seat.\n The next scene will load automatically after each click.", width/2, 0.2*height);


    //display time prompt
    
    if (timer-((millis()-startTime)/1000)>0){
      fill(textColor);
      if (timer-((millis()-startTime)/1000)<=3) {
        fill('red');
      }
      textSize(bodyTextSize);
      textAlign(CENTER);
      remTime = timer-(millis()-startTime)/1000;
      text("Do not give yourself more than 10s per image. \n Time remaining: "+Math.ceil(remTime).toString(), width/2, 0.75*height);
    }else{
      fill('red')
      textSize(bodyTextSize);
      textAlign(CENTER);
      remTime = timer-(millis()-startTime)/1000;
      text("Time up. Please click now.", width/2, 0.75*height);
    }

    fill(textColor);
    textSize(25);
    textAlign(CENTER);
    text((count+1).toString()+" / "+ (gameData.getRowCount().toString()), width/2, 0.9*height);

    //draw cursor
    fill(agentColor);
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
    fill(compColor);
    compX = row.getString("compX");
    compY = row.getString("compY");
    nComp = row.getNum("nComp");
    compXList = compX.split(";", nComp);
    compYList = compY.split(";", nComp);

    for (i = 0; i < nComp; i++) {
      ellipse(int(compXList[i])+xOffset, int(compYList[i])+yOffset, agentSize, agentSize);
    }

    //draw seatPoints
    fill(compColor);
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
    rowId = row.getNum("sceneId");
  }
}

function mouseClicked() {
  if (gameOn) {

    //update userData
    //
    newRow = userData.addRow();
    newRow.setNum("sceneId", rowId);
    newRow.setNum("sceneCount", count+1);
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

    //update data lists:
    sceneIdData.push(rowId)
    sceneCountData.push(count+1);
    datasetData.push(fileName);
    userNameData.push(userName);
    gameIdData.push(gameId);
    userXData.push(Math.floor(mouseX-xOffset));
    userYData.push(Math.floor(mouseY-yOffset));
    responseTimeData.push(timer-remTime);

    console.log(userXData);
    console.log(userYData);

    //send user data to backend
    /*
    post(endpoint,{
      sceneId:rowId,
      sceneCount:count,
      dataset:fileName,
      userName: userName,
      gameId: gameId,
      userX: Math.floor(mouseX-xOffset),
      userY: Math.floor(mouseY-yOffset),
      responseTime:(timer-remTime),
    });
    console.log(count.toString()+"th Post");
    */

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

  //send data to backend
  post(endpoint,{
    sceneId:sceneIdData,
    sceneCount:sceneCountData,
    dataset:datasetData,
    userName: userNameData,
    gameId: gameIdData,
    userX: userXData,
    userY: userYData,
    responseTime:responseTimeData,
  });
  console.log(count.toString()+"Data sent to backend");

  //save userData
  //saveTable(userData, "output/"+gameId+".csv");
  console.log('Data saved');

  remove();

  window.location.href = "/results?gameId="+gameIdData[0].toString();
}

function keyPressed() {
  if (!gameOn) {
    if (key=='Enter') {
      if(userName.length>0){
        gameOn = true;
        startTime = millis();
        gameId = userName+hour().toString()+minute().toString()+second().toString();
        introSound.play();
      }

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

function post(endpoint, params = {}) {
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
