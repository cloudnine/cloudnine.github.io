$(init);
function init(){

(function () {
  var script = document.createElement("script");
  script.type = "text/javascript";
  script.src = "mathjax/es5/tex-chtml.js";   // use the location of your MathJax

  var config = 'MathJax.Hub.Config({' +
  'tex2jax: {' +
"inlineMath:[['\\(','\\)']]," +
    "displayMath: [ ['$$','$$'], ['\[','\]'] ],"+
"processEscapes: true,"+
"processEnvironments: true,"+
"skipTags: ['script', 'noscript', 'style', 'textarea', 'pre'],"+
'TeX: { equationNumbers: { autoNumber: "AMS" },'+
'extensions: ["tex2math.js","TeX/noErrors.js","TeX/noUndefined.js",'+
'"TeX/AMSmath.js","TeX/AMSsymbols.js"]}'+
'jax: ["input/TeX","output/HTML-CSS"]' +
               '});' +
               'MathJax.Hub.Startup.onload();';

if (window.opera) {script.innerHTML = config}
               else {script.text = config}

  document.getElementsByTagName("head")[0].appendChild(script);
})();



};
