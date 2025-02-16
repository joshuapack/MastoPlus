import { mastodonentities } from './entities'

export namespace cuckoostore {

  export interface stateInfo {
    OAuthInfo: OAuthInfo
    mastodonServerUri: string
    currentUserAccount: mastodonentities.Account
    selectedUserAccount: mastodonentities.Account

    timelines: {
      home: Array<string>
      public: Array<string>
      direct: Array<string>
      local: Array<string>
      tag: {
        [index: string]: Array<string>
      }
      list: {
        [index: string]: Array<string>
      }
    }

    contextMap: {
      [statusId: string]: {
        ancestors: Array<string>
        descendants: Array<string>
      }
    }

    cardMap: {
      [statusId: string]: mastodonentities.Card
    }

    statusMap: {
      [statusId: string]: mastodonentities.Status
    }

    userStatusMap: Array<mastodonentities.Status>

    notifications: Array<mastodonentities.Notification>

    relationships: {
      [id: string]: mastodonentities.Relationship
    }

    customEmojis: Array<mastodonentities.Emoji>

    appStatus: {
      documentWidth: number
      isDrawerOpened: boolean
      isNotificationsPanelOpened: boolean
      isAccountModalOpened: boolean
      selectedAccountId: string
      unreadNotificationCount: number
      isEditingThemeMode: boolean
      shouldShowThemeEditPanel: boolean
      streamStatusesPool: {
        home: Array<string>
        public: Array<string>
        direct: Array<string>
        local: Array<string>
        tag: {
          [index: string]: Array<string>
        }
        list: {
          [index: string]: Array<string>
        }
      }
      settings: {
        multiLineMode: boolean
        maximumNumberOfColumnsInMultiLineMode: number
        showSensitiveContentMode: boolean
        postMediaAsSensitiveMode: boolean
        realTimeLoadStatusMode: boolean
        autoExpandSpoilerTextMode: boolean
        onlyMentionTargetUserMode: boolean
        theme: string,
        tags: Array<string>
        locale: string,
        postPrivacy: string
        muteMap: {
          statusList: Array<string>
          userList: Array<string>
        }
      }
    }
  }

  export interface OAuthInfo {
    clientId: string
    clientSecret: string
    accessToken: string
    code: string
  }

}
