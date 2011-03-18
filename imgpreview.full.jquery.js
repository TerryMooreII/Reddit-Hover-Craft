/*
 * imgPreview jQuery plugin
 * Copyright (c) 2009 James Padolsey
 * j@qd9.co.uk | http://james.padolsey.com
 * Dual licensed under MIT and GPL.
 * Updated: 09/02/09
 * @author James Padolsey
 * @version 0.22
 */
(function($){
    
    $.expr[':'].linkingToImage = function(elem, index, match){
        // This will return true if the specified attribute contains a valid link to an image:
        return !! ($(elem).attr(match[3]) && $(elem).attr(match[3]).match(/\.(gif|jpe?g|png|bmp)$/i));
    };
    
    $.fn.imgPreview = function(userDefinedSettings){
        
        var s = $.extend({
            
            /* DEFAULTS */
            
            // CSS to be applied to image:
            imgCSS: {},
            // Distance between cursor and preview:
            distanceFromCursor: {top:10, left:10},
            // Boolean, whether or not to preload images:
            preloadImages: true,
            // Callback: run when link is hovered: container is shown:
            onShow: function(){},
            // Callback: container is hidden:
            onHide: function(){},
            // Callback: Run when image within container has loaded:
            onLoad: function(){},
            // ID to give to container (for CSS styling):
            containerID: 'imgPreviewContainer',
            // Class to be given to container while image is loading:
            containerLoadingClass: 'loading',
            // Prefix (if using thumbnails), e.g. 'thumb_'
            thumbPrefix: '',
            // Where to retrieve the image from:
            srcAttr: 'href'
            
        }, userDefinedSettings),
        
        $container = $('<div/>').attr('id', s.containerID)
                        .append('<img/>').hide()
                        .css('position','absolute')
                        .appendTo('body'),
            
        $img = $('img', $container).css(s.imgCSS),
        
        // Get all valid elements (linking to images / ATTR with image link):
        $collection = this.filter(':linkingToImage(' + s.srcAttr + ')');
        
        // Re-usable means to add prefix (from setting):
        function addPrefix(src) {
            return src.replace(/(\/?)([^\/]+)$/,'$1' + s.thumbPrefix + '$2');
        }
        
        if (s.preloadImages) {
            (function(i){
                var tempIMG = new Image(),
                    callee = arguments.callee;
                tempIMG.src = addPrefix($($collection[i]).attr(s.srcAttr));
                tempIMG.onload = function(){
                    $collection[i + 1] && callee(i + 1);
                };
            })(0);
        }
        
		 function getWindowSize() {
			return {
				scrollLeft: $(window).scrollLeft(),
				scrollTop: $(window).scrollTop(),
				width: $(window).width(),
				height: $(window).height()
			};
		}
		
		function getPopupSize() {
			return {
				width: $($container).width(),
				height: $($container).height()
			};
		}
		
        $collection
            .mousemove(function(e){
             var windowSize = getWindowSize();
			 
			 var popupSize = getPopupSize();
				// console.log('-----Left------------');
				// console.log('epageW ' + e.pageX);
				// console.log('windowsSize.scrollLeft ' + windowSize.scrollLeft);
				// console.log('windowsSize.width ' + windowSize.width);
				// console.log('popupSize.width ' + popupSize.width);
			if (windowSize.width + windowSize.scrollLeft < e.pageX + popupSize.width + s.distanceFromCursor.left && e.pageX + popupSize.width + s.distanceFromCursor.left + 10 < windowSize.width){
				$($container).css("left", e.pageX - popupSize.width - s.distanceFromCursor.left);
			} else if ( e.pageX + popupSize.width > windowSize.width &&  e.pageX - popupSize.width > 0 ) { 
				$($container).css("left", e.pageX - popupSize.width - s.distanceFromCursor.left);
			} else if ( e.pageX + popupSize.width > windowSize.width ){
				$($container).css("left", 0);
			}else{
				$($container).css("left", e.pageX + s.distanceFromCursor.left);
			}
			 console.log('-----Top------------');
				console.log('epageY ' + e.pageY);
				console.log('windowsSize.scrollTop ' + windowSize.scrollTop);
				console.log('windowsSize.height ' + windowSize.height);
				console.log('popupSize.heifght ' + popupSize.height);
				var val = e.pageY -  (windowSize.height / 2 ) + s.distanceFromCursor.top +20;
				console.log('math ' + val );// 
				
			if (e.pageY - windowSize.scrollTop < popupSize.height && e.pageY - windowSize.scrollTop + popupSize.height > windowSize.height){
				$($container).css("top",  val);		
			}else if (e.pageY - windowSize.scrollTop < popupSize.height){
				$($container).css("top", e.pageY + s.distanceFromCursor.top);		
			}else if (windowSize.height + windowSize.scrollTop < e.pageY + popupSize.height + s.distanceFromCursor.top){
				$($container).css("top", e.pageY - popupSize.height - s.distanceFromCursor.top);
			} else {
				$($container).css("top", e.pageY + s.distanceFromCursor.top);
			}
                $($container).show()
            })
            .hover(function(){
                
                var link = this;
                $container
                    .addClass(s.containerLoadingClass)
                    .hide();
                $img
                    .load(function(){
                        $container.removeClass(s.containerLoadingClass);
                        $img.show();
                        s.onLoad.call($img[0], link);
                    })
                    .attr( 'src' , addPrefix($(link).attr(s.srcAttr)) );
                s.onShow.call($container[0], link);
                
            }, function(){
                
                $container.hide();
                $img.unbind('load').attr('src','').hide();
                s.onHide.call($container[0], this);
                
            });
        
        // Return full selection, not $collection!
        return this;
        
    };
    
})(jQuery);