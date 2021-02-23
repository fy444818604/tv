<template>
	<div class="wrap">
		<head-tips></head-tips>
		<main>
			<ul class="menu">
				<li v-for="(item,index) in nav" @right="navRight(index)" @left="navLeft(index)" v-items :key="item+index" :class="item.active?'active':''"
				 @focus="menuChange(index)" :name="item.name">
					{{item.name}}
					<img style="width: 48px;height: 48px;" class="blue" v-if="item.name == '直播'" src="../../assets/tv/2.gif" alt="">
					<img style="width: 48px;height: 48px;" class="white" v-if="item.name == '直播'" :src="require('../../assets/tv/3.gif')" alt="">
				</li>
			</ul>
			<router-view></router-view>
		</main>
	</div>
</template>

<script>
	import headTips from './component/head.vue'
	export default {
		data() {
			return {
				nav: [
					{
						name: '直播',
						active: false
					},
					{
						name: '资源',
						active: true,
						type: 1
					},
					{
						name: '同步课堂',
						active: false,
						type: 2
					},
					{
						name: '教研',
						active: false,
						type: 3
					},
					{
						name: '会议',
						active: false,
						type: 4
					},
				],
			}
		},
		watch: {
			$route: {
				handler: function(val, oldVal) {
					this.adapt()
				},
				// 深度观察监听
				deep: true
			}
		},
		components: {
			headTips,
		},
		methods: {
			adapt() {
				if (this.$route.path.indexOf("/component/detail/4/active") != -1) {
					if(!this.$route.query.id) this.$route.query.id = 1
					this.nav.map(v => {
						if (v.type == this.$route.query.id) v.active = true
						else v.active = false
					})
					this.$nextTick(() => {
						// let index = Number(this.$route.query.id) + 1
						// this.$service.move(this.$service.items[index]);
						let itemActive = this.nav.filter(v => {
							if(v.active) return v
						})
						let liveItem = this.$service.items.findIndex((v,i) => {
							if(v.data["name"] == itemActive[0].name) return i
						})
						this.$service.move(this.$service.items[liveItem]);
					})
				}else if(this.$route.path == "/component/detail/4/live") {
					let liveItem = this.$service.items.findIndex((v,i) => {
						if(v.data["name"] == "直播") return i
					})
					this.$service.move(this.$service.items[liveItem]);
				}
				
			},
			menuChange(index) {
				this.nav.map((v, i) => {
					if (index == i) v.active = true
					else v.active = false
				})
				if (this.nav[index].name == '我的') {
					// if(window.localStorage.getItem('token')){
					// 	this.$router.push({
					// 		path: '/person'
					// 	})
					// }
				} else if (this.nav[index].name == '直播') {
					if (this.$route.path != '/component/detail/4/live') {
						this.$router.push({
							path: './live'
						})
					}
				} else {
					if (this.$route.path == '/component/detail/4/active' && this.$route.query.id == this.nav[index].type) {

					} else {
						this.$router.push({
							path: 'active?id=' + this.nav[index].type
						})
					}

				}
				this.$nextTick(() => {
					this.$service.pointer.$el.classList.add("focus")
				})
			},
			navLeft(index) {
				if (index != 0) {
					let itemIndex = 0
					this.$service.items.map((v,i) => {
						if(v.id == this.$service.pointer.id) itemIndex = i-1
					})
					this.$service.move(this.$service.items[itemIndex])
				} 
			},
			navRight(index) {
				if (index != this.nav.length) {
					let itemIndex = 0
					this.$service.items.map((v,i) => {
						if(v.id == this.$service.pointer.id) itemIndex = i+1
					})
					this.$service.move(this.$service.items[itemIndex])
				}
			},
			isFullscreen() {
				return document.fullscreenElement ||
					document.msFullscreenElement ||
					document.mozFullScreenElement ||
					document.webkitFullscreenElement || false;
			}
		},
		mounted() {
			document.addEventListener('UniAppJSBridgeReady', function() {
				uni.postMessage({
					data: {
						message: '我是来自H5的消息'
					}
				})
			})
			this.adapt()

			window.myHistory = () => {
				var path = this.$route.path
				if(this.isFullscreen()){
					return
				}
				window.history.go(-1)
			}
		}
	}
</script>

<style lang="scss" scoped="scoped">
	@import "../../focus.scss";

	.wrap {
		padding: 3.066666rem 4.466666rem;
		background-image: url('../../assets/tv/bg.png');
		// min-height: calc(200vh - 2px);
		// zoom: .7;
		min-height: calc(200vh - 2px);
		zoom: .5;
	}

	.focus {
		// transform: scale(1.1);
		// outline: 5px solid yellow;
		position: relative;
		z-index: 99;
	}

	.menu {
		display: flex;
		margin-top: 29px;
		margin-bottom: 39px;
	}

	.menu>li {
		font-size: 40px;
		font-weight: 400;
		color: rgba(255, 255, 255, 0.70);
		padding: 16px 34px;
		margin-right: 52px;
		display: flex;
		align-items: center;
	}

	.menu>li.active {
		color: #FFFFFF;
		position: relative;
	}
	
	.menu>li .white,.menu>li.active .blue {
		display: none;
	}
	
	.menu>li.active .white,.menu>li .blue {
		display: block;
	}

	.menu>li.active::after {
		content: '';
		height: 8px;
		width: calc(100% - 96px);
		position: absolute;
		bottom: 0;
		left: 50px;
		background: linear-gradient(128deg, #5af5de 12%, #4b90ef 88%);
		border-radius: 4px;
	}

	.menu>li:nth-child(2).active::after {
		width: calc(100% - 148px);
	}
</style>
