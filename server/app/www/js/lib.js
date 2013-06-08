(function($,document,undefined){var pluses=/\+/g;function raw(s){return s}function decoded(s){return decodeURIComponent(s.replace(pluses," "))}var config=$.cookie=function(key,value,options){if(value!==undefined){options=$.extend({},config.defaults,options);if(value===null){options.expires=-1}if(typeof options.expires==="number"){var days=options.expires,t=options.expires=new Date;t.setDate(t.getDate()+days)}value=config.json?JSON.stringify(value):String(value);return document.cookie=[encodeURIComponent(key),"=",config.raw?value:encodeURIComponent(value),options.expires?"; expires="+options.expires.toUTCString():"",options.path?"; path="+options.path:"",options.domain?"; domain="+options.domain:"",options.secure?"; secure":""].join("")}var decode=config.raw?raw:decoded;var cookies=document.cookie.split("; ");for(var i=0,l=cookies.length;i<l;i++){var parts=cookies[i].split("=");if(decode(parts.shift())===key){var cookie=decode(parts.join("="));return config.json?JSON.parse(cookie):cookie}}return null};config.defaults={};$.removeCookie=function(key,options){if($.cookie(key)!==null){$.cookie(key,null,options);return true}return false}})(jQuery,document);reMarked=function(opts){var links=[];var cfg={link_list:false,h1_setext:true,h2_setext:true,h_atx_suf:false,gfm_code:false,li_bullet:"*-+"[0],hr_char:"-_*"[0],indnt_str:["    ","	","  "][0],bold_char:"*_"[0],emph_char:"*_"[1],gfm_del:true,gfm_tbls:true,tbl_edges:false,hash_lnks:false,br_only:false};extend(cfg,opts);function extend(a,b){if(!b)return a;for(var i in a){if(typeof b[i]!=="undefined")a[i]=b[i]}}function rep(str,num){var s="";while(num-->0)s+=str;return s}function trim12(str){var str=str.replace(/^\s\s*/,""),ws=/\s/,i=str.length;while(ws.test(str.charAt(--i)));return str.slice(0,i+1)}function lpad(targ,padStr,len){return rep(padStr,len-targ.length)+targ}function rpad(targ,padStr,len){return targ+rep(padStr,len-targ.length)}function otag(tag){if(!tag)return"";return"<"+tag+">"}function ctag(tag){if(!tag)return"";return"</"+tag+">"}function pfxLines(txt,pfx){return txt.replace(/^/gm,pfx)}function nodeName(e){return(e.nodeName=="#text"?"txt":e.nodeName).toLowerCase()}function wrap(str,opts){var pre,suf;if(opts instanceof Array){pre=opts[0];suf=opts[1]}else pre=suf=opts;pre=pre instanceof Function?pre.call(this,str):pre;suf=suf instanceof Function?suf.call(this,str):suf;return pre+str+suf}this.render=function(ctr){if(typeof ctr=="string"){var htmlstr=ctr;ctr=document.createElement("div");ctr.innerHTML=htmlstr}var s=new lib.tag(ctr,null,0);var re=s.rend().replace(/^[\t ]+\n/gm,"\n");if(cfg.link_list){re+="\n\n";var maxlen=0;for(var y in links){if(!links[y].e.title)continue;var len=links[y].e.href.length;if(len&&len>maxlen)maxlen=len}for(var k in links){var title=links[k].e.title?rep(" ",maxlen+2-links[k].e.href.length)+'"'+links[k].e.title+'"':"";re+="  ["+(+k+1)+"]: "+links[k].e.href+title+"\n"}}return re.replace(/^[\t ]+\n/gm,"\n")};var lib={};lib.tag=klass({wrap:"",lnPfx:"",lnInd:0,init:function(e,p,i){this.e=e;this.p=p;this.i=i;this.c=[];this.tag=nodeName(e);this.initK()},initK:function(){var i;if(this.e.hasChildNodes()){var inlRe=/^(?:a|strong|code|em|sub|sup|del|i|u|b|big|center)$/,n,name;for(i in this.e.childNodes){if(!/\d+/.test(i))continue;n=this.e.childNodes[i];name=nodeName(n);if(/style|script|canvas|video|audio/.test(name))continue;if(name=="txt"&&/^\s+$/.test(n.textContent)){if(i==0||i==this.e.childNodes.length-1||!this.p)continue;var prev=this.e.childNodes[i-1],next=this.e.childNodes[i+1];if(prev&&!nodeName(prev).match(inlRe)||next&&!nodeName(next).match(inlRe))continue}if(!lib[name])name="tag";var node=new lib[name](n,this,this.c.length);if(node instanceof lib.a&&n.href||node instanceof lib.img){node.lnkid=links.length;links.push(node)}this.c.push(node)}}},rend:function(){return this.rendK().replace(/\n{3,}/gm,"\n\n")},rendK:function(){var n,buf="";for(var i in this.c){n=this.c[i];buf+=(n.bef||"")+n.rend()+(n.aft||"")}return buf.replace(/^\n+|\n+$/,"")}});lib.blk=lib.tag.extend({wrap:["\n\n",""],wrapK:null,tagr:false,lnInd:null,init:function(e,p,i){this.supr(e,p,i);if(this.lnInd===null){if(this.p&&this.tagr&&this.c[0]instanceof lib.blk)this.lnInd=4;else this.lnInd=0}if(this.wrapK===null){if(this.tagr&&this.c[0]instanceof lib.blk)this.wrapK="\n";else this.wrapK=""}},rend:function(){return wrap.call(this,(this.tagr?otag(this.tag):"")+wrap.call(this,pfxLines(pfxLines(this.rendK(),this.lnPfx),rep(" ",this.lnInd)),this.wrapK)+(this.tagr?ctag(this.tag):""),this.wrap)},rendK:function(){var kids=this.supr();if(this.p instanceof lib.li){var repl=null,spcs=kids.match(/^[\t ]+/gm);if(!spcs)return kids;for(var i in spcs){if(repl===null||spcs[i][0].length<repl.length)repl=spcs[i][0]}return kids.replace(new RegExp("^"+repl),"")}return kids}});lib.tblk=lib.blk.extend({tagr:true});lib.cblk=lib.blk.extend({wrap:["\n",""]});lib.ctblk=lib.cblk.extend({tagr:true});lib.inl=lib.tag.extend({rend:function(){return wrap.call(this,this.rendK(),this.wrap)}});lib.tinl=lib.inl.extend({tagr:true,rend:function(){return otag(this.tag)+wrap.call(this,this.rendK(),this.wrap)+ctag(this.tag)}});lib.p=lib.blk.extend({rendK:function(){return this.supr().replace(/^\s+/gm,"")}});lib.div=lib.p.extend();lib.span=lib.inl.extend();lib.list=lib.blk.extend({expn:false,wrap:[function(){return this.p instanceof lib.li?"\n":"\n\n"},""]});lib.ul=lib.list.extend({});lib.ol=lib.list.extend({});lib.li=lib.cblk.extend({wrap:["\n",function(kids){return this.p.expn||kids.match(/\n{2}/gm)?"\n":""}],wrapK:[function(){return this.p.tag=="ul"?cfg.li_bullet+" ":this.i+1+".  "},""],rendK:function(){return this.supr().replace(/\n([^\n])/gm,"\n"+cfg.indnt_str+"$1")}});lib.hr=lib.blk.extend({wrap:["\n\n",rep(cfg.hr_char,3)]});lib.h=lib.blk.extend({});lib.h_setext=lib.h.extend({});cfg.h1_setext&&(lib.h1=lib.h_setext.extend({wrapK:["",function(kids){return"\n"+rep("=",kids.length)}]}));cfg.h2_setext&&(lib.h2=lib.h_setext.extend({wrapK:["",function(kids){return"\n"+rep("-",kids.length)}]}));lib.h_atx=lib.h.extend({wrapK:[function(kids){return rep("#",this.tag[1])+" "},function(kids){return cfg.h_atx_suf?" "+rep("#",this.tag[1]):""}]});!cfg.h1_setext&&(lib.h1=lib.h_atx.extend({}));!cfg.h2_setext&&(lib.h2=lib.h_atx.extend({}));lib.h3=lib.h_atx.extend({});lib.h4=lib.h_atx.extend({});lib.h5=lib.h_atx.extend({});lib.h6=lib.h_atx.extend({});lib.a=lib.inl.extend({lnkid:null,rend:function(){var kids=this.rendK(),href=this.e.getAttribute("href"),title=this.e.title?' "'+this.e.title+'"':"";if(!href||href==kids||href[0]=="#"&&!cfg.hash_lnks)return kids;if(cfg.link_list)return"["+kids+"] ["+(this.lnkid+1)+"]";return"["+kids+"]("+href+title+")"}});lib.img=lib.inl.extend({lnkid:null,rend:function(){var kids=this.e.alt,src=this.e.getAttribute("src");if(cfg.link_list)return"["+kids+"] ["+(this.lnkid+1)+"]";var title=this.e.title?' "'+this.e.title+'"':"";return"!["+kids+"]("+src+title+")"}});lib.em=lib.inl.extend({wrap:cfg.emph_char});lib.i=lib.em.extend();lib.del=cfg.gfm_del?lib.inl.extend({wrap:"~~"}):lib.tinl.extend();lib.br=lib.inl.extend({wrap:["",function(){var end=cfg.br_only?"<br>":"  ";return this.p instanceof lib.h?"<br>":end+"\n"}]});lib.strong=lib.inl.extend({wrap:rep(cfg.bold_char,2)});lib.b=lib.strong.extend();lib.dl=lib.tblk.extend({lnInd:2});lib.dt=lib.ctblk.extend();lib.dd=lib.ctblk.extend();lib.sub=lib.tinl.extend();lib.sup=lib.tinl.extend();lib.blockquote=lib.blk.extend({lnPfx:"> ",rend:function(){return this.supr().replace(/>[ \t]$/gm,">")}});lib.pre=lib.blk.extend({tagr:true,wrapK:"\n",lnInd:0});lib.code=lib.blk.extend({tagr:false,wrap:"",wrapK:function(kids){return kids.indexOf("`")!==-1?"``":"`"},lnInd:0,init:function(e,p,i){this.supr(e,p,i);if(this.p instanceof lib.pre){this.p.tagr=false;if(cfg.gfm_code){var cls=this.e.getAttribute("class");cls=(cls||"").split(" ")[0];if(cls.indexOf("lang-")===0)cls=cls.substr(5);this.wrapK=["```"+cls+"\n","\n```"]}else{this.wrapK="";this.p.lnInd=4}}}});lib.table=cfg.gfm_tbls?lib.blk.extend({cols:[],init:function(e,p,i){this.supr(e,p,i);this.cols=[]},rend:function(){for(var tsec in this.c)for(var row in this.c[tsec].c)for(var cell in this.c[tsec].c[row].c)this.c[tsec].c[row].c[cell].prep();return this.supr()}}):lib.tblk.extend();lib.thead=cfg.gfm_tbls?lib.cblk.extend({wrap:["\n",function(kids){var buf="";for(var i in this.p.cols){var col=this.p.cols[i],al=col.a[0]=="c"?":":" ",ar=col.a[0]=="r"||col.a[0]=="c"?":":" ";buf+=(i==0&&cfg.tbl_edges?"|":"")+al+rep("-",col.w)+ar+(i<this.p.cols.length-1||cfg.tbl_edges?"|":"")}return"\n"+trim12(buf)}]}):lib.ctblk.extend();lib.tbody=cfg.gfm_tbls?lib.cblk.extend():lib.ctblk.extend();lib.tfoot=cfg.gfm_tbls?lib.cblk.extend():lib.ctblk.extend();lib.tr=cfg.gfm_tbls?lib.cblk.extend({wrapK:[cfg.tbl_edges?"| ":"",cfg.tbl_edges?" |":""]}):lib.ctblk.extend();lib.th=cfg.gfm_tbls?lib.inl.extend({guts:null,wrap:[function(){var col=this.p.p.p.cols[this.i],spc=this.i==0?"":" ",pad,fill=col.w-this.guts.length;switch(col.a[0]){case"r":pad=rep(" ",fill);break;case"c":pad=rep(" ",Math.floor(fill/2));break;default:pad=""}return spc+pad},function(){var col=this.p.p.p.cols[this.i],edg=this.i==this.p.c.length-1?"":" |",pad,fill=col.w-this.guts.length;switch(col.a[0]){case"r":pad="";break;case"c":pad=rep(" ",Math.ceil(fill/2));break;default:pad=rep(" ",fill)}return pad+edg}],prep:function(){this.guts=this.rendK();this.rendK=function(){return this.guts};var cols=this.p.p.p.cols;if(!cols[this.i])cols[this.i]={w:null,a:""};var col=cols[this.i];col.w=Math.max(col.w||0,this.guts.length);if(this.e.align)col.a=this.e.align}}):lib.ctblk.extend();lib.td=lib.th.extend();lib.txt=lib.inl.extend({initK:function(){this.c=this.e.textContent.split(/^/gm)},rendK:function(){var kids=this.c.join("").replace(/\r/gm,"");if(!(this.p instanceof lib.code||this.p instanceof lib.pre)){kids=kids.replace(/^\s*#/gm,"\\#").replace(/\*/gm,"\\*")}if(this.i==0)kids=kids.replace(/^\n+/,"");if(this.i==this.p.c.length-1)kids=kids.replace(/\n+$/,"");return kids}})};!function(a,b){typeof define=="function"?define(b):typeof module!="undefined"?module.exports=b():this[a]=b()}("klass",function(){function f(a){return j.call(g(a)?a:function(){},a,1)}function g(a){return typeof a===c}function h(a,b,c){return function(){var d=this.supr;this.supr=c[e][a];var f=b.apply(this,arguments);return this.supr=d,f}}function i(a,b,c){for(var f in b)b.hasOwnProperty(f)&&(a[f]=g(b[f])&&g(c[e][f])&&d.test(b[f])?h(f,b[f],c):b[f])}function j(a,b){function c(){}function l(){this.init?this.init.apply(this,arguments):(b||h&&d.apply(this,arguments),j.apply(this,arguments))}c[e]=this[e];var d=this,f=new c,h=g(a),j=h?a:this,k=h?{}:a;return l.methods=function(a){return i(f,a,d),l[e]=f,this},l.methods.call(l,k).prototype.constructor=l,l.extend=arguments.callee,l[e].implement=l.statics=function(a,b){return a=typeof a=="string"?function(){var c={};return c[a]=b,c}():a,i(this,a,d),this},l}var a=this,b=a.klass,c="function",d=/xyz/.test(function(){xyz})?/\bsupr\b/:/.*/,e="prototype";return f.noConflict=function(){return a.klass=b,this},a.klass=f,f});(function($){$.fn.drags=function(opt){opt=$.extend({handle:"",cursor:"move"},opt);if(opt.handle===""){var $el=this}else{var $el=this.find(opt.handle)}return $el.css("cursor",opt.cursor).on("mousedown",function(e){if(opt.handle===""){var $drag=$(this).addClass("draggable")}else{var $drag=$(this).addClass("active-handle").parent().addClass("draggable")}var z_idx=$drag.css("z-index"),drg_h=$drag.outerHeight(),drg_w=$drag.outerWidth(),pos_y=$drag.offset().top+drg_h-e.pageY,pos_x=$drag.offset().left+drg_w-e.pageX;$drag.css("z-index",1e3).parents().on("mousemove",function(e){$(".draggable").offset({top:e.pageY+pos_y-drg_h,left:e.pageX+pos_x-drg_w}).on("mouseup",function(){$(this).removeClass("draggable").css("z-index",z_idx)})});e.preventDefault()}).on("mouseup",function(){if(opt.handle===""){$(this).removeClass("draggable")}else{$(this).removeClass("active-handle").parent().removeClass("draggable")}})}})(jQuery);(function(){var Editable,Editor,__bind=function(fn,me){return function(){return fn.apply(me,arguments)}};Editor=function(){function Editor(options){this.options=options;this.activateEditable=__bind(this.activateEditable,this);this.editable=__bind(this.editable,this);this.editables=[]}Editor.prototype.editable=function(selector,options){var editable;editable=new Editable(selector,options,this);this.editables.push(editable);return editable};Editor.prototype.activateEditable=function(editable){var _ref;if(this.activeEditable!==editable){if((_ref=this.activeEditable)!=null){_ref.deactivate()}}return this.activeEditable=editable};Editor.prototype.uniqueId=function(length){var id;if(length==null){length=16}id="";while(id.length<length){id+=Math.random().toString(36).substr(2)}return id.substr(0,length)};return Editor}();Editable=function(){function Editable(selector,options,editor){this.selector=selector;this.options=options;this.editor=editor;this.getValue=__bind(this.getValue,this);this.fixHtml=__bind(this.fixHtml,this);this.getNodeAtCaret=__bind(this.getNodeAtCaret,this);this.wrapHtml=__bind(this.wrapHtml,this);this.surroundSelectedText=__bind(this.surroundSelectedText,this);this.pasteHtmlAtCaret=__bind(this.pasteHtmlAtCaret,this);this.closeOptionsForm=__bind(this.closeOptionsForm,this);this.showLinkOptions=__bind(this.showLinkOptions,this);this.addImageOptions=__bind(this.addImageOptions,this);this.setImage=__bind(this.setImage,this);this.onImageSelect=__bind(this.onImageSelect,this);this.showUploadBox=__bind(this.showUploadBox,this);this.makeImagesEditable=__bind(this.makeImagesEditable,this);this.deactivate=__bind(this.deactivate,this);this.activate=__bind(this.activate,this);this.makeEditable=__bind(this.makeEditable,this);this.handleAction=__bind(this.handleAction,this);this.attachHandlers=__bind(this.attachHandlers,this)}Editable.prototype.attachHandlers=function(){var self,_this=this;self=this;$(document).on("mousedown",this.selector,function(e){_this.clickArgs=e;return _this.closeOptionsForm()});$(document).on("focus",this.selector,this.activate);return $(document).on("click",""+this.selector+" a",function(e){return self.showLinkOptions(this)})};Editable.prototype.handleAction=function(what){var e,link,markerUrl,uniqueId;switch(what){case"bold":return document.execCommand("bold",false,null);case"italic":return document.execCommand("italic",false,null);case"h2":return document.execCommand("formatBlock",false,"<h2>");case"image":uniqueId="bangjs-image-insert-"+this.editor.uniqueId();this.pasteHtmlAtCaret('<div id="'+uniqueId+'" class="bangjs-image-insert"></div>');return this.showUploadBox("#"+uniqueId,this.options.imageOptions);case"list":return this.pasteHtmlAtCaret("<ul><li>Item 1</li></ul>");case"link":markerUrl=this.editor.uniqueId();document.execCommand("createLink",false,markerUrl);link=$("a[href="+markerUrl+"]");link.attr("href","");return this.showLinkOptions(link[0]);case"quote":return this.wrapHtml("“","”");case"indent":return document.execCommand("formatBlock",false,"blockquote");case"unformat":e=this.getNodeAtCaret();return $(e).contents().parent("blockquote,h1,h2,h3").contents().unwrap()}};Editable.prototype.makeEditable=function(){switch(this.options.mode){case"text":$(this.selector).attr("contenteditable","true");break;case"html":this.toolbar=new BangJS.Toolbar({items:"h2,bold,italic,image,link,list,quote,indent,unformat"},this);$(this.selector).attr("contenteditable","true");this.fixHtml("load");this.makeImagesEditable();break;case"image":this.makeImagesEditable()}$(this.selector).addClass("bangjs-editable");return this.attachHandlers()};Editable.prototype.activate=function(event){this.editor.activateEditable(this);if(!this.isActive){this.isActive=true;if(this.toolbar){if(this.clickArgs){if(this.options.position){this.toolbar.setPosition(this.options.position(event))}else{this.toolbar.setPosition({left:this.clickArgs.pageX-$(window).scrollLeft()+20,top:this.clickArgs.pageY-$(window).scrollTop()-80})}}else{this.toolbar.setPosition({left:$(this.selector).position().left+20,top:$(this.selector).position().top-80})}this.toolbar.show()}}this.clickArgs=null;return true};Editable.prototype.deactivate=function(){var _ref;this.isActive=false;return(_ref=this.toolbar)!=null?_ref.hide():void 0};Editable.prototype.makeImagesEditable=function(){var img,_base;img=$(this.selector).find("img");if(img.length){img.wrap('<div class="image-container"></div>');return this.addImageOptions(this.options.imageOptions,$(this.selector).find(".image-container"))}else{return typeof(_base=this.options.imageOptions).onEmpty==="function"?_base.onEmpty():void 0}};Editable.prototype.showUploadBox=function(selector,options){var element,_ref,_ref1,_this=this;if((_ref=options.name)==null){options.name="bangjs-image-editable-"+this.editor.uniqueId()}element=$(selector);if((_ref1=options.title)==null){options.title="Upload a picture"}element.html('        <div class="'+options.name+' image-upload-box" contenteditable="false">            <form name="form" method="POST" target="'+options.name+'-frame" enctype="multipart/form-data" >                <p>                    '+options.title+': <br />                    <input type="file" class="file-input" name="file" />                </p>                <p>                    <i class="icon-remove"></i>                </p>                <iframe id="'+options.name+'-frame" name="'+options.name+'-frame" src="" style="display:none;height:0;width:0"></iframe>            </form>        </div>');element.find("i.icon-remove").click(function(){if(options.onEmpty){return options.onEmpty()}else{return element.remove()}});return $(document).bindNew("change","."+options.name+" .file-input",function(){return _this.onImageSelect(options)})};Editable.prototype.onImageSelect=function(options){var form,frame,_this=this;form=$("."+options.name+" form");form.attr("action",options.uploadUrl);frame=$("#"+options.name+"-frame");frame.bindNew("load",function(){var image,thumbnail;image=JSON.parse($(frame[0].contentWindow.document).text()).image;thumbnail=options.createThumbnail?JSON.parse($(frame[0].contentWindow.document).text()).thumbnail:void 0;return _this.setImage(options,image,thumbnail)});return form.submit()};Editable.prototype.setImage=function(options,imageUrl,thumbnailUrl){var imageBox;imageBox=$('<div class="image-container"></div>');imageBox.html('<img src="'+imageUrl+'" data-filter="none" data-src="'+imageUrl+'" data-thumbnail-src="'+thumbnailUrl+'" class="picture" />');$("."+options.name).replaceWith(imageBox);return this.addImageOptions(options,imageBox)};Editable.prototype.addImageOptions=function(options,imageBox){var _this=this;if(this.options.mode==="image"){imageBox.append('                <div class="bg bangjs-option"></div>                <div class="picture-options bangjs-option">                    <p class="buttons">                        <a href="#" class="add-title">Add caption</a><span class="gray"> | </span><a href="#" class="remove">Remove</a>                    </p>                </div>');return imageBox.find("a.remove").click(function(){if(options.onEmpty){options.onEmpty()}else{imageBox.remove()}return false})}};Editable.prototype.showLinkOptions=function(link){var options,_this=this;link=$(link);this.closeOptionsForm();options=$('<div class="bangjs-options-form" style="display:none">                        <p>                            <input class="url" placeholder="http://www.example.com" type="text" style="width:300px;" /> or <a class="clear" href="#">clear</a>.                        </p>                    </div>');$("body").append(options);options.css({left:""+link.position().left+"px",top:""+(link.position().top-40)+"px"});options.show();if(link.attr("href")){$(".bangjs-options-form input.url").val(link.attr("href"))}$(".bangjs-options-form input.url").focus();options[0].onClose=function(){if($(".bangjs-options-form input.url").val()){return link.attr("href",$(".bangjs-options-form input.url").val())}else{return link.contents().unwrap()}};$(document).off("click",".bangjs-options-form a.clear");$(document).on("click",".bangjs-options-form a.clear",function(){link.contents().unwrap();_this.closeOptionsForm(false);return false});$(document).off("keypress",".bangjs-options-form input.url");$(document).on("keypress",".bangjs-options-form input.url",function(e){if(e.which===13){if($(".bangjs-options-form input.url").val()){link.attr("href",$(".bangjs-options-form input.url").val())}else{link.contents().unwrap()}return _this.closeOptionsForm(false)}});return false};Editable.prototype.closeOptionsForm=function(fireClose){var form,_base;if(fireClose==null){fireClose=true}form=$(".bangjs-options-form");if(form.length){if(fireClose){if(typeof(_base=form[0]).onClose==="function"){_base.onClose()}}return form.remove()}};Editable.prototype.pasteHtmlAtCaret=function(html){var el,frag,lastNode,node,range,sel;if(window.getSelection){sel=window.getSelection();if(sel.getRangeAt&&sel.rangeCount){range=sel.getRangeAt(0);range.deleteContents();el=document.createElement("div");el.innerHTML=html;frag=document.createDocumentFragment();while(node=el.firstChild){lastNode=frag.appendChild(node)}range.insertNode(frag);if(lastNode){range=range.cloneRange();range.setStartAfter(lastNode);range.collapse(true);sel.removeAllRanges();return sel.addRange(range)}}}else if(document.selection&&document.selection.type!=="Control"){return document.selection.createRange().pasteHTML(html)}};Editable.prototype.surroundSelectedText=function(element){var range,sel,selRange;if(window.getSelection){sel=window.getSelection();if(sel.getRangeAt&&sel.rangeCount){range=sel.getRangeAt(0);element.appendChild(document.createTextNode(range.toString()));range.deleteContents();range.insertNode(element);range=range.cloneRange();range.setStartAfter(element);range.collapse(true);sel.removeAllRanges();return sel.addRange(range)}else if(document.selection&&document.selection.type!=="Control"){selRange=document.selection.createRange();element.appendChild(document.createTextNode(selRange.text));return selRange.pasteHTML(element.outerHTML)}}};Editable.prototype.wrapHtml=function(leftInsert,rightInsert){var range,sel,selectedText;if(window.getSelection){sel=window.getSelection();if(sel.rangeCount){range=sel.getRangeAt(0);selectedText=range.toString();range.deleteContents();return range.insertNode(document.createTextNode(leftInsert+selectedText+rightInsert))}}else if(document.selection&&document.selection.createRange){range=document.selection.createRange();selectedText=document.selection.createRange().text+"";return range.text=leftInsert+selectedText+rightInsert}};Editable.prototype.getNodeAtCaret=function(){var node;node=document.getSelection().anchorNode;if(node.nodeType===3){return node.parentNode}else{return node}};Editable.prototype.fixHtml=function(event){if(this.options.mode==="html"){if(event==="save"){$(".bangjs-option").remove();$("h1,h2,h3").each(function(){return $("<br />").insertAfter($(this))});$("blockquote").each(function(){return $("<br /><br />").insertAfter($(this))})}$(".post-content p").each(function(){var container,contents;container=$("<div></div>");contents=$(this).contents();container.append(contents);container.append("<br />");return $(this).replaceWith(container)});return $(".post-content div").each(function(){var contents,last;contents=$(this).contents();last=contents.last();$(this).replaceWith(contents);return $("<br />").insertAfter(last)})}};Editable.prototype.getValue=function(format){switch(format){case"markdown":this.fixHtml("save");return(new reMarked).render($(this.selector)[0]);case"text":return $(this.selector).text()}};return Editable}();window.BangJS={Editor:Editor}}).call(this);(function(){var Toolbar,__bind=function(fn,me){return function(){return fn.apply(me,arguments)}};Toolbar=function(){function Toolbar(options,editable){var item,items,_i,_len,_this=this;this.options=options;this.editable=editable;this.show=__bind(this.show,this);this.hide=__bind(this.hide,this);this.setPosition=__bind(this.setPosition,this);this.handleClick=__bind(this.handleClick,this);this.element=$('<div class="bangjs-editor-toolbar" style="display:none">                        <div class="handle">                            <i class="icon-move"></i>                        </div>                        <ul class="buttons"></ul>                        <div class="options-form" style="display:none"></div>                    </div>');$("body").append(this.element);this.buttons=this.element.find(".buttons");this.element.drags();items=this.options.items.split(",");this.element.css("width",""+(20+items.length*35)+"px");for(_i=0,_len=items.length;_i<_len;_i++){item=items[_i];switch(item){case"h1":this.buttons.append('<li class="ce-icon-h1"><span href="#">H</span><li>');this.buttons.find(".ce-icon-h1").click(function(){return _this.handleClick(function(){return _this.editable.handleAction("h1")})});break;case"h2":this.buttons.append('<li class="ce-icon-h2 hint hint--top" data-hint="Heading"><spanv href="#">H</span></li>');this.buttons.find(".ce-icon-h2").click(function(){return _this.handleClick(function(){return _this.editable.handleAction("h2")})});break;case"bold":this.buttons.append('<li class="ce-icon-bold hint hint--top" data-hint="Bold"><span href="#">b</span></li>');this.buttons.find(".ce-icon-bold").click(function(){return _this.handleClick(function(){return _this.editable.handleAction("bold")})});break;case"italic":this.buttons.append('<li class="ce-icon-italic hint hint--top" data-hint="Italic"><span href="#">i</span></li>');this.buttons.find(".ce-icon-italic").click(function(){return _this.handleClick(function(){return _this.editable.handleAction("italic")})});break;case"image":this.buttons.append('<li class="ce-icon-image hint hint--top" data-hint="Upload a picture"><i class="icon-picture"></i></li>');this.buttons.find(".ce-icon-image").click(function(){return _this.handleClick(function(){return _this.editable.handleAction("image")})});break;case"link":this.buttons.append('<li class="ce-icon-link hint hint--top" data-hint="Add a link"><i class="icon-link"></i></li>');this.buttons.find(".ce-icon-link").click(function(){return _this.handleClick(function(){return _this.editable.handleAction("link")})});break;case"list":this.buttons.append('<li class="ce-icon-list hint hint--top" data-hint="Create a list"><i class="icon-list"></i></li>');this.buttons.find(".ce-icon-list").click(function(){return _this.handleClick(function(){return _this.editable.handleAction("list")})});break;case"quote":this.buttons.append('<li class="ce-icon-quote hint hint--top" data-hint="Add quotes"><i class="icon-quote-left"></i></li>');this.buttons.find(".ce-icon-quote").click(function(){return _this.handleClick(function(){return _this.editable.handleAction("quote")})});break;case"indent":this.buttons.append('<li class="ce-icon-indent hint hint--top" data-hint="Indent"><i class="icon-indent-right"></i></li>');this.buttons.find(".ce-icon-indent").click(function(){return _this.handleClick(function(){return _this.editable.handleAction("indent")})});break;case"unformat":this.buttons.append('<li class="ce-icon-unformat hint hint--top" data-hint="Remove formatting"><i class="icon-remove-circle"></i></li>');this.buttons.find(".ce-icon-unformat").click(function(){return _this.handleClick(function(){return _this.editable.handleAction("unformat")})})}}}Toolbar.prototype.handleClick=function(fn){return fn()};Toolbar.prototype.setPosition=function(position){return this.element.css({top:""+position.top+"px",left:""+position.left+"px"})};Toolbar.prototype.hide=function(){return this.element.hide()};Toolbar.prototype.show=function(){return this.element.show()};return Toolbar}();window.BangJS.Toolbar=Toolbar}).call(this);