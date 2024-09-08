import { defineStore, createPinia } from 'pinia'
import { IUserInfo } from '@/api/types/common'
import { setItem, getItem } from '@/utils/storage'
import { USER } from '@/utils/constants'

// 创建pinia
export const store = createPinia()

const state = {
  count: 1,
  isCollapse: false,
  user: getItem<({ token: string } & IUserInfo) | null>(USER),
}

export type State = typeof state

export const indexStore = defineStore('index', {
  state: () => {
    return state
  },
  actions: {
    setIsCollapse(payload: boolean) {
      this.isCollapse = payload
    },
    setUser(user: ({ token: string } & IUserInfo) | null) {
      this.user = user
      setItem(USER, JSON.stringify(user))
    },
  },

  getters: {},
})
