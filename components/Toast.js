import React from 'react';
import { ToastAndroid } from 'react-native';

const Toast = (props) => {
    if (props.visible) {
      ToastAndroid.showWithGravityAndOffset(
        props.message,
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50,
      );
      return null;
    }
    return null;
};

export default Toast;


// handleButtonToastPress = () => {
//     this.setState({
//         toastVisible: true,
//       }, () => {
//         this.hideToast();
//       });
// };

// hideToast = () => {
//     this.setState({
//         toastVisible: false,
//     });
// };