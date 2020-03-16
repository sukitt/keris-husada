import React, { useState } from 'react';
import {
    Dimensions,
    View,
    Text,
    StyleSheet,
    Image,
    Animated
} from 'react-native';
import { TabView, SceneMap, TabBar  } from 'react-native-tab-view';
import { ScrollView } from 'react-navigation';
const HEADER_MAX_HEIGHT         = 120;
const HEADER_MIN_HEIGHT         = 70;
const PROFILE_IMAGE_MAX_HEIGHT  = 80;
const PROFILE_IMAGE_MIN_HEIGHT  = 40;


const FirstRoute = () => (
    <View style={[styles.scene, { backgroundColor: '#ff4081' }]}>
        <Text>
            But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exerciseBut I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exerciseBut I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise 
        </Text>
    </View>
);

const SecondRoute = () => (
  <View style={[styles.scene, { backgroundColor: '#673ab7' }]} />
);

const initialLayout = { width: Dimensions.get('window').width};


const connectHomeProfileScreen = (props) => {

    const [scrollY, setScrollY] = useState(new Animated.Value(0));
    const [index, setIndex]     = useState(1);
    const [routes]              = useState([
        { key: 'first', title: 'First' },
        { key: 'second', title: 'Second' }
    ]);

    const renderScene = SceneMap({
        first: FirstRoute,
        second: SecondRoute,
    });

    const renderTabBar = (props) => (
        <TabBar
          {...props}
          scrollEnabled
          indicatorStyle={styles.indicator}
          style={styles.tabbar}
          tabStyle={styles.tab}
          labelStyle={styles.label}
        />
    );

    const headerHeight = scrollY.interpolate({
        inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
        outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
        extrapolate: 'clamp'
    });

    const profileImageHeight = scrollY.interpolate({
        inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
        outputRange: [PROFILE_IMAGE_MAX_HEIGHT, PROFILE_IMAGE_MIN_HEIGHT],
        extrapolate: 'clamp'
    });

    const profileImageMarginTop = scrollY.interpolate({
        inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
        outputRange: [HEADER_MAX_HEIGHT - (PROFILE_IMAGE_MAX_HEIGHT / 2), HEADER_MAX_HEIGHT + 5],
        extrapolate: 'clamp'
    });

    const headerZindex = scrollY.interpolate({
        inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
        outputRange: [0,1],
        extrapolate: 'clamp'
    });

    const headerTitleBottom = scrollY.interpolate({
        inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT,
            HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT + 5 + PROFILE_IMAGE_MIN_HEIGHT,
            HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT + 5 + PROFILE_IMAGE_MIN_HEIGHT + 26,
        ],
        outputRange: [-20, -20, -20, 0],
        extrapolate: 'clamp'
    });

    return (
        <View style={{ flex: 1}}>
            <Animated.View
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: 'lightskyblue',
                    height: headerHeight,
                    zIndex: headerZindex,
                    alignItems: 'center'
                }}>

                <Animated.View style={{ position: 'absolute', bottom: headerTitleBottom }}>
                    <Text style={{ color: 'white', fontSize: 14, fontWeight: 'bold', }}>Super User</Text>
                </Animated.View>
            </Animated.View>


            <ScrollView 
                style={{ flex: 1 }}
                scrollEventThrottle={16}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }]
                )}>
                <Animated.View style={{
                    height: profileImageHeight,
                    width: profileImageHeight,
                    borderRadius: PROFILE_IMAGE_MAX_HEIGHT / 2,
                    borderColor: 'white',
                    borderWidth: 3,
                    overflow: 'hidden',
                    marginTop: profileImageMarginTop,
                    marginLeft: 10,
                }}>
                    <Image
                        style={{ flex: 1, width: null, height: null }}
                            source={require('../assets/images/logo.png')} 
                    />
                </Animated.View>
                <View><Text style={{ fontWeight: 'bold', fontSize: 26, paddingLeft: 10 }}>Super User</Text></View>
                <Animated.View style={{}}>
                    <TabView
                        navigationState={{ index, routes }}
                        renderScene={renderScene}
                        onIndexChange={setIndex}
                        initialLayout={initialLayout}
                    />
                </Animated.View>

                <Text>
                    But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise 
                </Text>

            </ScrollView>
                
        </View>
    );
};

const HomeProfileScreen = connectHomeProfileScreen;
export default HomeProfileScreen;

const styles = StyleSheet.create({
    scene: {
        flex: 1,
    },
    tabbar: {
      flexDirection: 'row',
      backgroundColor: '#f6f6f6',
      zIndex: 1,
    },
    tab: {
        width: 120
    },
    indicator: {
      backgroundColor: '#e03a3e',
    },
    label: {
      color: '#828282',
      fontSize: 14,
    },
    labelSelected: {
      fontSize: 14,
      color: 'black',
    },
});
