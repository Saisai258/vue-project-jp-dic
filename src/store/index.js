import { createStore } from 'vuex'

export default createStore({
  state: {
    login:false, // This state variable can be used to track if the user is logged in
  },
  getters: {
    Get_Login_State(state) {
      return state.login; // Getter to access the login state
    }
  },
  mutations: {
    Login_State_Change(state) {
      state.login = !state.login; // Toggle the login state
      localStorage.setItem("token", state.login); // Store the login state in localStorage
      
    },
     Logout_State_Change(state) {
    state.login = false;
    localStorage.removeItem("token");
    localStorage.removeItem("authUser");
  },
    SET_USER(state, user) {
    state.user = user
    state.isAuthenticated = true
  }
  },
  actions: {
    LoginStateChange({commit}){
      commit('Login_State_Change')
    },
    LogoutStateChange({commit}) {
    commit('Logout_State_Change');
  }
  },
  modules: {
  }
})
