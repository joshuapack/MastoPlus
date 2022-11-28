import Vue from 'vue'
import { getTargetStatusesList } from '@/util'
import { ThemeNames } from '@/constant'
import { cuckoostore } from '@/interface'
import ThemeManager from '@/themes'

export default {
  updateDrawerOpenStatus (state: cuckoostore.stateInfo, isDrawerOpened: boolean) {
    state.appStatus.isDrawerOpened = isDrawerOpened
  },

  updateNotificationsPanelStatus (state: cuckoostore.stateInfo, isNotificationsPanelOpened: boolean) {
    state.appStatus.isNotificationsPanelOpened = isNotificationsPanelOpened
  },

  updateAccountModalStatus (state: cuckoostore.stateInfo, isAccountModalOpened: boolean) {
    state.appStatus.isAccountModalOpened = isAccountModalOpened
  },

  updateSelectedAccountId (state: cuckoostore.stateInfo, selectedAccountId: string) {
    state.appStatus.selectedAccountId = selectedAccountId
  },

  updateUnreadNotificationCount (state: cuckoostore.stateInfo, count: number) {
    state.appStatus.unreadNotificationCount = count
  },

  updateDocumentWidth (state: cuckoostore.stateInfo) {
    state.appStatus.documentWidth = window.innerWidth
  },

  updateTheme (state: cuckoostore.stateInfo, newThemeName: string) {
    state.appStatus.settings.theme = newThemeName
    localStorage.setItem('theme', newThemeName)
  },

  updateTags (state: cuckoostore.stateInfo, newTags: Array<string>) {
    Vue.set(state.appStatus.settings, 'tags', newTags)
    localStorage.setItem('tags', JSON.stringify(newTags))
  },

  updateMultiLineMode (state: cuckoostore.stateInfo, newMode: boolean) {
    state.appStatus.settings.multiLineMode = newMode
    localStorage.setItem('multiLineMode', JSON.stringify(newMode))
  },

  updateShowSensitiveContentMode (state: cuckoostore.stateInfo, newMode: boolean) {
    state.appStatus.settings.showSensitiveContentMode = newMode
    localStorage.setItem('showSensitiveContentMode', JSON.stringify(newMode))
  },

  updateRealTimeLoadStatusMode (state: cuckoostore.stateInfo, newMode: boolean) {
    state.appStatus.settings.realTimeLoadStatusMode = newMode
    localStorage.setItem('realTimeLoadStatusMode', JSON.stringify(newMode))
  },

  updateLocale (state: cuckoostore.stateInfo, newLocale: string) {
    state.appStatus.settings.locale = newLocale
    localStorage.setItem('locale', newLocale)
  },

  updateMuteStatusList (state: cuckoostore.stateInfo, statusId: string) {
    const statusList: Array<string> = state.appStatus.settings.muteMap.statusList
    if (statusList.indexOf(statusId) === -1) statusList.push(statusId)
    localStorage.setItem('statusMuteList', JSON.stringify(statusList))
  },

  updateMuteUserList (state: cuckoostore.stateInfo, userId: string) {
    const userList: Array<string> = state.appStatus.settings.muteMap.userList
    if (userList.indexOf(userId) === -1) userList.push(userId)
    localStorage.setItem('userMuteList', JSON.stringify(userList))
  },

  unShiftStreamStatusesPool (state: cuckoostore.stateInfo, { newStatusIdList, timeLineType, hashName }) {
    const targetStatusesPool = getTargetStatusesList(state.appStatus.streamStatusesPool, timeLineType, hashName)
    newStatusIdList = newStatusIdList.filter(id => {
      return targetStatusesPool.indexOf(id) === -1
    })

    targetStatusesPool.unshift(...newStatusIdList)
  },

  clearStreamStatusesPool (state: cuckoostore.stateInfo, { timeLineType, hashName }) {
    const targetStatusesPool = getTargetStatusesList(state.appStatus.streamStatusesPool, timeLineType, hashName)
    targetStatusesPool.splice(0, targetStatusesPool.length)
  },

  updatePostPrivacy (state: cuckoostore.stateInfo, newPostPrivacy: string) {
    state.appStatus.settings.postPrivacy = newPostPrivacy
    localStorage.setItem('postPrivacy', newPostPrivacy)
  },

  updatePostMediaAsSensitiveMode (state: cuckoostore.stateInfo, newMode: boolean) {
    state.appStatus.settings.postMediaAsSensitiveMode = newMode
    localStorage.setItem('postMediaAsSensitiveMode', JSON.stringify(newMode))
  },

  updateOnlyMentionTargetUserMode (state: cuckoostore.stateInfo, newMode: boolean) {
    state.appStatus.settings.onlyMentionTargetUserMode = newMode
    localStorage.setItem('onlyMentionTargetUserMode', JSON.stringify(newMode))
  },

  updateMaximumNumberOfColumnsInMultiLineMode (state: cuckoostore.stateInfo, newNumber: number) {
    state.appStatus.settings.maximumNumberOfColumnsInMultiLineMode = newNumber
    localStorage.setItem('maximumNumberOfColumnsInMultiLineMode', JSON.stringify(newNumber))
  },

  updateAutoExpandSpoilerTextMode (state: cuckoostore.stateInfo, newMode: boolean) {
    state.appStatus.settings.autoExpandSpoilerTextMode = newMode
    localStorage.setItem('autoExpandSpoilerTextMode', JSON.stringify(newMode))
  },

  updateIsEditingThemeMode (state: cuckoostore.stateInfo, newMode: boolean) {
    state.appStatus.isEditingThemeMode = newMode
    state.appStatus.shouldShowThemeEditPanel = newMode
  },

  updateShouldShowThemeEditPanel (state: cuckoostore.stateInfo, show: boolean) {
    state.appStatus.shouldShowThemeEditPanel = show
  }
}
