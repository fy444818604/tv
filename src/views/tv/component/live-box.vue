<template>
	<ul class="live-model" v-group>
		<li v-for="(item,index) in live" @click="jump(item)" v-if="getShow(index)" :class="item.type == '2'?'prepare':''" 
		@up="up(index)" @left="left(index)" :ref="'middle'+index" :key="item+index" v-items @focus="focus(item)" @blur="blur(item)">
			<img :src="require('../../../assets/tv/pic.png')" alt="" class="live-bg1">
			<img :src="item.type != '2' && item.liveShot?host + item.liveShot:require('../../../assets/tv/pic.png')" alt="" class="live-bg">
			<div class="status" :class="item.type=='2'?'pre':''">
				{{status[item.type]}}
				<img style="width: 30px;height: 30px;" v-if="item.type=='1'" src="../../../assets/tv/3.gif" alt="">
			</div>
			<div class="live-name">{{item.eventName}}</div>
			<div class="live-time" v-show="item.type=='2'">
				{{item.eventStartTime}}&nbsp; &nbsp;开始
			</div>
		</li>
		<li class="more-li" v-items v-if="live.length >= 7 && liveType" @click="jumpLive">
			<div class="more-li-wrap">
				<span>更多直播</span>
				<img class="arrow" src="../../../assets/tv/arraw.png" alt="">
			</div>
		</li>
	</ul>
</template>

<script>
	export default {
		name:'live-box',
		props:{
			live:{
				type:Array
			},
			liveType:{
				type:Boolean,
				default:true
			}
		},
		data() {
			return {
				status:{
					"1":'直播中',
					"2":'预告'
				},
				index:0,
				bg:require('../../../assets/tv/pic.png'),
				host:process.env.VUE_APP_SOURCEURL 
			}
		},
		methods:{
			getShow(index) {
				if(this.liveType) {
					if(this.live.length >= 7) {
						if(index >= 5){
							return false
						}else {
							return true
						}
					}else{
						return true
					}
				}else {
					return true
				}
			},
			left(index) {
				if (index != 0) {
					let itemIndex = 0
					this.$service.items.map((v,i) => {
						if(v.id == this.$service.pointer.id) itemIndex = i-1
					})
					this.$service.move(this.$service.items[itemIndex])
				} 
			},
			up(index) {
				if(index < 3) {
					this.$service.items.map((v,i) => {
						if(v.$el.className.indexOf('active') != -1){
							this.$service.move(this.$service.items[i])
						}
					})
				}else {
					this.$service.move('up')
				}
			},
			jump(item) {
				if(event.which != 13) return
				this.$router.push({
					path:'/activeDetail',
					query:{
						aid:item.eventInfoId
					}
				})
			},
			jumpLive() {
				if(event.which != 13) return
				this.$parent.$parent.nav.map(v => {
					if(v.name === '直播'){
						v.active = true
					}else {
						v.active = false
					}
				})
				this.$router.push({
					path:'/component/detail/4/live'
				})
				this.$service.move(this.$service.items[3])
			},
			focus(item) {
				// if(item.type != '2' && item.liveShot) {
				// 	this.$service.pointer.$el.style.backgroundImage = `url(${process.env.VUE_APP_SOURCEURL + item.liveShot})`
				// }
			},
			blur(item) {
				// if(item.type != '2' && item.liveShot) {
				// 	this.$service.pointer.$el.style.backgroundImage = `url(${this.bg})`
				// }
			}
		}
	}
</script>

<style lang="scss" scoped="scoped">
	@import "../../../focus.scss";
	.live-model{
		display: flex;
		flex-wrap: wrap;
	}
	
	.live-model>li {
		width: calc(33.33% - 25px);
		margin-right: 37px;
		height: 304px;
		// background-image: url(../../../assets/tv/pic.png);
		// background-size: cover;
		// background-repeat: no-repeat;
		padding: 0 48px;
		margin-bottom: 40px;
		position: relative;
		border-radius: 8px;
	}
	
	.live-model>li:nth-child(3n){
		margin-right: 0;
	}
	
	.live-model>li>.status {
		position: absolute;
		left: 20px;
		top: 20px;
		border-radius: 6px;
		background: linear-gradient(180deg,#87e96a, #46ef7f);
		padding: 6px 16px;
		color: #FFFFFF;
		z-index: 1;
	}
	
	.live-model>li>.status.pre {
		background: linear-gradient(179deg,#bbbbbb 1%, #a7a7a7 100%);
	}
	
	.live-model>li.prepare {
		background-image: url(../../../assets/tv/pic1.png);
	}
	
	.live-name {
		margin-top: 88px;
		font-size: 40px;
		font-weight: 400;
		color: rgba(255,255,255,0.90);
		text-overflow: -o-ellipsis-lastline;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		line-height: 64px;
		position: relative;
		z-index: 2;
	}
	
	.live-time {
		padding: 6px 24px;
		border-radius: 24px;
		color: rgba(255,255,255,.9);
		background: rgba(255,255,255,.2);
		display: flex;
		width: 412px;
		margin-top: 14px;
		position: relative;
		z-index: 2;
	}
	
	.more-li {
		background: rgba(255,255,255,.12);
		background-image:none!important;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	
	.arrow {
		width: 44px;
		height: 44px;
		margin-left: 20px;
	}
	
	.more-li-wrap {
		display: flex;
		align-items: center;
	}
	
	.more-li-wrap>span {
		font-size: 44px;
		font-weight: 500;
		color: #FFFFFF;
	}
	
	.live-bg,.live-bg1 {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		z-index: 1;
	}
	
	.live-bg{
		display: none;
	}
	
	.focus>.live-bg {
		display: block;
	}
	
	.focus>.live-bg1 {
		display: none;
	}
</style>
