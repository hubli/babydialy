
(function(){

	// dom ready
	$(function(){		
		// 设置图片框架最大高度
		var width = getContentImgFrameWidth();
		$('.contentImg').css("maxHeight", width);
		$('.content').each(function(index){
			new AudioPlay(this);
		});	

		// 点赞
		$('.priase').on("click", function() {
			var $this = $(this);
			$.getJSON("requestUrl", function(data) {
				console.log(data);	
			});
		});
	});

	// 获取内容图片框架宽度
	function getContentImgFrameWidth(){
		return $('.contentImg').eq(0).width();
	}

	// 播放器控制
	function AudioPlay(root){
		var that = this,
			parent = $(root),
			$audio = parent.children("audio"),
			audio = $audio.get(0),
			oprateArea = parent.children(".oprateArea"),
			controlBtn = oprateArea.find(".contrlBtn"),
			countTime = oprateArea.find(".countTime"),
			duration;

		this.stop = function(){
			audio.pause();
			controlBtn.removeClass("contrlBtn--pause");
		}	

		// 更新语音文件实时播放时间
		function updatePlayProgress(currentTime){
			if(duration){
				countTime.text(formatTime(duration - currentTime));
			}
		}	
		
		// 设置语音文件长度
		function setDuration(){
			if(duration){	
		    	countTime.text(formatTime(duration));
			}else{
				countTime.text("未知长度");
			}				
		}
		// 格式化时间文件播放时间长度（s），不足末尾补0
		function formatTime(value){
			var timeCount = parseInt(value * 100 / 60) / 100 + "";
			switch(4 - timeCount.length) {
				case 1:
					timeCount += "0"
					break;
				case 2:
					timeCount += "00"
					break;
				case 3:
					timeCount += ".00"
					break;
			}			
			return timeCount;
		}

		function starOrPuase() {
			if(audio.paused){				
				if(AudioPlay.currentPlay && AudioPlay.currentPlay != that){
			    	AudioPlay.currentPlay.stop();
			    }
			    AudioPlay.currentPlay = that;		
				controlBtn.addClass("contrlBtn--pause");
				audio.play();
			}else{
				AudioPlay.currentPlay = null;
				that.stop();
			}	
		}

		//初始化对象
		(function(){
			setDuration();
			parent.on("click", ".contrlBtn", function(){
				starOrPuase();
			});

			// 监控文件加载状态
			audio.addEventListener("canplaythrough", function(){
				duration = audio.duration;
				setDuration();
			}, false);

			// 更新时间
			audio.addEventListener("timeupdate", function(){
				updatePlayProgress(audio.currentTime);
			}, false);

			// 播放结束
			audio.addEventListener("ended", function(){
				controlBtn.removeClass("contrlBtn--pause");
				setDuration();	
			}, false);
		})();
	};

})();
