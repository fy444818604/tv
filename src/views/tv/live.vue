<template>
	<div>
		<ul class="live-type">
			<li v-for="(item,index) in type" :key="item+index" v-items @left="left(index)" @focus="menuChange(index)">
				<span>{{item.name}}</span>
				<span>{{item.num}}</span>
			</li>
		</ul>
		<live-box :live="liveList" :liveType="liveType"></live-box>
	</div>
</template>

<script>
	import liveBox from './component/live-box.vue'
	export default {
		data() {
			return {
				type:[
					{name:'全部',num:0,actvie:true,type:0},
					{name:'同步课堂',num:0,actvie:false,type:1},
					{name:'教研',num:0,actvie:false,type:2},
					{name:'会议',num:0,actvie:false,type:3},
				],
				current:1,
				total:0,
				liveList:[],
				live1:[],
				live2:[],
				live3:[],
				liveType:false
			}
		},
		components:{
			liveBox
		},
		created() {
			this.searchAll(0);
		},
		methods:{
			left(index) {
				if (index != 0) {
					let itemIndex = 0
					this.$service.items.map((v,i) => {
						if(v.id == this.$service.pointer.id) itemIndex = i-1
					})
					this.$service.move(this.$service.items[itemIndex])
				} 
			},
			setNum() {
				let num = [this.live1.length+this.live2.length+this.live3.length,this.live1.length,this.live2.length,this.live3.length]
				this.type.map((v,i) => {
					v.num = num[i]
				})
			},
			searchAll(val) {
				this.liveList = []
				this.live1 = []
				this.live2 = []
				this.live3 = []
				this.$api.getActiveLiving({
					pageNo:this.current,
					pageSize:10000,
					type:0
				}).then(res => {
					res.data.map(v => {
						if(v.eventType === 2){
							this.live1.push(v)
						}else if(v.eventType === 3) {
							this.live3.push(v)
						}else{
							this.live2.push(v)
						}
					})
					if(val == 0){
						this.liveList = res.data
					}else if(val == 1){
						this.liveList = this.live1
					}else if(val == 2){
						this.liveList = this.live2
					}else {
						this.liveList = this.live3
					}
					this.setNum()
				})
			},
			menuChange(index) {
				this.searchAll(index);
			}
		}
	}
</script>

<style lang="scss" scoped="scoped">
	@import "../../focus.scss";
	.live-type {
		display: flex;
	}
	
	.live-type>li {
		width: calc(25% - 25px);
		height: 132px;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-bottom: 40px;
		background-color: rgba(255,255,255,.12);
		margin-right: 36px;
		border-radius: 4px;
	}
	
	.live-type>li:last-child {
		margin-right: 0;
	}
	
	.live-type>li>span {
		font-size: 38px;
		font-weight: 700;
		color: rgba(255,255,255,0.90);
	}
	
	.live-type>li>span:first-child {
		margin-right: 20px;
	}
</style>
