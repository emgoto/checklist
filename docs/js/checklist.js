!function(e){var t={};function n(r){if(t[r])return t[r].exports;var i=t[r]={i:r,l:!1,exports:{}};return e[r].call(i.exports,i,i.exports,n),i.l=!0,i.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)n.d(r,i,function(t){return e[t]}.bind(null,i));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=3)}({3:function(e,t,n){"use strict";n.r(t);const r=(e,t)=>{const n=t.filter((t,n)=>n===e.oldIndex),r=t.filter((t,n)=>n!==e.oldIndex);return[...r.slice(0,e.newIndex),n[0],...r.slice(e.newIndex)]},i=TrelloPowerUp.iframe(),a=()=>'\n    <div id="existing-item-textarea" class="item-textarea-container"> \n      <textarea name="message" class="item-textarea" style="margin-bottom: 0px" rows="1"></textarea>\n      </div>\n  ',o=e=>`<div class="item-container draggable-source">\n  <div class="checkbox"></div>\n  <div class="item-text">Task with an avatar and due date ${e.text}</div>\n    <div class="due-date">Oct 8<div class="due-date-icon"></div></div>\n    <img class="avatar" src="https://trello-avatars.s3.amazonaws.com/252bbb6c3a184e6d1391fdbab0d19f1b/50.png"/>\n  <div class="meatballs"></div>\n  </div>`,l=[{text:"1"},{text:"2"},{text:"3"}];function s(){if(this.querySelector("#existing-item-textarea"))return null;const e=this.querySelector(".item-text").innerHTML;this.querySelector(".item-text").style.display="none",this.querySelector(".due-date").style.display="none",this.querySelector(".avatar").style.display="none",this.querySelector(".meatballs").style.display="none",this.querySelector(".checkbox").insertAdjacentHTML("afterend",a());const t=this.querySelector(".item-textarea");t.focus(),t.value=e,t.onblur=()=>{const e=this.querySelector(".item-textarea").value;this.querySelector(".item-text").innerHTML=e,this.removeChild(this.querySelector("#existing-item-textarea")),this.querySelector(".item-text").style.display="",this.querySelector(".due-date").style.display="",this.querySelector(".avatar").style.display="",this.querySelector(".meatballs").style.display=""}}function c(){const e=document.getElementById("checklist-container");new Draggable.Sortable(e,{mirror:{xAxis:!1}}).on("sortable:stop",e=>{r(e,l)}),l.map(t=>e.insertAdjacentHTML("afterend",o(t))),i.sizeTo(document.body),document.getElementById("add-an-item").addEventListener("click",(function(){this.style.display="none",document.getElementById("new-item-textarea").removeAttribute("hidden")}));const t=document.querySelectorAll(".item-container");Array.from(t).forEach(e=>e.onclick=s)}i.render((function(){try{c()}catch(e){console.log("oh man",e)}}));try{c()}catch(e){console.log("oh man",e)}}});
//# sourceMappingURL=checklist.js.map