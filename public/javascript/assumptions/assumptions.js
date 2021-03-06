var assumptions = [{
//complete ajax results
'completeReturns':[],
//cut returns dependent on presentAssumptions() (assumptions js)
// or mannually expressed (customReturns.js)
'currentReturns':[],
'covMatrix':[],
'corrMatrix':[],

}]


$( document ).ready(function() {


if(!$.cookie("sumPortfolio") || $.cookie("sumPortfolio")=='false'){
$.cookie("message", "Portfolio does not sum to 100%");
window.location.href = 'portfolio';
}

if(!$.cookie("assets")){
//the message cookie is used to store messages for redirects 
$.cookie("message", "Please build portfolio below before setting assumptions");
window.location.href = 'portfolio';
}




var completeReturns;

objCounter=0;
completeReturns=[];
objDescription=[];
objPercent=[];
objSymbol=[];
annualReturn=[];
annualStdev=[];
temp = $.cookie("assets");
obj= $.secureEvalJSON(temp);
for(i=0;i<obj.length;i++){
if(obj[i].percent>0){
objDescription.push(obj[i].Description);
objPercent.push(obj[i].percent);
objSymbol.push(obj[i].Symbol);
objCounter ++;
}
}


$.ajax({
  type: "POST",
  url: "historicReturns",
  data: {objSymbol:objSymbol},
  success: function(data) {
  
  		completeReturns =trimDataArray(data);
		assumptions.completeReturns = completeReturns ; 
		calander.endDate = completeReturns[0][0];
		calander.startDate = completeReturns[0][completeReturns[0].length-1];
	
		presentAssumptions(completeReturns)
	},
	error:function(xhr, status, error){
	console.log(xhr.responseText)
	}

})








})
//takes multidemension array and returns a smaller array with no zero values (avoids division by zero)	
function trimDataArray(dataArray){
lengthOfDataArray =dataArray[0].length;
whicharray = 0;
returnArray = [];
for(y=1;y<dataArray.length;y++){
for(i=0;i<dataArray[y].length;i++){
if(dataArray[y][i]< 0.01 && i < lengthOfDataArray){
lengthOfDataArray = i;
whicharray = y;
}
}
}
for(y=0;y<dataArray.length;y++){
returnArray[y] =  dataArray[y].splice(0,lengthOfDataArray);
}
return returnArray;
}
//pass multi dimensional array; array[0]=dates;array[0+i]=security returns
//returns return for array[0+1] to array[n]

/*
Formula to find return for each security in completeReturns
 1+x=(price(N)/price(0))^1/(periods/12)
 Formula to find std for each security in completeReturns
 mean =sum(returns)/count
 variance =  (sum(return - mean)^2) /count
 stdev = sqrt(variance)
 
 
 */
function customReturn(dataArray){
resultArray=[];
for(i=1;i<dataArray.length;i++){
arrayLength = dataArray[i].length;
x = (dataArray[i][0]/dataArray[i][arrayLength-1]);
z=(1/((arrayLength - 1)/12))
y= Math.pow(x, z);
/* ^(1/((arrayLength - 1)/12)) */
resultArray.push(y-1);
}
return resultArray;
}

function customStdev(dataArray){
resultArray=[];
for(i=1;i<dataArray.length;i++){
temp=[];
for(y=dataArray[i].length - 1;y>0;y--){
temp[y]=dataArray[i][y-1]/dataArray[i][y]-1;

}
monthly = standardDeviation(temp)
annual =Math.sqrt(12)*monthly;
resultArray.push(annual)

}
return resultArray;

}


function standardDeviation(values){
  var avg = average(values);
  
  var squareDiffs = values.map(function(value){
    var diff = value - avg;
    var sqrDiff = diff * diff;
    return sqrDiff;
  });
  
  var avgSquareDiff = average(squareDiffs);
 
  var stdDev = Math.sqrt(avgSquareDiff);
  return stdDev;
}
 
function average(data){
  var sum = data.reduce(function(sum, value){
    return sum + value;
  }, 0);
 
  var avg = sum / data.length;
  return avg;
}

function covariance(arr1,arr2){

sum1=arr1.reduce(function(a, b) {
  return a + b;
});
sum2=arr2.reduce(function(a, b) {
  return a + b;
});
 cnt=arr1.length;
avg1=sum1/cnt;
avg2=sum2/cnt;

  ret = [];

  for(ii=0;ii<arr1.length;ii++){
  ret[ii]=(arr2[ii]-avg2) * (arr1[ii]-avg1) ;
  }
 x=ret.reduce(function(a, b) {
  return a + b;
});
  covarian=x/(cnt);
return covarian;

}

function correlation(arr1,arr2){

sum1=arr1.reduce(function(a, b) {
  return a + b;
});
sum2=arr2.reduce(function(a, b) {
  return a + b;
});
 cnt=arr1.length;
avg1=sum1/cnt;
avg2=sum2/cnt;

  ret = [];

  for(ii=0;ii<arr1.length;ii++){
  ret[ii]=(arr2[ii]-avg2) * (arr1[ii]-avg1) ;
  }
 x=ret.reduce(function(a, b) {
  return a + b;
});
  covarian=x/(cnt-1);
std1=standardDeviation(arr1)
std2=standardDeviation(arr2)

corr= covarian/std1;
corr= corr/std2
 
return corr;

}

function presentAssumptions(completeReturns){


annualReturns = customReturn(completeReturns);

		stdev = customStdev(completeReturns);
		$('#assumptionsTable').empty();
		$('#assumptionsTable').append("<tr><th>Asset</th><th>Percentage</th><th>Annual Return</th><th>Standard Deviation</th></tr>");
		assumptions.currentReturns = [];
		description=[];
		percent=[];
		returns=[];
		stdevs=[];
		
		
		for(i=0;i<objCounter;i++){
		areturn= (annualReturns[i]*100).toFixed(2);
		astdev= (stdev[i]*100).toFixed(2);
		$('#assumptionsTable').append("<tr><td>"+objDescription[i]+"</td><td>"+objPercent[i]+" %</td><td class='areturn'>"+areturn+" %</td><td class='astdev'>"+astdev+" %</td></tr>")
		description[i]=objDescription[i];
		percent[i]=objPercent[i];
		returns[i]=areturn;
		stdevs[i]=astdev;
		}
		assumptions.currentReturns[0]=description;
		assumptions.currentReturns[1]=percent;
		assumptions.currentReturns[2]=returns;
		assumptions.currentReturns[3]=stdevs;

//check if customReturns is false; if so ok to update currentReturns cookie
		
if($.cookie("customReturns")=="false"){
//set cookie currentReturns used by next screen 
		src = JSON.stringify(assumptions.currentReturns);
		$.cookie("currentReturns", src);	
		
}else{}
			
		
		
		$('#timePeriodInfo').empty();
		$('#timePeriodInfo').append("<div>Data for the time period between <a id='startMonth'> "+moment(completeReturns[0][completeReturns[0].length-1]).format("MMMM YYYY")+"</a> and <a id='endMonth'> "+moment(completeReturns[0][0]).format("MMMM YYYY")+"</a></div>")
		calander1 = $('#calanderHold');
		startElement = $('#startMonth');
		endElement = $('#endMonth');
	//found in calander.js
	calanderBuild(calander1,startElement,endElement,completeReturns);	


assumptions.covMatrix=[];
assumptions.corrMatrix=[];

for(i=1;i<completeReturns.length;i++){
tempArrayHold=[];
tempArrayHold2=[];
for(y=1;y<completeReturns.length;y++){

tempi=completeReturns[i].slice(0);
tempy=completeReturns[y].slice(0);
tempCov = covariance(tempi,tempy);
tempCorr = correlation(tempi,tempy);
tempArrayHold.push(tempCov);
tempArrayHold2.push(tempCorr);
}
assumptions.covMatrix.push(tempArrayHold);
assumptions.corrMatrix.push(tempArrayHold2);
}
for(i=0;i<assumptions.corrMatrix.length;i++){
assumptions.corrMatrix[i][i]=1;
}

if($.cookie("correlation") == "false"){

srcCorrelation = JSON.stringify(assumptions.corrMatrix);
$.cookie("correlation", srcCorrelation)	
srccov = JSON.stringify(assumptions.covMatrix);
		$.cookie("covariance", srccov);
}


if($.cookie("customReturns")=="true"){
$('#assumptionsTable').css('display','none');
$('#timePeriodInfo').css('display','none');
$('#customTable').css('display','block');
$("#customReturnCheckBox").prop("checked", true);
tempCurrentReturn=$.cookie("currentReturns");
tempCurrentReturns=$.secureEvalJSON(tempCurrentReturn);


$('#customTable').empty();
		$('#customTable').append("<tr><th>Asset</th><th>Percentage</th><th>Annual Return</th><th>Standard Deviation</th></tr>");
		for(i=0;i<tempCurrentReturns[0].length;i++){
		$('#customTable').append("<tr><td>"+tempCurrentReturns[0][i]+"</td><td>"+tempCurrentReturns[1][i]+" %</td><td><input class ='customAnnualReturn' type='text' value='"+tempCurrentReturns[2][i]+"'> %</td><td><input type='text' class ='customAnnualStd' value='"+tempCurrentReturns[3][i]+"'> %</td></tr>")
	
		}
updateCustomReturns();//function found below


}		
		
		
}





























