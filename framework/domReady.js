/* 
* @Author: lee
* @Date:   2016-01-11 00:28:48
* @Last Modified by:   anchen
* @Last Modified time: 2016-01-11 00:29:00
*/

'use strict';
define(function(){"use strict";function e(e){var t;for(t=0;e.length>t;t+=1)e[t](h)}function t(){var t=c;l&&t.length&&(c=[],e(t))}function i(){l||(l=!0,o&&clearInterval(o),t())}function n(e){return l?e(h):c.push(e),n}var r,s,o,a="undefined"!=typeof window&&window.document,l=!a,h=a?document:null,c=[];if(a){if(document.addEventListener)document.addEventListener("DOMContentLoaded",i,!1),window.addEventListener("load",i,!1);else if(window.attachEvent){window.attachEvent("onload",i),s=document.createElement("div");try{r=null===window.frameElement}catch(u){}s.doScroll&&r&&window.external&&(o=setInterval(function(){try{s.doScroll(),i()}catch(e){}},30))}"complete"===document.readyState&&i()}return n.version="2.0.1",n.load=function(e,t,i,r){r.isBuild?i(null):n(i)},n});