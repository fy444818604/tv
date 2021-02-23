<template>
	<div class="wrap">
		<head-tips></head-tips>
		<main>
			<div class="main-container">
				<div class="player-wrap">
					<video id="videoDom" controls autoplay src v-show="liveRtmp || videoSrc"></video>
					<div class="play-preview" v-if="liveStatus === 0 && !liveRtmp && !videoSrc">
						<div>直播未开始</div>
						<div>
							{{ startTime | date_formate_one }} -
							{{ endTime | date_formate_two }}
						</div>
						<div>{{ countDownText }}</div>
					</div>
					<div class="play-preview" v-if="liveStatus === 1 && !liveRtmp && !videoSrc">
						<div>直播进行中</div>
						<div>直播未推流 , 正在查看中...</div>
					</div>
					<div class="play-preview" v-if="liveStatus === 2 && !liveRtmp && !videoSrc">
						<div>直播已结束</div>
						<div>
							{{ startTime | date_formate_one }} -
							{{ endTime | date_formate_two }}
						</div>
						<div class="watch-num">
							<p>总计观看人数</p>
							<span>0</span>
						</div>
					</div>
				</div>
				<div class="active-msg">
					<div class="active-title">
						{{ tvName }}
					</div>
					<ul class="authors" v-if="talkName">
						<li v-items class="gradient" @right="" @left="" @click="handleDetail">{{ talkName }}</li>
					</ul>
					<div class="no-authors" v-else>暂无主讲人</div>
					<div class="introduction gradient" v-if="themeBackMask" v-items @click="handleDetail" @right @left>
						<span class="introduction_span">{{ themeBackMask }}</span>
						<span class="introduction_more" v-if="themeBackMaskLen > 114">更多></span>
					</div>
					<div class="no-introduction" v-else>
						暂无简介
					</div>
					<ul class="btn-group">
						<li class="gradient" name="full" @click="handleVideoScreen" v-items="{default:true}" @left="fullLeft" @right="fullRight">
							<i class="iconfont iconquanping"></i>
							<div>全屏</div>
						</li>
						<li class="gradient" @click="handleDetail" v-items @right>
							<i class="iconfont iconxiangqing"></i>
							<div>详情</div>
						</li>
					</ul>
				</div>
			</div>
			<ul class="online-list" id="online-list" v-if="!isRes">
				<div class="online-left" @click="handleChangeLive" name="online" v-items @down="down" @up="up">
					<div class="img-wrap current">
						<img :src="liveShotList.length!=0?videoCdn+liveShotList[0]:''" alt="" />
						<p v-if="liveStatus === 0">直播未开始</p>
						<p v-if="liveStatus === 1">直播进行中</p>
						<p v-if="liveStatus === 2">直播已结束</p>
					</div>
					<div class="play-icon" style="z-index: 3;">
						<div class="triangle"></div>
					</div>
					<div class="play-icon play-live" :class="isActive?'active':''" style="z-index: 2;">
						<img :src="require('../../../assets/tv/3.gif')" alt="">
					</div>
				</div>
				<template v-if="videoList.length > 0">
					<li v-for="(item, index) in videoList" class="video-focus" v-items :key="index" :class="item.active?'active':''"
					 @click="handleChangeVideo(item.eventAttrId, item.eventAttrPath, index)" @up="up" @down="down" @right="right(index)"
					 @left="left(index)">
						<div class="play-icon">
							<div class="triangle"></div>
						</div>
						<div class="play-icon play-live" v-show="item.active">
							<img :src="require('../../../assets/tv/3.gif')" alt="">
						</div>
						<div class="video-box">
							<div class="img-wrap">
								<img :src="videoCdn + item.eventAttrSmallImgUrl" alt="" />
							</div>
							<div class="online-name">{{ item.eventAttrName }}</div>
						</div>
					</li>
				</template>
			</ul>

			<div class="resource" v-if="isRes">
				<div class="resource-item" @click="handlePlayResource">
					<img :src="videoCdn + resourcePic" alt="" />
					<span class="text-overflow-3">{{resName}}</span>
					<div class="play-icon">
						<div class="triangle"></div>
					</div>
				</div>
			</div>

			<div class="atth-wrap" v-if="attachment.length > 0">
				<div class="atth-title">附件</div>
				<ul>
					<li v-for="(item, index) in attachment" :key="index">
						<i class="iconfont" :class="getIcon(item.eventAttrName)"></i>
						<p>{{ item.eventAttrName }}</p>
					</li>
				</ul>
			</div>
			<div class="atth-wrap no-padding" v-if="imgList.length > 0">
				<div class="atth-title">图片</div>
				<div id="scroll" class="scroll">
					<ul style="height: 270px;">
						<li v-for="(item, index) in imgList" @click="handleShowBigImage(item)" class="photo-focus" :key="index" @down="imgDown(index)"
						 @up="imgUp(index)" @left="imgLeft(index)" @right="imgRight(index)" v-items style="width: 200px; height: 200px; border-radius: 8px">
							<img :src="videoCdn + item.eventAttrSmallImgUrl" alt="" style="width: 100%; height: 100%; border-radius: 8px" />
							<el-dialog :show-close="false" class="img-dialog" :visible.sync="item.visible">
								<div class="icon" @click="handleClose(item)">
									<i class="iconfont icon-close"></i>
								</div>
								<img width="100%" :src="videoCdn + item.eventAttrSmallImgUrl" />
							</el-dialog>
						</li>
					</ul>
				</div>
			</div>
			<div class="atth-wrap no-padding" v-if="homeworkList.length > 0">
				<div class="atth-title">作业</div>
				<div id="scroll1" class="scroll">
					<ul style="height: 270px;">
						<li v-for="(item, index) in homeworkList" :key="index" class="photo-focus" @click="handleShowBigHomeWork(item)"
						 @down="imgDown1(index)" @up="imgUp1(index)" @left="imgLeft1(index)" @right="imgRight1(index)" v-items>
							<img :src="videoCdn + item.homeworkUrl" style="width: 200px; height: 200px; border-radius: 8px" />
							<div></div>
							<el-dialog :show-close="false" class="img-dialog" :visible.sync="item.visible" @click="handleClose(item)">
								<div class="icon" @click="handleClose(item)">
									<i class="iconfont icon-close"></i>
								</div>
								<img width="100%" :src="videoCdn + item.homeworkUrl" />
							</el-dialog>
						</li>
					</ul>
				</div>
			</div>
		</main>
	</div>
</template>

<script>
	import {
		dateFormat
	} from '@/utils/time.js'
	import headTips from '../component/head.vue'
	import axios from "axios";
	export default {
		data() {
			return {
				isActive: true,
				videoCdn: process.env.VUE_APP_SOURCEURL,
				author: ["梁泳珊", "杨佩"],
				btnGroup: [{
						icon: "iconquanping",
						name: "全屏",
						handle: "",
					},
					{
						icon: "iconxiangqing",
						name: "详情",
						handle: "",
					},
				],
				//
				resourceId: this.$route.query.resourceId || null,
				aid: this.$route.query.aid || null,
				liveStatus: null, // 0. 未直播 1. 直播中 2. 已结束
				startTime: null, // 活动开始时间
				endTime: null, // 活动结束时间
				tvName: "", // 活动名称
				talkName: "", // 活动主讲人
				countDownText: "", // 倒计时数
				themeBackMask: "", // 活动简介
				themeBackMaskLen: "", // 字符长度
				videoList: [], // 视频列表
				attachment: [], // 附件列表
				imgList: [], // 图片列表
				homeworkList: [], // 家庭作业
				videoDom: null, // video element
				liveUrls: [], // 直播流
				liveRtmp: false, // 是否直播流
				flvUrl: "", // flv直播地址
				liveIndex: true, // 是否在直播框
				videoId: null, // 录播id
				videoSrc: "", // 录播src
				liveShotList: [], //直播截图

				// 资源相关
				isRes: false,
				resourcePic: "", // 资源图片
				resourcePath: "", // 资源路径
				resName: '',
				dom: null,
				dom1: null,
				dom2: null,

				flag: true
			};
		},
		components: {
			headTips,
		},
		filters: {
			date_formate_one(val) {
				return dateFormat(new Date(val), "yyyy-MM-dd hh:mm");
			},
			date_formate_two(val) {
				return dateFormat(new Date(val), "hh:mm");
			},
		},
		methods: {
			fullLeft() {
				if(this.fullscreenElement() && this.videoDom.src.substring(0,4) != 'blob') {
					this.videoDom.currentTime = this.videoDom.currentTime - 15
				}
			},
			fullRight() {
				if(this.fullscreenElement() && this.videoDom.src.substring(0,4) != 'blob') {
					this.videoDom.currentTime = this.videoDom.currentTime + 15
				}
				if(!this.fullscreenElement()) {
					this.$service.move('right')
				}
			},
			getIsRes() {
				if (this.aid) this.isRes = false
				else this.isRes = true
				if (this.isRes) {
					this.getResourDetail();
				} else {
					this.getTvDetail();
				}
			},
			gblen(str) {
				if (str) {
					var len = 0;
					for (var i = 0; i < str.length; i++) {
						if (str.charCodeAt(i) > 127 || str.charCodeAt(i) == 94) {
							len += 2;
						} else {
							len++;
						}
					}
					return len;
				} else {
					return 0;
				}
			},
			getIcon(name) {
				let suffix = name.split(".")[name.split(".").length - 1];
				let icon = "";
				switch (suffix) {
					case "png":
						icon = "iconpng";
						break;
					case "psd":
						icon = "iconpsd";
						break;
					case "txt":
						icon = "icontxt";
						break;
					case "mp4":
						icon = "iconvideo";
						break;
					case "zip":
						icon = "iconzip";
						break;
					case "jpg":
						icon = "iconjpg";
						break;
					case "mp3":
						icon = "iconmp";
						break;
					case "excel":
						icon = "iconexcel";
						break;
					case "ppt":
						icon = "iconppt";
						break;
					case "word":
						icon = "iconword";
						break;
					case "pdf":
						icon = "iconpdf";
						break;
					default:
						icon = "iconwhite";
						break;
				}
				return icon;
			},
			countDown(startTime, endTime) {
				let days = (endTime - startTime) / 1000 / 3600 / 24;
				let day = Math.floor(days);
				let hours = (days - day) * 24;
				let hour = Math.floor(hours);
				let minutes = (hours - hour) * 60;
				let minute = Math.floor(minutes);
				let seconds = (minutes - minute) * 60;
				let second = Math.floor(seconds);
				let str = "";
				if (day >= 1) {
					str = `将于 ${day}天${hour}小时${minute}分钟后 开播`;
				} else if (day < 1 && day >= 0 && hour >= 1) {
					str = `将于 ${hour}小时${minute}分钟后 开播`;
				} else if (hour < 1 && minute >= 1) {
					str = `将于 ${minute}分钟后 开播`;
				} else if (minute < 1 && second >= 1) {
					str = `直播马上开始了`;
				} else {
					str = "";
				}
				return str;
			},
			// 播放flv
			flvPlay(url) {
				this.flvPlayer = flvjs.createPlayer({
					type: "flv",
					url: url,
					isLive: true,
				}, {
					enableStashBuffer: false,
					stashInitialSize: 128,
				});
				this.flvPlayer.attachMediaElement(this.videoDom);
				this.flvPlayer.load();
				this.flvPlayer.play();
			},
			// 销毁flv
			flvDestroy() {
				this.videoDom.src = "";
				if (this.flvPlayer) {
					this.flvPlayer.detachMediaElement();
					this.flvPlayer.unload();
					this.flvPlayer = null;
				}
			},
			handleCountDown(startTime, endTime) {
				return this.countDown(startTime, endTime);
			},
			handleClose(item) {
				item.visible = false;
			},
			handleShowBigImage(item) {
				if (event.which != 13) return
				if (!this.flag) return
				this.flag = false
				if (item.visible) {
					item.visible = false
					this.$nextTick(() => {
						setTimeout(() => {
							this.$service.pointer.$el.classList.add('focus')
							this.flag = true
						}, 500)
					})
					return
				}
				this.$service.pointer.$el.classList.remove('focus')
				item.visible = !item.visible;
				this.$nextTick(() => {
					setTimeout(() => {
						if (!item.visible) this.$service.pointer.$el.classList.add('focus')
						this.flag = true
					}, 500)
				})
			},
			handleShowBigHomeWork(item) {
				// item.visible = true;
				if (event.which != 13) return
				if (!this.flag) return
				this.flag = false
				this.$service.pointer.$el.classList.remove('focus')
				item.visible = !item.visible;
				this.$nextTick(() => {
					setTimeout(() => {
						if (!item.visible) this.$service.pointer.$el.classList.add('focus')
						this.flag = true
					}, 800)
				})
			},
			handleChangeLive() {
				if (event.which != 13) return
				this.isActive = true
				this.videoList.map((v) => {
					v.active = false
				})
				if (!this.videoSrc) return;
				this.liveIndex = true;
				this.videoId = null;
				this.videoDom.setAttribute("src", "");
				this.videoSrc = "";
				this.flvUrl && this.flvPlay(this.flvUrl);
			},
			handleChangeVideo(id, src, index) {
				if (event.which != 13) return
				this.isActive = false
				this.videoList.map((v, i) => {
					if (i == index) {
						v.active = true
					} else {
						v.active = false
					}
				})
				this.flvDestroy();
				this.videoId = id;
				this.videoSrc = src;
				this.liveIndex = false;
				this.videoDom.setAttribute("src", this.videoCdn + this.videoSrc);
				this.$nextTick(() => {
					this.$service.move(this.$service.pointer);
					this.$service.pointer.$el.classList.add("focus")
				})
			},
			handleVideoScreen() {
				if (event.which != 13) return
				if (this.videoDom.style.display != 'none') {
					this.launchFullScreen(this.videoDom);
				}
			},
			handleDetail() {
				if (event.which != 13) return
				let query;
				if (this.isRes) {
					query = {
						resourceId: this.resourceId
					}
				} else {
					query = {
						aid: this.aid
					}
				}
				this.$router.push({
					path: '/activeTip',
					query: query
				})
			},

			getTvDetail() {
				this.$api
					.tvDetail({
						eventId: this.aid,
					})
					.then((res) => {
						if (res.code === 0 && res.success) {
							const data = res.data;
							this.startTime = data.eventInfo.eventStartTime;
							this.endTime = data.eventInfo.eventEndTime;
							this.tvName = data.eventInfo.eventName;
							this.talkName = data.eventInfo.eventTalkManName;

							this.themeBackMask = data.eventThemeBack ?
								data.eventThemeBack.eventThemeBackMask :
								"";
							this.themeBackMaskLen = this.gblen(this.themeBackMask);
							data.videoList.map(v => {
								Object.assign(v, {
									active: false
								})
							})
							this.videoList = data.videoList;
							this.attachment = data.attrList;
							this.imgList = data.imageList.map((item) => {
								this.$set(item, "visible", false);
								return item;
							});

							this.liveShotList = data.liveShotList
							if (data.eventAptRecord && data.eventAptRecord.homeworkList) {
								this.homeworkList = data.eventAptRecord.homeworkList.map(
									(item) => {
										this.$set(item, "visible", false);
										return item;
									}
								);
							}
							// 有直播间, 可获取直播地址
							if (data.eventOtherInfo.eventOtherInfoLiveRoomId == "1") {
								this.getLiveUrls();
							}
						}
					});
			},
			getLiveUrls() {
				axios
					.get("event/tv/getLiveUrls.do", {
						params: {
							eventId: this.aid,
							id: +new Date()
						},
					})
					.then((res) => {
						if (res.data.code === 0 && res.data.success) {
							const data = res.data.data;
							let liveUrls = data.filter((item) => item.status == "1");
							liveUrls.sort(this.mySort);
							this.liveUrls = liveUrls;
							this.liveStatus = 1;
							if (this.liveUrls.length !== 0) {
								// 有直播
								console.log("this.liveUrls", this.liveUrls);
								this.flvUrl = this.liveUrls[0].flvUrl;
								this.flvPlay(this.flvUrl);
								this.liveRtmp = true;
							} else {
								this.liveRtmp = false;
								if (new Date().getTime() < this.startTime) {
									// 活动未开始
									this.liveStatus = 0;
									this.countDownText = this.handleCountDown(
										new Date().getTime(),
										this.startTime
									);
								} else if (new Date().getTime() > this.endTime) {
									// 活动已结束
									this.liveStatus = 2;
								}
							}
						}
					});
			},
			mySort(a, b) {
				return a.type - b.type;
			},
			launchFullScreen(el) {
				if (el.requestFullScreen) {
					el.requestFullScreen();
				} else if (el.mozRequestFullScreen) {
					el.mozRequestFullScreen();
				} else if (el.webkitRequestFullScreen) {
					el.webkitRequestFullScreen();
					setTimeout(() => {
						this.fullscreenElement()
					},1000)
				} else if (el.msRequestFullscreen) {
					el.msRequestFullscreen();
				}
			},
			fullscreenElement() {
				var fullscreenEle = document.fullscreenElement ||
					document.mozFullScreenElement ||
					document.webkitFullscreenElement;
				return fullscreenEle;
			},
			// 资源相关
			getResourDetail() {
				this.$api
					.tvResourceDetail({
						resourceId: this.resourceId
					})
					.then((res) => {
						console.log("res", res);
						if (res.code === 0 && res.success) {
							const data = res.data;
							this.tvName = data.resResource.resourceName;
							this.talkName = data.resResource.userName;
							this.themeBackMask = data.resResource.resourceMask;
							this.themeBackMaskLen = this.gblen(this.themeBackMask);
							this.resourcePic = data.resResource.resourcePic;
							this.resourcePath = data.resourceAuth.resourcePath;
							this.resName = data.resResource.resourceName;
							this.videoSrc = this.resourcePath;
							this.attachment = data.resAttachmentList.map((item) => {
								item.eventAttrName = item.attachmentName;
								return item;
							});
							this.videoDom.setAttribute("src", this.videoCdn + this.videoSrc);
						}
					});
			},
			handlePlayResource() {
				if (event.which != 13) return
				this.videoDom.setAttribute("src", this.videoCdn + this.videoSrc);
			},
			right(index) {
				event.preventDefault()
				if (index != this.videoList.length - 1) {
					let itemIndex = 0
					this.$service.items.map((v, i) => {
						if (v.id == this.$service.pointer.id) itemIndex = i + 1
					})
					this.$service.move(this.$service.items[itemIndex])
					let left = Number(this.dom.scrollLeft) + 590
					this.dom.scrollTo(left, 0)
				}
			},
			left(index) {
				event.preventDefault()
				if (index == 0) {
					let itemIndex = 0
					this.$service.items.map((v, i) => {
						if (v.data.name == 'online') itemIndex = i
					})
					this.$service.move(this.$service.items[itemIndex])
				} else {
					let itemIndex = 0
					this.$service.items.map((v, i) => {
						if (v.id == this.$service.pointer.id) itemIndex = i - 1
					})
					this.$service.move(this.$service.items[itemIndex])
					let left = Number(this.dom.scrollLeft) - 590
					this.dom.scrollTo(left, 0)
				}
			},
			up() {
				let itemIndex = 0
				this.$service.items.map((v, i) => {
					if (v.data.name == 'full') itemIndex = i
				})
				this.$service.move(this.$service.items[itemIndex])
			},
			down() {
				let top = Number(this.$parent.wrap.scrollTop) + 350
				this.$parent.wrap.scrollTo(0, top)
				this.$service.move('down')
			},
			imgLeft(index) {
				event.preventDefault()
				if (this.imgList[index].visible) {
					this.imgList[index].visible = false
					return
				}
				let left = Number(this.dom1.scrollLeft) - 250
				this.dom1.scrollTo(left, 0)
				this.$service.move('left')
			},
			imgRight(index) {
				event.preventDefault()
				if (this.imgList[index].visible) {
					this.imgList[index].visible = false
					return
				}
				if (index == this.imgList.length - 1) return
				let left = Number(this.dom1.scrollLeft) + 250
				this.dom1.scrollTo(left, 0)
				this.$service.move('right')
			},
			imgUp(index) {
				if (this.imgList[index].visible) {
					this.imgList[index].visible = false
					return
				}
				let left = Number(this.$parent.wrap.scrollTop) - 250
				this.$parent.wrap.scrollTo(left, 0)
				this.$service.move('up')
			},
			imgDown(index) {
				if (this.imgList[index].visible) {
					this.imgList[index].visible = false
					return
				} else {
					this.$service.move('down')
				}
			},
			imgUp1(index) {
				if (this.homeworkList[index].visible) {
					this.homeworkList[index].visible = false
					return
				}
				this.$service.move('up')
			},
			imgDown1(index) {
				if (this.homeworkList[index].visible) {
					this.homeworkList[index].visible = false
					return
				}
				this.$service.move('down')
			},
			imgLeft1(index) {
				if (this.homeworkList[index].visible) {
					this.homeworkList[index].visible = false
					return
				}
				let left = Number(this.dom2.scrollLeft) - 200
				this.dom2.scrollTo(left, 0)
				this.$service.move('left')
			},
			imgRight1(index) {
				if (this.homeworkList[index].visible) {
					this.homeworkList[index].visible = false
					return
				}
				if (index == this.homeworkList.length - 1) return
				let left = Number(this.dom2.scrollLeft) + 200
				this.dom2.scrollTo(left, 0)
				this.$service.move('right')
			},
		},
		created() {
			this.getIsRes()
		},
		mounted() {
			this.videoDom = document.getElementById("videoDom");
			this.dom = document.getElementById('online-list')
			setTimeout(() => {
				this.dom1 = document.getElementById('scroll')
				this.dom2 = document.getElementById('scroll1')
			}, 1000)
			this.$service.move(this.$service.pointer);
		},
		beforeDestroy() {
			this.flvPlayer.pause()
			this.flvPlayer.unload()
			this.flvPlayer.detachMediaElement()
			this.flvPlayer.destroy()
			this.flvPlayer = null
		}
	};
</script>

<style lang="scss" scoped="scoped">
	@import "../../../focus.scss";

	.wrap {
		padding: 3.066666rem 4.466666rem;
		background-image: url("../../../assets/tv/bg.png");
		background-repeat: no-repeat;
		background-size: cover;
		// min-height: calc(150vh - 1px);
		min-height: calc(200vh - 2px);
		zoom: .5;
	}

	.main-container {
		display: flex;
		margin-top: 36px;
	}

	.player-wrap {
		position: relative;
		width: 888px;
		height: 499px;
		background: rgba(255, 255, 255, 0.12);
		margin-right: 56px;
		border-radius: 8px;

		video {
			position: absolute;
			width: 100%;
			height: 100%;
		}
	}

	.play-preview {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;

		.watch-num {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;

			span {
				margin-top: 10px;
			}
		}
	}

	.play-preview>div {
		font-size: 38px;
		font-weight: 700;
		color: rgba(255, 255, 255, 0.9);
	}

	.play-preview>div:nth-child(2) {
		margin: 40px 0 32px 0;
	}

	.active-msg {
		width: calc(100% - 944px);
	}

	.active-title {
		color: rgba(255, 255, 255, 0.9);
		font-size: 48px;
		font-weight: 700;
		line-height: 72px;
		text-overflow: -o-ellipsis-lastline;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		height: 144px;
	}

	.authors {
		display: flex;
	}

	.authors>li {
		background: rgba(255, 255, 255, 0.12);
		border-radius: 28px;
		color: rgba(255, 255, 255, 0.9);
		padding: 13px 32px;
		font-size: 30px;
		font-weight: 400;
		margin-right: 16px;
		margin-top: 24px;
		margin-bottom: 3px;
	}

	.no-authors {
		height: 87px;
		line-height: 87px;
		color: rgba(255, 255, 255, 0.9);
		font-size: 30px;
		font-weight: 400;
	}

	.resource {
		margin-top: 40px;
		width: 100%;

		.resource-item {
			position: relative;
			display: flex;
			flex-direction: row;
			width: 560px;
			height: 156px;
			padding: 16px;
			box-sizing: border-box;
			background: rgba(#ffffff, 0.12);
			border-radius: 8px;
			border: 2px solid #fff;

			img {
				width: 228px;
				height: 100%;
			}

			span {
				margin-left: 24px;
				font-size: 28px;
				font-weight: 700;
				color: #ffffff;
				line-height: 40px;
			}

			.border {
				position: absolute;
				bottom: -32px;
				right: 24px;
				width: 64px;
				height: 64px;
				border-radius: 50%;
				box-shadow: 0px 0px 12px 0px rgba(90, 245, 222, 0.5);
				background: linear-gradient(128deg, #5af5de 12%, #4b90ef 88%);
			}
		}
	}

	.no-introduction {
		height: 127px;
		padding: 20px 0;
		color: rgba(255, 255, 255, 0.9);
	}

	.introduction {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: flex-end;
		padding: 20px 0;

		.introduction_span {
			width: 90%;
			height: 87px;
			font-weight: 400;
			color: rgba(255, 255, 255, 0.7);
			line-height: 47px;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
			white-space: normal;
			overflow: hidden;
			text-overflow: ellipsis;
			// word-break: keep-all;
			font-size: 30px;
		}

		.introduction_more {
			color: rgba(255, 255, 255, 0.7);
			font-size: 30px;
			display: inline-block;
			width: 85px;
		}
	}

	.btn-group {
		display: flex;
		margin-top: 8px;
	}

	.btn-group>li {
		width: 132px;
		height: 132px;
		border-radius: 8px;
		background: rgba(255, 255, 255, 0.12);
		display: flex;
		justify-content: center;
		align-items: center;
		margin-right: 12px;
		flex-direction: column;
	}

	.btn-group>li>* {
		color: rgba(255, 255, 255, 0.9);
	}

	.btn-group>li>i {
		font-size: 40px;
	}

	.btn-group>li>div {
		font-size: 26px;
		margin-top: 21px;
	}

	.online-list {
		// margin-top: 40px;
		padding: 30px 0;
		position: relative;
		display: flex;
		height: 255px;
		overflow-x: scroll;
		align-items: center;

		.online-left {
			position: relative;
			margin-right: 24px;
			height: 168px;
			padding: 16px;
			box-sizing: border-box;
			background: rgba(#fff, 0.12);
			border-radius: 8px;
			margin-left: 10px;

			.border {
				position: absolute;
				right: 24px;
				bottom: -32px;
				width: 64px;
				height: 64px;
				background: linear-gradient(128deg, #5af5de 12%, #4b90ef 88%);
				border-radius: 50%;
				box-shadow: 0px 0px 12px 0px rgba(90, 245, 222, 0.5);
			}

			.img-wrap {
				position: relative;
				width: 228px;
				height: 100%;

				img {
					width: 100%;
					height: 100%;
					border-radius: 8px;
					opacity: 0.4;
				}

				p {
					position: absolute;
					left: 0;
					top: 50%;
					transform: translateY(-50%);
					width: 100%;
					font-size: 26px;
					font-weight: 700;
					color: #fff;
					text-align: center;
				}
			}
		}

		li {
			position: relative;
			margin-right: 26px;
			height: 168px;

			&.current {
				.video-box {
					border-color: #fff;
				}

				.border {
					display: block;
				}
			}

			.video-box {
				display: flex;
				width: 584px;
				height: 100%;
				padding: 16px;
				box-sizing: border-box;
				border: 4px solid transparent;
				border-radius: 8px;
				background: rgba(#ffffff, 0.12);

				.img-wrap {
					width: 228px;
					height: 124px;

					img {
						width: 100%;
						height: 100%;
					}
				}

				.online-name {
					margin-left: 24px;
					font-size: 28px;
					font-weight: 500;
					color: rgba(255, 255, 255, 0.7);
					line-height: 40px;
				}
			}

			.border {
				display: none;
				position: absolute;
				right: 24px;
				bottom: -32px;
				width: 64px;
				height: 64px;
				background: linear-gradient(128deg, #5af5de 12%, #4b90ef 88%);
				border-radius: 50%;
				box-shadow: 0px 0px 12px 0px rgba(90, 245, 222, 0.5);
			}
		}
	}

	.atth-title {
		font-size: 38px;
		color: rgba(255, 255, 255, 0.9);
		font-weight: 500;
		margin-bottom: 24px;
	}

	.atth-wrap {
		margin-top: 56px;

		i {
			font-size: 78px;
			color: #ea5250;
			margin-right: 20px;
		}

		ul {
			display: flex;
			overflow-x: scroll;
			width: auto;
			position: relative;
			padding-left: 30px;
			left: -30px;

			li {
				display: flex;
				align-items: center;
				margin-right: 32px;
				background-color: rgba(255, 255, 255, 0.12);
				border-radius: 8px;
				display: flex;
				padding: 23px;

				.img-dialog {
					.icon {
						position: absolute;
						right: 10px;
						top: 10px;
						font-size: 30px;
					}

					& /deep/ .el-dialog__body {
						max-height: 660px;
						box-sizing: border-box;

						img {
							width: 100%;
							max-height: 600px;
						}

						i {
							font-size: 42px;
							color: #ea5250;
							margin-right: 0;
							color: #333333;
						}
					}
				}

				p {
					font-size: 28px;
					margin-left: 20px;
					color: rgba(255, 255, 255, 0.7);
					line-height: 40px;
					width: 348px;
					height: 80px;
					overflow: hidden;
				}

				.box {
					margin-left: 20px;
					font-size: 28px;
					color: rgba(255, 255, 255, 0.7);
					line-height: 40px;
					width: 348px;
				}
			}
		}
	}

	.no-padding ul li {
		padding: 0;
		margin-top: 25px;
		margin-bottom: 25px;
	}

	.no-padding ul {
		width: auto;
		overflow-x: visible;
		display: inline-flex !important;
	}

	.no-padding ul li:last-child {
		margin-right: 0;
	}

	.scroll {
		overflow-x: scroll;
		width: 100%;
		position: relative;
		// padding-left: 30px;
		// left: -30px;
	}

	.scroll>ul>li:nth-child(1) {
		margin-left: 10px;
	}

	.play-icon {
		right: 24px;
		top: 120px;
	}

	.play-icon>img {
		width: 48px;
		height: 48px;
		margin: 0 auto;
		margin-top: 14px;
		margin-left: 14px;
	}

	.video-focus.active .play-live {
		display: block !important;
	}

	.active.play-live {
		display: block !important;
	}
</style>
