(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{13:function(e,t,n){e.exports=n(24)},18:function(e,t,n){},24:function(e,t,n){"use strict";n.r(t);var a=n(1),c=n.n(a),o=n(9),i=n.n(o),r=n(2),s=n(3),u=n(5),l=n(4),h=n(6),d=n(26),f=n(10),p=new(function(e){function t(){var e;return Object(r.a)(this,t),(e=Object(u.a)(this,Object(l.a)(t).call(this))).socket=null,e.pin=null,e}return Object(h.a)(t,e),Object(s.a)(t,[{key:"connect",value:function(){var e=this;if(!this.isConnected){this.socket=new WebSocket("ws://localhost:8080"),this.socket.addEventListener("open",function(){e.emit("connected")}),this.socket.addEventListener("message",this.onData.bind(this)),this.socket.addEventListener("error",function(){e.emit("error")}),this.socket.addEventListener("close",function(){e.emit("close")})}}},{key:"onData",value:function(e){var t=this;e.data.split("*!*").forEach(function(e){var n,a;try{var c=JSON.parse(e);n=c.type||null,a=c.data||null}catch(o){return}t.processResponse(n,a)})}},{key:"processResponse",value:function(e,t){switch(e){case"chat":var n=t.text,a=t.from;this.emit("chat",{text:n,from:a});break;case"pin":var c=t.pin;this.pin=c,this.emit("pin")}}},{key:"sendChat",value:function(e){this.send("chat",{text:e})}},{key:"send",value:function(e,t){this.isConnected&&this.socket.send(JSON.stringify({type:e,data:t})+"*!*")}},{key:"close",value:function(){this.isConnected&&this.socket.close()}},{key:"isConnected",get:function(){return!!this.socket&&1===this.socket.readyState}}]),t}(f.EventEmitter)),v=(n(18),function(e){function t(e){var n;return Object(r.a)(this,t),(n=Object(u.a)(this,Object(l.a)(t).call(this,e))).outputRef=c.a.createRef(),n.inputRef=c.a.createRef(),n}return Object(h.a)(t,e),Object(s.a)(t,[{key:"componentDidMount",value:function(){var e=this;p.on("connected",function(){return e.updateChat("Connected to server.")}),p.on("close",function(){return e.updateChat("Lost connection.")}),p.on("pin",function(){return e.updateChat("PIN = ".concat(p.pin))}),p.on("chat",function(t){return e.updateChat(t.text,t.from)}),this.updateChat("Connecting..."),p.connect()}},{key:"updateChat",value:function(e,t){var n=this.outputRef.current,a=t?"".concat(t,": ").concat(e):e;n.value?(n.value="".concat(n.value,"\n").concat(a),n.scrollTop=n.scrollHeight):n.value=a}},{key:"onInput",value:function(e){var t=this.inputRef.current.value;t&&13===e.keyCode&&(p.sendChat(t),this.inputRef.current.value="")}},{key:"render",value:function(){return c.a.createElement("div",null,c.a.createElement("br",null),c.a.createElement("header",null,c.a.createElement("h1",{className:"text-center"},"Electron Chat")),c.a.createElement("br",null),c.a.createElement(d.a,null,c.a.createElement("div",{className:"chat"},c.a.createElement("textarea",{ref:this.outputRef,readOnly:!0}),c.a.createElement("br",null),c.a.createElement("input",{ref:this.inputRef,type:"text",onKeyUp:this.onInput.bind(this)}))))}}]),t}(c.a.Component));n(22);i.a.render(c.a.createElement(v,null),document.querySelector("#root"))}},[[13,2,1]]]);
//# sourceMappingURL=main.503b12f9.chunk.js.map