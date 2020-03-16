import { Alert } from 'react-native';

export const MessageError = (args, onSubmit, rentry) => {
    switch (args) {
        case 'Request failed with status code 401':
            Alert.alert(
                'Gagal Masuk',
                'Nama pengguna dan / atau kata sandi Anda tidak cocok',[{
                    text: 'OK', onPress: () => console.log('pressed ok')
                }],
                {cancelable: false}
            );
            break;
        case 'Network Error':
            Alert.alert(
                'Kesalahan Jaringan',
                'Koneksi jaringan terputus',[{
                    text: 'OK',
                }],
                {cancelable: false}
            );
            break;
        default:
            Alert.alert(
                'Oops',
                'Ada yang salah. kami sedang berupaya memperbaiki ini semampu kami.'
                + ' Anda mungkin dapat mencoba lagi.',[{
                    text: 'Batal',
                },{
                    text: 'Coba lagi', onPress: () => {
                        {rentry}
                        {onSubmit()}
                        
                    }
                }],
                {cancelable: false}
            );
            break;
    };
};