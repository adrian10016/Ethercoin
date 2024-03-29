import React, { Component } from 'react'
import { StyleSheet, Text, View, Image } from 'react-native'
import { Grid, Row, Col } from 'native-base'
import QRCode from 'react-native-qrcode-svg'

import { observer, inject } from 'mobx-react'

@inject("appCoinsStore")
@observer
export default class App extends Component {
  render() {
    const {coin} = this.props
    
    let symbol = ''
    let balance = 0
    let gbp = 0;
    let address = ''
    if(coin){
      symbol = coin.token_symbol
      balance = coin.balance
      gbp = coin.gbpPrice
      if(coin.wallet_symbol === 'BTC'){
        address = this.props.appCoinsStore.btcProvider.getAddress()
      } else {
        address = this.props.appCoinsStore.ethProvider.address()
      }
    }
    
    return (
      <View style={ styles.container }>
        {coin &&
          <View style={styles.QrImage}>
            <QRCode
              value={address}
              size = {200}
              />
          </View>
        }
        <Grid style={styles.InfoBox}>
          <Row style={styles.InfoRow}>
            <Col style={styles.InfoCol}><Text style={styles.InfoText}>{balance.toFixed(4)} {symbol}</Text></Col>
            <Col style={styles.InfoCol}><Text style={styles.InfoText}>{gbp.toFixed(4)} GBP</Text></Col>
          </Row>
        </Grid>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container:{ flex: 1, backgroundColor:"#fff", paddingTop:30, paddingBottom:30, paddingLeft:20, paddingRight:20, },
  QrImage:{ width:200, height:200, marginRight:"auto", marginLeft:"auto", marginBottom:50,  },
  InfoRow:{ flexDirection: 'row', justifyContent:"space-between",},
  InfoCol:{ width:"46%", shadowColor: '#000', elevation: 10, shadowOffset: { width: 0, height: 0 }, shadowOpacity:0.25, backgroundColor:"#fff", height:50,  paddingLeft:10, paddingRight:10, borderRadius:4,  },
  InfoText:{color:"#333333", fontSize:14, lineHeight: 50, },
});