<template>
	<div>
		<div class="search-wrap">
			<div class="icon-wrap">
				<i class="iconfont iconsousuo"></i>
			</div>
			<input type="text" class="search-input" v-model="text" placeholder="请输入关键字搜索">
			<div class="clear" @click="text = ''">
				<span>×</span>
			</div>
		</div>
		<div class="btn-wrap">
			<button class="search" @click="search">搜索</button>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				text: '',
				targetId:''
			}
		},
		methods:{
			search() {
				this.$api.setMsg({
					targetId:this.targetId,
					msg:this.text
				}).then(res => {
					console.log(res);
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
		margin:  20px 16px 0 16px;
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
