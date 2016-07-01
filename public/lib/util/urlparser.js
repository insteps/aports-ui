/*<![CDATA[*/
/**
* @projectDescription 	Poly9's polyvalent URLParser class
* @author	Denis Laprise - denis@poly9.com - http://poly9.com
* URLParser is freely distributable under the terms of an MIT-style license.
* Modified by V.Krishn (insteps.net)
* @version 0.1.1
*/
if(typeof Poly9=="undefined")var Poly9={};Poly9.URLParser=function(a){this._fields={Username:4,Password:5,Port:7,Protocol:2,Host:6,Pathname:8,URL:0,Querystring:9,Fragment:10};this._values={};this._regex=null;this.version=0.1;this._regex=/^((\w+):\/\/)?((\w+):?(\w+)?@)?([^\/\?:]+):?(\d+)?(\/?[^\?#]+)?\??([^#]+)?#?(\w*)/;for(var b in this._fields)this["get"+b]=this._makeGetter(b);typeof a!="undefined"&&this._parse(a)};Poly9.URLParser.prototype.setURL=function(a){this._parse(a)};
Poly9.URLParser.prototype._initValues=function(){for(var a in this._fields)this._values[a]=""};Poly9.URLParser.prototype._parse=function(a){this._initValues();a=this._regex.exec(a);if(!a)throw"DPURLParser::_parse -> Invalid URL";for(var b in this._fields)if(typeof a[this._fields[b]]!="undefined")this._values[b]=a[this._fields[b]];this.getQueryarray=this._queryArray};Poly9.URLParser.prototype._makeGetter=function(a){return function(){return this._values[a]}};
Poly9.URLParser.prototype._queryArray=function(){var a=this.getQuerystring().split("&");this.qsa={};for(var b in a){var c=a[b].split("=");this.qsa[c[0]]=c[1]}return this.qsa};
/*]]>*/
