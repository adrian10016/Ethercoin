import React, { Component } from 'react';
import { StyleSheet, Image, View, ImageBackground, TouchableOpacity, ScrollView } from 'react-native';
import { Container, Footer, FooterTab, Button,  Icon, Grid, Col, Text, Row, Picker  } from 'native-base';
import MainStore from '../appstores/MainStore';
import Constant from '../constants/constant';

export default class CoinDetailComponent extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedCoin: props.navigation.state.params.selectedCoin,
      coins: props.navigation.state.params.coins,
      transactions: []
    };
  }
  async componentWillMount() {
    const { selectedCoin } = this.state
    this.refresh(selectedCoin)
  }

  async refresh(selectedCoin){    
    this.setState({ selectedCoin })

    let transactions 
    if(selectedCoin.wallet_symbol === 'ETH'){
      let token_contract_address = selectedCoin.token_contract_address
      if(selectedCoin.token_symbol === 'ETH'){
        token_contract_address = ''
      }
      transactions = await MainStore.appState.appCoinsStore.ethProvider.getTxList(token_contract_address)
    } else {
      transactions = await MainStore.appState.appCoinsStore.btcProvider.getTxList()
    }
    // console.log('Transaction History', transactions)
    this.setState({ transactions })
  }
  async onValueChange(coin) {
    this.refresh(coin)
  }

  renderList(){
    let { transactions, selectedCoin } =this.state
    const contents = []
    if(transactions){
      transactions.forEach((item) =>{
        let renderItem
        const cost = selectedCoin.gbpPrice * item.amount
        item.amount = item.amount * 1
        if(item.state === Constant.TX_STATE_CONFIRMED){
          if(item.receive){
            renderItem = <Row key={item.timestamp} style={styles.TransactionRow} 
                onPress={() => this.props.navigation.navigate('TransactionDetailReceived', {transactionItem:item, selectedCoin})}>
              <Col style={styles.TransactionCol}>
                <View style={styles.TransactionStatus}>
                  <Text style={styles.TransactionStatusText}>Receive</Text>
                  <Image source={require('../assets/images/transaction-icon2.png')} style={styles.TransactionStatusIcon} /> 
                </View>
                <Grid style={styles.TransactionListGrid}>
                  <Row style={styles.TransactionListRow}>
                    <Col style={styles.TransactionListColLeft}>
                      <Text style={styles.TransactionDate}>{item.date}</Text>
                      <Text style={styles.TransactionListInfo}>{item.from.substring(0, 20) + '...'}</Text>
                    </Col>
                    <Col style={styles.TransactionListColRight}>
                      <Text style={styles.TransactionAmount1}>+ £ {cost.toFixed(2)}</Text>
                      <Text style={styles.ReceiveAmount}>+ <Icon name="bitcoin" type="FontAwesome5" style={styles.ReceiveAmountBitcoin} /> {item.amount.toFixed(8)} </Text>
                    </Col>
                  </Row>
                </Grid>
              </Col>
            </Row>
          } else {
            renderItem = <Row key={item.timestamp} style={styles.TransactionRow} 
              onPress={() => this.props.navigation.navigate('TransactionDetailSent', {transactionItem:item, selectedCoin})}>
              <Col style={styles.TransactionCol}>
                <View style={styles.TransactionStatus}>
                  <Text style={styles.TransactionStatusText}>Sent</Text>
                  <Image source={require('../assets/images/transaction-icon3.png')} style={styles.TransactionStatusIcon} /> 
                </View>
                <Grid style={styles.TransactionListGrid}>
                  <Row style={styles.TransactionListRow}>
                    <Col style={styles.TransactionListColLeft}>
                      <Text style={styles.TransactionDate}>{item.date}</Text>
                      <Text style={styles.TransactionListInfo}>{item.to.substring(0, 20) + '...'}</Text>
                    </Col>
                    <Col style={styles.TransactionListColRight}>
                      <Text style={styles.TransactionAmount1}>+ £ {cost.toFixed(2)}</Text>
                      <Text style={styles.SentAmount}>+ <Icon name="bitcoin" type="FontAwesome5" style={styles.SentAmountBitcoin} /> {item.amount.toFixed(8)} </Text>
                    </Col>
                  </Row>
                </Grid>
              </Col>
            </Row>
          }
        } else if(item.state === Constant.TX_STATE_PENDING){
          renderItem = <Row key={item.timestamp} style={styles.TransactionRow}>
            <Col style={styles.TransactionCol}>
              <View style={styles.TransactionStatus}>
                <Text style={styles.TransactionStatusText}>Pending</Text>
                <Image source={require('../assets/images/transaction-icon4.png')} style={styles.TransactionStatusIcon} /> 
              </View>
              <Grid style={styles.TransactionListGrid}>
                <Row style={styles.TransactionListRow}>
                  <Col style={styles.TransactionListColLeft}>
                    <Text style={styles.TransactionDate}>{item.date}</Text>
                    <Text style={styles.TransactionListInfo}>{item.to.substring(0, 20) + '...'}</Text>
                  </Col>
                  <Col style={styles.TransactionListColRight}>
                    <Text style={styles.TransactionAmount1}>+ £ {cost.toFixed(2)}</Text>
                    <Text style={styles.WaitAmount}>+ <Icon name="bitcoin" type="FontAwesome5" style={styles.WaitAmountBitcoin} /> {item.amount.toFixed(8)} </Text>
                  </Col>
                </Row>
              </Grid>
            </Col>
          </Row>
        } else {
          renderItem = <Row key={item.timestamp} style={styles.TransactionRow}>
            <Col style={styles.TransactionCol}>
              <View style={styles.TransactionStatus}>
                <Text style={styles.TransactionStatusText}>Failed</Text>
                <Image source={require('../assets/images/transaction-icon5.png')} style={styles.TransactionStatusIcon} /> 
              </View>
              <Grid style={styles.TransactionListGrid}>
                <Row style={styles.TransactionListRow}>
                  <Col style={styles.TransactionListColLeft}>
                    <Text style={styles.TransactionDate}>{item.date}</Text>
                    <Text style={styles.TransactionListInfo}>{item.to.substring(0, 20) + '...'}</Text>
                  </Col>
                  <Col style={styles.TransactionListColRight}>
                    <Text style={styles.TransactionAmount1}>+ £ {cost.toFixed(2)}</Text>
                    <Text style={styles.CancelAmount}>+ <Icon name="bitcoin" type="FontAwesome5" style={styles.CancelAmountBitcoin} /> {item.amount.toFixed(8)} </Text>
                  </Col>
                </Row>
              </Grid>
            </Col>
          </Row>
        }

        contents.push(renderItem)
      })
    }
    return contents
  }
  renderPickerItems(){
    const pickerItems = []
    const {coins} = this.state
    if(coins != null){
      coins.forEach(c => {
        const item = <Picker.Item key={c.token_symbol} label={c.token_symbol} value={c} />
        pickerItems.push(item)
      })
    }
    return pickerItems
  }

  render() {
    const {goBack} = this.props.navigation
    const { selectedCoin } = this.state
    const pickerItems = this.renderPickerItems()
    const listContents = this.renderList()
    let cost = selectedCoin.gbpPrice * selectedCoin.balance;

    return (
      <Container>
        <ScrollView style={ styles.ScrollViewContainer}>
          <View style={ styles.container }>
            <ImageBackground source={require('../assets/images/inner-header-bg2.jpg')} style={styles.backgroundImage}>            
              <View style={styles.HeaderTop}>
                <TouchableOpacity onPress={() => goBack()}>
                  <Image style={styles.rightbutton} source={require('../assets/images/backbutton.png')} />
                </TouchableOpacity>
                <View style={ styles.HeaderPicker}>
                  <Picker
                    mode="dropdown"
                    iosHeader="Select Coin"
                    iosIcon={<Icon name="caret-down" type="FontAwesome" style={styles.DownArrow} />}
                    style={ styles.PageTitle}
                    selectedValue={this.state.selectedCoin}
                    onValueChange={this.onValueChange.bind(this)}
                    textStyle={{ fontSize:18,color:"#fff",}}
                    >
                    {pickerItems}
                  </Picker>   
                </View>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('Settings')}>
                  <Image style={styles.leftbutton} source={require('../assets/images/icon2.png')} />
                </TouchableOpacity>
              </View>
              <View style={styles.HeaderBottom}>
                <Text style={styles.BalanceTitle}>{selectedCoin.balance.toFixed(4)} {selectedCoin.token_symbol}</Text>
                <View style={styles.BalanceValue}>
                  <Text style={styles.BalanceValueText}> £ {cost.toFixed(2)}</Text>
                </View>
              </View>
            </ImageBackground>
            <Text style={styles.TransactionTitle}><Image source={require('../assets/images/transaction-icon.png')} style={styles.transactionIcon} /> Transaction History</Text> 
            <Grid style={styles.TransactionList}>
              { listContents }
            </Grid>  
          </View>
        </ScrollView>
        {/* Footer start */}
        <Footer style={styles.Footer}>
          <FooterTab style={styles.FooterTab}>
            <ImageBackground source={require('../assets/images/tab-bg.jpg')} style={styles.Tabbackground}>
              <Button style={styles.TabButton} onPress={() => this.props.navigation.navigate('Main')}>
                <Image style={styles.TabButtonImage} source={require('../assets/images/icon3.png')} />
                <Text style={styles.TabButtonText}>WALLET</Text>
              </Button>
              <Button style={styles.TabButton} onPress={() => this.props.navigation.navigate('CoinDetailReceive')}>
              <Image style={styles.TabButtonImage} source={require('../assets/images/icon4.png')} />
                <Text style={styles.TabButtonText}>RECEIVE</Text>
              </Button>
              <Button style={styles.TabButton} onPress={() => this.props.navigation.navigate('CoinDetailSend')}>
              <Image style={styles.TabButtonImage} source={require('../assets/images/icon5.png')} />
                <Text style={styles.TabButtonText}>SEND</Text>
              </Button>
              <Button style={styles.TabButton} onPress={() => this.props.navigation.navigate('ShapeshiftExchange')}>
              <Image style={styles.TabButtonImage} source={require('../assets/images/icon6.png')} />
                <Text style={styles.TabButtonText}>EXCHANGE</Text>
              </Button>
            </ImageBackground>
          </FooterTab>
        </Footer>
        {/* Footer End */}
      </Container>
    );
  }
}



const styles = StyleSheet.create({
  container:{ flex: 1, backgroundColor:"#fff"},
  backgroundImage: { width:"100%", height:185, resizeMode: 'cover',},
  HeaderTop:{ flexDirection: 'row', justifyContent:"space-between", },
  HeaderPicker:{ display:"flex",  borderColor:"#fff", borderWidth:1, borderRadius:3, paddingLeft:0, paddingRight:0,
                  marginTop:40, marginBottom:30, height:35, width:100 }, 
  PageTitle:{ lineHeight:0, width:"100%", height:"100%",  margin: 0, 
              textAlign:"center", fontSize: 50, color:"#fff" },
  rightbutton:{ marginLeft:20, marginTop:40},
  leftbutton:{ marginRight:20, marginTop:40},
  HeaderBottom:{ textAlign:"center",},
  BalanceTitle:{ textAlign:"center", textTransform:"uppercase", color:"#fff", fontSize:30, },
  BalanceValue:{ textAlign:"center",  width:"100%",  flexDirection: 'row',  justifyContent: 'center', alignItems: 'center', },
  BalanceValueText:{ color:"#fff", fontSize:14,},
  DownIcon:{ display:"flex", },
  BalanceValueImage:{ marginRight:5, marginTop:10},
  Tabbackground:{ display:"flex", flexDirection: 'row', width:"100%", resizeMode: 'cover', padding:0, },
  TabButton:{ width:"25%", height:"100%", padding:0, borderRadius:0, backgroundColor:"transparent"  },
  tabBarActiveTextColor:{ backgroundColor:"#fff"},
  TabButtonText:{ color:"#fff", fontSize:10, fontWeight:"500",    },
  Footer:{ height:75, shadowColor: '#fff', shadowOffset: { width: 0, height: -20 }, shadowOpacity:1, },
  TabButtonImage:{ marginBottom:5,},
  DownArrow:{ color:"#fff", fontSize:18, marginLeft:-8, marginTop:-2},

  TransactionTitle:{ textAlign:"center", color:"#6737a6", fontWeight:"600", fontSize:20, marginTop:20, marginBottom:20, marginLeft:"auto", marginRight:"auto" },

  TransactionList:{ paddingLeft:20, paddingRight:20, },
  TransactionCol:{ backgroundColor:"#fff", borderRadius:8, position:"relative", marginBottom:20, paddingTop:10, elevation: 10,  paddingLeft:60, paddingRight:15, minHeight:65, shadowColor: '#000', shadowOffset: { width: 0, height: 0 }, shadowOpacity:0.3, },  
  TransactionStatus:{ position:"absolute", width:60, textAlign:"center", left:0, top:"50%",  marginTop:-15,  },
  TransactionStatusText:{ textAlign:"center", fontSize:10, color:"#808080", marginBottom:5  },
  TransactionStatusIcon:{ marginLeft:"auto", marginRight:"auto",  },
  TransactionListRow:{ flexDirection: 'row', justifyContent:"space-between",  },
  TransactionListColLeft:{ width:"49%", },
  TransactionListColRight:{ width:"49%", textAlign:"right", },
  TransactionDate:{ color:"#000117", fontSize:11, marginBottom:10,},
  TransactionTime:{ color:"#808080", fontSize:9, },
  TransactionListInfo:{ color:"#333333", fontSize:11, width:"100%", overflow:"hidden", height:16,   },
  TransactionAmount1:{ color:"#000117", fontSize:11, textAlign:"right", marginBottom:10,  },
  ReceiveAmount:{ color:"#6cb310", fontSize:11, textAlign:"right",  },
  ReceiveAmountBitcoin:{ fontSize:11, color:"#6cb310", },

  SentAmount:{ color:"#3849c8", fontSize:11, textAlign:"right",  },
  SentAmountBitcoin:{ fontSize:11, color:"#3849c8", },

  WaitAmount:{ color:"#ff9600", fontSize:11, textAlign:"right",  },
  WaitAmountBitcoin:{ fontSize:11, color:"#ff9600", },

  CancelAmount:{ color:"#fe001e", fontSize:11, textAlign:"right",  },
  CancelAmountBitcoin:{ fontSize:11, color:"#fe001e", },
});