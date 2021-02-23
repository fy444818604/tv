<template>
	<div>
		<live-box :live="liveList"></live-box>
		<res-box :res="res"></res-box>
	</div>
</template>

<script>
	import liveBox from './component/live-box.vue'
	import resBox from './component/res-box.vue'
	export default {
		data(){
			return {
				current:1,
				type:this.$route.query.id || 1,
				res:[],
				liveList:[],
				total:0,
				flag:true
			}
		},
		components:{
			liveBox,
			resBox
		},
		watch:{
			$route: {
				handler: function(val, oldVal){
					this.current = 1
					this.res = []
					this.liveList = []
					this.total = 0
					this.type = val.query.id
					this.$nextTick(() => {
						this.search()
						this.live()
					})
				},
				// 深度观察监听
				deep: true
			}
		},
		methods:{
			search() {
				this.$api.getActivedAndRes({
					pageNo:this.current,
					pageSize:12,
					type: this.type
				}).then(res => {
					this.total = Number(res.totalDatas)
					this.res = [...this.res,...res.data]
					this.flag = true
				})
			},
			live() {
				if(this.type == 1){
					this.liveList = []
				}else [
					this.$api.getActiveLiving({
						pageNo:1,
						pageSize:7,
						type:this.type - 1
					}).then(res => {
						this.liveList = res.data
					})
				]
			}
		},
		created() {
			this.search()
			this.live()
		},
		mounted() {
			let scrollbarEl = this.$parent.$parent.$refs.wrap
			scrollbarEl.onscroll = () => {
				let scrollTop = scrollbarEl.scrollTop
				let scrollHeight = scrollbarEl.scrollHeight
				let clientHeight = window.innerHeight || document.documentElement.clientHeight
				if (scrollTop >= scrollHeight - clientHeight - 20 && this.flag) {
					this.flag = false
					this.current++
					this.$nextTick(() => {
						this.search()
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped="scoped">
</style>
