import React from 'react';
import { Toast } from 'native-base';

const Notice = (message, type, position='bottom', textButton='Okay') => {
    if (message === 'Request failed with status code 401') {
        message = 'Tidak ada akun aktif yang ditemukan dengan kredensial yang diberikan';
    } else {
        message;
    };

    return (
        Toast.show({
            text: message,
            position: position,
            type: type,
            buttonText: textButton,
            duration: 3000
        })
    );
}

export default Notice;