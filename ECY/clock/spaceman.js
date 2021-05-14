;(function(global){
	var spaceMan = new SpaceMan();
	function SpaceMan(){
		this.urlObj={}//图片路径对象
		this.imgObj={};//图片对象
		this.otherCount=6;//其他图片数
		this.count=60;//太空人图片数，比较多，用来旋转
		this.startCount=2;//太空人图片开始数
		this.imageKey=2;//默认起始图片下标
		
		this.renderArr=[];//渲染数组1
		this.renderArr2=[];//渲染数组2
		
		this.hourObj={};//小时对象
		this.minuteObj={};//分钟对象
		this.secondObj={};//秒钟对象
		
		this.weekDayObj={};//星期对象
		this.monthDateObj={};//日期对象
		this.lunarDateObj={};//农历日期对象
		
		this.weekArr=['周日','周一','周二','周三','周四','周五','周六'];
	}
	//组装图片路径
	SpaceMan.prototype.loadUrl=function(){
		//组装大空人图片路径
		for(var i=this.count;i>=this.startCount;i--){
			this.urlObj[i]="images/human ("+i+").jpg";
		}
		//组装其他图片路径
		for(var i=1;i<=this.otherCount;i++){
			this.urlObj[this.count+i]="images/other"+i+".png";
		}
	}
	//初始化
	SpaceMan.prototype.init=function(el){
		if(!el) return ;
		this.el=el;
		this.loadUrl();
		
		var canvas = document.createElement('canvas');//创建画布
		canvas.style.cssText="background:white;";
		var W = canvas.width = 500; //设置宽度
		var H = canvas.height = 500;//设置高度
		
		el.appendChild(canvas);//添加到指定的dom对象中
		this.ctx = canvas.getContext('2d');
		this.canvas=canvas;
		this.w=W;
		this.h=H;
		
		var canvas2 = document.createElement('canvas');//创建画布
		canvas2.style.cssText="position:absolute;left:0px;";//设置样式
		canvas2.width = W; //设置宽度
		canvas2.height = H;//设置高度
		el.appendChild(canvas2);//添加到指定的dom对象中
		this.ctx2 = canvas2.getContext('2d');
		this.canvas2=canvas2;
		
		//初始化时间
		this.initTime();
		//加载图片，并回调绘制出图片
		this.loadImg(this.draw.bind(this));
	}
	
	//渲染图形
	SpaceMan.prototype.render=function(){
		var context=this.ctx;
		this.clearCanvas();	
		_.each(this.renderArr,function(item){
			item && item.render(context);
		});
		
		var context2=this.ctx2;
		this.clearCanvas2();	
		_.each(this.renderArr2,function(item){
			item && item.render(context2);
		});
	}
	
	SpaceMan.prototype.render2=function(){
		var context2=this.ctx2;
		this.clearCanvas2();	
		_.each(this.renderArr2,function(item){
			item && item.render(context2);
		});
	}
	 
	//清洗画布
	SpaceMan.prototype.clearCanvas=function() {
		this.ctx.clearRect(0,0,parseInt(this.w),parseInt(this.h));
    }
    //清洗画布2
    SpaceMan.prototype.clearCanvas2=function() {
		this.ctx2.clearRect(0,0,parseInt(this.w),parseInt(this.h));
    }
    
	//绘制入口
	SpaceMan.prototype.draw=function(){
		this.drawClock();//绘制表盘
		this.drawClockLine();//绘制横向纵向线
		this.drawText();//绘制相关文字
		this.drawOtherImg();//绘制其他图片
		
		this.drawImg();//绘制太空人图片
		this.drawDateTime();//绘制日期
		
		this.render();//执行渲染
		this.start();//动画开始
	}
	//绘制表盘
	SpaceMan.prototype.drawClock=function(){
		  var x=y=0,cilcle;
		  x=this.w/2;y=this.h/2;
		  
		  //绘制外面的大圆
		  cilcle = new Circle({
		 	x:x,//圆心X坐标
			y:y,//圆心X坐标
			r:250,//半径
			startAngle:0,//开始角度
			endAngle:2*Math.PI,//结束角度
			lineWidth:2,
			fill:true,
			fillStyle:'#444444'
		 });
		 this.renderArr.push(cilcle);
		 //绘制第2个圆
		 cilcle = new Circle({
		 	x:x,//圆心X坐标
			y:y,//圆心X坐标
			r:220,//半径
			startAngle:0,//开始角度
			endAngle:2*Math.PI,//结束角度
			lineWidth:2,
			fill:true,
			fillStyle:'#DFE6F0'
		 });
		 this.renderArr.push(cilcle);
		 
	}
	
	//组装太空人图片对象信息
	SpaceMan.prototype.drawImg=function(){
		var image = this.imgObj[this.imageKey];
		var img,x=y=0,sWidth=534,sHeight=598,dx=190,dy=200,dWidth=120,dHeight=134;
		
		img = new ImageDraw({image:image,sx:x,sy:y,sWidth:sWidth,sHeight:sHeight, dx:dx, dy:dy ,dWidth:dWidth,dHeight:dHeight},this);
		this.renderArr2.push(img);		
	}
	//组装图片对象信息
	SpaceMan.prototype.drawOtherImg=function(){
		//绘制电量
		var image = this.imgObj[66];
		var img,x=y=0,sWidth=200,sHeight=200,dx=170,dy=45,dWidth=50,dHeight=50;
		img = new ImageDraw({image:image,sx:x,sy:y,sWidth:sWidth,sHeight:sHeight, dx:dx, dy:dy ,dWidth:dWidth,dHeight:dHeight},this);
		this.renderArr.push(img);
		
		//绘制太阳
		image = this.imgObj[62];
		sWidth=200,sHeight=200,dx=340,dy=70,dWidth=50,dHeight=50;
		img = new ImageDraw({image:image,sx:x,sy:y,sWidth:sWidth,sHeight:sHeight, dx:dx, dy:dy ,dWidth:dWidth,dHeight:dHeight},this);
		this.renderArr.push(img);	
		//绘制最大温度
		image = this.imgObj[65];
		var img,x=y=0,sWidth=200,sHeight=200,dx=315,dy=70,dWidth=20,dHeight=20;
		img = new ImageDraw({image:image,sx:x,sy:y,sWidth:sWidth,sHeight:sHeight, dx:dx, dy:dy ,dWidth:dWidth,dHeight:dHeight},this);
		this.renderArr.push(img);
		
		//绘制最小温度
		image = this.imgObj[64];
		var img,x=y=0,sWidth=200,sHeight=200,dx=315,dy=90,dWidth=20,dHeight=20;
		img = new ImageDraw({image:image,sx:x,sy:y,sWidth:sWidth,sHeight:sHeight, dx:dx, dy:dy ,dWidth:dWidth,dHeight:dHeight},this);
		this.renderArr.push(img);
		
		//绘制心率
		image = this.imgObj[61];
		sWidth=200,sHeight=200,dx=70,dy=305,dWidth=60,dHeight=60;
		img = new ImageDraw({image:image,sx:x,sy:y,sWidth:sWidth,sHeight:sHeight, dx:dx, dy:dy ,dWidth:dWidth,dHeight:dHeight},this);
		this.renderArr.push(img);	
		
		//绘制步数
		image = this.imgObj[63];
		sWidth=200,sHeight=200,dx=320,dy=310,dWidth=50,dHeight=50;
		img = new ImageDraw({image:image,sx:x,sy:y,sWidth:sWidth,sHeight:sHeight, dx:dx, dy:dy ,dWidth:dWidth,dHeight:dHeight},this);
		this.renderArr.push(img);
	}
	//组装文字信息
	SpaceMan.prototype.drawText=function(){
		var content="",x=y=0;
		//天气
		x=230;y=60,content="空气良好";
		var	text = new Text({
			x:x,
			y:y,
			text:content,
			font:'bold 20px ans-serif',
			textAlign:'left',
			fill:true,
			fillStyle:'#44444'
		});	
		this.renderArr.push(text);	
		
		x=230;y=85,content="晴天";
		var	text = new Text({
			x:x,
			y:y,
			text:content,
			font:'20px ans-serif',
			textAlign:'left',
			fill:true,
			fillStyle:'#44444'
		});	
		this.renderArr.push(text);
		
		//气温
		x=230;y=110,content="23°C";
		var	text = new Text({
			x:x,
			y:y,
			text:content,
			font:'18px ans-serif',
			textAlign:'left',
			fill:true,
			fillStyle:'#44444'
		});	
		this.renderArr.push(text);
		
		//绘制最小温度
		x=285;y=110,content="18°";
		var	text = new Text({
			x:x,
			y:y,
			text:content,
			font:'18px ans-serif',
			textAlign:'left',
			fill:true,
			fillStyle:'#44444'
		});	
		this.renderArr.push(text);
		
		//绘制最大温度
		x=285;y=85,content="26°";
		var	text = new Text({
			x:x,
			y:y,
			text:content,
			font:'18px ans-serif',
			textAlign:'left',
			fill:true,
			fillStyle:'#44444'
		});	
		this.renderArr.push(text);
		
		
		//电量
		x=120;y=115,content="70%";
		var	text = new Text({
			x:x,
			y:y,
			text:content,
			font:'bold 35px ans-serif',
			textAlign:'left',
			fill:true,
			fillStyle:'#44444'
		});	
		this.renderArr.push(text);
		
		//心率
		x=65;y=305,content="80~128";
		var	text = new Text({
			x:x,
			y:y,
			text:content,
			font:'20px ans-serif',
			textAlign:'left',
			fill:true,
			fillStyle:'#44444'
		});	
		this.renderArr.push(text);
		
		x=130;y=345,content="92";
		var	text = new Text({
			x:x,
			y:y,
			text:content,
			font:'bold 30px ans-serif',
			textAlign:'left',
			fill:true,
			fillStyle:'#44444'
		});	
		this.renderArr.push(text);
		
		//步数
		x=370;y=345,content="7032";
		var	text = new Text({
			x:x,
			y:y,
			text:content,
			font:'bold 26px ans-serif',
			textAlign:'left',
			fill:true,
			fillStyle:'#44444'
		});	
		this.renderArr.push(text);
		
		//睡眠
		x=110;y=395,content="睡眠";
		var	text = new Text({
			x:x,
			y:y,
			text:content,
			font:'30px ans-serif',
			textAlign:'left',
			fill:true,
			fillStyle:'#44444'
		});	
		this.renderArr.push(text);
		
		x=190;y=400,content="8h30m";
		var	text = new Text({
			x:x,
			y:y,
			text:content,
			font:'BOLD 34px ans-serif',
			textAlign:'left',
			fill:true,
			fillStyle:'#44444'
		});	
		this.renderArr.push(text);
		
		//距离
		x=350;y=395,content="距离";
		var	text = new Text({
			x:x,
			y:y,
			text:content,
			font:'30px ans-serif',
			textAlign:'left',
			fill:true,
			fillStyle:'#44444'
		});	
		this.renderArr.push(text);
		
		x=210;y=445,content="9.22km";
		var	text = new Text({
			x:x,
			y:y,
			text:content,
			font:'BOLD 32px ans-serif',
			textAlign:'left',
			fill:true,
			fillStyle:'#44444'
		});	
		this.renderArr.push(text);
	}
	
	//加载图片
	SpaceMan.prototype.loadImg=function(fn){
		var that=this;
		var keys = Object.keys(this.urlObj);
		var url,key;
		var n=0;
		for(var i=0;i<keys.length;i++)
		{
			key=keys[i];
			url =  this.urlObj[keys[i]];
			var img=new Image();
			img.src=url;
			(function(k,obj){
				obj.onload=function(){
				that.imgObj[k]=obj;
				n++;
				
				if(n===keys.length){
					fn();
				}
			}
			})(key,img)
		}
	}
	
	//开始转动
	SpaceMan.prototype.start=function(){
		//100毫秒执行一次
		setInterval(this.humanRotate.bind(this),100);
		//1秒执行一次时间更新
		setInterval(this.updateTime.bind(this),1000);
	}
	//太空人转动
	SpaceMan.prototype.humanRotate=function(){
		//不断的更新图片即可
		this.imageKey--;
		if(this.imageKey<this.startCount){
			this.imageKey=60;
		}
		var img = this.renderArr2[0];
		img.image = this.imgObj[this.imageKey];
		
		this.render2();
	}
	//更新时间
	SpaceMan.prototype.updateTime=function(){
		this.updateSecond();
	}
	//时间
	SpaceMan.prototype.initTime=function(){
		var time = new Date();
		
		this.year = time.getFullYear();//年
		this.month = time.getMonth()+1;//月
		this.date = time.getDate();//日
		
		this.hour = time.getHours();//时
		this.minute = time.getMinutes();//分
		this.second = time.getSeconds();//秒
		this.day = time.getDay();//星期几
		
		this.getCurrentMonthDayLength();
	}
	//获取当前月有多少天
	SpaceMan.prototype.getCurrentMonthDayLength=function(){
		this.currentMonthDayLength = new Date(Number(this.year), Number(this.month-1) + 1, 0).getDate();
	}
	
	//秒钟更新
	SpaceMan.prototype.updateSecond=function(){
		this.second++;
		if(this.second==60){//到达60以后设置为0
			this.second=0;
			this.updateMinute();//更新分钟
		}
		var content = this.second+"";
			content=(content.length==1?(0+content):content);
		this.secondObj.text=content;
	}
	
	//分钟更新
	SpaceMan.prototype.updateMinute=function(){
		this.minute++;
		if(this.minute==60){
			this.minute=0;
			this.updateHour();
		}
	
		var content = this.minute+"";
			content=(content.length==1?(0+content):content);
			
		this.minuteObj.text=content;
	}
	
	//时钟更新
	SpaceMan.prototype.updateHour=function(){
		this.hour+=1;
		if(this.hour==24){
			this.hour=0;
			this.updateDate();
		}
		var content = this.hour+"";
			content=(content.length==1?(0+content):content);
		this.hourObj.text=content;
	}
	
	//更新日
	SpaceMan.prototype.updateDate=function(){
		var that=this,dateUpdateFlag=false,lastMonthDayLength,angleDis;
		this.date+=1;//日期递增1
		this.updateWeekDay();//更新周几
		if(this.date>this.currentMonthDayLength){//大于本月最大天数就切换到1日
			this.date=1;
			this.updateMonth();//更新月份
		}
		
		this.monthDateObj.text = this.month+"-"+this.date;
		
		this.updateMonthDate2();
	}
	//月更新
	SpaceMan.prototype.updateMonth=function(){
		var that=this;
		this.month+=1;
		if(this.month>12){
			this.month=1;
		}
	}
	//农历日期更新
	SpaceMan.prototype.updateMonthDate2=function(){
		var lunarDay = this.lunarObj.getLunarDay(this.year,this.month,this.date);
		var lunarDayArr = lunarDay.split(" ");
		var content= lunarDayArr[1];
		this.lunarDateObj.text=content;
	}
	
		//更新星期几
	SpaceMan.prototype.updateWeekDay=function(){
		this.day+=1;
		//大于6则重置
		if(this.day>6){
			this.day=0;
		}
		//数组中获取周几
		this.weekDayObj.text=this.weekArr[this.day];
	}
	
	//分隔线的 绘制
	SpaceMan.prototype.drawClockLine=function(){
		var x=y=0;
		var	line = new Line({
				x:x,
				y:y,
			 	startX:70,
			 	startY:120,
			 	endX:430,
			 	endY:120,
			 	strokeStyle:'#030609',
			 	lineWidth:3
			})
		this.renderArr.push(line);
		
		line = new Line({
				x:x,
				y:y,
			 	startX:220,
			 	startY:30,
			 	endX:220,
			 	endY:120,
			 	strokeStyle:'#030609',
			 	lineWidth:3
			})
		this.renderArr.push(line);
		
		line = new Line({
				x:x,
				y:y,
			 	startX:58,
			 	startY:360,
			 	endX:442,
			 	endY:360,
			 	strokeStyle:'#030609',
			 	lineWidth:3
			})
		this.renderArr.push(line);
		
		
		line = new Line({
				x:x,
				y:y,
			 	startX:180,
			 	startY:410,
			 	endX:180,
			 	endY:460,
			 	strokeStyle:'#030609',
			 	lineWidth:3
			})
		this.renderArr.push(line);
		
		line = new Line({
				x:x,
				y:y,
			 	startX:178,
			 	startY:410,
			 	endX:342,
			 	endY:410,
			 	strokeStyle:'#030609',
			 	lineWidth:3
			})
		this.renderArr.push(line);
		
		line = new Line({
			x:x,
			y:y,
		 	startX:340,
		 	startY:410,
		 	endX:340,
		 	endY:360,
		 	strokeStyle:'#030609',
		 	lineWidth:3
		})
		this.renderArr.push(line);
	}
	//绘制日期
	SpaceMan.prototype.drawDateTime=function(){
		this.drawHour();//绘制小时
		this.drawMinute();//绘制分钟
		this.drawSecond();//绘制秒钟
		
		this.drawWeekDay();//绘制周
		this.drawMonthDate();//绘制日
		this.drawMonthDate2();//绘制农历
	}
	
	//绘制小时
	SpaceMan.prototype.drawHour=function(){
		var content=this.hour+"",x=y=0;
		//小时
		x=120;y=190,
		content=(content.length==1?(0+content):content);
		var	text = new Text({
			x:x,
			y:y,
			text:content,
			font:'bold 80px ans-serif',
			textAlign:'left',
			fill:true,
			fillStyle:'#44444'
		});	
		this.renderArr2.push(text);	
		this.hourObj=text;
		
		//绘制 ：号
		x=220;y=175,
		content=":";
		text = new Text({
			x:x,
			y:y,
			text:content,
			font:'bold 60px ans-serif',
			textAlign:'left',
			fill:true,
			fillStyle:'#44444'
		});	
		this.renderArr2.push(text);	
		
	}
	//绘制分钟
	SpaceMan.prototype.drawMinute=function(){
		var content=this.minute+"",x=y=0;
		//分
		x=235;y=190,
		content=(content.length==1?(0+content):content);
		var	text = new Text({
			x:x,
			y:y,
			text:content,
			font:'bold 80px ans-serif',
			textAlign:'left',
			fill:true,
			fillStyle:'#44444'
		});	
		this.renderArr2.push(text);	
		this.minuteObj=text;
	}
	//绘制秒钟
	SpaceMan.prototype.drawSecond=function(){
		var content=this.second+"",x=y=0;
		//秒
		x=340;y=190,
		content=(content.length==1?(0+content):content);
		var	text = new Text({
			x:x,
			y:y,
			text:content,
			font:'bold 35px ans-serif',
			textAlign:'left',
			fill:true,
			fillStyle:'#44444'
		});	
		this.renderArr2.push(text);	
		
		this.secondObj=text;
	}
	
	//绘制星期
	SpaceMan.prototype.drawWeekDay=function(){
		var x=y=0;
		x=350;y=270,
		content=this.weekArr[this.day];
		var	text = new Text({
			x:x,
			y:y,
			text:content,
			font:'20px ans-serif',
			textAlign:'left',
			fill:true,
			fillStyle:'#44444'
		});	
		this.renderArr2.push(text);	
		
		this.weekDayObj=text;
	}
	
	//绘制日
	SpaceMan.prototype.drawMonthDate=function(){
		var content=this.month+"-"+this.date,x=y=0;
		//小时
		x=400;y=270,
		content=(content.length==1?(0+content):content);
		var	text = new Text({
			x:x,
			y:y,
			text:content,
			font:'20px ans-serif',
			textAlign:'left',
			fill:true,
			fillStyle:'#44444'
		});	
		this.renderArr2.push(text);	
		
		this.monthDateObj=text;
	}
	
	//绘制农历日
	SpaceMan.prototype.drawMonthDate2=function(){
		this.lunarObj = new LunarDay();
		var lunarDay = this.lunarObj.getLunarDay(this.year,this.month,this.date);
		var lunarDayArr = lunarDay.split(" ");
		var content= lunarDayArr[1],x=y=0;
		
		x=350;y=240;
		text = new Text({
			x:x,
			y:y,
			text:content,
			font:'20px ans-serif',
			textAlign:'left',
			fill:true,
			fillStyle:'#44444'
		});	
		this.renderArr2.push(text);	
		this.lunarDateObj=text;
	}
	
	/*农历部分*/
	function LunarDay(){
		var CalendarData=new Array(100);
		var madd=new Array(12);
		var tgString="甲乙丙丁戊己庚辛壬癸";
		var dzString="子丑寅卯辰巳午未申酉戌亥";
		var numString="一二三四五六七八九十";
		var monString="正二三四五六七八九十冬腊";
		var weekString="日一二三四五六";
		var sx="鼠牛虎兔龙蛇马羊猴鸡狗猪";
		var cYear,cMonth,cDay,TheDate;
		CalendarData = new Array(0xA4B,0x5164B,0x6A5,0x6D4,0x415B5,0x2B6,0x957,0x2092F,0x497,0x60C96,0xD4A,0xEA5,0x50DA9,0x5AD,0x2B6,0x3126E, 0x92E,0x7192D,0xC95,0xD4A,0x61B4A,0xB55,0x56A,0x4155B, 0x25D,0x92D,0x2192B,0xA95,0x71695,0x6CA,0xB55,0x50AB5,0x4DA,0xA5B,0x30A57,0x52B,0x8152A,0xE95,0x6AA,0x615AA,0xAB5,0x4B6,0x414AE,0xA57,0x526,0x31D26,0xD95,0x70B55,0x56A,0x96D,0x5095D,0x4AD,0xA4D,0x41A4D,0xD25,0x81AA5,0xB54,0xB6A,0x612DA,0x95B,0x49B,0x41497,0xA4B,0xA164B, 0x6A5,0x6D4,0x615B4,0xAB6,0x957,0x5092F,0x497,0x64B, 0x30D4A,0xEA5,0x80D65,0x5AC,0xAB6,0x5126D,0x92E,0xC96,0x41A95,0xD4A,0xDA5,0x20B55,0x56A,0x7155B,0x25D,0x92D,0x5192B,0xA95,0xB4A,0x416AA,0xAD5,0x90AB5,0x4BA,0xA5B, 0x60A57,0x52B,0xA93,0x40E95);
		madd[0]=0;
		madd[1]=31;
		madd[2]=59;
		madd[3]=90;
		madd[4]=120;
		madd[5]=151;
		madd[6]=181;
		madd[7]=212;
		madd[8]=243;
		madd[9]=273;
		madd[10]=304;
		madd[11]=334;
		
		function GetBit(m,n){
			return (m>>n)&1;
		}
		function e2c(){
			TheDate= (arguments.length!=3) ? new Date() : new Date(arguments[0],arguments[1],arguments[2]);
			var total,m,n,k;
			var isEnd=false;
			var tmp=TheDate.getYear();
			if(tmp<1900){
			  tmp+=1900;
			}
			total=(tmp-1921)*365+Math.floor((tmp-1921)/4)+madd[TheDate.getMonth()]+TheDate.getDate()-38;
			if(TheDate.getYear()%4==0&&TheDate.getMonth()>1) {
			  total++;
			}
			for(m=0;;m++){
			  k=(CalendarData[m]<0xfff)?11:12;
			  for(n=k;n>=0;n--){
			  if(total<=29+GetBit(CalendarData[m],n)){
			   isEnd=true; break;
			  }
			  total=total-29-GetBit(CalendarData[m],n);
			  }
			  if(isEnd) break;
			}
			cYear=1921 + m;
			cMonth=k-n+1;
			cDay=total;
			if(k==12){
			  if(cMonth==Math.floor(CalendarData[m]/0x10000)+1){
			  cMonth=1-cMonth;
			  }
			  if(cMonth>Math.floor(CalendarData[m]/0x10000)+1){
			  cMonth--;
			  }
			}
		}
		function GetcDateString(){
			var tmp="";
			tmp+=tgString.charAt((cYear-4)%10);
			tmp+=dzString.charAt((cYear-4)%12);
			tmp+="(";
			tmp+=sx.charAt((cYear-4)%12);
			tmp+=")年 ";
			if(cMonth<1){
			  tmp+="(闰)";
			  tmp+=monString.charAt(-cMonth-1);
			}else{
			  tmp+=monString.charAt(cMonth-1);
			}
			tmp+="月";
			tmp+=(cDay<11)?"初":((cDay<20)?"十":((cDay<30)?"廿":"三十"));
			if (cDay%10!=0||cDay==10){
			  tmp+=numString.charAt((cDay-1)%10);
			}
			return tmp;
		}
		function GetLunarDay(solarYear,solarMonth,solarDay){
			if(solarYear<1921 || solarYear>2030){
				return "";
			}else{
			  solarMonth = (parseInt(solarMonth)>0) ? (solarMonth-1) : 11;
			  e2c(solarYear,solarMonth,solarDay);
			  return GetcDateString();
			}
		}
		
		return  {getLunarDay:GetLunarDay}
	}
	
	
	//图片对象ImageDraw构造函数
	function ImageDraw(o,obj){
		this.id='',
		this.image=0,//图片对象（必填）
		this.sx=0,//图片切片开始x位置（显示整个图片的时候不需要填）
		this.sy=0,//图片切片开始y位置（显示整个图片的时候不需要填）
		this.sWidth=0, //图片切片开始宽度（显示整个图片的时候不需要填）
		this.sHeight=0,//图片切片开始高度（显示整个图片的时候不需要填）
		this.dx=0, //图片目标x位置（必填）
		this.dy=0, //图片目标y位置（必填）
		this.dWidth=0,//图片目标显示宽度（宽度不缩放时不必填）
		this.dHeight=0//图片目标高度高度（高度不缩放时不必填）
		
		this.init(o,obj);
	}
	ImageDraw.prototype.init=function(o,obj){
		this.lol=obj;
		for(var key in o){
			this[key]=o[key];
		}
		return this;
	}
	ImageDraw.prototype.render=function(context){
		draw(context,this);
		function draw(context,obj) {
			var ctx=context;
			ctx.save();
			
			if(!obj.image || getType(obj.dx)=='undefined' || getType(obj.dy)=='undefined'){
				throw new Error("绘制图片缺失参数");	
				return;
			} 
			ctx.translate(obj.dx,obj.dy);
			if(getType(obj.sx)!='undefined' && getType(obj.sy)!='undefined' && obj.sWidth && obj.sHeight && obj.dWidth && obj.dHeight){
				//裁剪图片，显示时候有缩放
				ctx.drawImage(obj.image, obj.sx, obj.sy, obj.sWidth, obj.sHeight, 0, 0, obj.dWidth, obj.dHeight);
			}else if(obj.dWidth && obj.dHeight){
				ctx.drawImage(obj.image, 0, 0, obj.dWidth, obj.dHeight);//原始图片，显示时候有缩放
			}else{
				ctx.drawImage(obj.image,0, 0);//原始图片，显示时候无缩放
			}
			ctx.restore();
		}
	}
	ImageDraw.prototype.isPoint=function(pos){
		//鼠标位置的x、y要分别大于dx、dy 且x、y要分别小于 dx+dWidth、dy+dHeight
		if(pos.x>this.dx && pos.y>this.dy && pos.x<this.dx+this.dWidth && pos.y<this.dy+this.dHeight ){//表示处于当前图片对象范围内
			return true;
		}
		return false;
	}
	
	//文字的构造函数
	function Text(o){
		this.x=0,//x坐标
		this.y=0,//y坐标
		this.disX=0,//x坐标偏移量
		this.disY=0,//y坐标偏移量
		this.text='',//内容
		this.font=null;//字体
		this.textAlign=null;//对齐方式
		
		this.init(o);
	}
	
	Text.prototype.init=function(o){
		for(var key in o){
			this[key]=o[key];
		}
	}
	Text.prototype.render=function(context){
		this.ctx=context;
		innerRender(this);
			
		function innerRender(obj){
			var ctx=obj.ctx;
			ctx.save()
			ctx.beginPath();
			ctx.translate(obj.x,obj.y);
			if(obj.angle){//根据旋转角度来执行旋转
				ctx.rotate(-obj.angle*Math.PI/180);
			}
			
			if(obj.font){
				ctx.font=obj.font;
			}
			if(obj.textAlign){
				ctx.textAlign=obj.textAlign;
			}
			if(obj.fill){//是否填充
				obj.fillStyle?(ctx.fillStyle=obj.fillStyle):null;
				ctx.fillText(obj.text,obj.disX,obj.disY);
			}
			if(obj.stroke){//是否描边
				obj.strokeStyle?(ctx.strokeStyle=obj.strokeStyle):null;
				ctx.strokeText(obj.text,obj.disX,obj.disY);
			}
		  	ctx.restore();
		}
	  	return this;
	}
	
	
	//直线的构造
	function Line(o){
		this.x=0,//x坐标
		this.y=0,//y坐标
		this.startX=0,//开始点x位置
		this.startY=0, //开始点y位置
		this.endX=0,//结束点x位置
		this.endY=0;//结束点y位置
		this.thin=false;//设置变细系数
		
		this.init(o);
	}
	Line.prototype.init=function(o){
		for(var key in o){
			this[key]=o[key];
		}
	}
	Line.prototype.render=function(ctx){
		innerRender(this);
		
		function innerRender(obj){
			ctx.save()
			ctx.beginPath();
			ctx.translate(obj.x,obj.y);
			if(obj.thin){
				ctx.translate(0.5,0.5);
			}
			if(obj.lineWidth){//设定线宽
				ctx.lineWidth=obj.lineWidth;
			}
			if(obj.strokeStyle){
				ctx.strokeStyle=obj.strokeStyle;
			}
			//划线
		  	ctx.moveTo(obj.startX, obj.startY);
		  	ctx.lineTo(obj.endX, obj.endY);
		  	ctx.stroke();
		  	ctx.restore();
		}
	  	
	  	return this;
	}
	
	//构造函数
	 function Circle(o){
		this.x=0,//圆心X坐标
		this.y=0,//圆心Y坐标
		this.r=0,//半径
		this.startAngle=0,//开始角度
		this.endAngle=0,//结束角度
		this.anticlockwise=false;//顺时针，逆时针方向指定
		this.stroke=false;//是否描边
		this.fill=false;//是否填充
		this.scaleX=1;//缩放X比例
		this.scaleY=1;//缩放Y比例
		this.rotate=0;
		
		this.init(o);
	 }
	 //初始化
	 Circle.prototype.init=function(o){
		for(var key in o){
			this[key]=o[key];
		}
	}
		 //绘制
	 Circle.prototype.render=function(context){
		var ctx=context;//获取上下文
		ctx.save();
		ctx.beginPath();
		ctx.translate(this.x,this.y);
		if(this.fill){
			ctx.moveTo(0,0);
		}
		//ctx.moveTo(this.x,this.y);
		ctx.scale(this.scaleX,this.scaleY);//设定缩放
		ctx.arc(0,0,this.r,this.startAngle,this.endAngle);//画圆
		if(this.lineWidth){//线宽
			ctx.lineWidth=this.lineWidth;
		}
		if(this.fill){//是否填充
			this.fillStyle?(ctx.fillStyle=this.fillStyle):null;
			ctx.fill();
		}
		if(this.stroke){//是否描边
			this.strokeStyle?(ctx.strokeStyle=this.strokeStyle):null;
			ctx.stroke();
		}	
		ctx.restore();
	 	
	 	return this;
	 }	
 	
	var _= util = {
		//获取属性值
		getStyle:function (obj, prop) {
			var prevComputedStyle = document.defaultView ? document.defaultView.getComputedStyle( obj, null ) : obj.currentStyle;
			return prevComputedStyle[prop];
		},
		getRandom:function(min,max){
			return parseInt(Math.random()*(max-min)+min);
		},
		getRandomColor:function(){
			return '#' + Math.random().toString(16).substr(2, 6).toUpperCase();
		},
		//获取鼠标信息
		getOffset:function(e){
			return {
					x:e.offsetX,
					y:e.offsetY
				};
		},
		//循环
		each:function(arr,fn){
			var len = arr.length;
			for(var i=0;i<len;i++){
				fn(arr[i],i);
			}
		},
		getDecimals:function(value){
			return (value!=Math.floor(value))?(value.toString()).split('.')[1].length:0;
		}
		
	}

	var class2type={};	
	_.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(name) {
		class2type[ "[object " + name + "]" ] = name;
	});

	function getType( obj ) {
		return obj == null ?
			String( obj ) :
			class2type[ Object.prototype.toString.call(obj) ] || "undefined";
	}
	
	global.spaceMan=spaceMan;	
})(window);