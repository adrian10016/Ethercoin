import React, { Component } from 'react';
import { StyleSheet, Text, View, ImageBackground, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Container, Footer, FooterTab, Grid, Col, Icon, Row, Input, Button } from 'native-base';
import MainStore from '../appstores/MainStore';
import * as changelly from '../api/changelly'
import { observer, inject } from 'mobx-react'

@inject("appCoinsStore")
@observer
export default class ShapeshiftExchangeComponent extends Component {
    static navigationOptions = {
        header: null,
    };
    constructor(props) {
        super(props);
        this.state = {
            isDropdownExchange: false,
            exchangeCoin: null,
            isDropdownReceive: false,
            receiveCoin: null,
            valueExchange: '',
            valueReceive: ''
        }
    }

    componentWillMount() {
        this.loadCoinData()
    }

    loadCoinData(){
        let coins = this.props.appCoinsStore.coins
        coins = coins.filter(c => c.isAdded === true)
        let exchangeCoin = null
        let receiveCoin = null
        if(coins != null && coins.length > 0){
            exchangeCoin = coins[0]
        }
        if(coins != null && coins.length > 1){
            receiveCoin = coins[1]
        }
        this.setState({ exchangeCoin, receiveCoin })
    }

    onNext(){
        console.log('onNext')
    }

    getExchnageAmount(){
        let params = {
            'from': this.state.exchangeCoin.token_symbol,
            'to': this.state.receiveCoin.token_symbol,
            'amount': 2
          }
          changelly.API('getExchangeAmount', params).then((res) => {
            console.log("Success", res)
            // let sample_response = {
            //   jsonrpc: "2.0",
            //   id: "test",
            //   result: "0.72596439091239070521"
            // }      
            // this.setState({second_input_amount: sample_response.result})
          }, error => {
            console.log("Failed", error)
          })
    }

    onUseAllFunds(){
        const {exchangeCoin } = this.state
        let valueExchange = exchangeCoin.balance
        // let valueReceive = 
        valueExchange = valueExchange + ''
        // valueReceive = valueReceive + ''
        this.setState({ valueExchange })
    }
    onChangeAmountExchange(valueExchange){
        this.setState({valueExchange})
    }
    onChangeAmountReceive(valueReceive){
        this.setState({valueReceive})
    }
    
    renderExchangeField(){
        const {exchangeCoin} = this.state
        let ret
        if(exchangeCoin){
            ret = <View>
                <Button style={styles.cryptoDropdown}
                    onPress={() => {
                        this.setState({ isDropdownExchange: true })
                    }}
                >
                    <Image style={styles.CryptoIcon} source={exchangeCoin.icon_path} />
                    <Text style={styles.cryptoDropdownText}>{exchangeCoin.token_name}</Text>
                    <Icon name="caret-down" type="FontAwesome5" style={styles.cryptoDropdownArrow} />
                </Button>
            </View>
        } else {
            ret = <View></View>
        }
        return ret
    }
    renderReceiveField(){
        const {receiveCoin} = this.state
        let ret
        if(receiveCoin){
            ret = <View>
                <Button style={styles.cryptoDropdown}
                onPress={() => {
                    this.setState({ isDropdownReceive: true })
                }}
                >
                    <Image style={styles.CryptoIcon} source={receiveCoin.icon_path} />
                    <Text style={styles.cryptoDropdownText}>{receiveCoin.token_name}</Text>
                    <Icon name="caret-down" type="FontAwesome5" style={styles.cryptoDropdownArrow} />
                </Button>
            </View>
        } else {
            ret = <View></View>
        }
        return ret
    }
    renderDropdownExchange(){
        let coins = this.props.appCoinsStore.coins
        coins = coins.filter(c => c.isAdded === true)

        let contents =[]
        if(coins){
            coins.forEach(c => {
                item = <Button style={styles.CryptoModalButton}
                        onPress={() => {
                            this.setState({
                                isDropdownExchange: false,
                                exchangeCoin: c
                            })
                        }}
                    >
                        <Image style={styles.CryptoModalIcon} source={c.icon_path} />
                        <Text style={styles.CryptoModalButtonText}>{c.token_name}</Text>
                    </Button>
                contents.push(item)
            })
        }
        return contents
    }
    renderDropdownReceive(){
        let coins = this.props.appCoinsStore.coins
        coins = coins.filter(c => c.isAdded === true)
        
        let contents =[]
        if(coins){
            coins.forEach(c => {
                item = <Button style={styles.CryptoModalButton}
                        onPress={() => {
                            this.setState({
                                isDropdownReceive: false,
                                receiveCoin: c
                            })
                        }}
                        >
                        <Image style={styles.CryptoModalIcon} source={c.icon_path} />
                        <Text style={styles.CryptoModalButtonText}>{c.token_name}</Text>
                    </Button>
                contents.push(item)
            })
        }
        return contents
    }

    render() {
        const { goBack } = this.props.navigation;
        const {exchangeCoin, receiveCoin, valueExchange, valueReceive} = this.state
        let exchangeHintText = ''
        let receiveHintText = ''
        if(exchangeCoin){
            exchangeHintText = exchangeCoin.token_symbol
        }
        if(receiveCoin){
            receiveHintText = receiveCoin.token_symbol
        }
        const dropdownExchange = this.renderDropdownExchange()
        const dropdownReceive = this.renderDropdownReceive()
        const exchangeField = this.renderExchangeField()
        const receiveField = this.renderReceiveField()
        
        return (
            <Container>
                <View style={styles.container}>
                    <ImageBackground source={require('../assets/images/inner-header-bg.jpg')} style={styles.backgroundImage}>
                        <TouchableOpacity onPress={() => goBack()}>
                            <Image style={styles.rightbutton} source={require('../assets/images/backbutton.png')} />
                        </TouchableOpacity>

                        <View style={styles.PageTitleBox}>
                            <Text style={styles.PageTitle}>Changelly</Text>
                            <Text style={styles.SubPageTitle}>Exchange</Text>
                        </View>

                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Settings')}>
                            <Image style={styles.leftbutton} source={require('../assets/images/icon2.png')} />
                        </TouchableOpacity>
                    </ImageBackground>
                    <ScrollView style={styles.ScrollViewContainer}>
                        <Text style={styles.ChangellyText1}>Select the coins you wisth to exchange. The converted coins will be automatically added to your wallet.</Text>
                        <Text style={styles.ChangellyText2}>Given rate includes transaction fee</Text>
                        <Grid style={styles.SelectGrid}>
                            <Col style={styles.GridCol}>
                                <Text style={styles.ColTitle}>Exchange</Text>
                                {exchangeField}
                            </Col>
                            <Col style={styles.GridCol}>
                                <Text style={styles.ColTitle}>Receive</Text>
                                {receiveField}
                            </Col>
                        </Grid>

                        <Grid style={styles.BTCGrid}>
                            <Row style={styles.BTCTextRow}>
                                <Col><Text style={styles.BTCPayText}>Amount</Text></Col>
                                <Col>
                                    <TouchableOpacity style={styles.BTCTextRight} onPress={() => this.onUseAllFunds()}>
                                        <Text style={styles.BTCLink}>Use all funds</Text>
                                    </TouchableOpacity>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Input
                                        value={valueExchange}
                                        onChangeText={(value) => this.onChangeAmountExchange(value)}
                                        keyboardType={'numeric'}
                                        style={styles.BTCTextarea} 
                                        placeholder={exchangeHintText} />
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Input
                                        value={valueReceive}
                                        onChangeText={(value) => this.onChangeAmountGBPField(value)}
                                        keyboardType={'numeric'}
                                        style={styles.BTCTextarea} 
                                        placeholder={receiveHintText} />
                                </Col>
                            </Row>
                        </Grid>

                        <Grid style={styles.PoweredGrid}>
                            <Row style={styles.PoweredRow}>
                                <Col style={styles.PoweredCol}><Text style={styles.PoweredText}>Powered by</Text><Image style={styles.TabButtonImage} source={require('../assets/images/Powered-icon.jpg')} /></Col>
                                <Col style={styles.PoweredColRight}>
                                    <TouchableOpacity onPress={() => this.onNext()} style={styles.PoweredButton}>
                                        <Text style={styles.PoweredButtonText}>Next</Text>
                                    </TouchableOpacity>
                                </Col>
                            </Row>
                        </Grid>
                    </ScrollView>
                </View>

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
                { this.state.isDropdownExchange && <View style={styles.CryptoModal}>
                    { dropdownExchange }
                </View>
                }

                { this.state.isDropdownReceive && <View style={styles.CryptoModal}>
                    { dropdownReceive }
                </View>
                }
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    backgroundImage: { width: "100%", height: 100, resizeMode: 'cover', flexDirection: 'row', justifyContent: "space-between" },
    PageTitleBox: { paddingTop: 36, },
    PageTitle: { textAlign: "center", color: "#fff", fontSize: 20, fontWeight: "600", },
    SubPageTitle: { textAlign: "center", color: "#fff", fontSize: 14 },
    rightbutton: { marginLeft: 20, marginTop: 45 },
    leftbutton: { marginRight: 20, marginTop: 45 },
    ScrollViewContainer: { paddingTop: 30, paddingLeft: 20, paddingRight: 20, },
    BTCGrid: { marginBottom: 30, },
    BTCTextRow: { flexDirection: 'row', justifyContent: "space-between", marginBottom: 15, },
    BTCPayText: { color: "#333333", fontSize: 16, },
    BTCLink: { textAlign: "right", color: "#2c32b2", fontSize: 16, },
    BTCTextarea: { backgroundColor: "#fff", borderRadius: 8, height: 50, color: "#757575", fontSize: 16, 
                marginBottom: 20, paddingTop: 5, paddingLeft: 20, elevation: 5, paddingRight: 20, 
                shadowColor: '#000', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.35, },
    ChangellyText1: { color: "#333333", fontSize: 16, lineHeight: 26, marginBottom: 20, },
    ChangellyText2: { color: "#333333", fontSize: 16, lineHeight: 26, marginBottom: 20, fontWeight: "600", },
    ColTitle: { color: "#757575", fontSize: 16, letterSpacing: 0.25, width: "100%", marginBottom: 5, },
    DownArrow: { color: "#757575", fontSize: 24, marginLeft: -5, marginTop: -2 },
    colPicker: { padding: 0, justifyContent: "flex-start", margin: 0, alignItems: "flex-start", textAlign: "left", width: "100%", borderWidth: 0, marginLeft: -8, },
    SelectGrid: { marginBottom: 25, },
    PoweredGrid: { marginBottom: 80, },
    PoweredRow: { flexDirection: 'row', justifyContent: "space-between", },
    PoweredCol: { flexDirection: 'row', alignItems: "center", },
    PoweredColRight: { textAlign: "right", lineHeight: 50, },
    PoweredText: { color: "#666666", fontSize: 16, marginRight: 15, },
    PoweredButton: { height: 50, width: 100, borderRadius: 8, backgroundColor: "#ebebeb", borderWidth: 1, borderColor: "#fff", marginLeft: "auto", },
    PoweredButtonText: { lineHeight: 45, textAlign: "center", color: "#2c32b2", fontSize: 16, letterSpacing: 0.50, },
    Tabbackground: { display: "flex", flexDirection: 'row', width: "100%", resizeMode: 'cover', padding: 0, },
    TabButton: { width: "25%", height: "100%", padding: 0, borderRadius: 0, backgroundColor: "transparent" },
    tabBarActiveTextColor: { backgroundColor: "#fff" },
    TabButtonText: { color: "#fff", fontSize: 10, fontWeight: "500", },
    Footer: { height: 75, shadowColor: '#fff', shadowOffset: { width: 0, height: -20 }, shadowOpacity: 1, elevation: 10, },
    TabButtonImage: { marginBottom: 5, },

    cryptoDropdown: { backgroundColor: "transparent", alignItems: "flex-start", textAlign: "left", justifyContent: "flex-start", },
    CryptoIcon: { width: 40, height: 40, marginRight: 10, },
    cryptoDropdownText: { lineHeight: 30, textAlign: "left", color: "#333333", fontSize: 16 },
    cryptoDropdownArrow: { color: "#757575", fontSize: 24, marginTop: 5, },
    CryptoModal: { position: "absolute", left: 0, top: 0, width: "100%", height: "100%", backgroundColor: "#fff", zIndex: 999, paddingTop: 40, paddingLeft: 20, paddingRight: 20, },
    CryptoModalButton: { backgroundColor: "transparent", alignItems: "flex-start", textAlign: "left", justifyContent: "flex-start", borderBottomColor: "#ededed", borderBottomWidth: 1, paddingTop: 15, paddingBottom: 15, height: 70, },
    CryptoModalButtonText: { lineHeight: 30, textAlign: "left", color: "#333333", fontSize: 18 },
    CryptoModalIcon: { width: 40, height: 40, marginRight: 20, },

});