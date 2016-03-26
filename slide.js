 (function(window,document){
   var DEFAULTS={
      imgWidth:300,
      imgHeight:300,
      events:['mouseover'],
      datas:[],
      autoPlay:true,
      playTime:3000
   };
   var utils={
          isDOM: function (o) {
      return (
        typeof HTMLElement === 'object' ? o instanceof HTMLElement :
        o && typeof o === 'object' && o !== null && o.nodeType === 1 && typeof o.nodeName === 'string'
      );
    },
    isSupportClassList:document.body.classList?true:false,
    isIE9:(!window.atob&&document.addEventListener)?true:false,
    ieVersion:function(){
        var ua = window.navigator.userAgent;
        var msie = ua.indexOf('MSIE ');
  if (msie > 0) {
    // IE 10 or older => return version number
    return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
  }

  var trident = ua.indexOf('Trident/');
  if (trident > 0) {
    // IE 11 => return version number
    var rv = ua.indexOf('rv:');
    return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
  }

  var edge = ua.indexOf('Edge/');
  if (edge > 0) {
    // Edge (IE 12+) => return version number
    return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
  }

  // other browser
  return false;
    },
    merge: function (obj1, obj2) {
      var result = {};
      for (var prop in obj1) {
        if (obj2.hasOwnProperty(prop)) {
          result[prop] = obj2[prop];
        } else {
          result[prop] = obj1[prop];
        }
      }
      return result;
    },
    ployfill:(function(){
       if (!String.prototype.trim) {
           String.prototype.trim = function () {
                return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
          };
       }
       if(!Array.prototype.forEach){
       	   Array.prototype.forEach = function(callback, context) {
             for (var i = 0; i < this.length; i++) {
                  callback.apply(context, [ this[i], i, this ]);
           }
         };
       }
    })(),
    addClass:function(ele,cls){
        if(this.isSupportClassList){
           var classArr=cls.split(' ');
           for(var i=0,len=classArr.length;i<len;i++){
                  ele.classList.add(classArr[i]);
           }
           return;
        }       
        var classArr=cls.split(' ');//把以空格分开的类名分开，存为数组
        for(var i=0,len=classArr.length;i<len;i++){
        	if(!this.hasClass(ele,classArr[i])){
        		ele.className+=' '+classArr[i];
        	}
        }
    },
    removeClass:function(ele,cls){//cls为一个或多个类名
    	// cls中若删除多个类，中间以空格分开
           if(this.isSupportClassList){
              var classArr=cls.split(' ');
              for(var i=0,len=classArr.length;i<len;i++){
                  ele.classList.remove(classArr[i]);
              }
              return;
           }
           var myClassArr=ele.className.split(' ');
           var classArr=cls.split(' ');
           for(var i=0,len=classArr.length;i<len;i++){
               var k=myClassArr.indexOf(classArr[i]);
               if(k!=-1){
                  myClassArr.splice(k,1);
               }
           }
           ele.className=myClassArr.join(' ');
        },
    toggle:function(ele,cls){//cls只能为一个类名
      if(this.isSupportClassList){
         ele.classList.toggle(cls);
         return;
      }
      if(!this.hasClass(ele,cls)){
              this.addClass(ele,cls);
      }else{
           this.removeClass(ele,cls);
      }
    },
    hasClass:function(ele,cls){//cls只能为一个类名
      if(this.isSupportClassList){
        return ele.classList.contains(cls);
      }
      return (" " + ele.className + " ").indexOf(" " + cls + " ") > -1;
   }
 };
   function Slider(element,options){
   	  this.settings=utils.merge(DEFAULTS,options);
   	  this.id=element;//容器id
   	  if(utils.isDOM(element)){
   	  	this.container=element;
   	  }
   	  this.imgWidth=this.settings.imgWidth;
   	  this.imgHeight=this.settings.imgHeight;
   	  this.events=this.settings.events;//绑定切换图片状态的事件
   	  this.autoPlay=this.settings.autoPlay;
   	  this.playTime=this.settings.playTime;
   	  this.datas=this.settings.datas;
   	  this.init();
   }
   Slider.prototype={
   	 init:function(){
   	 	this.index=0;
   	 	this.timer=null;
   	 	this.template="<p class='data'>{{data}}</p>";
        this.cacheDOM();
        this.createDOM();
        this.loadCSS();
        this.render();
        this.action();
        this.bindEvents();
   	 },
   	 cacheDOM:function(){//定义元素
       this.container=document.getElementById(this.id);//外层容器
       this.oDiv=this.container.getElementsByTagName('div')[0];//图片容器，ul的父元素
       this.prev=this.oDiv.getElementsByClassName('prev')[0];//左滑按钮
       this.next=this.oDiv.getElementsByClassName('next')[0];//右滑按钮
       this.oUl=this.container.getElementsByTagName('ul')[0];//img 外层的ul标签
       this.oOl=this.container.getElementsByTagName('ol')[0];//下部负责滑动的圆形按钮
       this.listItems=this.oOl.getElementsByTagName('li');//
       this.imgItems=this.oUl.getElementsByTagName('img');//图片列表
   	 },
   	 createDOM:function(){
   	 	if(!this.datas.length){
   	 		return -1;
   	 	}
        this.p=document.createElement('p');
        utils.addClass(this.p,'data');
        this.oDiv.appendChild(this.p);
   	 },
   	 loadCSS:function(){//加载Slider相关的css文件
        var link=document.createElement('link');
        link.rel="stylesheet";
        link.type='text/css';
        link.href='slide.css';
        document.head.appendChild(link);
   	 },
   	 bindEvents:function(){//绑定事件
   	   var self=this;
   	   this.events.forEach(function(item){
         self.oOl.addEventListener(item,function(e){
           if(e.target.tagName=='LI'){
           	   self.stopAuto();
         	   var index=[].indexOf.call(self.listItems,e.target);
         	   self.move(index);
           }
         },false);
       });
       for(var i=0,len=this.listItems.length;i<len;i++){
       	   (function(){
                 self.listItems[i].addEventListener('mouseout',function(){
                           self.action();
                 },false);
       	   })(i);
       }
       self.prev.addEventListener('click',function(){
       	   self.stopAuto();
       	   if(self.index===0){
       	   	 self.action();
       	   	 return -1;
       	   }
           self.index--;
           self.move(self.index);
       },false);
       self.next.addEventListener('click',function(){
       	   self.stopAuto();
       	   self.index++;
       	   if(self.index===self.imgItems.length){
       	   	self.index=0;
       	   }          
           self.move(self.index);
           self.action();
       },false);
   	 },
   	 render:function(){
   	 	  var self=this;
   	 	  var ulWidth=this.imgItems.length*this.imgWidth;//设置ul宽度为图片宽度的n倍
   	 	  var ulHeight=this.imgHeight;//设置ul高度为图片高度
   	 	  
   	 	  var prevHeight=this.prev.offsetHeight;
   	 	  var topHeight=(this.imgHeight-prevHeight)/2;//计算距离，使左右按钮高度居中
   	 	  this.container.style.width=this.imgWidth+'px';//设置最外层容器宽度，即为图片宽度
          this.oDiv.style.width=this.imgWidth;//设置容器宽度为图片宽度
          this.oUl.style.cssText="width:"+ulWidth+'px'+";"+"height:"+ulHeight+'px';//
          this.prev.style.top=topHeight+'px';
          this.next.style.top=topHeight+'px';
          [].forEach.call(self.imgItems,function(item){
              item.style.width=self.imgWidth+'px';
              item.style.height=self.imgHeight+'px';
          });
          this.addDataInfo(this.index);
   	 },
   	 action:function(){
         var self=this;
         if(self.autoPlay!==true){
         	return -1;
         }//如果autoPlay不为true,跳出此函数
         this.timer=setInterval(function(){
            self.index++;
            if(self.index===self.imgItems.length){
            	self.index=0;
            }
            self.move(self.index);
         },self.playTime);
   	 },
   	 stopAuto:function(){
        clearInterval(this.timer);
        this.timer=null;
   	 },
   	 move:function(index){//容器移动
        var self=this;
   	 	  this.addDataInfo(index);
        if(utils.ieVersion()===9){
           var endLeft=parseInt(this.oUl.style.left)-index*300;
           if(parseInt(this.oUl.style.left)<=endLeft){
            return;
           }
           setInterval(function(){
               self.oUl.style.left=parseInt(self.oUl.style.left)-20+'px';
           },20);

        }else{
            this.oUl.style.left=-1*index*300+'px';
        }
        this.addActive(index);
   	 },
   	 addActive:function(index){
        this.clearActive();
        utils.addClass(this.listItems[index],'active');
   	 },
   	 clearActive:function(){
   	 	var self=this;
        [].forEach.call(this.listItems,function(item){
              utils.removeClass(item,'active');
    	});
   	 },
   	 addDataInfo:function(dataIndex){
   	 	  if(!this.datas.length){
          	return -1;
          }else{
          	this.p.innerHTML=this.datas[dataIndex];
          }
   	 }
   };
   window.Slider=Slider;
  })(window,document);