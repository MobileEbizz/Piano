//#region import 
//#region RN
import React from 'react';
import { Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
//#endregion
//#region common files
import { hp, wp } from "../utils/constants";
import { colors } from '../res/colors';
import { fonts } from '../res/fonts';
//#endregion
//#region third party libs
import LinearGradient from 'react-native-linear-gradient';
import globalStyles from '../res/globalStyles';
//#endregion
//#endregion

export const AppButton = (props) => {
    return (
        // <TouchableOpacity activeOpacity={0.5} onPress={props.onPress} style={[{ alignSelf: 'center', padding: 0.1 }, props.style]} disabled={props.disabled}>
        //     <LinearGradient
        //         start={{ x: 1, y: 0 }}
        //         end={{ x: 0, y: 0 }}
        //         colors={props.disabled === undefined ? props.colors : (props.disabled ? [colors.GREY3, colors.GREY3] : [colors.GRADIENT1, colors.GRADIENT2])}
        //         style={[styles.linearGradient, props.linearGradient]}>
        //         <Text style={[styles.text, props.disabled === undefined ? props.txtStyle : { color: colors.WHITE }]}>{props.title}</Text>
        //     </LinearGradient>
        // </TouchableOpacity>
        <TouchableOpacity style={styles.btnContainer} onPress={() => props.onBtnClicked()}>
            <Image source={props.img} style={{ ...globalStyles.img, height: wp(10), width: wp(10), ...props.imgStyle }} />
        </TouchableOpacity>
    )
}
const styles = StyleSheet.create({
    btnContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    }
    // linearGradient: {
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     padding: hp('2%'),
    //     borderRadius: hp('5%'),
    //     width: wp('80%')
    // },
    // text: {
    //     fontFamily: fonts.VM,
    //     fontSize: wp('5.4%'),
    //     color: colors.BROWN
    // }
})