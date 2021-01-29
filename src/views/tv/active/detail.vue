<template>
	<div class="wrap">
		<div class="active-detail">
			<div class="resName">{{resName}}</div>
			<div class="detail-item" style="align-items: flex-start;">
				<div>主讲人</div>
				<div class="author" v-if="userName">
					<div class="userface">
						<img :src="userFace || require('../../../assets/image/123.png')" alt="">
					</div>
					<div class="username">{{userName}}</div>
				</div>
			</div>
			<div class="detail-item" v-if="this.aid">
				<div>活动类型</div>
				<div>{{eventClassfyName}}</div>
			</div>
			<div class="detail-item">
				<div>{{this.aid?'':'上传'}}时间</div>
				<div>{{time}}</div>
			</div>
			<div class="intro-wrap">
				<span class="intro">简介:</span>{{intro}}
			</div>
			<div class="detail-item">
				<div>科目</div>
				<div>{{format(subject)}}</div>
			</div>
			<div class="detail-item">
				<div>教材</div>
				<div></div>
			</div>
			<div class="detail-item" style="align-items: flex-start;">
				<div>标签</div>
				<ul class="label">
					<li v-for="(item,index) in labelDataVos" :key="index">{{item.name}}</li>
				</ul>
			</div>
			<div class="detail-item" style="align-items: flex-start;" v-if="this.aid">
				<div>主讲教室</div>
				<ul class="room">
					<li v-for="(item,index) in main" :key="index">{{item.schoolName}}-{{item.roomName}}</li>
				</ul>
			</div>
			<div class="detail-item" style="align-items: flex-start;" v-if="this.aid">
				<div>听讲教室</div>
				<ul class="room">
					<li v-for="(item,index) in secondary" :key="index">{{item.schoolName}}-{{item.roomName}}</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				aid:this.$route.query.aid,
				resourceId:this.$route.query.resourceId,
				id:this.$route.query.aid || this.$route.query.resourceId,
				resName: '',
				userName: '',
				eventClassfyName: '',
				time: '',
				intro: '',
				subject: '',
				labelDataVos: [],
				userFace: '',
				main: [],
				secondary: []
			}
		},
		methods: {
			search() {
				this.$api.getInfoDetail({
					id: this.id,
					types: this.$route.query.aid?2:1
				}).then(res => {
					let value = res.data;
					this.resName = value.resName
					this.userName = value.userName
					this.eventClassfyName = value.eventClassfyName
					this.time = value.time
					this.intro = value.intro
					this.subject = `${value.stage}/${value.subject}/${value.grade}`
					this.labelDataVos = value.labelDataVos
					if(value.userFace) this.userFace = process.env.VUE_APP_SOURCEURL + value.userFace
					if (value.eventAptRecordVos.recordInvitationList) {
						value.eventAptRecordVos.recordInvitationList.map(v => {
							if (v.roomType === 1) this.main.push(v)
							else this.secondary.push(v)
						})
					}
					console.log(res);
				})
			},
			format(val) {
				let last = val.split('')
				if(last.length == 2) return ''
				if(last[last.length-1] === '/'){
					last.pop()
					return last.join('')
				}else {
					return val
				}
			}
		},
		created() {
			this.search()
		}
	}
</script>

<style lang="scss" scoped="scoped">
	.wrap {
		padding: 3.066666rem 4.466666rem;
		background-image: url('../../../assets/tv/bg.png');
		min-height: calc(200vh - 2px);
		zoom: .7;
	}
	
	.detail-item{
		display: flex;
		align-items: center;
		margin-bottom: 74px;
	}
	
	.intro-wrap{
		margin-bottom: 74px;
	}
	
	.intro-wrap {
		font-size: 36px;
		font-weight: 400;
		color:rgba(255,255,255,.7);
		line-height: 56px;
		text-align:justify;
	}
	
	.intro {
		margin-right: 12px;
		width: 81px;
		float: left;
	}
	
	.detail-item>div:nth-child(1),.intro  {
		color:rgba(255,255,255,.9);
		font-size: 36px;
		font-weight: 400;
	}
	
	.detail-item>div:nth-child(1)::after {
		content: ':';
		color:rgba(255,255,255,.9);
		margin-right: 12px;
	}
	
	.detail-item>div:nth-child(2) {
		font-size: 36px;
		font-weight: 400;
		color: rgba(255,255,255,0.70);
	}
	
	.userface {
		width: 136px;
		height: 136px;
	}
	
	.userface>img {
		width: 100%;
		height: 100%;
		border-radius: 100%;
	}
	
	.username {
		color: rgba(255,255,255,.7);
		margin-top: 16px;
	}
	
	.author {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	
	.label {
		display: flex;
		width: calc(100% - 100px);
		flex-wrap: wrap;
	}
	
	.label>li{
		border-radius: 8px;
		background: rgba(255,255,255,.12);
		padding: 10px 18px;
		font-weight: 400;
		color: rgba(255,255,255,0.70);
		font-size: 34px;
		margin-right: 16px;
		margin-bottom: 16px;
	}
	
	.resName {
		font-size: 48px;
		font-weight: 700;
		color: rgba(255,255,255,0.90);
		margin-bottom: 72px;
	}
	
	.room {
		display: flex;
		flex-direction: column;
	}
	
	.room>li {
		margin-bottom: 20px;
		font-size: 36px;
		font-weight: 400;
		color: rgba(255,255,255,0.70);
	}
	
	.room>li:last-child{
		margin-bottom: 0;
	}
</style>
