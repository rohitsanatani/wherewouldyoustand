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
let plotHeatMap = true;
let plotUserPoints = false;
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
let userScoreScaled;
let pointsModel = [];

let compColor = 200;
let agentColor = 'red';
let textColor = 255;
let accentColor = '#ff4040'
let titleTextSize = 40;
let bodyTextSize = 20;
let actionTextSize = 30;

let heatMapMode;

function preload (){

  plan = loadImage("assets/plan_1.png");
  paramPlan = loadImage("assets/params.png");
  //load all user data and scene data
  allUserData = loadTable(dataFilePath, "csv", "header");
  sceneData = loadTable(sceneFilePath, "csv", "header");
  
}

function setup()
{
  freqWeight = 2;
  distWeight = .75;
  doorWeight = .25;
  heatMapMode = 'freq';

  createCanvas(1530, 850);
  back = loadImage("assets/back.png");
  background(255);

  //check display resolution and alert user
  if(windowWidth<width){
    window.alert("Your browser resolution is less than the suggested game resolution.\nPlease zoom out within your browser to fit page to screen");
  }

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
    fill(accentColor);
    textSize(titleTextSize);
    textAlign(CENTER);
    text("Where Would You Stand On The Subway?", width/2, 0.1*height);

    //display intro
    fill(textColor);
    textSize(bodyTextSize);
    textAlign(CENTER);
    text("Great! Now let's see how rational (and predictable) your decisions were!\n\nLogically, your chances of getting a seat depends on the number of seats (S) that you are closest to.\n Because you would want to be the first one there as soon as a seat gets vacant.\n\nHowever, based on past data, the following parameters also influence positioning choices:\n\nDistance from nearest co-passenger (P)\nProximity to nearest door (D)", width/2, 0.175*height);

    //draw plan
    imageMode(CENTER);
    image(paramPlan, width/2, 0.55*height);

    //display name
    fill(textColor);
    textSize(bodyTextSize);
    textAlign(CENTER);
    //text("From a 'rational' point of view, your chances of getting a seat depends most strongly on\nthe number of seats you are closest to (S).\nHowever in real life, our decisions are dictated by (P) and (D) as well.\n\nIn the following section, you will be able to evaluate your choices against each of these parameters.\nIn additon, we have also constructed a model based on past data.", width/2, 0.65*height);
    text("In the following section, you will be able to evaluate your choices against each of these parameters.\nIn additon, we have also constructed a predictive model based on past data.", width/2, 0.7*height);

    //display name
    fill(accentColor);
    textSize(bodyTextSize);
    textAlign(CENTER);
    text("Hit Enter to evaluate your choices.\nYour GameId: "+resultGameId, width/2, 0.85*height);
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
    fill(accentColor);
    textSize(titleTextSize);
    textAlign(CENTER);
    text("Where Would You Stand on the Subway?", width/2, 0.1*height);

    //display intro
    fill(textColor);
    textSize(bodyTextSize);
    textAlign(CENTER);
    text("Take a look at how rational your decisions were!\n Toggle the different heatmap modes to evaluate your decisions (<h>). \n Also compare your positioning choices with data from past players (<u>).", width/2, 0.2*height);

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
    textAlign(LEFT);
    text("SceneId: "+gameUserData[count].sceneId, width*.05, 0.35*height);

    textAlign(RIGHT);
    text("YourScore (0-1): "+userScoreScaled.toString(), width*.95, 0.35*height);


    //display heatmap mode
    textAlign(CENTER);
    if (heatMapMode=='bayes'){
      text("Heatmap Mode: Bayesian Model", width*.5, 0.35*height);
    }
    else if (heatMapMode=='freq'){
      text("Heatmap Mode: Number of seats nearest to (S)", width*.5, 0.35*height);
    }
    else if (heatMapMode=='dist'){
      text("Heatmap Mode: Distance to nearest co-passenger (P)", width*.5, 0.35*height);
    }
    else if (heatMapMode=='door'){
      text("Heatmap Mode: Proximity to nearest Door (D)", width*.5, 0.35*height);
    }
    //text("Score: "+getScore(mouseX-xOffset, mouseY-yOffset).toString(), width*.9, 0.3*height);
    //console.log(gameUserData[count].sceneId);

    //display legend:
    fill(textColor);
    textSize(bodyTextSize);
    textAlign(LEFT);
    text("     Controls\n\n<ENTER>: Next Scene\n<p>    : Previous Scene\n<h>    : Toggle Heatmap Modes\n<u>    : Toggle past user data\n<q>    : Quit", width*.425, 0.7*height);


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

    if (count>sceneData.getRowCount()-1) {
      thankYou();
    }
    if (count<sceneData.getRowCount()) {
      //compute allPointFreqs
      allPointScore = getAllScore();
      console.log(allPointScore.reduce((a, b) => { return Math.max(a, b) }));
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

  remove();

  window.location.href = "/exit";
}

function keyPressed() {

  if (!gameOn) {
    if (key=='Enter') {
      //this code runs when the user clicks enter to start game

      //load game data from cloud using gameId
      incomingObjs = getData('getgamedata?gameId='+resultGameId).then((incomingObjs) => {
        gameUserData = incomingObjs.gameUserData

        //compute allPointFreqs
        allPointScore = getAllScore();
        //compute modelPoint
        //pointsModel = getModelPoint();

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
      allPointScore = getAllScore();
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
    /*if (plotHeatMap) {
      plotHeatMap = false;
    } else {
      plotHeatMap = true;*/
      if (heatMapMode=='bayes'){
        heatMapMode='freq';
        allPointScore = getAllScore();
      }
      else if (heatMapMode=='freq'){
        heatMapMode='dist';
        allPointScore = getAllScore();
      }
      else if (heatMapMode=='dist'){
        heatMapMode='door';
        allPointScore = getAllScore();
      }
      else if (heatMapMode=='door'){
        heatMapMode='bayes';
        allPointScore = getAllScore();
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
  }else if (key=='q'){
    thankYou();
  }
}


function getScore(xPoint, yPoint) {

  let row = sceneData.getRow(count);

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


  //compute score from 3 params

  if (heatMapMode=='bayes'){
    freqWeight = 2;
    distWeight = .75;
    doorWeight = .25;
  }
  else if (heatMapMode=='freq'){
    freqWeight = 1;
    distWeight = 0;
    doorWeight = 0;
  }
  else if (heatMapMode=='dist'){
    freqWeight = 0;
    distWeight = 1;
    doorWeight = 0;
  }
  else if (heatMapMode=='door'){
    freqWeight = 0;
    distWeight = 0;
    doorWeight = 1;
  }

  //float score = freqScore;
  //float score = 4*freqScore*distScore;
  score = (float)(Math.pow(freqScore, freqWeight)*Math.pow(distScore, distWeight)*Math.pow(doorScore, doorWeight));
  //float score = .25*(freqScore+1.5*(distScore));

  return score;
}

function getAllScore() {
  allPointScore = new Array(width*height);
  for (x = xOffset; x<xOffset+plan.width; x=x+step) {
    for (y = yOffset+seatOffset; y<yOffset+plan.height-seatOffset; y = y+step) {
      allPointScore[x+(y*width)] = getScore(x-xOffset, y-yOffset);
    }
  }
  userScore = getScore(int(gameUserData[count].userX),int(gameUserData[count].userY));
  userScoreScaled = (userScore/(allPointScore.reduce((a, b) => { return Math.max(a, b) }))).toFixed(2);
  return allPointScore;
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
  //pointScoreMax = Math.max.apply(null, allPointScore);
  pointScoreMax = allPointScore.reduce((a, b) => { return Math.max(a, b) })
  // Loop through every point in steps
  for (x = xOffset; x<xOffset+plan.width; x = x+step) {
    for (y = yOffset+seatOffset; y<yOffset+plan.height-seatOffset; y=y+step) {
      pointScore = allPointScore[x+(y*width)];
      pointScoreScaled =.5*pointScore/pointScoreMax;
      //gradient = 255-((pointScoreScaled)*255);
      //c = color(255, gradient, gradient);
      gradient = (pointScoreScaled)*255;
      if (heatMapMode=='bayes'){
        c = color(gradient, 0, gradient);
      }
      else if (heatMapMode=='freq'){
        c = color(0, 0, gradient);
      }
      else if (heatMapMode=='dist'){
        c = color(gradient, gradient, 0);
      }
      else if (heatMapMode=='door'){
        c = color(0, gradient, 0);
      }

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
