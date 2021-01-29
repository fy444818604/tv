import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

const componentDetail3 = {
	path: "/component/detail/4",
	component: (resolve) => {
		require(['../views/tv/index'], resolve);
	},
	redirect:'/component/detail/4/active',
	children:[{
		path: "active",
		name: "active",
		component: (resolve) => {
			require(["../views/tv/active-list"], resolve);
		}
	},{
		path: "live",
		name: "live",
		component: (resolve) => {
			require(["../views/tv/live"], resolve);
		}
	}]
}

const tvPerson = {
	path: "/person",
	name:"person",
	component: (resolve) => {
		require(['../views/tv/person'], resolve);
	},
}

const tvActive = {
	path: "/activeDetail",
	name:"activeDetail",
	component: (resolve) => {
		require(['../views/tv/active/index'], resolve);
	},
}

const tvActiveDetail = {
	path: "/activeTip",
	name:"activeTip",
	component: (resolve) => {
		require(['../views/tv/active/detail'], resolve);
	},
}

const tvSearch = {
	path: "/search",
	name: "search",
	component: (resolve) => {
		require(['../views/tv/search'], resolve);
	},
}

const tvSign = {
	path: "/sign",
	name: "sign",
	component: (resolve) => {
		require(['../views/tv/sign'], resolve);
	},
}

const tvPhoneSearch = {
	path: "/phone/search",
	name: "phoneSearch",
	component: (resolve) => {
		require(['../views/tv/phone/search'], resolve);
	},
}

const router = new Router({
	base: "/",
	// mode: 'history',
	routes: [
		componentDetail3,
		tvPerson,
		tvActive,
		tvActiveDetail,
		tvSearch,
		tvPhoneSearch,
		tvSign
	]
});

router.beforeEach((to, from, next) => {
	console.log(to)
	if(Vue.prototype.isLogin && to.name != 'phoneSearch') {
		if(window.localStorage.getItem('token')){
			next();
		}else {
			if(to.name != 'sign'){
				next('/sign')
			}else {
				next()
			}
		}
	} else {
		next();
	}
})

export default router;
