!function(a,b,c){"function"==typeof define&&define.amd?define(c):"undefined"!=typeof module&&module.exports?module.exports=c():b[a]=c()}("Placeholder",this,function(){var a=function(a,b,c){a.addEventListener?a.addEventListener(b,c,!1):a.attachEvent("on"+b,c)},b=function(a,b,c){a.removeEventListener?a.removeEventListener(b,c,!1):a.detachEvent("on"+b,c)},c=function(a){return a?a.replace(/^\s\s*/,"").replace(/\s\s*$/,""):""},d=function(a,b){0===c(a.value).length&&(a.value=b)},e=function(a){this.target=a,this.text=c(a.firstChild.nodeValue),this.input=document.getElementById(a.getAttribute("for")||a.getAttribute("htmlFor")),this.type||this._init()};return e.prototype._init=function(){if(this.target.style.position="absolute",this.target.style.left="-9999px",this.input.setAttribute("title",this.text),"select"===this.input.nodeName.toLowerCase()){this.type="select";var a=this.input.options[0],b=!!this.input.selectedIndex||null!==a.getAttribute("selected");c(a.value).length>0&&(this.option=document.createElement("option"),this.input.insertBefore(this.option,a),a=this.option),a.text=this.text,a.value="",a.selected=!b}("textarea"===this.input.nodeName.toLowerCase()||/text|email|tel|url|number/i.test(this.input.type))&&(this.type="text",this.supported="placeholder"in this.input,this.supported?this.input.setAttribute("placeholder",this.text):this._contrive())},e.prototype._contrive=function(){var b=this;this._handlers={},"complete"===document.readyState?d(this.input,this.text):a(window,"load",function(){d(b.input,b.text)}),this.input.className+=" has-placeholder",this.input.form&&(this._handlers.submit=function(){b.input.value===b.text&&(b.input.value="")},a(this.input.form,"submit",this._handlers.submit)),this._handlers.focus=function(){if(b.input.value===b.text)if(b.input.setSelectionRange)b.input.setSelectionRange(0,0);else if(b.input.createTextRange){var a=b.input.createTextRange();a.collapse(!0),a.select()}},a(this.input,"focus",this._handlers.focus),this._handlers.keydown=function(){b.input.value===b.text&&(b.input.value="",b.input.className=b.input.className.replace(/\bhas-placeholder\b/,""))},a(this.input,"keydown",this._handlers.keydown),this._handlers.blur=function(){0===c(b.input.value).length&&(b.input.value=b.text,b.input.className.match(/\bhas-placeholder\b/)||(b.input.className+=" has-placeholder"))},a(this.input,"blur",this._handlers.blur)},e.prototype.teardown=function(){if(this.target.style.position="",this.target.style.left="",this.input.removeAttribute("title"),"select"===this.type)this.option?(this.input.removeChild(this.option),delete this.option):this.input.options[0].text="";else{if(this.supported)this.input.removeAttribute("placeholder");else{this.input.className=this.input.className.replace(/\bhas-placeholder\b/,""),this.input.value===this.text&&(this.input.value="");for(var a in this._handlers)this._handlers.hasOwnProperty(a)&&b(this.input,a,this._handlers[a]);delete this._handlers}delete this.supported}delete this.type},e});