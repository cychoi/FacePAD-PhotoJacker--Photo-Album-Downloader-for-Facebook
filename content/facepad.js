/****************************************************************/
/****************************************************************/
/********PHOTOJACKER: PHOTO ALBUM DOWNLOADER FOR FACEBOOK********/
/****************************************************************/
/*****************OFFICIAL RELEASE VERSION 0.9.6*****************/
/****************************************************************/
/*********CREATED BY: ARTHUR SABINTSEV (THE LAZYRUSSIAN)*********/
/****************************************************************/
/*******************HTTP://WWW.PHOTOJACKER.COM*******************/
/****************************************************************/
/**********************ARTHUR@SABINTSEV.COM**********************/
/****************************************************************/
/****************************************************************/

window.addEventListener("load", function() { facepadACTION.Initialize() }, true);

var facepadACTION = {
  
 Initialize: function(){
    var self = this;
    var contextMenu = document.getElementById("contentAreaContextMenu");
    contextMenu.addEventListener("popupshowing", function() { self.ContextMenuPopup(); }, false);
  },
 
 ContextMenuPopup: function(){
    var albumLink = (gContextMenu.onSaveableLink || (gContextMenu.inDirList && gContextMenu.onLink));
    var albumLoc = (gContextMenu.linkURL.match(/http:\/\/.*?\.facebook\.com\/album\.php.*?/) || gContextMenu.linkURL.match(/http:\/\/.*?\.facebook\.com\/photo_search\.php.*?/) || gContextMenu.linkURL.match(/http:\/\/.*?\.facebook\.com\/media.*?/));
    if(albumLink && albumLoc){
      gContextMenu.showItem("facepad_dl", true);
      gContextMenu.showItem("facepad_support", true);
    }
    else {
      gContextMenu.showItem("facepad_dl", false);
      gContextMenu.showItem("facepad_support", false);
    }
  },
 
 Support: function(){
    gBrowser.loadOneTab("http://bit.ly/photojacker-donate");    
  },

 Loader: function(){
    var self = this;
    var pageNum = 0;
    var prefix = "";
    //var authURL = "https://www.facebook.com/dialog/oauth?client_id=158448270883070&redirect_uri=http://www.facebook.com/apps/application.php?id=158448270883070&response_type=token";
    //gBrowser.loadOneTab(authURL);  
    self.LoadPage(gContextMenu.linkURL,pageNum,prefix) 
  },
 
 LoadPage: function(facebookURL,pageNum,prefixOrig) {
    var self = this;
    var stop = false;
    var facepad_xmlhttp;
    var facebookURLrequest = facebookURL;
    if(pageNum!=0) facebookURLrequest=facebookURL+"&page="+pageNum;
    if(!facepad_xmlhttp && typeof XMLHttpRequest!='undefined') {
      facepad_xmlhttp = new XMLHttpRequest();
    }  
    facepad_xmlhttp.open("GET", facebookURLrequest);
    facepad_xmlhttp.onreadystatechange = function() {      
      if (facepad_xmlhttp.readyState == 4 && facepad_xmlhttp.status == 200) {
	var photos = new Array();
	var photoURL = /(http:\/\/[a-zA-Z./\-\_0-9]*photos[a-zA-Z./\-\_0-9]*\.jpg)/g;
	var matches = facepad_xmlhttp.responseText.match(photoURL);

	var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(Components.interfaces.nsIFilePicker);
	fp.init(window, "Which directory should PhotoJacker save this Facebook album to?", Components.interfaces.nsIFilePicker.modeGetFolder);
	var showfp = fp.show();
	if (showfp == Components.interfaces.nsIFilePicker.returnOK){
	  var targetDir = fp.file;
	  var prefix = prefixOrig;
	  if(pageNum==0){
	    var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService);
	    var prefixInput = {value: ""};  
	    var prefixCheck = {value: false};
	    var prefixAsk = prompts.prompt(null, "Set a Photo Prefix - PhotoJacker",
					   "What term would you like to prefix the downloaded photos with? (Example: familyalbum1)",
					   prefixInput,
					   null,
					   prefixCheck
					   );
	    prefix = prefixInput.value;
	  }
	  
	  for(i=0;i<matches.length;i++){
	    photos[photos.length] = matches[i];
	  }	  
	  for(i=0; i<photos.length; i++){ 
	    var faceFile = Components.classes["@mozilla.org/network/io-service;1"]
	      .getService(Components.interfaces.nsIIOService)  
	      .newURI(photos[i].replace(/_s/g, "_n").replace(/\/s/g, "/n").replace(/_t/g, "_n").replace(/_a/g, "_n").replace(/\/a/g, "/n"), null, null);
	    var targetFile = targetDir.clone();
	    
	    imageCounter = i+((pageNum)*200);
	    if(prefix != null && prefix != ""){
	      if(imageCounter<9){targetFile.append(prefix.toLowerCase()+"_00"+(imageCounter+1)+".jpg");}
	      else if(imageCounter<99){targetFile.append(prefix.toLowerCase()+"_0"+(imageCounter+1)+".jpg");}
	      else {targetFile.append(prefix.toLowerCase()+"_"+(imageCounter+1)+".jpg");};
	    }
	    else{
	      if(imageCounter<9){targetFile.append(prefix.toLowerCase()+"00"+(imageCounter+1)+".jpg");}
	      else if(imageCounter<99){targetFile.append(prefix.toLowerCase()+"0"+(imageCounter+1)+".jpg");}
	      else {targetFile.append(prefix.toLowerCase()+(imageCounter+1)+".jpg");};
	    };
	    if (stop==false) var persist = Components.classes["@mozilla.org/embedding/browser/nsWebBrowserPersist;1"].createInstance(Components.interfaces.nsIWebBrowserPersist);
	    persist.saveURI(faceFile, null, null, null, null, targetFile);
	  }
	  if((facepad_xmlhttp.responseText.match(/More<\/span>/)) && (!facebookURLrequest.match(/http:\/\/.*?\.facebook\.com\/photo_search\.php.*?/))){
	      self.LoadPage(facebookURL,pageNum+1,prefix);
	  }
	  photos = null;  
	  stop = true;
	  prefix = null;
	}	
      }
    }
    facepad_xmlhttp.send(null);
  }
}
