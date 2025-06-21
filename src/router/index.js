import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import KanjiSearchView from '@/views/KanjiSearchView.vue'
import KanjiDetailsView from '@/views/KanjiDetailsView.vue'
import GetAllUserListView from '@/views/GetAllUserListView.vue'
import RegisterView from '@/views/RegisterView.vue'
import JapaneseDicView from '@/views/JapaneseDicView.vue'
import JlptView from '@/views/JlptView.vue'
// import store from '@/store'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
   {
    path: '/login',
    component: LoginView
  },
  {
    path: '/allUser',
    name: 'allUser',
    component: GetAllUserListView
  },
  {
  path: '/register',
  name: 'register',
  component: RegisterView
},
  {
    path: '/jp',
    name: 'jp',
    component: KanjiSearchView
  },
  {
    path: '/jpDic',
    name: 'jpDic',
    component: JapaneseDicView
  },
  {
    path: '/jlpt',
    name: 'jlpt',
    component: JlptView
  },
  {
    path: '/details/:word',
    name: 'details',
    component: KanjiDetailsView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue'),
    meta: {
      requiresAuth: true // This route requires authentication
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const authUser = JSON.parse(localStorage.getItem('authUser'));
  
  if (to.meta.requiresAuth && !authUser) {
    next('/login');
  } else {
    next();
  }
});

router.beforeEach((to, from, next) => {
const login=localStorage.getItem("token") // Check login state from localStorage

  if(to.meta.requiresAuth && login) {
   next() 
  }
  else if(to.meta.requiresAuth && !login) {
    next("/login") // Redirect to login if not authenticated
  }
  else {
    next()
  }
}
)

export default router
