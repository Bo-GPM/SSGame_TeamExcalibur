//Fully functional code for orange and pink plant growth patterns
//What was breaking it? This line: const expansionPattern = getExpansionPattern(cropType, row, col,newCrops);
//it is currently commented out in GameLogic line 20
/*
function pinkGrowth(row,column,currentCrops) {
  upCol = 0;
  downCol = 0;
  rightCol = 0;
  leftCol = 0;

  if(currentCrops[row+1][column+1] == 'Blue' || currentCrops[row+1][column+1] == 'Green')
  {
    upCol = 1;
  }
  if(currentCrops[row-1][column-1] == 'Blue' || currentCrops[row-1][column-1] == 'Green')
  {
    downCol = -1;
  }
  if(currentCrops[row+1][column-1] == 'Blue' || currentCrops[row+1][column-1] == 'Green')
  {
    rightCol = 1;
  }
  if(currentCrops[row-1][column+1] == 'Blue' || currentCrops[row-1][column+1] == 'Green')
  {
    leftCol = -1;
  }
    return [[upCol*2,upCol*2],[upCol,upCol],
    [downCol*2,downCol*2],[downCol,downCol],
    [rightCol ,-rightCol],[rightCol*2,-rightCol*2],
    [leftCol,-leftCol],[leftCol*2,-leftCol*2]];  
}

function orangeGrowth(row,column,currentCrops)
{
let neighbor = false;
for(let i=-1;i < 1;i++)
{
for(let i2=-1;i2 < 1;i2++)
{
  //string += currentCrops[row+i][column+i2];
  if(row+i >=1 && column+i >= 1)
  {
  if(currentCrops[row+i][column+i2] == 'Blue')
  {
    neighbor = true;
  }
  }
}}
if(neighbor){
  return [[-1,0],[0,-1],[1,0],[0,1]];
}else{
  return [[0,0]]
}
}
*/