import React, { Component } from 'react';
import { StyleSheet, View, ImageBackground, Image, TouchableOpacity, ScrollView} from 'react-native';
import { Text, CheckBox, } from 'native-base';
import { ethers } from 'ethers'

export default class RecoveryStepOneComponent extends Component {
    static navigationOptions = {
        header: null,
    };
    state = {
        mnemonic: null,
        mnemonicString: '',
    }
    async componentWillMount() {
        let mnemonicString = ethers.utils.HDNode.entropyToMnemonic(ethers.utils.randomBytes(16))
        let mnemonic = mnemonicString.split(' ')
        this.setState({ mnemonic, mnemonicString })
    }

    render() {
        const {goBack} = this.props.navigation;
        const { mnemonic, mnemonicString } = this.state
        let PhraseContainer;
        if(!mnemonic){
            PhraseContainer = <View style={ styles.PhraseContainer}/>   
        } else {
            PhraseContainer = <View style={ styles.PhraseContainer}>     
                <View style={ styles.PhraseCol}>
                    <View style={ styles.PhraseColList}>
                        <Text style={ styles.PhraseColNumber}>1</Text>
                        <Text style={ styles.PhraseColText}>{mnemonic[0]}</Text>
                    </View>
                    <View style={ styles.PhraseColList}>
                        <Text style={ styles.PhraseColNumber}>2</Text>
                        <Text style={ styles.PhraseColText}>{mnemonic[1]}</Text>
                    </View>
                    <View style={ styles.PhraseColList}>
                        <Text style={ styles.PhraseColNumber}>3</Text>
                        <Text style={ styles.PhraseColText}>{mnemonic[2]}</Text>
                    </View>
                    <View style={ styles.PhraseColList}>
                        <Text style={ styles.PhraseColNumber}>4</Text>
                        <Text style={ styles.PhraseColText}>{mnemonic[3]}</Text>
                    </View>
                    <View style={ styles.PhraseColList}>
                        <Text style={ styles.PhraseColNumber}>5</Text>
                        <Text style={ styles.PhraseColText}>{mnemonic[4]}</Text>
                    </View>
                    <View style={ styles.PhraseColList}>
                        <Text style={ styles.PhraseColNumber}>6</Text>
                        <Text style={ styles.PhraseColText}>{mnemonic[5]}</Text>
                    </View>        
                </View>

                <View style={ styles.PhraseCol}>
                    <View style={ styles.PhraseColList}>
                        <Text style={ styles.PhraseColNumber}>7</Text>
                        <Text style={ styles.PhraseColText}>{mnemonic[6]}</Text>
                    </View>
                    <View style={ styles.PhraseColList}>
                        <Text style={ styles.PhraseColNumber}>8</Text>
                        <Text style={ styles.PhraseColText}>{mnemonic[7]}</Text>
                    </View>
                    <View style={ styles.PhraseColList}>
                        <Text style={ styles.PhraseColNumber}>9</Text>
                        <Text style={ styles.PhraseColText}>{mnemonic[8]}</Text>
                    </View>
                    <View style={ styles.PhraseColList}>
                        <Text style={ styles.PhraseColNumber}>10</Text>
                        <Text style={ styles.PhraseColText}>{mnemonic[9]}</Text>
                    </View>
                    <View style={ styles.PhraseColList}>
                        <Text style={ styles.PhraseColNumber}>11</Text>
                        <Text style={ styles.PhraseColText}>{mnemonic[10]}</Text>
                    </View>
                    <View style={ styles.PhraseColList}>
                        <Text style={ styles.PhraseColNumber}>12</Text>
                        <Text style={ styles.PhraseColText}>{mnemonic[11]}</Text>
                    </View>
                </View>
            </View>
        }

        return (
            <View style={ styles.container }>
                <ImageBackground source={require('../assets/images/inner-header-bg.jpg')} style={styles.backgroundImage}>            
                    <TouchableOpacity onPress={() => goBack()}>
                        <Image style={styles.rightbutton} source={require('../assets/images/backbutton.png')} />
                    </TouchableOpacity>
                    <Text style={ styles.PageTitle}>Recovery Phrase</Text>      
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('RecoveryStepTwo', { mnemonicString })}>
                        <Image style={styles.leftbutton} source={require('../assets/images/forewordbutton.png')} />
                    </TouchableOpacity>      
                </ImageBackground>
        
                <ScrollView style={ styles.ScrollViewContainer}>
                
                    <View style={ styles.RecoveryContainer}>        
                        <Text style={ styles.RecoveryText}>Passphrase is very important as it is used to recover your wallet and funds <Text style={ styles.RecoveryTextBold}>in case your device is lost or stolen</Text></Text>
                        <Text style={ styles.RecoveryText2}>If you lose your recovery phrase, your wallet cannot be recovered.</Text>          
                    </View>
        
                    {PhraseContainer}

                    <View style={ styles.SafelyCol}>         
                        <CheckBox style={styles.SafelyCheckbox} checked={true} color="#2c32b2" />
                        <Text style={ styles.SafelyText}>have safely stored my recovery phrase</Text>
                    </View>
                </ScrollView>
            </View>
        );
    }
}
  
const styles = StyleSheet.create({
    container:{ flex: 1, backgroundColor:"#fff"},
    backgroundImage: { width:"100%", height:100, resizeMode: 'cover', flexDirection: 'row', justifyContent:"space-between"},
    PageTitle:{ textAlign:"center", lineHeight:120, color:"#fff", fontSize:20, fontWeight:"600", },
    rightbutton:{ marginLeft:20, marginTop:45},
    leftbutton:{ marginRight:20, marginTop:45},
    ScrollViewContainer:{ paddingTop:30, paddingLeft:20, paddingRight:20,},
    RecoveryText:{ textAlign:"center", color:"#000", fontSize:16, lineHeight:22, marginBottom:30 },
    RecoveryText2:{ textAlign:"center", color:"#e71629", fontWeight:"600", fontSize:16, lineHeight:22, marginBottom:30 },
    RecoveryTextBold:{ fontWeight:"600"},
    PhraseContainer:{ borderColor:"#6137a7", borderStyle:"dotted", borderWidth:1, borderRadius:10, paddingLeft:20, paddingRight:20, paddingTop:30, flexDirection: 'row', },
    PhraseCol:{ width:"50%", },
    PhraseColList:{ position:"relative", paddingLeft:65, minHeight:50, marginBottom:30},
    PhraseColNumber:{  fontFamily:"LatoRegular", position:"absolute", left:0, top:0, width:50, height:50, borderRadius:25, borderColor:"#6137a7", borderWidth:2, textAlign:"center", lineHeight:46, borderStyle:"solid", color:"#6137a7", fontSize:22, },
    PhraseColText:{ lineHeight:45, color:"#333333", fontSize:18, fontFamily:"LatoRegular", fontWeight:"500", },
    SafelyCol:{ flexDirection: 'row', marginBottom:50, paddingLeft:10, paddingTop:15,},
    SafelyCheckbox:{ borderColor:"#2c32b2", color:"#2c32b2", marginRight:10,},
    SafelyText:{ color:"#2c32b2", fontSize:14, marginLeft:5,}
});