var names = ["Dave", "Miroslav", "Brad"];
var initials = ["DK", "MS", "BM"];

var outputStr = '<table style="font-size:300%;">'

var nameCol = '<tr><td></td>'
for (i = 0; i < names.length; i++) {
  nameCol += '<th>' + initials[i] + '</th>';
}
nameCol += '</tr>';
outputStr += nameCol;


for (i = 0; i < names.length; i++) {
  var bufferCol = '<tr><th>' + initials[i] + '</th>';
  for (j = 0; j < names.length; j++) {
    if (i == j) {
		bufferCol += '<td></td>';
	}
	else {
		bufferCol += '<td><form><button onclick="logClick(' + i + ',' + j + ')">Buy</button></form></td>';
	}
  }
  bufferCol += '</tr>';
  outputStr += bufferCol;
}

outputStr += '</table>';

document.write(outputStr);