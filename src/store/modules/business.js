const business = {
  state: {
    oldFileName:''
  },
  mutations: {
    SET_OLDFILENAME: (state, oldFileName) => {
      state.oldFileName = oldFileName
    },
  },
  actions: {
   addOldFileName({ commit, state }, oldFileName) {
       commit('SET_OLDFILENAME', oldFileName)
   },
  }
}

export default business
