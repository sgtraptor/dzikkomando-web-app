Vue.use(VueYouTubeEmbed.default)


var app = new Vue({
	el: '#app',
	data: {
		videoId: '',
		paused:true,
		media:mediaData.media,
		currentVideo:null,
		baseTitle:'',
		rwdAlternativeMode:true,
	},
	methods: {
		ready (event) {
			//player is ready
			this.player = event.target
		},
		playing (event) {
			//player is playing a video
		},
		change(item,index,back) {
			this.media.forEach(function(innerItem){
				innerItem.active=false;
			});
			this.currentVideo=item;
			item.active=true;
			this.videoId = item.videoId
			if(!this.paused){
				let self=this;
				setTimeout(function(){
					self.player.playVideo()
				},5);
			}
			if(!this.rwdAlternativeMode){
				this.scrollToTop(200);
			}
			if(!back){
				history.pushState({'index':index}, item.name, item.slug);
			}
			document.title = this.baseTitle+' - '+item.name;
		},
		play() {
			this.paused=false;
			this.player.playVideo();
		},
		stop () {
			this.paused=true;
			this.player.stopVideo()
		},
		pause () {
			this.paused=true;
			this.player.pauseVideo()
		},
		scrollToTop(scrollDuration) {
			let scrollStep = -window.scrollY / (scrollDuration / 15),
			scrollInterval = setInterval(function(){
				if ( window.scrollY != 0 ) {
					window.scrollBy( 0, scrollStep );
				}
				else clearInterval(scrollInterval);
			},15);
		},
		getFontSize(name){
			if(name.length>100){
				return '0.6em';
			}
			else if(name.length>70){
				return '0.7em';
			}
			else if(name.length>25){
				return '0.8em';
			} else {
				return '1em';
			}
		}
	},
	mounted() {
		this.baseTitle=document.title;
		let self=this;

		//check current url
		let url=window.location.href;
		let lastPart = url.split("/").pop();
		let slugFind=false;

		//find media to activate
		this.media.forEach(function(item,index){
			if(item.slug==lastPart){
				slugFind=true;
				self.change(self.media[index],index,false);
			}
		});
		if(!slugFind){
			this.change(this.media[0],0,false);
		}

		//set url after history.popstate
		window.addEventListener('popstate', function(event) {
			let newLocation=document.location.href;
			let newlastPart = newLocation.split("/").pop();	self.media.forEach(function(item,index){
				if(item.slug==newlastPart){
					self.change(self.media[index],index,true);
				}
			});
		});
	}
})
