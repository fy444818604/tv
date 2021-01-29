<template>
	<div class="wrap">
		<div class="search-wrap">
			<div class="code-wrap">
				<div id="code"></div>
				<div class="code-tip">请使用微信扫描二维码进行搜索</div>
			</div>
			<div>
				<div class="searchText-wrap" v-items={default:true} @click="focus" @down="down1" @up="loseBlur" @left="loseBlur" @right="loseBlur">
					<div class="search-icon">
						<i class="iconfont iconsousuo"></i>
					</div>
					<input id="searchText" :disable="read" placeholder="请输入资源名称查询" class="searchText" type="text" v-model="searchText">
				</div>
				<ul class="search-list-wrap" id="scroll">
					<li v-for="(item,index) in list" class="text-overflow" @focus="domBlur" v-items :key="item+index" @click="jump(item)" @up="up(index)" @down="down(index)" @left="loseBlur" @right="loseBlur">
						{{item.name}}
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
	import QRCode from "qrcodejs2";
	export default {
		data() {
			return {
				qrcode: null,
				targetId: +new Date(),
				searchText:'',
				currentIndex:0,
				list:[],
				listAll:[],
				dom:null,
				flag:true,
				read:false
			}
		},
		methods: {
			getCode() {
				let host = window.location.href.split('/#/')
				let url = host[0] + '/#/phone/search?targetId='+this.targetId
				this.qrcode = new QRCode(document.getElementById('code'), {
					text: url,
					width: 476,
					height: 476,
					colorDark: "#000000",
					colorLight: "#ffffff",
					correctLevel: QRCode.CorrectLevel.H
				});
			},
			getList() {
				this.$api.getSearchList({
					targetId:this.targetId,
					id:+new Date()
				}).then(res => {
					if(!this.flag) return
					this.getList()
					if(res.data) {
						this.searchText = res.data
					}
				}).catch(() => {
					if(!this.flag) return
					setTimeout(() => {
						this.getList()
					},5000)
				})
			},
			getData() {
				this.$api.resSearch({
					searchStr:this.searchText,
					pageSize:100
				}).then(res => {
					this.currentIndex = 0
					this.listAll = res.data
					this.$nextTick(() => {
						this.getListData(this.currentIndex)
					})
				})
			},
			getListData(first) {
				if(first%4 == 3){
					this.list = this.listAll.slice(first-3,first+1)
				}else {
					this.list = this.listAll.slice(first,first+4)
				}
			},
			focus() {
				this.read = false
				this.$nextTick(() => {
					document.getElementById('searchText').focus()
				})
			},
			up(index) {
				this.domBlur()
				// this.read = true
				// let top = Number(this.dom.scrollTop) - 111 
				// this.dom.scrollTo(0,top)
				event.preventDefault()
				if(this.currentIndex != 0) {
					this.currentIndex--
					this.$nextTick(() => {
						if(index == 0) {
							this.getListData(this.currentIndex)
							this.$service.move(this.$service.items[4])
						}else {
							this.$service.move('up')
						}
					})
				}else {
					this.$service.move('up')
				}
			},
			down(index) {
				this.domBlur()
				event.preventDefault()
				// this.read = true
				// let top = Number(this.dom.scrollTop) + 111 
				// this.dom.scrollTo(0,top)
				if(this.currentIndex != this.listAll.length - 1) {
					this.currentIndex++
					if(index == 3){
						this.getListData(this.currentIndex)
						this.$service.move(this.$service.items[1])
					}else {
						this.$service.move('down')
					}
				}
			},
			down1() {
				this.domBlur()
				event.preventDefault()
				this.$service.move('down')
			},
			domBlur() {
				document.getElementById('searchText').blur()
			},
			loseBlur() {
				event.preventDefault()
			},
			jump(item) {
				let query;
				if(item.type == "1"){
					query = {
						resourceId:item.id
					}
				}else {
					query = {
						aid:item.id
					}
				}
				this.$router.push({
					path:'/activeDetail',
					query:query
				})
			}
		},
		created() {
			this.flag = true
		},
		mounted() {
			this.dom = document.getElementById('scroll')
			this.getCode()
			this.getList()
			this.$service.move(this.$service.pointer);
		},
		destroyed() {
			this.flag = false
		},
		watch: {
			searchText() {
				this.getData()
			}
		}
	}
</script>

<style lang="scss" scoped="scoped">
	@import "../../focus.scss";
	
	.wrap {
		padding: 3.066666rem 4.466666rem;
		background-image: url("../../assets/tv/bg.png");
		background-repeat: no-repeat;
		background-size: cover;
		// min-height: calc(150vh - 7px);
		// min-height: calc(200vh - 2px);
		min-height: calc(200vh - 2px);
		zoom: .5;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.iconsousuo {
		font-size: 36px;
		color: #FFFFFF;
	}
	
	.search-wrap {
		display: flex;
		
		.code-wrap {
			width: 680px;
			height: 680px;
			// border: 1px solid #707070;
			background: rgba(255,255,255,.12);
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			margin-right: 104px;
			
			.code-tip {
				font-size: 34px;
				font-weight: 400;
				color: rgba(255,255,255,0.50);
				margin-top: 41px;
			}
		}
		
		.searchText-wrap {
			display: flex;
			height: 100px;
			width: 720px;
			border-bottom: 2px solid rgba(255,255,255,0.60);
			
			.search-icon {
				display: flex;
				justify-content: center;
				align-items: center;
				width: 76px;
			}
			
			.searchText {
				width: calc(100% - 76px);
				background: transparent;
				border: none;
				outline: none;
				color: #FFFFFF;
			}
		}
		
		.search-list-wrap {
			margin-top: 40px;
			height: 538px;
			overflow: auto;
			width: 720px;
			
			&>li {
				padding: 20px 15px;
				font-size: 38px;
				color: rgba(255,255,255,0.70);
				font-weight: 400;
				margin-top: 20px;
			}
		}
	}
	
</style>
