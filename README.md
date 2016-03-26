# slider
pc端轮播图
### PC端轮播组件，可配置是否autoplay,自动播放时每个图片显示的时间，定义控制切换图片时的事件(hover,click),及在图片上显示的文字
### 可按照如下进行配置
```
html结构如下：
  <div id="con" class="container">
	    <div>
		    <ul>
			   <li><a href="" title=""><img src="http://1.imoge.sinaapp.com/c.png" alt=""></a></li>
			   <li><a href="" title=""><img src="http://1.imoge.sinaapp.com/b.png" alt=""></a></li>
			   <li><a href="" title=""><img src="http://1.imoge.sinaapp.com/a.jpg" alt=""></a></li>
		   </ul>
		   <div class="prev"></div>
		   <div class="next"></div>
		 </div>
		<div class="circles">
		  <ol>
			 <li data-index='0' class="active">1</li>
			 <li data-index='1'>2</li>
			 <li data-index='2'>3</li>
		  </ol>
		</div>
  </div>
  
new Slider('con',{
     id:'con',
     imgWidth:300,
     imgHeight:200,
     events:['mouseover','click'],
     datas:['hello','thank','ajljsjdlf'],
     autoPlay:true,
     playTime:2000
 });
 ```
 - id为整个容器的id
 - imgWidth/imgHeight 为图片的宽高
 - events:指定可以触发图片切换的事件
 - datas: 图片上显示的信息，若无，此项可以不填
 - autoPlay ： 是否要自动播放
 - playTime: 若自动播放，间隔的时间
