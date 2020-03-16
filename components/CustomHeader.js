import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Dimensions } from 'react-native';
import StyleLayout from '../constants/Layout';
import { 
    Layout, 
    Text, 
    Button, 
    Icon 
} from '@ui-kitten/components';
import { ThemeContext } from '../constants/theme-context';
import { updateUser, getNewToken, removeUserData, setAccount } from '../redux/actions';

const IconBack = () => (
    <Icon
        name='arrow-back'
        width={25}
        height={25}
        fill={ThemeContext._currentValue.theme==='light'?'black':'white'}
    />
)

const IconCheckmark = () => (
    <Icon 
        name='checkmark' 
        width={25} 
        height={25} 
        fill={ThemeContext._currentValue.theme==='light'?'black':'white'}
    />
)

const ButtonLeft = (props) => (
    <Button
        {...props}
        status='primary'
        appearance='ghost'
        icon={IconBack}
        style={{
            width: 35,
            height: 35,
            borderRadius: 20,
            padding: 10,
            shadowOpacity: 4,
            shadowColor: 'grey',
            shadowOffset: { width: 10, height: 10 },
        }}
    />
)

const ButtonRight = (props) => (
    <Button
        icon={IconCheckmark} 
        appearance='ghost'
        status='primary'
        style={{
            width: 35,
            height: 35,
            borderRadius: 20,
            padding: 10,
        }}
        {...props}
    />
)

const mapStateToProps = (state) => {
    return {
        id: state.auth.id,
        username: state.auth.username,
        password: state.auth.password,
        received_token: state.auth.receive_token,
        token: state.auth.token,
        id: state.auth.id,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setAccount: (args) => (
            dispatch(setAccount(args))
        ),
    }
}

class connectCustomHeader extends Component {
    constructor(props) {
        super(props);

        this.handlePress = this.handlePress.bind(this);
    }

    isNotNullUndefined = (args) => (
        args !== null && args !== undefined
    );

    isNotExpired = () => {
        const { received_token } = this.props
        const token_date = Date(received_token)
        let now = new Date();
        return now.getDate() === new Date(token_date).getDate() && (
            now.getMinutes() - new Date(token_date).getMinutes()
        ) < 5
    }

    isGt3 = (args) => (
        args > 3
    );

    handleExpired = () => {
        const data = {
            username: this.props.username,
            password: this.props.password,
        }
        return getNewToken(data)
    }

    
    handlePress = () => {

        // let phone = params.phoneValue !== undefined? params.phoneValue(): false;
        // let gt_3  = phone.length>3;
        // let confirm = (
        //     `Nomor: ${phone}\nType: ${params.type}\nDial code: ${params.dialcode}\n\nApakah nomor tersebut benar?`
        // );
        // return Alert.alert(
        //     gt_3? 'Info': 'Peringatan',
        //     gt_3
        //     ? confirm
        //     : 'Nomor tidak boleh kosong',
        //     [
        //         gt_3?{text: 'Ubah', style: 'cancel'}: null,
        //         gt_3
        //         ? {text: 'Ya', onPress: () => {
        //             // verifyPhone(phone, params.token).then(res => alert(res)).catch(err => console.log(err))
        //             navigation.navigate('Verify', {
        //                 method: 'argumen 1'
        //             });
        //         }}
        //         : { text: 'OK' }
        //     ]
        // );
    }
    render() {
        let { navigation } = this.props;
        let { params } = navigation.state;
        return (
            <Layout level='1' style={styles.constainer}>
                <Layout style={{ marginLeft: 12 }}>
                    <ButtonLeft 
                        onPress={() => navigation.goBack()}
                    />
                </Layout>

                <Text category='h6' style={{ alignSelf: 'center'}}>
                    {this.props.title.includes('telepon')? 'Nomor baru': this.props.title}
                </Text>

                <Layout style={{ marginRight: Dimensions.get('screen').width / 7,  }} />
            </Layout>
        );
    };
};
const CustomHeader = connect(mapStateToProps, mapDispatchToProps)(connectCustomHeader)
export default CustomHeader;

const styles = StyleSheet.create({
    constainer: {
        flexDirection: 'row', 
        justifyContent: 'space-between',
        alignItems: 'center',
        height: StyleLayout.header,
        borderBottomWidth: 0.3,
        borderBottomColor: 'grey',
    }
})
