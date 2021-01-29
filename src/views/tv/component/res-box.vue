<template>
	<ul class="model-row-4">
		<li v-for="(item,index) in res" v-items :key="item+index" @click="jump(item)" @down="down" @left="left(index)">
			<div class="play-icon">
				<div class="triangle"></div>
			</div>
			<div class="img-wrap">
				<img :src="item.pic == null?require('../../../assets/tv/demo.png'):`${host+item.pic}`" alt="">
			</div>
			<div class="res-name text-overflow">
				{{item.name}}
			</div>
		</li>
	</ul>
</template>

<script>
	export default {
		name:'res-box',
		props:{
			res:{
				type:Array
			}
		},
		data() {
			return {
				host:process.env.VUE_APP_SOURCEURL
			}
		},
		methods: {
			jump(item) {
				if(event.which != 13) return
				let query;
				if(item.type == 1){
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
			down() {
				this.$service.move('down')
				// this.$service.pointer.$el.scrollIntoView(false)
			}
		}
	}
</script>

<style lang="scss" scoped="scoped">
	@import "../../../focus.scss";
	.model-row-4 {
		display: flex;
		flex-wrap: wrap;
	}
	
	.model-row-4>li {
		margin-right: 36px;
		margin-bottom: 20px;
		width:calc(25% - 30px);
		position: relative;
	}
	
	.model-row-4>li:nth-child(4n) {
		margin-right: 0;
	}
	
	.model-row-4>li>.img-wrap>img{
		width: 100%;
		height: 230px;
		object-fit: cover;
	}
	
	.model-row-4>li>.res-name{
		font-size: 30px;
		font-weight: 400;
		color: rgba(255,255,255,0.90);
		padding: 20px 0;
	}
</style>
