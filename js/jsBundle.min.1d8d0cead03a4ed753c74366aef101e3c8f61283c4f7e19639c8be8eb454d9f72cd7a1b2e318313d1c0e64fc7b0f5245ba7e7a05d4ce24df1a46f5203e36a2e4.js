function MediumLightbox(element,options){"use strict";if(!element)return;var zoomedImg;var screenSize={};var options=options||{};var margin=options.margin||50;var scrollDiv=document.createElement("div");scrollDiv.className="scrollbar-measure";document.body.appendChild(scrollDiv);var scrollbarWidth=scrollDiv.offsetWidth-scrollDiv.clientWidth;document.body.removeChild(scrollDiv);function updateScreenSize(){var w=window,d=document,e=d.documentElement,g=d.getElementsByTagName('body')[0],x=w.innerWidth||e.clientWidth||g.clientWidth,y=w.innerHeight||e.clientHeight||g.clientHeight;screenSize.x=x;screenSize.y=y;}
updateScreenSize();window.addEventListener("resize",updateScreenSize);function zoom(){if(!this.isZoomed){this.isZoomed=!this.isZoomed;zoomedImg=this;if(!this.img)
this.img=this.getElementsByTagName('img')[0];var imgH=this.img.getBoundingClientRect().height;var imgW=this.img.getBoundingClientRect().width;var imgL=this.img.getBoundingClientRect().left;var imgT=this.img.getBoundingClientRect().top;var realW,realH;if(this.img.dataset){realW=this.img.dataset.width;realH=this.img.dataset.height;}else{realW=this.img.getAttribute('data-width');realH=this.img.getAttribute('data-height');}
if(this.img.classList)
this.img.classList.add('zoomImg');else
this.img.className+=' '+'zoomImg';this.overlay=document.createElement('div');this.overlay.id='the-overlay';this.overlay.className='zoomOverlay';this.overlay.style.cssText='height:'+(screenSize.y)+'px; width: '+screenSize.x+'px; top: -'+((screenSize.y-imgH)/2)+'px; left: -'+((screenSize.x-imgW)/2)+'px;';this.wrapper=document.createElement('div');this.wrapper.id='the-wrapper';this.wrapper.className='zoomImg-wrap zoomImg-wrap--absolute';this.wrapper.appendChild(this.img);this.wrapper.appendChild(this.overlay);this.children[0].appendChild(this.wrapper);var wrapX=((screenSize.x-scrollbarWidth)/2)-imgL-(imgW/2);var wrapY=imgT*(-1)+(screenSize.y-imgH)/2;var scale=1;if(realH>imgH){if(imgH==imgW&&screenSize.y>screenSize.x){scale=(screenSize.x-margin)/imgW;}else if(imgH==imgW&&screenSize.y<screenSize.x){scale=(screenSize.y-margin)/imgH;}else if(imgH>imgW){scale=(screenSize.y-margin)/imgH;if(scale*imgW>screenSize.x){scale=(screenSize.x-margin)/imgW;};}else if(imgH<imgW){scale=(screenSize.x-margin)/imgW;if(scale*imgH>screenSize.y){scale=(screenSize.y-margin)/imgH;};}}
if(scale*imgW>realW){scale=realW/imgW;}
var that=this;setTimeout(function(){that.wrapper.style.cssText='transform: translate('+wrapX+'px, '+wrapY+'px) translateZ(0px);-webkit-transform: translate('+wrapX+'px, '+wrapY+'px) translateZ(0px);';that.img.style.cssText="transform: scale("+scale+");-webkit-transform: scale("+scale+")";that.overlay.className='zoomOverlay show';},0);}else{this.isZoomed=!this.isZoomed;zoomedImg=null
this.img.style.cssText="";this.wrapper.style.cssText='';this.overlay.className='zoomOverlay';var that=this;setTimeout(function(){that.children[0].appendChild(that.img)
that.children[0].removeChild(that.wrapper)
var className='zoomImg'
if(that.img.classList)
that.img.classList.remove(className);else
that.img.className=that.img.className.replace(new RegExp('(^|\\b)'+className.split(' ').join('|')+'(\\b|$)','gi'),' ');},300)}}
var elements=document.querySelectorAll(element);Array.prototype.forEach.call(elements,function(el,i){el.addEventListener("click",zoom);});function zoomOut(){if(zoomedImg){zoomedImg.click();}}
window.addEventListener("scroll",zoomOut);};"use strict";var searchFn=function(){var lastTerm="You are likely to be eaten by a grue.";var stopwords=["i","me","my","we","our","you","it","its","this","that","am","is","are","was","be","has","had","do","a","an","the","but","if","or","as","of","at","by","for","with","to","then","no","not","so","too","can","and","but"];var normalizer=document.createElement("textarea");var normalize=function(input){normalizer.innerHTML=input;var inputDecoded=normalizer.value;return " "+inputDecoded.trim().toLowerCase().replace(/[^0-9a-z ]/gi," ").replace(/\s+/g," ")+" ";}
var limit=30;var minChars=2;var searching=false;var render=function(results){results.sort(function(a,b){return b.weight-a.weight;});for(var i=0;i<results.length&&i<limit;i+=1){var result=results[i].item;var resultPane='<article class=\"post post-search-grid\">'+
'<a class=\"title post-meta-styling post-search-image\" href=\"'+result.permalink+'#article-title\"'+
'alt=\"'+result.showTitle+'\">'+
'<img src=\"'+result.showImage+'\" alt=\"'+result.showTitle+'\" class=\"search-img\"></a>'+
'<a  class=\"title post-meta-styling post-search-title\" href=\"'+result.permalink+'#article-title\"><div>'+
'<h2>'+result.showTitle+'</h2></div></a>'+
'<div class=\"ml-2 mb-2 mt-1 post-search-meta\"><small><strong>Author:'+result.showAuthor+'</strong>'+
'|&nbsp;<i class=\"far fa-calendar-alt\"></i>&nbsp;'+result.showDate+'</small></div>'+
'<div class="\post-search-summary\">'+result.showSummary+'</div>'+
'<a  class=\"btn btn-outline-secondary post-search-continue\"  href=\"'+result.permalink+'\" role =\"button\">Continue Reading...</a>'+
'<div class=\"post-search-data\"></div></article>';$("#results").append(resultPane);}};var checkTerms=function(terms,weight,target){var weightResult=0;terms.forEach(function(term){if(~target.indexOf(term.term)){var idx=target.indexOf(term.term);while(~idx){weightResult+=term.weight*weight;idx=target.indexOf(term.term,idx+1);}}});return weightResult;};var search=function(terms){var results=[];searchHost.index.forEach(function(item){if(item.tags){var weight_1=0;terms.forEach(function(term){if(item.title.startsWith(term.term)){weight_1+=term.weight*32;}});weight_1+=checkTerms(terms,1,item.content);weight_1+=checkTerms(terms,2,item.description);weight_1+=checkTerms(terms,2,item.subtitle);item.tags.forEach(function(tag){weight_1+=checkTerms(terms,4,tag);});weight_1+=checkTerms(terms,16,item.title);if(weight_1){results.push({weight:weight_1,item:item});}}});if(results.length){var resultsMessage=results.length+" items found.";if(results.length>limit){resultsMessage+=" Showing first "+limit+" results.";}
$("#results").html('<p class="p-news" id="results-message">'+resultsMessage+'</p>');render(results);}
else{$("#results").html('<p class="p-news" id="results-message">No items found.</p>');}};var runSearch=function(){if(searching){return;}
var term=normalize($("#searchBox").val()).trim();if(term===lastTerm){return;}
lastTerm=term;if(term.length<minChars){$("#results").html('<p class="p-news" id="results-message">No items found.</p>');$("#btnGo").attr("disabled",true);return;}
$("#btnGo").removeAttr("disabled");searching=true;var startSearch=new Date();$("#results").html('<p class="p-news" id="results-message">Processing search...</p>');var terms=term.split(" ");var termsTree=[];for(var i=0;i<terms.length;i+=1){for(var j=i;j<terms.length;j+=1){var weight=Math.pow(2,j-i);var str="";for(var k=i;k<=j;k+=1){str+=(terms[k]+" ");}
var newTerm=str.trim();if(newTerm.length>=minChars&&stopwords.indexOf(newTerm)<0){termsTree.push({weight:weight,term:" "+str.trim()+" "});}}}
search(termsTree);searching=false;var endSearch=new Date();$("#results").append('<p class="p-news" id="results-message"><small>Search took '+(endSearch-startSearch)+'ms.</small></p>');};var initSearch=function(){$("#searchBox").keyup(function(){runSearch();});$("#btnGo").click(function(){runSearch();var loc=window.location.href.split("#")[0];loc=loc+"#"+"resultsArea";window.location.href=loc;});runSearch();};$("#searchBox").hide();$("#btnGo").hide();var searchHost={};$.getJSON("/index.json",function(results){searchHost.index=[];var dup={};results.forEach(function(result){if(result.tags&&!dup[result.permalink]){var res={};res.showTitle=result.title;res.showDescription=result.description;res.showDate=result.date;res.showSummary=result.summary;res.showAuthor=result.author;res.showImage=result.image;res.title=normalize(result.title);res.subtitle=normalize(result.subtitle);res.description=normalize(result.description);res.content=normalize(result.summary);var newTags_1=[];result.tags.forEach(function(tag){return newTags_1.push(normalize(tag));});res.tags=newTags_1;res.permalink=result.permalink;searchHost.index.push(res);dup[result.permalink]=true;}});$("#loading").hide();$("#btnGo").show();$("#searchBox").show().removeAttr("disabled").focus();initSearch();});};window.addEventListener("DOMContentLoaded",searchFn);;(function(){var script=document.createElement("script");script.type="text/javascript";script.src="mathjax/es5/tex-chtml.js";var config='MathJax.Hub.Config({'+
'tex2jax: {'+
"inlineMath:[['\\(','\\)']],"+
"displayMath: [ ['$$','$$'], ['\[','\]'] ],"+
"processEscapes: true,"+
"processEnvironments: true,"+
"skipTags: ['script', 'noscript', 'style', 'textarea', 'pre'],"+
'TeX: { equationNumbers: { autoNumber: "AMS" },'+
'extensions: ["tex2math.js","TeX/noErrors.js","TeX/noUndefined.js",'+
'"TeX/AMSmath.js","TeX/AMSsymbols.js"]}'+
'jax: ["input/TeX","output/HTML-CSS"]'+
'});'+
'MathJax.Hub.Startup.onload();';if(window.opera){script.innerHTML=config}
else{script.text=config}
document.getElementsByTagName("head")[0].appendChild(script);})();;$(init);function init(){(function(){var script=document.createElement("script");script.type="text/javascript";script.src="mathjax/es5/tex-chtml.js";var config='MathJax.Hub.Config({'+
'tex2jax: {'+
"inlineMath:[['\\(','\\)']],"+
"displayMath: [ ['$$','$$'], ['\[','\]'] ],"+
"processEscapes: true,"+
"processEnvironments: true,"+
"skipTags: ['script', 'noscript', 'style', 'textarea', 'pre'],"+
'TeX: { equationNumbers: { autoNumber: "AMS" },'+
'extensions: ["tex2math.js","TeX/noErrors.js","TeX/noUndefined.js",'+
'"TeX/AMSmath.js","TeX/AMSsymbols.js"]}'+
'jax: ["input/TeX","output/HTML-CSS"]'+
'});'+
'MathJax.Hub.Startup.onload();';if(window.opera){script.innerHTML=config}
else{script.text=config}
document.getElementsByTagName("head")[0].appendChild(script);})();MediumLightbox('figure.zoom-effect');};