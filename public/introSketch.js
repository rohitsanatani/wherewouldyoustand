let plan;
let back;
let agentSize = 15;
let xOffset;
let yOffset;
let gameData;
let fileName = "mv2";
let nComp;
let compX;
let compY;
let nDoors;
let doorX;
let doorY;
let nSeats;
let seatX;
let seatY;
let agentX;
let agentY;
let demoRow = 26;
let stepX;
let stepY;

let compColor = 200;
let agentColor = 'red';
let textColor = 255;
let accentColor = '#ff4040'
let titleTextSize = 40;
let bodyTextSize = 20;
let actionTextSize = 30;

function preload (){
  
//read gameData
  gameData = loadTable("gamedata/"+fileName+".csv", "header");
  
  plan = loadImage("assets/plan_1.png");
}

function setup()
{

  createCanvas(1530, 850);
  //createCanvas(windowWidth, windowHeight);
  back = loadImage("assets/back.png");
  background(255);

  //check display resolution and alert user
  if(windowWidth<width){
    window.alert("Your browser resolution is less than the suggested game resolution.\nPlease zoom out within your browser for the best experience");
  }

  xOffset = (width/2)-(plan.width/2);
  yOffset = (height/2)-(plan.height/2);

  agentX = 200;
  agentY = 60;
  stepX = 2;
  stepY = 0;
}

function draw()
{
    background(255);
    imageMode(CENTER);
    image(back, width/2, height/2);

    //draw plan
    imageMode(CORNER);
    image(plan, xOffset, yOffset);

    //display title
    //fill(textColor);
    fill(accentColor);
    textFont("Courier New");
    textStyle(NORMAL);
    textSize(40);
    textAlign(CENTER);
    text("Where Would You Stand On The Subway?", width/2, 0.1*height);


    //display intro
    fill(textColor);
    textSize(bodyTextSize);
    textAlign(CENTER);
    text("When was the last time you walked into a crowded subway coach, tired after a long day, and \n lost a seat to someone who was more strategically positioned? \n\n Well, turns out, we seldom make the most rational decisions in this regard.\nPlay this quick game to find out why, and how predictable your intuitive decisions are!", width/2, 0.2*height);
    //text("Play this quick game to find out why, and how predictable your intuitive decisions are!", width/2, 0.75*height);
    textSize(bodyTextSize);
    fill(accentColor);
    text(" Hit 'ENTER' to proceed", width/2, 0.8*height);
    row = gameData.getRow(demoRow);

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

    //draw agent 
    noStroke();
    fill(agentColor);
    ellipse(agentX+xOffset, agentY+yOffset, agentSize, agentSize);

    //check conditions

    if(agentX>plan.width || agentX<0){
      stepX = -stepX;
    }

    if(agentY<50){
      stepY = 2;
    }

    if(agentY>(plan.height-50)){
      stepY = -2;
    }

    if(agentY<((plan.height/2)+10) & agentY>((plan.height/2)-10)){
      stepY = 2;
    }
    

    for (i = 0; i < nComp; i++) {
      if (dist(int(compXList[i]), int(compYList[i]), agentX, agentY)<1.5*agentSize){
        if(agentY<plan.height/2){
          stepY = 2;
        }else{
          stepY = -2;
        }

      }
    }

    //update agent position

    agentX = agentX + stepX;
    agentY = agentY + stepY;
    stepY = 0;
      
  }


function keyPressed() {

    if (key=='Enter') {
      window.location.href = "/play";
    } 
  }

