import { observable, action, computed } from 'mobx'
import BigNumber from 'bignumber.js'
import Config from './stores/Config'
import Constants from '../constants/constant'
import AppWalletsStore from './AppWalletsStore'
import AppCoinsStore from './AppCoinsStore'
import AppDS from './datasource/AppDS'
import MixpanelHandler from '../handler/MixpanelHandler'

class AppState {
    dataVersion = '1'
    @observable config = new Config('mainnet', Constants.INFURA_API_KEY)
    @observable defaultWallet = null // for web3 dapp
    @observable selectedWallet = null // for sending transaction
    @observable selectedToken = null // for sending transaction
    @observable selectedTransaction = null
    @observable rateETHDollar = new BigNumber(0)
    @observable rateBTCDollar = new BigNumber(0)
    @observable hasPassword = false
    @observable didBackup = false
    currentWalletIndex = 0
    currentBTCWalletIndex = 0
    @observable internetConnection = 'online' // online || offline
    @observable unpendTransactions = []
    @observable gasPriceEstimate = {
      slow: 2,
      standard: 10,
      fast: 60
    }
    @observable allowDailyUsage = null
  
    @observable currentCardIndex = 0
    lastestVersionRead = ''
    shouldShowUpdatePopup = true
    homeCarousel = null
    mixpanleHandler = null
  
    static TIME_INTERVAL = 20000
  
    constructor() {
      this.appWalletsStore = new AppWalletsStore()
      this.appCoinsStore = new AppCoinsStore()
    }
  
    startAllServices() {
      this.getRateETHDollar()
      this.getRateBTCDollar()
      this.getGasPriceEstimate()
    }
    
    initMixpanel() {
      this.mixpanleHandler = new MixpanelHandler()
    }
    
    @action setConfig = (cf) => { this.config = cf }
    @action setBackup = (isBackup) => { this.didBackup = isBackup }
    @action setSelectedWallet = (w) => { this.selectedWallet = w }
    @action setInternetConnection = (ic) => { this.internetConnection = ic }
    @action setselectedToken = (t) => { this.selectedToken = t }
    @action setSelectedTransaction = (tx) => { this.selectedTransaction = tx }
    @action setUnpendTransactions = (ut) => { this.unpendTransactions = ut }
    @action setLastestVersionRead = (lvr) => { this.lastestVersionRead = lvr }
    @action setShouldShowUpdatePopup = (isShow) => { this.shouldShowUpdatePopup = isShow }
    
    @action autoSetSelectedWallet() {
      const lastIndex = this.wallets.length - 1
      if (lastIndex < 0) this.setSelectedWallet(null)
  
      this.setSelectedWallet(this.wallets[lastIndex])
    }
  
    @action setHasPassword(hasPassword) {
      this.hasPassword = hasPassword
    }
  
    @action setCurrentWalletIndex(index) {
      this.currentWalletIndex = index
    }
  
    @action setAllowDailyUsage(isEnable) {
      this.allowDailyUsage = isEnable
      this.save()
    }
  
    @action setCurrentBTCWalletIndex(index) {
      this.currentBTCWalletIndex = index
      this.save()
    }
  
    @action async getRateETHDollar() {
      setTimeout(async () => {
        if (this.internetConnection === 'online') {
          // const rate = rs.data && rs.data.RAW && rs.data.RAW.ETH && rs.data.RAW.ETH.USD
  
          // if (rate.PRICE != this.rateETHDollar) {
          //   this.rateETHDollar = new BigNumber(rate.PRICE)
          // }
        }
      }, 100)
    }
  
    @action async getRateBTCDollar() {
      setTimeout(async () => {
        // const rate = rs.data && rs.data.RAW && rs.data.RAW.BTC && rs.data.RAW.BTC.USD
  
        // if (rate.PRICE != this.rateBTCDollar) {
        //   this.rateBTCDollar = new BigNumber(rate.PRICE)
        // }
      }, 100)
    }
  
    @action async getGasPriceEstimate() {
      setTimeout(async () => {
        if (this.config.network === Config.networks.mainnet && this.internetConnection === 'online') {
          // const data = typeof res.data === 'object'
          //   ? {
          //     slow: !isNaN(res.data.safeLow / 10) ? Math.floor(res.data.safeLow / 10) : 2,
          //     standard: !isNaN(res.data.average / 10) ? Math.floor(res.data.average / 10) : 10,
          //     fast: !isNaN(res.data.fastest / 10) ? Math.floor(res.data.fastest / 10) : 60
          //   }
          //   : this.gasPriceEstimate
  
          // this.gasPriceEstimate = data
        } else {
          this.gasPriceEstimate = {
            slow: 2,
            standard: 10,
            fast: 60
          }
        }
      }, 0)
    }
  
    @action setCurrentCardIndex(index) {
      this.currentCardIndex = index
    }
  
    @action async loadPendingTxs() {
    }
  
    @action async import(orgData) {
      const data = orgData
      this.config = new Config(data.config.network, data.config.infuraKey)
      this.hasPassword = data.hasPassword
      this.didBackup = data.didBackup
      this.currentWalletIndex = data.currentWalletIndex || 0
      this.currentBTCWalletIndex = data.currentBTCWalletIndex || 0
      this.shouldShowUpdatePopup = data.shouldShowUpdatePopup !== undefined ? data.shouldShowUpdatePopup : true
      this.lastestVersionRead = data.lastestVersionRead
      this.allowDailyUsage = data.allowDailyUsage
  
      await this.loadPendingTxs()
      await this.appWalletsStore.getWalletFromDS()
      await this.appCoinsStore.getCoinFromDS()
  
      if (this.wallets.length > 0) {
        this.setSelectedWallet(this.wallets[0])
      }
  
      this.rateETHDollar = new BigNumber(data.rateETHDollar || 0)
      this.rateBTCDollar = new BigNumber(data.rateBTCDollar || 0)
      this.gasPriceEstimate = data.gasPriceEstimate
    }
  
    @computed get isShowSendButton() {
      const idx = this.wallets.length
      const wallet = this.selectedWallet
      if (this.currentCardIndex === idx || !wallet) {
        return false
      }
      return wallet.canSendTransaction
    }
  
    @computed get networkName() {
      return this.config.network
    }
  
    @computed get wallets() {
      if (this.networkName !== Config.networks.mainnet) {
        const ethWallets = this.appWalletsStore.wallets.filter(w => w.type === 'ethereum')
        return ethWallets
      }
      return this.appWalletsStore.wallets
    }

    @computed get coins() {
      return this.appCoinsStore.coins
    }
  
    @computed get enableNotification() {
      if (this.wallets.length == 0) return true
      for (let i = 0; i < this.wallets.length; i++) {
        if (this.wallets[i].enableNotification) return true
      }
      return false
    }
  
    resetAppState() {
      this.config = new Config('mainnet', Constants.INFURA_API_KEY)
      this.setHasPassword(false)
      this.setBackup(false)
      this.currentWalletIndex = 0
      this.appWalletsStore.removeAll()
      this.appCoinsStore.removeAll()
    }
  
    save() {
      return AppDS.saveAppData(this.toJSON())
    }
  
    // for local storage: be careful with MobX observable
    toJSON() {
      return {
        dataVersion: this.dataVersion,
        config: this.config.toJSON(),
        defaultWallet: this.defaultWallet ? this.defaultWallet.address : null,
        selectedWallet: this.selectedWallet ? this.selectedWallet.address : null,
        selectedToken: this.selectedToken ? this.selectedToken.address : null,
        hasPassword: this.hasPassword,
        rateETHDollar: this.rateETHDollar.toString(10),
        rateBTCDollar: this.rateBTCDollar.toString(10),
        currentWalletIndex: this.currentWalletIndex,
        currentBTCWalletIndex: this.currentBTCWalletIndex,
        didBackup: this.didBackup,
        gasPriceEstimate: this.gasPriceEstimate,
        enableNotification: this.enableNotification,
        lastestVersionRead: this.lastestVersionRead,
        shouldShowUpdatePopup: this.shouldShowUpdatePopup,
        allowDailyUsage: this.allowDailyUsage
      }
    }
  }
  
  export default new AppState()
  