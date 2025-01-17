//#region imports
//#region RN
import {Platform} from 'react-native';
//#endregion
//#region common files
import {APP_NAME} from '../utils/constants';
//#endregion
//#region third party libs
import firebase from '@react-native-firebase/app';
import AsyncStorage from '@react-native-community/async-storage';
import {images} from '../res/images';
import {onGetChat} from '../utils/svgImagesAction';
import messaging from '@react-native-firebase/messaging';
//#endregion
//#endregion
global.fcmToken = '';
global.isNotificationOpen = false;

class FCMService {
  register = (onRegister, onNotification, onOpenNotification) => {
    this.checkPermission(onRegister);
    this.createNoitificationListeners(
      onRegister,
      onNotification,
      onOpenNotification,
    );
  };
  requestPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (!enabled) {
      console.log('FCM Permission denied');
    }
  };

  getToken = async (callBack) => {
    try {
      const fcmToken = await messaging().getToken();
      if (fcmToken) {
        global.fcmToken = fcmToken;
        callBack && callBack(fcmToken);
      }
    } catch (error) {
      console.log('Failed to get FCM token:', error);
    }
  };

  deleteToken = async () => {
    try {
      await messaging().deleteToken();
      global.fcmToken = '';
    } catch (error) {
      console.log('Failed to delete FCM token:', error);
    }
  };


  createNotificationListeners = async callBack => {
    this.notificationListener = firebase
      .notifications()
      .onNotification(notification => {
        const localNotification = new firebase.notifications.Notification()
          .setNotificationId(notification._notificationId)
          .setTitle(notification._title)
          .setBody(notification._body)
          .setData(notification._data)
          .android.setSmallIcon('@mipmap/notification_app_icon')
          // .android.setLargeIcon("@mipmap/ic_launcher_round")
          .android.setChannelId(APP_NAME);

        const action = new firebase.notifications.Android.Action(
          'snooze',
          'ic_launcher',
          ' ',
        );
        action.setShowUserInterface(false);
        localNotification.android.addAction(action);

        const channel = new firebase.notifications.Android.Channel(
          APP_NAME,
          APP_NAME,
          firebase.notifications.Android.Importance.Max,
        );
        firebase.notifications().android.createChannel(channel);
        firebase
          .notifications()
          .displayNotification(localNotification)
          .catch(err => console.log('NotificationERROR=====', err));
      });

    firebase.notifications().onNotificationDisplayed(notification => {
      onGetChat();
      if (Platform.OS == 'ios') {
        firebase
          .notifications()
          .getBadge()
          .then(count => {
            count++;
            firebase.notifications().setBadge(0);
          })
          .then(() => {})
          .catch(error => {});
      }
    });
    /*
     * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
     * */
    this.notificationOpenedListener = firebase
      .notifications()
      .onNotificationOpened(async notificationOpen => {
        const {title, body, type} = notificationOpen.notification._data;
        let notificationType =
          Platform.OS === 'android'
            ? type
            : notificationOpen.notification._data['gcm.notification.type'];
        console.log(
          'notificationType notificationOpenedListener : ',
          notificationType,
        );
        try {
          if (notificationType !== undefined) {
            // if (notificationType === "3" || notificationType === "4" || notificationType === "6") {
            //     navigation.navigate('WorkoutSet');
            // } else if (notificationType === "5") {
            //     navigation.navigate('PerformanceScreen');
            // } else if (notificationType === "7") {
            //     navigation.navigate('PerformanceScreenFree');
            // }
            if (notificationType == 10) {
              console.log('notificationType');
              global.isNotificationOpen = true;
              callBack();
            }
          }
        } catch (error) {
          console.log('Error : ', error);
        }
      });

    /*
     * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
     * */
    const notificationOpen = await firebase
      .notifications()
      .getInitialNotification();
    if (notificationOpen) {
      const {title, body, type} = notificationOpen.notification._data;
      let notificationType =
        Platform.OS === 'android'
          ? type
          : notificationOpen.notification._data['gcm.notification.type'];
      console.log('notificationType notificationOpen: ', notificationType);
      try {
        // const notificationId = await AsyncStorage.getItem('notificationId');
        // if (notificationId !== notificationOpen.notification.notificationId) {
        if (notificationType !== undefined) {
          // if (notificationType === "3" || notificationType === "4" || notificationType === "6") {
          //     navigation.navigate('WorkoutSet');
          // } else if (notificationType === "5") {
          //     navigation.navigate('PerformanceScreen');
          // } else if (notificationType === "7") {
          //     navigation.navigate('PerformanceScreenFree');
          // }
          if (notificationType == 10) {
            console.log('notificationType');
            global.isNotificationOpen = true;
            callBack();
          }
        }
        // }
      } catch (error) {
        console.log('Error : ', error);
      }
    }
    /*
     * Triggered for data only payload in foreground
     * */
    this.messageListener = firebase.messaging().onMessage(message => {
      const localNotification = new firebase.notifications.Notification({
        show_in_foreground: false,
      })
        .setTitle(message._data.title)
        .setBody(message._data.body)
        .setData(message._data)
        .android.setSmallIcon('@mipmap/notification_app_icon')
        // .android.setLargeIcon("@mipmap/ic_launcher_round")
        // .android.setColor("#ffffff")
        .android.setPriority(firebase.notifications.Android.Priority.High)
        .android.setChannelId(APP_NAME)
        .android.setAutoCancel(true)
        .android.setBadgeIconType(
          firebase.notifications.Android.BadgeIconType.Large,
        )
        .setSound('default');

      const action = new firebase.notifications.Android.Action(
        'snooze',
        'ic_launcher',
        ' ',
      );
      action.setShowUserInterface(false);
      localNotification.android.addAction(action);

      const channel = new firebase.notifications.Android.Channel(
        APP_NAME,
        APP_NAME,
        firebase.notifications.Android.Importance.Max,
      );
      firebase.notifications().android.createChannel(channel);
      firebase
        .notifications()
        .displayNotification(localNotification)
        .catch(err => console.log('NotificationERROR=====', err));
    });
  };

  buildChannel = obj => {
    return new firebase.notifications.Android.Channel(
      obj.channelId,
      obj.channelName,
      firebase.notifications.Android.Importance.High,
    ).setDescription(obj.channelDes);
  };

  buildNotification = obj => {
    const localNotification = new firebase.notifications.Notification({
      //  show_in_foreground: false,
    })
      .setNotificationId(obj.dataId)
      .setTitle(obj.title)
      .setBody(obj.body)
      .setData(obj.data)
      .android.setSmallIcon('@mipmap/notification_app_icon')
      // .android.setLargeIcon("@mipmap/ic_launcher_round")
      // .android.setColor("#ffffff")
      .android.setPriority(firebase.notifications.Android.Priority.High)
      .android.setChannelId(APP_NAME)
      .android.setAutoCancel(true)
      .android.setBadgeIconType(
        firebase.notifications.Android.BadgeIconType.Large,
      )
      .setSound('default');

    const action = new firebase.notifications.Android.Action(
      'snooze',
      'ic_launcher',
      ' ',
    );
    action.setShowUserInterface(false);
    localNotification.android.addAction(action);

    const channel = new firebase.notifications.Android.Channel(
      APP_NAME,
      APP_NAME,
      firebase.notifications.Android.Importance.Max,
    );
    firebase.notifications().android.createChannel(channel);
    firebase
      .notifications()
      .displayNotification(localNotification)
      .catch(err => console.log('Notification Error', err));
  };

  scheduleNotification = (scheduleTime, setNumber) => {
    let notification = new firebase.notifications.Notification();
    notification
      .setSound('default')
      .setNotificationId('SUMMARY_ID')
      .setTitle('Test schedule notifications 🔥')
      .setData({
        title: 'value1',
        body: 'value2',
      });
    if (Platform.OS === 'android') {
      notification.android
        .setChannelId(APP_NAME)
        .android.setPriority(firebase.notifications.Android.Priority.Max);
    }
    firebase
      .notifications()
      .scheduleNotification(notification, {
        fireDate: scheduleTime,
      })
      .catch(err => console.log(err));
  };

  displayNotification = notification => {
    firebase
      .notifications()
      .displayNotification(notification)
      .catch(error => {
        console.log('Display Notification error', error);
      });
  };

  removeDelieveredNotification = notification => {
    firebase
      .notifications()
      .removeDeliveredNotification(notification.notificationId);
  };
}
export const fcmService = new FCMService();
