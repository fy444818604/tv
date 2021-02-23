<template>
	<div>
		<div class="flex-x-center">
			<div class="search-wrap">
				<div class="icon-wrap">
					<i class="iconfont iconsousuo"></i>
				</div>
				<input type="text" class="search-input" v-model="text" placeholder="请输入关键字搜索">
				<div class="clear" @click="text = ''">
					<span>×</span>
				</div>
			</div>
			<span @click="search()" style="margin-right: 16px;color: #4C84FF;">搜索</span>
		</div>
		<ul class="data-list">
			<li class="text-overflow" @click="setMsg(item)" v-for="(item,index) in listAll">{{item.name}}</li>
		</ul>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				text: '',
				targetId:'',
				listAll:[]
			}
		},
		methods:{
			search() {
				this.$api.resSearch({
					searchStr:this.text,
					pageSize:100
				}).then(res => {
					this.listAll = res.data
				})
			},
			setMsg(item) {
				let msg = {
					types:item.types,
					id:item.id
				}
				this.$api.setMsg({
					targetId:this.targetId,
					msg:JSON.stringify(msg)
				}).then(res => {
					this.text = ''
					this.listAll = []
				})
			}
		},
		mounted() {
			document.title = '搜索'
			this.targetId = window.location.href.split("targetId=")[1]
		}
	}
</script>

<style lang="scss" scoped="scoped">
	.data-list {
		height: 520px;
		overflow: auto;
	}
	
	.data-list>li {
		margin-left: 16px;
		padding-left: 12px;
		height: 52px;
		line-height: 52px;
		color: #303133;
		border-bottom: 1px solid #e4e7ed;
	}
	
	.search {
		height: 44px;
		background: #4c84ff;
		border-radius: 22px;
		width: 100%;
		outline: none;
		border: none;
		color: #FFFFFF;
	}
	
	.btn-wrap {
		padding: 40px 87px;
	}
	
	.search-wrap {
		width: calc(100% - 76px);
		margin:  20px 16px;
		height: 36px;
		background: #f5f5f5;
		border-radius: 18px;
		display: flex;
		align-items: center;
	}
	
	.search-input {
		border: none;
		outline: none;
		background: transparent;
		width: calc(100% - 61px);
	}
	
	.icon-wrap {
		display: flex;
		align-items: center;
		padding-left: 12px;
		padding-right: 6px;
	}
	
	.iconsousuo {
		color: #909399;
	}
	
	.clear {
		background: #909399;
		width: 16px;
		height: 16px;
		display: flex;
		justify-content: center;
		border-radius: 100%;
	}
	.clear>span {
		color: #FFFFFF;
		margin-top: -1px;
	}
</style>
