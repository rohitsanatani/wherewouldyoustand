//var allData = '<%- JSON.stringify(allData) %>';
//const allData = document.getElementById('allData');
//console.log(allData);

var thisGameId = document.getElementById('thisGameId').getAttribute('thisGameId');
console.log(thisGameId);

  // GAME CODE STARTS HERE
  //--------------------------

let plan;
let agentSize = 15;
let nSamples = 8;
let modelRuns = 20;
let count;
let xOffset;
let yOffset;
let seatOffset = 35;
let allUserData;
let gameUserData;
let sceneData;
let gameOn = false;
let plotHeatMap = false;
let plotUserPoints = true;
let plotModelPoints = false;
//let resultGameId = "rohit191546";
let resultGameId = thisGameId;
let dataFilePath = "gamedata/master2.csv";
//let dataFilePath = "http://drive.google.com/uc?export=download&id=1lNKQTBmkLQqQwKdA-trz42lkBqm5bnv-"
let sceneFilePath = "gamedata/mv2.csv";
let sceneUserX = [];
let sceneUserY = [];

let freqWeight = 2;
let distWeight = .75;
let doorWeight = .25;
let step = 5;
let seats = [];
let competitors = [];
let players = [];
let closestPlayers = [];
let playerFreq = [];
let closestSeats = [];
let allPointScore;
let pointsModel = [];

let compColor = 200;
let agentColor = 'red';
let textColor = 255;
let titleTextSize = 40;
let bodyTextSize = 20;

function preload (){

  plan = loadImage("assets/plan_1.png");
  //load all user data and scene data
  allUserData = loadTable(dataFilePath, "csv", "header");
  sceneData = loadTable(sceneFilePath, "csv", "header");
  
}

function setup()
{
  createCanvas(1530, 850);
  back = loadImage("assets/back.png");
  background(255);
  xOffset = (width/2)-(plan.width/2);
  yOffset = (height/2-plan.height/2);

  count = 0;

  allPointScore = new Array (width*height);
}

function draw()
{
  if (!gameOn) {
    background(255);
    imageMode(CENTER);
    image(back, width/2, height/2);
    //display title
    textFont("Courier New");
    fill(textColor);
    textSize(titleTextSize);
    textAlign(CENTER);
    text("Where Would You Stand On The Subway?", width/2, 0.1*height);

    //display intro
    fill(textColor);
    textSize(bodyTextSize);
    textAlign(CENTER);
    text("Great! Now let's see how predictable (and 'rational') your decisions were!\n \n Hit Enter to continue...", width/2, 0.2*height);

    //display name
    fill(textColor);
    textSize(bodyTextSize);
    textAlign(CENTER);
    text(resultGameId, width/2, 0.6*height);
  }

  //mainLoop
  if (gameOn) {

    background(255);
    imageMode(CENTER);
    image(back, width/2, height/2);

    xOffset = (width/2)-(plan.width/2);
    yOffset = (height/2-plan.height/2);

    imageMode(CORNER);
    image(plan, xOffset, yOffset);

    //display title
    fill(textColor);
    textSize(titleTextSize);
    textAlign(CENTER);
    text("Where Would You Stand on the Subway?", width/2, 0.1*height);

    //display intro
    fill(textColor);
    textSize(bodyTextSize);
    textAlign(CENTER);
    text("Take a look at how your choices compared with past players. \n The heatmap indicates areas which actually correspond to high chances of getting a seat", width/2, 0.2*height);

    //create heatmap
    if (plotHeatMap) {
      drawHeatMap();
    }

    //draw modelPoint
    if (plotModelPoints) {
      fill(240, 240, 255);
      stroke(0,0,255);
      for (i = 0; i <modelRuns; i++) {
        ellipse(pointsModel[i][0]+xOffset, pointsModel[i][1]+yOffset, agentSize, agentSize);
      }
    }
    //load row from scene data csv 
    row = sceneData.getRow(count);

    //draw compPoints
    fill(compColor);
    compX = row.getString("compX");
    compY = row.getString("compY");
    nComp = row.getNum("nComp");
    compXList = compX.split(";", nComp);
    compYList = compY.split(";", nComp);
    id = row.getNum("sceneId");

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
  
    //draw allUserPoints
    if (plotUserPoints) {
      fill(70, 0, 0);
      //noFill();
      noStroke();
      //stroke(255, 0, 0);

      for (i = 0; i < userXList.length; i++) {
        ellipse(int(userXList[i])+xOffset, int(userYList[i])+yOffset, agentSize, agentSize);
      }
      noStroke();
    }

    //draw thisUserPoints

      fill(agentColor);
      stroke(agentColor);

      ellipse(int(gameUserData[count].userX)+xOffset, int(gameUserData[count].userY)+yOffset, agentSize, agentSize);

      noStroke();

    //display id
    fill(textColor);
    textSize(bodyTextSize);
    textAlign(RIGHT);
    text("SceneId: "+gameUserData[count].sceneId, width*.9, 0.3*height);
    console.log(gameUserData[count].sceneId);

    //display freq
    fill(0);
    textSize(25);
    textAlign(RIGHT);
    //text("Score: "+getScore(mouseX-xOffset, mouseY-yOffset)/(Math.max.apply(null, allPointScore)), width*.75, 0.25*height);
    //text("Score: "+getScore(mouseX-xOffset, mouseY-yOffset), width*.75, 0.25*height);
  }
}


function mouseClicked() {
  if (gameOn) {
    
    count = count+1;

    if (count>=sceneData.getRowCount()-1) {
      thankYou();
    }
    if (count<sceneData.getRowCount()) {
      //compute allPointFreqs
      //allPointScore = getAllScore();
      //compute modelPoint
      //pointsModel = getModelPoint();
    }

    //populate userXList and userYList from allUserData
    userXList = [];
    userYList = [];
    for (i = 0;i<allUserData.getRowCount();i++){
      thisRow = allUserData.getRow(i);
      if (thisRow.getNum("sceneId") == count+1){
        userXList.push(thisRow.getNum("userX"));
        userYList.push(thisRow.getNum("userY"));
      }
    }

  }
}

function thankYou() {
  noLoop();
  background(255);
  fill(0);
  textSize(50);
  textAlign(CENTER);
  text("Thank You!", width/2, height/2);
}

function keyPressed() {

  if (!gameOn) {
    if (key=='Enter') {
      //this code runs when the user clicks enter to start game

      //load game data from cloud using gameId
      incomingObjs = getData('getgamedata?gameId='+resultGameId).then((incomingObjs) => {
        gameUserData = incomingObjs.gameUserData

        //set gameOn = true
        gameOn = true;
      }); 

      //read allUserData
      //allUserData = loadTable("gamedata/"+resultGameId+".csv", "header");

      //populate userXList and userYList from allUserData
      userXList = [];
      userYList = [];
      for (i = 0;i<allUserData.getRowCount();i++){
        thisRow = allUserData.getRow(i);
        if (thisRow.getNum("sceneId") == (count+1)){
          userXList.push(thisRow.getNum("userX"));
          userYList.push(thisRow.getNum("userY"));
        }
      }


      //compute allPointFreqs
      //print ('reached before allpscore');
      //allPointScore = getAllScore();
      //print (allPointScore);
      //compute modelPoint
      //pointsModel = getModelPoint();
    } else if (key =='Backspace'){
      resultGameId = resultGameId.slice(0,-1);      
    } else if (key =='Shift'){
      resultGameId = resultGameId;      
    } else {
      resultGameId+=key;
    }
  } else if (key=='Enter') {
    mouseClicked();
  } else if (key=='p') {
    if (count>0) {
      count=count-1;
      //compute allPointFreqs
      //allPointScore = getAllScore();
      //compute modelPoint
      //pointsModel = getModelPoint();

      //populate userXList and userYList from allUserData
      userXList = [];
      userYList = [];
      for (i = 0;i<allUserData.getRowCount();i++){
        thisRow = allUserData.getRow(i);
        if (thisRow.getNum("sceneId") == (count+1)){
          userXList.push(thisRow.getNum("userX"));
          userYList.push(thisRow.getNum("userY"));
        }
      }
      console.log(gameUserData[0].sceneId);
    }
  } else if (key=='h') {
    if (plotHeatMap) {
      plotHeatMap = false;
    } else {
      plotHeatMap = true;
    }
  } else if (key=='u') {
    if (plotUserPoints) {
      plotUserPoints = false;
    } else {
      plotUserPoints = true;
    }
  } else if (key=='m') {
    if (plotModelPoints) {
      plotModelPoints = false;
    } else {
      plotModelPoints = true;
    }
  }
}


function getScore(xPoint, yPoint) {
  //print(allUserData.columns);
  let row = allUserData.getRow(count);

  //populate players and competitors array
  compX = row.getString("compX");
  compY = row.getString("compY");
  nComp = row.getNum("nComp");
  nPlayers = nComp+1;
  compXList = compX.split(";", nComp);
  compYList = compY.split(";", nComp);

  competitors = [];
  players = [];

  for (i = 0; i < nComp; i++) {
    //competitors[i][0] = (compXList[i]);
    //competitors[i][1] = (compYList[i]);
    competitors.push([compXList[i],compYList[i]]);
    //players[i][0] = (compXList[i]);
    //players[i][1] = (compYList[i]);
    players.push([compXList[i],compYList[i]]);
  }
  //players[nPlayers-1][0] = xPoint;
  //players[nPlayers-1][1] = yPoint;
  players.push([xPoint,yPoint]);
  ellipse(mouseX, mouseY, agentSize, agentSize);

  //populate seats array
  seatX = row.getString("seatX");
  seatY = row.getString("seatY");
  nSeats = row.getNum("nSeats");
  seatXList = seatX.split(";", nSeats);
  seatYList = seatY.split(";", nSeats);

  //seats = new int[nSeats][2];
  seats = [];

  for (i = 0; i < nSeats; i++) {
    //seats[i][0] = int(seatXList[i]);
    //seats[i][1] = int(seatYList[i]);
    seats.push([seatXList[i],seatYList[i]]);
  }

  //distanceList = new float [nSeats][nPlayers]; //index = seat, value = lists of distances to each player
  //closestPlayers = new float [nSeats]; //index = seat, value = index of closest player
  distanceList = new Array(nSeats);
  closestPlayers = new Array(nSeats);

  for (i = 0; i < nSeats; i++) {
    distances = new Array (nPlayers);
    for (j = 0; j < nPlayers; j++) {
      distVal = dist(players[j][0], players[j][1], seats[i][0], seats[i][1]);
      distances[j] = distVal;
    }
    distMin = min(distances);
    //get nearest player for each seat
    closestPlayer = 0;
    for (k = 0; k < nPlayers; k++) {
      if (distances[k] == distMin) {
        closestPlayer = k;
      }
    }
    distanceList[i] = distances;
    closestPlayers[i] = closestPlayer;
  }

  playerFreq = new Array(nPlayers);
  for (i = 0; i<nPlayers; i++) {
    freq = 0;
    for (j = 0; j<nSeats; j++) {
      if (i == closestPlayers[j]) {
        freq = freq + 1;
      }
    }
    playerFreq[i] = freq;
  }
  freqScore =  playerFreq[nPlayers-1]/float(nSeats);

  //---------------------------------------
  //compute distance from nearest competitor
  distances = new Array(nComp);
  for (i=0; i<nComp; i++) {
    distances[i] = dist(xPoint, yPoint, competitors[i][0], competitors[i][1]);
  }
  distMin = min(distances);

  distScore = distMin/plan.width;

  //---------------------------------------
  //compute distance from nearest door
  doorX = row.getString("doorX");
  doorY = row.getString("doorY");
  nDoors = row.getNum("nDoors");
  doorXList = doorX.split(";", nDoors);
  doorYList = doorY.split(";", nDoors);

  //doors = new int[nDoors][2];
  doors = new Array(nDoors);

  for (i = 0; i < nDoors; i++) {
    //doors[i][0] = int(doorXList[i]);
    //doors[i][1] = int(doorYList[i]);
    doors[i] = [doorXList[i],doorYList[i]];
  }

  doorDists = new Array (nDoors);
  for (i=0; i<nDoors; i++) {
    doorDists[i] = dist(xPoint, yPoint, doors[i][0], doors[i][1]);
  }

  doorDistMin = min(doorDists);
  doorScore = plan.width/doorDistMin;



  //float score = freqScore;
  //float score = 4*freqScore*distScore;
  score = (float)(Math.pow(freqScore, freqWeight)*Math.pow(distScore, distWeight)*Math.pow(doorScore, doorWeight));
  //float score = .25*(freqScore+1.5*(distScore));

  return score;
}

function getAllScore() {
  allPointScore1 = new Array(width*height);
  for (x = xOffset; x<xOffset+plan.width; x=x+step) {
    for (y = yOffset+seatOffset; y<yOffset+plan.height-seatOffset; y = y+step) {
      allPointScore1[x+(y*width)] = getScore(x-xOffset, y-yOffset);
    }
  }
  return allPointScore1;
}

function getModelPoint() {
  //DO NOT TOUCH THIS CODE. YOUR LIFE WILL FALL APART
  //YOU GOT THIS TO WORK AT SOME POINT BUT HAVE NO IDEA HOW 
  //winningPoints = new int [modelRuns][2];
  winningPoints = new Array (modelRuns);
  for (k = 0; k<modelRuns; k++) {
    testScore = 0;
    modelPoint = new Array (2);
    winningPoint = new Array (2);
    for (i = 0; i<nSamples; i++) {
      modelPoint[0] = Math.floor(random(0, plan.width));
      modelPoint[1] = Math.floor(random(1.2*seatOffset, plan.height-(1.2*seatOffset)));
      if (getScore(modelPoint[0], modelPoint[1])>testScore) {
        testScore = getScore(modelPoint[0], modelPoint[1]);
        winningPoint[0] = modelPoint[0];
        winningPoint[1] = modelPoint[1];
      }
    }
    //winningPoints[k][0] = winningPoint[0];
    //winningPoints[k][1] = winningPoint[1];
    winningPoints[k] = [winningPoint[0],winningPoint[1]];
  }
  return winningPoints;
}

function drawHeatMap() {
  // create heatmap
  noStroke();
  //pointScoreMax = max(allPointScore);
  pointScoreMax = Math.max.apply(null, allPointScore);
  // Loop through every point in steps
  for (x = xOffset; x<xOffset+plan.width; x = x+step) {
    for (y = yOffset+seatOffset; y<yOffset+plan.height-seatOffset; y=y+step) {
      pointScore = allPointScore[x+(y*width)];
      pointScoreScaled =.5*pointScore/pointScoreMax;
      //float gradient = 255-((pointScore)*255);
      gradient = 255-((pointScoreScaled)*255);
      c = color(255, gradient, gradient);
      fill(c);
      rectMode(CENTER);
      rect(x, y, step+1, step+1);
    }
  }
}

// Standard functions start here------------------------------------

function getData(endpoint) {
  return fetch(endpoint)
    .then(convertToJSON)
    .catch((error) => {
      // give a useful error message
      throw `GET request to ${endpoint} failed with error:\n${error}`;
    });
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
