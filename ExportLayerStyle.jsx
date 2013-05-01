// ExportLayerStyle.jsx
// Written by Tom Krcha, @tomkrcha, www.tomkrcha.com
// Public Domain.
// NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

#target photoshop
// I am using 'JSON in JavaScript' for formatting the data http://www.json.org/js.html
#include "utils/json2.js"

function run() {
  var layer = app.activeDocument.activeLayer;
  var obj = getLayerStyles();
	if(obj==null){
		alert("No style to assigned to the selected layer.");
		return;
	}
  // additional info
	obj["layer"] = {name:layer.name,bounds:layer.bounds.toString(),opacity:layer.opacity,blendMode:layer.blendMode.toString()};
	saveFile(layer.name,JSON.stringify(obj,null,"\t"));
   	
  return true;
}

// Available LayerStyle properties: frameFX, solidFill, gradientFill, chromeFX, bevelEmboss, innerGlow, outerGlow, innerShadow, dropShadow.opacity/distance
function getLayerStyles(){
   var ref = new ActionReference();
   ref.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID( "Ordn" ), charIDToTypeID( "Trgt" ) );
   var layerDesc = executeActionGet(ref);
   if(layerDesc.hasKey(stringIDToTypeID('layerEffects'))){
       stylesDesc = layerDesc.getObjectValue(stringIDToTypeID('layerEffects'));
       var obj = actionDescriptorToObject(stylesDesc);
       return obj;
   }
};

function actionDescriptorToObject(desc){
	var obj = {};
	var len = desc.count;
	for(var i=0;i<len;i++){
		var key = desc.getKey(i);
		obj[typeIDToStringID(key)] = getValueByType(desc,key);
	}
	return obj;
}
// Get a value from an ActionDescriptor by a type defined by a key
// ALIASTYPE BOOLEANTYPE CLASSTYPE DOUBLETYPE ENUMERATEDTYPE INTEGERTYPE LARGEINTEGERTYPE LISTTYPE OBJECTTYPE RAWTYPE REFERENCETYPE STRINGTYPE UNITDOUBLE
function getValueByType(desc,key){
	var type = desc.getType(key);
	var value = null;
	switch(type){
		case DescValueType.ALIASTYPE:
			value = "alias";
			break;
		case DescValueType.BOOLEANTYPE:
			value = desc.getBoolean(key);
			break;
		case DescValueType.CLASSTYPE:
			value = desc.getClass(key);
			break;
		case DescValueType.OBJECTTYPE:
			value = actionDescriptorToObject(desc.getObjectValue(key));//+" - "+desc.getObjectType(key);
			break;
		case DescValueType.ENUMERATEDTYPE:
			value = typeIDToStringID(desc.getEnumerationValue(key));
			break;
		case DescValueType.DOUBLETYPE:
			value = desc.getDouble(key);
			break;
		case DescValueType.INTEGERTYPE:
			value = desc.getInteger(key);
			break;
		case DescValueType.LARGEINTEGERTYPE:
			value = desc.getLargeInteger(key);
			break;
		case DescValueType.LISTTYPE:
			value = desc.getList(key);
			break;
		case DescValueType.RAWTYPE:
      		// not implemented
			break;
		case DescValueType.REFERENCETYPE:
			value = desc.getReference(key);
			break;
		case DescValueType.STRINGTYPE:
			value = desc.getString(key);
			break;
		case DescValueType.UNITDOUBLE:
			value = desc.getUnitDoubleValue(key);
			break;
	}
	return value;
}

// Save file with a layer name
function saveFile(layerName,str){
    var fileName = app.activeDocument.name.substring(0,app.activeDocument.name.lastIndexOf("."));
    var path = app.activeDocument.path.fsName;
    var fullPath = path+"/"+fileName+"_"+layerName+".json";
    var file = new File(fullPath);
    file.open('w');
    file.write(str);
    file.close();
   	alert("Style saved to "+fullPath);
}
 
// Logging functions for debugging via ExtendScript Toolkit Console
var logstr="";
function log(str,delimeter){
	if(delimeter==null){
		delimeter = "\n";
	}	
	logstr=str+delimeter+logstr;
}

function flushLog(){
	$.writeln(logstr);
}

// Run the script
run();
