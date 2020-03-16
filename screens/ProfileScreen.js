import React, { useState, useEffect, useContext } from 'react';
import { connect } from 'react-redux';
import Constants from 'expo-constants';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import Axios from 'axios';

import { 
    Dimensions,
    StyleSheet, 
    ImageBackground, 
    Image,
    Animated,
    ScrollView,
    FlatList,
    StatusBar,
    TouchableOpacity,
    SafeAreaView,
    View,
    SectionList,
    ActivityIndicator
} from 'react-native';
import {
    Layout,
    Text,
    Menu,
    Avatar,
    Button,
    Icon,
    List,
    ListItem,
} from '@ui-kitten/components';

// Component
import TopNavigationMenu from '../components/TopNavigationMenu';
import { ThemeContext } from '../constants/theme-context';
import { isTokenExp, isTokenRefreshExp, refreshToken, getNewToken } from '../redux/actions/tokenAction';
import { updateUser, setAccount, setLoading, setToken, setTokenRefresh } from '../redux/actions';
import { BaseURL } from '../constants/Endpoint';


const AnimatedSectionList = Animated.createAnimatedComponent(SectionList);

const STATUS_BAR_HEIGHT = Constants.statusBarHeight;
const BASE_HEIGHT       = Dimensions.get('screen').height;
const BASE_WIDTH        = Dimensions.get('screen').width;
const HEADER_MAX_HEIGHT = 147;
const HEADER_MIN_HEIGHT = 80;
const ICON_SIZE         = 50; 
const AVATAR_MAX_SIZE   = 60;
const ANTI_FLASH_WHITE = '#FFFFFF';


/**
 * Redux
 *  state
 */
const mapStateToProps = (state) => {
    return {
        username: state.auth.username,
        password: state.auth.password,
        profile: state.auth.profile,
        account: state.auth.account,
        token: state.auth.token,
        token_refresh: state.auth.token_refresh,
        online: state.check.online,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setAccount: (args) => (
            dispatch(setAccount(args))
        ),
        setToken: (args) => (
            dispatch(setToken(args))
        ),
        setTokenRefresh: (args) => (
            dispatch(setTokenRefresh(args))
        ),
    }
}

class SeparatorSection extends React.Component {
    render() {
        return (
            <Layout level='1' style={styles.separatorSection} />
        )
    }
}


const connectProfileScreen = (props) => {
    /** 
     * React Hook
     *  state
     *  context
    */
    const [scrollY, setScrollY] = useState(new Animated.Value(0));
    const [loading, setLoding]  = useState(false)
    const [image, setImage]     = useState(null);
    const [status, setStatus]   = useState(null);
    const themeContext          = useContext(ThemeContext);

    const getPermissionsAsync = async () => {
        const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if (status !== 'granted') {
            alert('Maaf, kami membutuhkan ijin akses untuk ganti photo profil')
        }
    }

    // const _pickImage = async () => {
    //     if (!status) {
    //         getPermissionsAsync();
    //     };

    //     let result = await ImagePicker.launchImageLibraryAsync({
    //         mediaTypes: ImagePicker.MediaTypeOptions.All,
    //         allowsEditing: true,
    //         aspect: [2, 2],
    //         quality: 1,
    //     });
        
    //     console.log(result);

    //     if (!result.cancelled) {
    //         setImage(result.uri);
    //         const context = new FormData();
    //         context.append("avatar", {
    //             uri: result.uri,
    //             type: result.type,
    //             name: 'avatar'
    //         })
    //         console.log(context)
    //         const url = `${BaseURL}/api/user/${props.account.id}/`
    //         // let context = { avatar: result.uri }
            

    //         if (!isTokenExp(props.token)) {
    //             setLoading(true)
    //             fetch(url, {
    //                 method: 'put',
    //                 data: { avatar: result.uri },
    //                 headers: {
    //                     'Authorization': `Bearer ${props.token}`,
    //                     'Content-Type': 'multipart/form-data'
    //                 }
    //             })
    //             .then((res) => res.json())
    //             .then((res) => {
    //                 console.log(res)
    //                 props.setAccount(res);
    //                 setLoading(false);
    //             })
    //             .catch((err) => {
    //                 setLoading(false);
    //                 if (err) {
    //                     alert(err.message);
    //                 };
    //             })
    //         } else {
    //             if (!isTokenRefreshExp(props.token)) {
    //                 setLoading(true);
    //                 refreshToken(props.token_refresh)
    //                 .then((response) => {
    //                     props.setToken(response.data.access);
    //                     fetch(url, {
    //                         method: 'put',
    //                         data: { avatar: result.uri },
    //                         headers: {
    //                             'Authorization': `Bearer ${response.data.access}`,
    //                             'Content-Type': 'multipart/form-data'
    //                         }
    //                     })
    //                     .then((response) => response.json())
    //                     .then((response) => {
    //                         console.log(response)
    //                         props.setAccount(response);
    //                         setLoading(false);
    //                     })
    //                     .catch((err) => {
    //                         setLoading(false);
    //                         if (err) {
    //                             alert(err.message);
    //                         };
    //                     })
    //                 })
    //                 .catch((err) => {
    //                     setLoading(false);
    //                     if (err) {
    //                         alert(err.message);
    //                     };
    //                 });
    //             } else {
    //                 setLoading(true);
    //                 let data = { 
    //                     username: props.username,
    //                     password: props.password
    //                 }

    //                 getNewToken(data)
    //                 .then((response) => {
    //                     props.setToken(response.data.access);
    //                     props.setTokenRefresh(response.data.refresh);
    //                     fetch(url, {
    //                         method: 'put',
    //                         data: { avatar: result.uri },
    //                         headers: {
    //                             'Authorization': `Bearer ${response.data.access}`,
    //                             'Content-Type': 'multipart/form-data; charset=utf-8;'
    //                         }
    //                     })
    //                     .then((response) => response.json())
    //                     .then((response) => {
    //                         console.log(response)
    //                         props.setAccount(response);
    //                         setLoading(false);
    //                     })
    //                     .catch((err) => {
    //                         setLoading(false);
    //                         if (err) {
    //                             alert(err.message);
    //                         };
    //                     })
    //                 })
    //                 .catch((err) => {
    //                     setLoading(false);
    //                     if (err) {
    //                         alert(err.message);
    //                     };
    //                 });
    //             }
    //         }
    //     };
    // };

    const convertDate = (args) => {
        let option = { year: 'numeric', month: 'long', day: '2-digit', timeZoneName: 'short' };
        const date = new Date(args);
        console.log(date.toLocaleDateString('id-ID', option));
        return date.toLocaleDateString('id-ID', option);
    }

    
    const Item = ({ item: { data_id, id, title, description, icon, separator } }) => {
        const size = 30;
        const fill = '#3366FF';
        if (loading) {
            return <ActivityIndicator style={{marginTop: 20, alignSelf: 'center'}} />
        }
        return(
            <Layout level='3'>
                {
                    data_id === 1
                    ?   <TouchableOpacity 
                            onPress={() => {
                                props.navigation.navigate('Edit', {
                                    label: description,
                                    value: title,
                                })
                            }}>
                            <Layout 
                                level='3' 
                                style={[
                                    styles.itemLayout, id === 4
                                        ? { paddingBottom: 10 }
                                        : null
                                    ]}>
                                <Icon 
                                    name={icon} 
                                    width={size} 
                                    height={size} 
                                    fill={fill} 
                                />
                                <Layout level='3' style={styles.itemLayoutHead}>
                                    <Text 
                                        category='h6' 
                                        numberOfLines={1} 
                                        style={{
                                            width: BASE_WIDTH - 100
                                        }}>
                                        {title}
                                    </Text>
                                    <Text 
                                        appearance='hint' 
                                        category='s1' 
                                        style={{ marginTop: 2}}>
                                        {description}
                                    </Text>
                                </Layout>
                            </Layout>
                        </TouchableOpacity>
                    :   <Layout 
                            level='3' 
                            style={[
                                styles.itemLayout, id === 4
                                ? { paddingBottom: 10 }
                                : null]}>
                            <Icon 
                                name={icon} 
                                width={size} 
                                height={size} 
                                fill={fill} 
                            />
                            <Layout 
                                level='3' 
                                style={styles.itemLayoutHead}>
                                <Text 
                                    category='h6' 
                                    numberOfLines={1} 
                                    style={{
                                        width: BASE_WIDTH - 100 
                                    }}>
                                    {title === 1
                                        ? 'D3 Keperawatan' 
                                        : (title === 2
                                            ? 'Kebidanan'
                                            : title)
                                    }
                                </Text>
                                <Text 
                                    appearance='hint' 
                                    category='s1' 
                                    style={{
                                        marginTop: 2
                                    }}>
                                    {description}
                                </Text>
                            </Layout>
                        </Layout>
                }
            </Layout>
        );
    };
    
    const SectionHeader = ({ section: { id, title } }) => {
        return(
            <Layout 
                level='3' 
                style={styles.sectionHead}>
                <Text category='h6' status='primary' style={{ fontWeight: '700' }}> {title} </Text>
            </Layout>
        );
    };
    console.log(props.profile)

    const DATA = [{
            id: 1,
            title: 'Account',
            data: [{
                    id: 1,
                    title: props.account.username,
                    description: 'Nama Pengguna',
                    icon: 'person-outline',
                    separator: true,
                    data_id: 1,
                },{
                    id: 2,  
                    title: props.account.password,
                    description: 'Kata Sandi',
                    icon: 'lock-outline',
                    separator: true,
                    data_id: 1,
                },{
                    id: 3,
                    title: props.account.email,
                    description: 'Alamat Email',
                    icon: 'email-outline',
                    separator: true,
                    data_id: 1,
                },{
                    id: 4,
                    title: props.account.phone_number,
                    description: 'Nomor telepon',
                    icon: 'phone-outline',
                    separator: false,
                    data_id: 1,
                }]
        },{
            id: 2,
            title: 'Biodata',
            data: [{
                    id: 1,
                    title: props.profile.nama_lengkap,
                    description: 'Nama Lengkap',
                    icon: 'person-outline',
                    separator: true,
                    data_id: 2,
                },{
                    id: 2,
                    title: `${props.profile.tempat_lahir}, ${convertDate(props.profile.tanggal_lahir)}`,
                    description: 'Tempat, Tanggal Lahir',
                    icon: 'calendar-outline',
                    separator: true,
                    data_id: 2,
                },{
                    id: 3,
                    title: props.profile.agama,
                    description: 'Agama',
                    icon: 'book-outline',
                    separator: true,
                    data_id: 2,
                },{
                    id: 4,
                    title: `${props.profile.alamat}`,
                    description: 'Alamat Lengkap',
                    icon: 'pin-outline',
                    separator: true,
                    data_id: 2,
                },{
                    id: 5,
                    title: 'Indonesia',
                    description: 'Kebangsaan',
                    icon: 'flag-outline',
                    separator: false,
                    data_id: 2,
                }]
        },{
            id: 3,
            title: 'Akademik',
            data: [{
                    id: 1,
                    title: props.profile.nim,
                    description: 'NIM',
                    icon: 'credit-card-outline',
                    separator: true,
                    data_id: 3,
                },{
                    id: 2,
                    title: props.profile.tanggal_masuk,
                    description: 'Tanggal Masuk',
                    icon: 'calendar-outline',
                    separator: true,
                    data_id: 3,
                },{
                    id: 3,
                    title: props.profile.program_studi,
                    description: 'Program Studi',
                    icon: 'briefcase-outline',
                    separator: true,
                    data_id: 3,
                },{
                    id: 4,
                    title: ((new Date().getFullYear() - parseInt(props.profile.tahun_masuk)) / 0.5),
                    description: 'Semester',
                    icon: 'info-outline',
                    separator: false,
                    data_id: 3,
                }]
        }
    ];


    /** ANIMATION
     *  trasnform
     *  opacity
     */

    const headerTransform = [{ 
        translateY : scrollY.interpolate({
            inputRange: [0, HEADER_MAX_HEIGHT - 57],
            outputRange: [1, -90],
            extrapolate: 'clamp'
        })
    }]
    
    const avatarTransform = [{ 
            translateY: scrollY.interpolate({
                inputRange: [0, HEADER_MAX_HEIGHT - 57],
                outputRange: [0, -(HEADER_MIN_HEIGHT - 5)],
                extrapolate: 'clamp',
            })
        },{
            translateX: scrollY.interpolate({
                inputRange: [0, HEADER_MAX_HEIGHT - 57],
                outputRange: [0, (BASE_WIDTH / 8)],
                extrapolate: 'clamp'
            })
        },{
            scale: scrollY.interpolate({
                inputRange: [0, HEADER_MAX_HEIGHT - 57],
                outputRange: [1, 0.8],
                extrapolate: 'clamp',
            })
        }
    ];

    const titleTransform = [{ 
            translateY: scrollY.interpolate({
                inputRange: [0, HEADER_MAX_HEIGHT - 57],
                outputRange: [0, -(HEADER_MIN_HEIGHT - 10)],
                extrapolate: 'clamp',
            })
        },{
            translateX: scrollY.interpolate({
                inputRange: [0, HEADER_MAX_HEIGHT - 57],
                outputRange: [0, (BASE_WIDTH / 20)],
                extrapolate: 'clamp'
            })
        },{
            scale: scrollY.interpolate({
                inputRange: [0, HEADER_MAX_HEIGHT - 57],
                outputRange: [1, 0.8],
                extrapolate: 'clamp',
            })
        }
    ];

    const subtitleTransform = [{ 
            translateY: scrollY.interpolate({
                inputRange: [0, HEADER_MAX_HEIGHT - 57],
                outputRange: [0, -(HEADER_MIN_HEIGHT - 3)],
                extrapolate: 'clamp',
            })
        },{
            translateX: scrollY.interpolate({
                inputRange: [0, HEADER_MAX_HEIGHT - 57],
                outputRange: [0, (BASE_WIDTH / 8.6)],
                extrapolate: 'clamp'
            })
        },
    ];

    const scrollViewEvent = Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: true }
    );

    const iconOpacity = scrollY.interpolate({
        inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
        outputRange: [1, 0],
        extrapolate: 'clamp'
    });

    const iconTransform = [{
        translateY: scrollY.interpolate({
            inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
            outputRange: [1, - HEADER_MIN_HEIGHT],
            extrapolate: 'clamp'
        })
    }, {
        scale: scrollY.interpolate({
            inputRange: [0, 200],
            outputRange: [1, 0.2],
            extrapolate: 'clamp'
        })
    }];

    /* Render component */
    const renderIconCamera = (style) => (
        <Icon {...style} name='camera-outline' />
    );
    
    const Separator = () => <Layout style={styles.separatorItem} />;
    if (loading) {
        return <ActivityIndicator  style={{marginTop: 50, alignSelf: 'center'}} />
    }

    return (
        <Layout style={styles.container}>
            <TopNavigationMenu 
                onPressLeft={() => props.navigation.openDrawer()} 
                style={styles.topMenu} 
                navigation={props.navigation} 
            />

            <Animated.View
                style={[
                    styles.headerAnimate, 
                    { transform: headerTransform },
                    themeContext.theme === 'dark'
                        ? { backgroundColor: '#3366FF' }
                        : { backgroundColor: ANTI_FLASH_WHITE },
                ]}
            />
            
            <Animated.Image
                source={props.account.avatar? {uri: props.account.avatar}: require('../assets/images/logo.png')}
                style={[styles.avatarAnimate, { transform: avatarTransform, borderRadius: 50 }]}
            />

            <Animated.Text 
                style={[
                    styles.titleAnimate, 
                    { transform: titleTransform },
                    themeContext.theme === 'dark'
                        ? { color: 'white', fontWeight: '900' }
                        : { color: '#303030', fontWeight: '900' }
                ]}>
                {props.profile.nama_lengkap}
            </Animated.Text>

            <Animated.Text style={[
                    styles.subtitleAnimate, 
                    { transform: subtitleTransform },
                    themeContext.theme === 'dark'
                        ? { color: 'white', fontWeight: '600' }
                        : { color: '#3B3B3B', fontWeight: '600' }
                ]}>
                {props.online? 'Online': 'Offline'}
            </Animated.Text>

            {/* <Animated.View 
                style={[
                    styles.iconCameraAnimate, {
                         transform: iconTransform, 
                         opacity: iconOpacity 
                        }
                ]}>
                <Button 
                    style={styles.buttonCamera}   
                    icon={renderIconCamera}
                    onPress={() => _pickImage()}
                />
            </Animated.View> */}
            <AnimatedSectionList
                {...props}
                sections={DATA}
                keyExtractor={( item, index ) => item + index}
                renderItem={Item}
                renderSectionHeader={SectionHeader}
                ItemSeparatorComponent={Separator}
                SectionSeparatorComponent={SeparatorSection}
                contentContainerStyle={{
                    flexGrow: 1,
                    border: 1,
                    paddingTop: 90
                 }}
                scrollEventThrottle={16}
                onScroll={scrollViewEvent}
                stickySectionHeadersEnabled={true}
            />
        </Layout>        
    );
};

const ProfileScreen = connect(mapStateToProps, mapDispatchToProps)(connectProfileScreen);
export default ProfileScreen;


const styles = StyleSheet.create({
    avatarAnimate: {
        position: 'absolute',
        top: HEADER_MAX_HEIGHT / 2 + STATUS_BAR_HEIGHT,
        left: 20, 
        width: AVATAR_MAX_SIZE, 
        height: AVATAR_MAX_SIZE, 
        zIndex: 2,
    },
    buttonCamera: {
        width: null, 
        height: null, 
        borderRadius: ICON_SIZE
    },
    center: {
      alignSelf: 'center',
    },
    container: {
        height: BASE_HEIGHT,
        paddingTop: STATUS_BAR_HEIGHT,
        paddingBottom: 20
    },
    headerAnimate: {
        position: 'absolute',
        width: BASE_WIDTH,
        height: HEADER_MAX_HEIGHT,
        paddingLeft: 20,
        zIndex: 1,
    },
    iconCameraAnimate: {
        position: 'absolute',
        right: 20,
        top: HEADER_MAX_HEIGHT - ICON_SIZE / 2 + STATUS_BAR_HEIGHT,
        width: ICON_SIZE, 
        height: ICON_SIZE,
        borderWidth: 2,
        borderColor: 'white',
        borderRadius: ICON_SIZE,
        zIndex: 2,
    },
    itemLayout: {
        flexDirection: 'row', 
        alignItems: 'center', 
        paddingTop: 5,
        paddingBottom: 5, 
        paddingLeft: 20, 
    },
    itemLayoutHead: {
        flexDirection: 'column',
        marginLeft: 10
    },
    sectionHead: { 
        paddingLeft: 20,
        padding: 16,
    },
    separatorSection: {
        height: 5,
    },
    separatorItem: {
        height: 2,
    },
    subtitleAnimate: {
        position: 'absolute',
        top: HEADER_MAX_HEIGHT - 40 + STATUS_BAR_HEIGHT,
        left: BASE_WIDTH / 4,
        fontSize: 15,
        width: 50,
        zIndex: 2,
    },
    titleAnimate: {
        position: 'absolute',
        top: HEADER_MAX_HEIGHT - 72 + STATUS_BAR_HEIGHT,
        left: BASE_WIDTH / 4,
        fontSize: 23,
        width: (BASE_WIDTH) - 120,
        zIndex: 2,
    },
    topMenu: {
        // backgroundColor: 'transparent',
        zIndex: 2, 
        shadowColor: 'black',
        shadowOffset: {
            width: 20,
            height: 20,
        },
        shadowOpacity: 10,
        shadowRadius: 10,
    },
});

