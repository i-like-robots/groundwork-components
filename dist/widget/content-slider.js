!function(a,b,c){"function"==typeof define&&define.amd?define(c):"undefined"!=typeof module&&module.exports?module.exports=c():b[a]=c()}("Slider",this,function(){var a=function(a){this.target=a,this.runner=a.children[0],this.frames=a.children[0].children,this.current||this._init()};return a.prototype._init=function(){var a=this;this.current=0,this.target.style.position="relative",this.target.style.overflow="hidden",this.runner.style.position="relative",this.linkNext=document.createElement("a"),this.linkPrev=document.createElement("a"),this.linkNext.className=this.linkNext.innerHTML="next",this.linkPrev.className=this.linkPrev.innerHTML="prev",this.linkNext.onclick=function(){return a.to(a.current+1),!1},this.linkPrev.onclick=function(){return a.to(a.current-1),!1},this.target.appendChild(this.linkNext),this.target.appendChild(this.linkPrev),this._update(),this.transforms=function(){var a,b,c,d=["WebkitTransform","msTransform","transform"];for(a=0,b=d.length;b>a;a++)if(d[a]in document.body.style){c=d[a];break}return c}(),this.resize=function(){a.to(a.current)},window.attachEvent?window.attachEvent("onresize",this.resize):window.addEventListener("resize",this.resize,!1)},a.prototype.to=function(a){if(this.frames[a]){var b=this.runner.scrollWidth-this.target.clientWidth,c=this.frames[a].offsetLeft,d=c>=b;d&&(c=b),d&&this.limit||(this.transforms?this.runner.style[this.transforms]="translateX("+-1*c+"px)":this.runner.style.left=""+-1*c+"px",this.current=a),this.limit=d,this._update()}},a.prototype._update=function(){var a=" is-disabled ",b=/is\-disabled/g,c=" is-focus ",d=/is\-focus/g;this.current+1===this.frames.length||this.limit?this.linkNext.className+=a:this.linkNext.className=this.linkNext.className.replace(b,""),0===this.current?this.linkPrev.className+=a:this.linkPrev.className=this.linkPrev.className.replace(b,"");for(var e=0,f=this.frames.length;f>e;e++)this.frames[e].className=this.frames[e].className.replace(d,"");this.frames[this.current].className+=c},a.prototype.teardown=function(){this.target.style.position="",this.target.style.overflow="",this.runner.style.position="",this.target.removeChild(this.linkNext),this.target.removeChild(this.linkPrev),window.attachEvent?window.detachEvent("onresize",this.resize):window.removeEventListener("resize",this.resize,!1),delete this.current,delete this.linkNext,delete this.linkPrev,delete this.transforms},a});