<template>
  <mu-dialog
    dialog-class="account-modal-container"
    v-if="isDialogOpening"
    :open.sync="isDialogOpening" overlay-color="rgba(0,0,0,0.8)"
    :overlay-opacity="1" @close="onTryCloseDialog" :transition="transition"
    :width="dialogWidth" :fullscreen="shouldDialogFullScreen" v-loading="isLoading"
  >

    <div class="dialog-header">
      <div class="left-area">
        <mu-button icon @click="onTryCloseDialog">
          <mu-icon value="close"></mu-icon>
        </mu-button>
        <div v-if="selectedUserAccount.id === currentUserAccount.id" class="tags">Your Account</div>
        <div v-if="isFollowingYou()" class="tags">Follows You</div>
        <div v-if="isBlocking()" class="tags">Blocked</div>
        <div v-if="isBlockedBy()" class="tags">Being Blocked</div>
        <div v-if="isBlockedDomain()" class="tags">Blocked Server</div>
        <div v-if="isMuting()" class="tags">Muting</div>
        <div v-if="isMutingNotifications()" class="tags">Muting Notifications</div>
        <div v-if="isRequested()" class="tags">Requested</div>
        <div v-if="selectedUserAccount.bot" class="tags">Bot</div>
      </div>

      <div class="right-area">
        <div class="card-header-action">
          <mu-list-item-action v-if="shouldShowFollowOperateBtn(selectedUserAccount, 'FOLLOW')">
            <mu-icon @click.stop="onFollowingAccount()" class="follow-action" value="person_add" />
          </mu-list-item-action>
          <mu-list-item-action v-if="shouldShowFollowOperateBtn(selectedUserAccount, 'UN_FOLLOW')">
            <mu-icon @click.stop="onUnFollowingAccount()" class="follow-action secondary-theme-text-color" value="person_add_disabled" />
          </mu-list-item-action>
          <!-- <mu-icon class="header-icon" value="more_vert" /> -->
        </div>
      </div>
    </div>

    <section v-show="!isLoading">
      <div class="header-img-div">
          <img :src="selectedUserAccount.header" @click="shouldShowHeaderLightBox = true">
      </div>
      <mu-avatar class="selected-user-avatar" slot="avatar" size="100">
        <img :src="selectedUserAccount.avatar" @click="shouldShowAvatarLightBox = true">
      </mu-avatar>
      <div class="description">
        <div class="user-and-status-info">
          <a class="user-name primary-read-text-color" :href="selectedUserAccount.url" v-html="selectedUserAccount.display_name" target="_blank"></a>
        </div>
        <div><a :href="selectedUserAccount.url" target="_blank">@{{selectedUserAccount.acct}}</a></div>
        <div v-html="personalNote()"></div>
        <div v-html="selectedUserAccount.note"></div>
        <ul>
          <li v-for="field in selectedUserAccount.fields">
          <mu-icon class="check_mark" value="check_box" v-if="field.verified_at"></mu-icon> {{ field.name }} - <span v-html="field.value"></span>
          </li>
        </ul>
      </div>
      <div class="flex-container">
        <div>{{ selectedUserAccount.statuses_count }} Posts</div>
        <div>{{ selectedUserAccount.following_count }} Following</div>
        <div>{{ selectedUserAccount.followers_count }} Followers</div>
      </div>
      <div class="profile-posts">
        <div class="center">
          <mu-button color="primary" v-show="!showingPosts" @click="loadPosts">
            Show Posts
          </mu-button>
        </div>
        <mu-card class="statuses-container" v-loading="isLoadingPosts" v-show="showingPosts">
          <div v-for="status in userStatusMap" v-if="!isLoadingPosts">
            <status-card class="status-card-container" v-if="status" :status="status" />
          </div>
        </mu-card>
      </div>
      <div class="bottom-area center">
        <a :href="selectedUserAccount.url" target="_blank">Browse more on the original profile</a>
      </div>
    </section>

    <footer v-if="!shouldDialogFullScreen">
    </footer>

    <mu-dialog class="light-box" transition="fade" ref="lightBox"
              @click.native.stop="onLightBoxClick"
              :open.sync="shouldShowHeaderLightBox" :overlay-opacity="0.7">
      <mu-icon class="close-icon" value="close" @click="shouldShowHeaderLightBox = false"/>
      <div class="light-box-item" @click.stop="shouldShowHeaderLightBox = false">
        <img :src="selectedUserAccount.header"/>
      </div>
    </mu-dialog>

    <mu-dialog class="light-box" transition="fade" ref="lightBox"
              @click.native.stop="onLightBoxClick"
              :open.sync="shouldShowAvatarLightBox"
              :overlay-opacity="0.7">
      <mu-icon class="close-icon" value="close" @click="shouldShowAvatarLightBox = false"/>
      <div class="light-box-item" @click.stop="shouldShowAvatarLightBox = false">
        <img :src="selectedUserAccount.avatar"/>
      </div>
    </mu-dialog>

  </mu-dialog>
</template>

<script lang="ts">
  import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
  import { State, Getter, Action } from 'vuex-class';
  import { UiWidthCheckConstants } from '@/constant';
  import { mastodonentities } from "../interface";
  import StatusCard from '@/components/StatusCard'

  @Component({
    components: {
      'status-card': StatusCard,
    }
  })

  class AccountModal extends Vue {

    isLoading: boolean = false

    isLoadingPosts: boolean = false

    showingPosts: boolean = false

    statuses: Array<any> = []

    shouldShowHeaderLightBox: boolean = false

    shouldShowAvatarLightBox: boolean = false

    @Prop() open: boolean

    @Prop() close: Function

    @Prop() userId: string

    @Action('followAccountById') followAccountById
    @Action('unFollowAccountById') unFollowAccountById
    @Action('updateRelationships') updateRelationships
    @Action('fetchAccountStatuses') fetchAccountStatuses

    @State('selectedUserAccount') selectedUserAccount
    
    @State('currentUserAccount') currentUserAccount

    @State('userStatusMap') userStatusMap

    @Getter('shouldDialogFullScreen') shouldDialogFullScreen

    @Action('fetchAccountInfoById') fetchAccountInfoById

    @State('relationships') relationships: {
      [id: string]: mastodonentities.Relationship
    }

    get isDialogOpening () {
      return this.open
    }

    set isDialogOpening (val) {}

    @Watch('isDialogOpening')
    onDialogOpenChanged (isOpening) {
      if (isOpening === true) this.getAccountInfo()
    }

    get dialogWidth () {
      return this.shouldDialogFullScreen ? null : UiWidthCheckConstants.POST_STATUS_DIALOG_TOGGLE_WIDTH
    }

    get transition () {
      return this.shouldDialogFullScreen ? 'slide-bottom' : 'slide-top'
    }

    onLightBoxClick () { }

    async onTryCloseDialog () {
      this.closeDialog()
    }

    async getAccountInfo () {
      this.isLoading = true;
      this.isLoadingPosts = false
      this.showingPosts = false
      await this.fetchAccountInfoById(this.userId)
      await this.updateRelationships({ idList: [this.userId] })
      this.isLoading = false;
    }

    async onFollowingAccount () {
      this.isLoading = true
      await this.followAccountById(this.userId)
      this.isLoading = false
    }

    async onUnFollowingAccount () {
      this.isLoading = true
      await this.unFollowAccountById(this.userId)
      this.isLoading = false
    }

    async loadPosts () {
      this.isLoadingPosts = true
      this.showingPosts = true
      await this.fetchAccountStatuses(this.userId)
      this.isLoadingPosts = false
    }

    shouldShowFollowOperateBtn (account: mastodonentities.Account, operateType: string) {
      if (account.id === this.currentUserAccount.id) return undefined
      let typeCheckOK = false
      if (operateType === 'FOLLOW') {
        typeCheckOK = this.relationships[account.id] && !this.relationships[account.id].following
      } else if (operateType === 'UN_FOLLOW') {
        typeCheckOK = this.relationships[account.id] && this.relationships[account.id].following
      }
      return typeCheckOK
    }

    isFollowingYou () {
      if (this.selectedUserAccount.id === this.currentUserAccount.id) return undefined
      return this.relationships[this.selectedUserAccount.id] && this.relationships[this.selectedUserAccount.id].followed_by;
    }

    isBlocking () {
      if (this.selectedUserAccount.id === this.currentUserAccount.id) return undefined
      return this.relationships[this.selectedUserAccount.id] && this.relationships[this.selectedUserAccount.id].blocking;
    }

    isBlockedBy () {
      if (this.selectedUserAccount.id === this.currentUserAccount.id) return undefined
      return this.relationships[this.selectedUserAccount.id] && this.relationships[this.selectedUserAccount.id].blocked_by;
    }

    isBlockedDomain () {
      if (this.selectedUserAccount.id === this.currentUserAccount.id) return undefined
      return this.relationships[this.selectedUserAccount.id] && this.relationships[this.selectedUserAccount.id].domain_blocking;
    }

    isMuting () {
      if (this.selectedUserAccount.id === this.currentUserAccount.id) return undefined
      return this.relationships[this.selectedUserAccount.id] && this.relationships[this.selectedUserAccount.id].muting;
    }

    isMutingNotifications () {
      if (this.selectedUserAccount.id === this.currentUserAccount.id) return undefined
      return this.relationships[this.selectedUserAccount.id] && this.relationships[this.selectedUserAccount.id].muting_notifications;
    }

    isRequested () {
      if (this.selectedUserAccount.id === this.currentUserAccount.id) return undefined
      return this.relationships[this.selectedUserAccount.id] && this.relationships[this.selectedUserAccount.id].requested;
    }

    personalNote () {
      if (this.selectedUserAccount.id === this.currentUserAccount.id) return ''
      return this.relationships[this.selectedUserAccount.id] && this.relationships[this.selectedUserAccount.id].note;
    }

    closeDialog () {
      this.$emit('update:open', false)
    }
  }

  export default AccountModal
</script>

<style lang="less" scoped>
  .account-modal-container {

    .dialog-header {
      line-height: 1;
      display: flex;
      justify-content: space-between;
      padding: 16px 4px 8px 16px;

      .left-area {
        display: flex;
        align-items: center;
      }

      .right-area {
        display: flex;
        align-items: center;
        width: 48px;
        height: 48px;
      }
    }

    section {
      .header-img-div {
          height: 145px;
          position: relative;
          background: #1f232b;

          img {
              font-family: "object-fit:cover";
              object-fit: cover;
              display: block;
              width: 100%;
              height: 100%;
              margin: 0;
          }
      }

      .selected-user-avatar {
          position: relative;
          margin-top: -100px;
      }

      .description {
        padding: 10px;
      }

      .profile-posts {
        padding: 10px;
      }

      .center {
        text-align: center;
      }

      .bottom-area {
        padding: 10px;
      }

      .statuses-container {
        min-height: 100px;
      }

      .status-card-container {
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.3), 0 6px 20px 0 rgba(0, 0, 0, 0.25);
        margin-top: 20px;
      }

      @media (max-width: 530px) {
        height: calc(100% - 56px - 72px);
        display: flex;
        flex-direction: column;

        .selected-user-avatar {
            margin-top: -80px;
        }
      }
    }

    footer {
      display: flex;
      align-items: center;
      flex-direction: row-reverse;
      height: 57px;
    }
  }
</style>

<style lang="less">
  .account-modal-container {
    border-radius: 4px;
    max-height: 100vh;
    overflow-y: auto;

    .mu-dialog-body {
      padding: 0;
    }

    .follow-action {
      cursor: pointer;
    }
  }

  .light-box {
    .mu-dialog {
      background-color: transparent;
      max-width: unset;

      .close-icon {
        font-size: 46px;
        position: fixed;
        z-index: 1;
        right: 20px;
        top: 20px;
        cursor: pointer;
        color: #fff;
      }

      .mu-dialog-body {
        padding: 0;
        width: 100vw;
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;

        .light-box-item {
          img {
            max-width: 100vw;
            max-height: 80vh;
            width: auto;
            height: auto;
          }
        }
      }
    }
  }

</style>
  