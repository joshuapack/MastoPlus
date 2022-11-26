<template>
    <mu-dialog dialog-class="account-modal-container"
               v-if="isDialogOpening"
               :open.sync="isDialogOpening" overlay-color="rgba(0,0,0,0.8)"
               :overlay-opacity="1" @close="onTryCloseDialog" :transition="transition"
               :width="dialogWidth" :fullscreen="shouldDialogFullScreen" v-loading="isLoading">
  
      <div class="dialog-header">
        <div class="left-area">
            <mu-button icon @click="onTryCloseDialog">
              <mu-icon value="close"></mu-icon>
            </mu-button>
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
            <img :src="selectedUserAccount.header">
        </div>
        <mu-avatar class="selected-user-avatar" slot="avatar" size="100">
          <img :src="selectedUserAccount.avatar">
        </mu-avatar>
        <div class="description">
          <div class="user-and-status-info">
            <a class="user-name primary-read-text-color" :href="selectedUserAccount.url" v-html="selectedUserAccount.display_name" target="_blank"></a>
          </div>
          <div><a :href="selectedUserAccount.url" target="_blank">@{{selectedUserAccount.acct}}</a></div>
          <div v-html="selectedUserAccount.note"></div>
        </div>
  
        <div class="bottom-area">
        </div>
      </section>
  
      <footer v-if="!shouldDialogFullScreen">
      </footer>
  
    </mu-dialog>
  </template>
  
  <script lang="ts">
    import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
    import { State, Getter, Action } from 'vuex-class';
    import { UiWidthCheckConstants } from '@/constant';
    import { mastodonentities } from "../interface";
  
    @Component({
      components: {
      }
    })

    class AccountModal extends Vue {
  
      isLoading: boolean = false
  
      @Prop() open: boolean
  
      @Prop() close: Function

      @Prop() userId: string

      @Action('followAccountById') followAccountById
      @Action('unFollowAccountById') unFollowAccountById
      @Action('updateRelationships') updateRelationships
  
      @State('selectedUserAccount') selectedUserAccount
      
      @State('currentUserAccount') currentUserAccount
  
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
  
      async onTryCloseDialog () {
        this.closeDialog()
      }

      async getAccountInfo () {
        this.isLoading = true;
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

      shouldShowFollowOperateBtn (account: mastodonentities.Account, operateType: string) {
        let typeCheckOK = false
        if (operateType === 'FOLLOW') {
          typeCheckOK = this.relationships[account.id] && !this.relationships[account.id].following
        } else if (operateType === 'UN_FOLLOW') {
          typeCheckOK = this.relationships[account.id] && this.relationships[account.id].following
        }
        if (account.id === this.currentUserAccount.id) return undefined
        return typeCheckOK
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
            overflow: hidden;
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
  
        .bottom-area {
          display: flex;
          justify-content: space-between;
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

      .mu-dialog-body {
        padding: 0;
      }

      .follow-action {
        cursor: pointer;
      }
    }
  
  </style>
  