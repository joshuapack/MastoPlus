import * as Api from '@/api'
import { mastodonentities } from "@/interface"

const accounts = {
  async followAccountById ({ commit }, id: string) {
    try {
      const result = await Api.accounts.followAccountById(id)
      commit('updateRelationships', { [result.data.id]: result.data })
    } catch (e) {

    }
  },

  async unFollowAccountById ({ commit }, id: string) {
    try {
      const result = await Api.accounts.unFollowAccountById(id)
      commit('updateRelationships', { [result.data.id]: result.data })
    } catch (e) {

    }
  },

  async fetchAccountInfoById ({ commit }, id: string) {
    try {
      const result = await Api.accounts.fetchAccountInfoById(id)
      commit('updateSelectedUserAccount', result.data)
    } catch (e) {

    }
  },

  async fetchAccountStatuses ({ commit }, id: string) {
    try {
      return await Api.accounts.fetchAccountStatuses(id)
    } catch (e) {

    }
  },
}

export default accounts
