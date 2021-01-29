<template>
	<div class="wrap">
		<ul class="tab">
			<li class="active">
				<div class="btm"></div>
				<span>用户登录</span>
			</li>
			<li>
				<span>教师登录</span>
			</li>
		</ul>
		<div class="sign-wrap">
			<div class="code-wrap">
				<div id="code"></div>
				<div class="code-wrap-tip">请用微信扫码登录</div>
			</div>
			<div class="login-form">
				<div v-items="{default:true}" @left="blurInput" @right="blurInput" @up="blurInput" @down="down" @click="focus">
					<input @click.prevent="aaa" type="text" id="username" v-model="userName" class="login-inp" placeholder="请输入账号">
				</div>
				<div v-items @up="up" @down="down1" @click="focus1" @left="blurInput" @right="blurInput">
					<input @click.prevent="aaa" type="password" id="password" v-model="password" class="login-inp" placeholder="请输入密码">
				</div>
				<button class="login-btn" @up="up1" @down="blurInput" @left="blurInput" @right="blurInput" v-items @click="login">登录</button>
			</div>
		</div>
	</div>
</template>

<script>
	import QRCode from "qrcodejs2";
	export default {
		data() {
			return {
				targetId: +new Date(),
				flag:true,
				userName:'18080136032',
				password:'123456',
				orgId:''
			}
		},
		methods:{
			getCode() {
				let url = 'https://vx.ysclass.net/33/'+'login_'+this.targetId
				this.qrcode = new QRCode(document.getElementById('code'), {
					text: url,
					width: 480,
					height: 480,
					colorDark: "#000000",
					colorLight: "#ffffff",
					correctLevel: QRCode.CorrectLevel.H
				});
			},
			getToken() {
				this.$api.getLoginToken({
					targetId:this.targetId,
					id: +new Date()
				}).then(res => {
					if(!this.flag) return
					if(res.data){
						let result = JSON.parse(res.data)
						localStorage.setItem('token',result.data.accessToken)
						this.$router.push({
							path:'/component/detail/4/live'
						})
					}
					this.getToken()
				})
			},
			aaa() {
				return
			},
			blurInput() {
				event.preventDefault()
			},
			focus() {
				document.getElementById('username').focus()
			},
			blur() {
				document.getElementById('username').blur()
			},
			focus1() {
				document.getElementById('password').focus()
			},
			blur1() {
				document.getElementById('password').blur()
			},
			up() {
				this.blur1()
				this.$service.move(this.$service.items[0]);
				event.preventDefault()
			},
			up1() {
				this.$service.move('up')
				event.preventDefault()
			},
			down() {
				this.$service.move(this.$service.items[1]);
				this.blur()
				event.preventDefault()
			},
			down1() {
				this.blur1()
				this.$service.move('down');
				event.preventDefault()
			},
			login() {
				let data = {
					checkCode: "",
					checkCodeSessionId: "",
					loginType: 1,
					password: this.password,
					tenantId: "",
					userName: this.userName
				}
				if(this.orgId != ''){
					Object.assign(data,{
						orgId:this.orgId
					})
				}
				this.$api.login(data).then(res => {
					if(res.data.operationType == 0) {
						alert(res.msg); 
						return;
					}
					if(res.data.operationType == 1) {
						alert(res.msg); 
						return;
					}
					if(res.data.operationType == 2) {
						alert(res.msg); 
						return;
					}
					if(res.data.userToken){
						console.log(123);
						localStorage.setItem('token',res.data.userToken.accessToken)
						this.$router.push({
							path:'/component/detail/4/live'
						})
					}else {
						this.orgId = res.data.orgList[0].orgId
						this.$nextTick(() => {
							this.login()
						})
					}
				})
			}
		},
		created() {
			this.flag = true
		},
		destroyed() {
			this.flag = false
			this.orgId = ''
		},
		mounted() {
			this.getCode()
			this.getToken()
			this.$service.move(this.$service.pointer);
		}
	}
</script>

<style lang="scss" scoped="scoped">
	@import "../../focus.scss";
	
	.wrap {
		background-image: url("../../assets/tv/bg.png");
		background-repeat: no-repeat;
		background-size: cover;
		// min-height: calc(150vh - 7px);
		// min-height: calc(200vh - 2px);
		min-height: calc(200vh - 2px);
		zoom: .5;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	
	.tab {
		width: 100%;
		display: flex;
		height: 132px;
		background: linear-gradient(90deg,rgba(255,255,255,0.00), rgba(255,255,255,.12) 50%, rgba(255,255,255,0.00));
	}
	
	.tab>li {
		color: rgba(255,255,255,.5);
		width: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
	}
	
	.tab>li:first-child::after {
		content: '';
		background-color: rgba(255,255,255,.12);
		height: 36px;
		width: 1px;
		right: 0;
		position: absolute;
	}
	
	.tab>li.active span{
		color: rgba(255,255,255,.9);
	}
	
	.tab>li.active>.btm {
		width: 88px;
		height: 8px;
		position: absolute;
		bottom: 0;
		background: linear-gradient(128deg,#5af5de 12%, #4b90ef 88%);
		border-radius: 4px;
	}
	
	.sign-wrap {
		display: flex;
		margin-top: 120px;
	}
	
	.code-wrap {
		margin-right: 80px;
		text-align: center;
	}
	
	.code-wrap-tip {
		margin-top: 24px;
	}
	
	.login-form {
		display: flex;
		flex-direction: column;
		width: 720px;
	}
	
	.login-inp {
		width: 100%;
		height: 104px;
		background: rgba(255,255,255,.12);
		border-radius: 20px;
		padding-left: 40px;
		margin-bottom: 56px;
		border: none;
		outline: none;
	}
	
	.login-btn {
		width: 100%;
		height: 120px;
		background: rgba(255,255,255,.12);
		border-radius: 20px;
		border: none;
		outline: none;
		margin-top: 43px;
	}
	
</style>
