import React, { useState, useEffect, useContext } from 'react';
import Constants from 'expo-constants';
import { connect } from 'react-redux';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { 
    SafeAreaView, 
    StyleSheet, 
    AsyncStorage,
    Dimensions,
} from 'react-native';
import { 
    Layout, 
    Text, 
    Drawer, 
    Icon, 
    Avatar, 
    Toggle
} from '@ui-kitten/components';
import { DrawerItems } from 'react-navigation-drawer';

/* Component */
import Notice from './Notice';
import { axiosBase } from '../constants/Endpoint';
import { ThemeContext } from '../constants/theme-context';

import { USER_ACCOUNT } from '../constants/storageKey';

/**
 *  Redux 
 *  actions
 *  state
 *  dispatch 
 * */
import { setUsername, setProfile } from '../redux/actions';

const mapStateToProps = (state) => {
    return {
        token: state.auth.token,
        online: state.check.online,
        account: state.auth.account,
        profile: state.auth.profile,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setUsername: value => (
            dispatch(setUsername(value))
        ),
        setProfile: value => (
            dispatch(setProfile(value))
        )
    };
};

// Constants keys storage

// Component Render
const OnlineOffline = (params) => {
    if (params) {
        return (
            <Badge success style={{ height: 12 }} />
        )
    } else {
        return (
            <Badge danger style={{ height: 12 }} />
        );
    }
}

const connectCustomDrawContentComponent = (props) => {
    const [account, setAccount] = useState({});
    const [profile, setProfile] = useState({});

    // React Context
    const themeContext = useContext(ThemeContext);
    console.log(props.account)
    /**
     *  React Hook useEffect
     *  Get account from redux & Set account to local
     * */

    useEffect(() => {
        if (props.profile.length > 0) {
            setProfile({...props.profile[0]})
        }

        if (props.account.length > 0) {
            setAccount({...props.account[0]})
        }
    }, []);
    

    const onRouteSelect = (index) => {
        const { [index]: selectedTabRoute } = props.navigation.state.routes;
        props.navigation.navigate(selectedTabRoute.routeName);
        // const route = drawerData[index];
        // props.navigation.navigate(route.title);
    };
    
    
    const defaultAvatar = <Icon name='person' />
    const uName     = account !== undefined? (account.username? account.username: '') : '';
    const avatar    = props.account !== undefined? (
        props.account.avatar? <Avatar size='large' source={{ uri: props.account.avatar }} />: defaultAvatar
    ) : defaultAvatar;
    let hp          = props.account !== undefined? (props.account.phone_number? props.account.phone_number : '-') : '-';
    let hpNew       = `${hp.slice(0,3)} ${hp.slice(3,6)} ${hp.slice(6)}`;
     

    const Header = () => (
        <Layout level='2' style={[styles.layoutHeader, themeContext.theme === 'dark'? { backgroundColor: '#3366FF' }: null]}>
            <TouchableWithoutFeedback 
                style={styles.header} 
                onPress={() => props.navigation.navigate('Profile')}>
                {avatar}
                <Layout style={styles.column}>
                    <Text category='h6' numberOfLines={1}>{props.profile.nama_lengkap}</Text>
                    <Text category='s1' appearance='hint'>@{props.account.username}</Text>
                </Layout>
            </TouchableWithoutFeedback>
            <Layout style={styles.subHeader}>
                <Text category='s1' appearance='hint'>{props.account.email}</Text>
                <Text category='s1' appearance='hint'>{hpNew}</Text>
            </Layout>
        </Layout>
    );

    return (
        <SafeAreaView>
          <Layout style={styles.drawer}>
            {/* <Drawer
                data={drawerData}
                header={Header}
                onSelect={onRouteSelect}
            /> */}
            <Header />
            <DrawerItems 
                {...props}
                labelStyle={{ 
                    color: themeContext.theme === 'dark'? 'white': '#444444', 
                    fontSize: 17,
                    fontWeight: '600'
                }}
                activeTintColor={themeContext.theme === 'dark'? '#3366FF': '#6690FF'}
                inactiveTintColor='#8A9399'
                itemStyle={{ paddingLeft: 5 }}
            />

            {/* <Layout style={styles.layoutToogle}>
                <Toggle 
                    text={`${themeContext.theme[0].toUpperCase() + themeContext.theme.substr(1)}`}
                    textStyle={{ fontWeight: 'bold' }}
                    checked={themeContext.theme=='dark'}
                    onChange={themeContext.toggleTheme} 
                />
            </Layout> */}
          </Layout>
        </SafeAreaView>  
    );
};

CustomDrawContentComponent = connect(mapStateToProps, mapDispatchToProps)(connectCustomDrawContentComponent)
export default CustomDrawContentComponent;

const BASE_WIDTH        = Dimensions.get('window').width;
const BASE_HEIGHT       = Dimensions.get('window').height;
const STATUS_BAR_HEIGHT = Constants.statusBarHeight;
const PADDING           = 2;
const MARGIN            = 15;

const styles = StyleSheet.create({
    drawer: {
        height: BASE_HEIGHT
    },
    column: {
        // borderWidth: 1
        flexDirection: 'column', 
        padding: PADDING,
        marginLeft: MARGIN,
        backgroundColor: 'transparent',
    },
    header: {
        // borderWidth: 1,
        flexDirection: 'row', 
        paddingLeft: MARGIN,
    },
    layoutHeader: { 
        // borderWidth: 1,
        paddingTop: STATUS_BAR_HEIGHT * 2,
        paddingLeft: 15,
        height: (BASE_HEIGHT / 3),
        marginBottom: -4
    },
    subHeader: {
        // borderWidth: 1,
        paddingLeft: MARGIN,
        marginTop: MARGIN,
        backgroundColor: 'transparent'
    },
    layoutToogle: {
        position: 'absolute',
        bottom: MARGIN, 
        left: MARGIN + 5,
    }
});
