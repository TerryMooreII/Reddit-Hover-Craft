//jQuery page: http://james.padolsey.com/demos/imgPreview/full/
//chrome extension wait for call back info: http://comments.gmane.org/gmane.comp.web.chromium.extensions/4367
    //<![CDATA[



function reWriteImgurUrls(reWriteUrl){
	//This will rewrite urls that orginally go to imgur.com to go
  //to just the jpg file.  BETA	

	if (reWriteUrl == "true"){
		//alert('TRUE dat');
		for (var i = 0; i < document.links.length; i++){
			var url = document.links[i].href.substring(7,12);
			if (url == "imgur"){
				imgChar = document.links[i].href.substring(17,22);
				document.links[i].href = "http://i.imgur.com/" + imgChar + ".jpg";
			}
		}
	//} else {
		//alert('Not True');
	
	}
  //We call getValue here so that all of the async js calls are coplete and
  //we have all of the settings
  getValue('getHeight', onValue);
};

function getValue(key, callback) {
	chrome.extension.sendRequest({msg: key},
		function(response)
		{
		if (key == 'getHeight') {			
			height = response.msg;
			if (height == undefined ) {
				height = 400;
			}
		  callback(height);	
		}else if (key == 'getReWrite') {
			reWriteUrl = response.msg;
			if (reWriteUrl == undefined ) {
				reWriteUrl = false;
			}
		  callback(reWriteUrl);	
		 }	
	});
};	

function onValue(height){

		jQuery.noConflict();
		(function($){  
    //This is for the home page
		$('a').imgPreview({ //p.title 
			containerID: 'imgPreviewWithStyles',
				imgCSS: {
					// Limit preview size:
					height: parseInt(height)
				},
				// When container is shown:
				onShow: function(link){
				// Animate link:
				$(link).stop().animate({opacity:0.4});
				// Reset image:
				$('img', this).css({opacity:0});
				},
				// When image has loaded:
					onLoad: function(){
				// Animate image
				$(this).animate({opacity:1}, 300);
				},
				// When container hides: 
				onHide: function(link){
			// Animate link:
			$(link).stop().animate({opacity:1});
				}
		});
   
		})(jQuery);
};


//reWriteImgurUrls();
getValue('getReWrite', reWriteImgurUrls);





    //]]>
