import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      name: '张三',
      age: 20,
    }
  },
  actions: {
    updateName(name: string) {
      this.name = name
    },
    updateAge(age: number) {
      this.age = age
    },
  },
  getters: {
    fullName: (state) => {
      return state.name + '丰'
    },
  },
})
