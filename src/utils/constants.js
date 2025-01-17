//#region import
import {Dimensions, Alert, Platform, StatusBar} from 'react-native';
import {
  widthPercentageToDP as WP,
  heightPercentageToDP as HP,
} from 'react-native-responsive-screen';
//#endregion

var {height, width} = Dimensions.get('window');
export const hp = HP;
export const wp = WP;
export const DEVICE = {
  DEVICE_HEIGHT: height,
  DEVICE_WIDTH: width,
  ANDROID_DEVICE_HEIGHT:
    Platform.OS === 'android' && Platform.Version > 26
      ? Dimensions.get('screen').height - StatusBar.currentHeight
      : Dimensions.get('window').height,
};
export const DEVICE_OS = Platform.OS;
export const APP_NAME = 'Vove';
export const TOM_TOM_APIKEY = 'ryZLgRtTeBk03OtVAlBV27GVIQ8Widcj';
export const CHECKMOBI_APIKEY = 'EF85741D-AF09-4EEA-8885-BD5B4CF52923';
// export const CHECKMOBI_APIKEY = "4B873157-EA0D-4DBB-B0BA-EEA289C9463F";

export const SVGwidth = wp(90);
export const SVGheight = wp(40);

export const removeNonNumber = (string = '') => string.replace(/[^\d]/g, '');
export const removeLeadingSpaces = (string = '') => string.replace(/^\s+/g, '');
export const chapterNumber = 'chapterNumber';
export const levelNumber = 'levelNumber';
export const levelResult = 'levelResult';
export const chapterData = 'chapterData';
export function showAlert(msg) {
  Alert.alert(
    APP_NAME,
    '' + msg,
    [
      {
        text: 'OK',
        onPress: () => {},
      },
    ],
    {
      cancelable: false,
    },
  );
}

export const hArray = ['0', '1', '2', '3'];
export const minArray = [
  '0',
  '5',
  '10',
  '15',
  '20',
  '25',
  '30',
  '35',
  '40',
  '45',
  '50',
  '55',
];
