import React from 'react';
import Constants from 'expo-constants';
import {
    View,
    Text,
    Animated,
    Image
} from 'react-native';

class Head extends React.Component {
    render() {
        let { params } = this.props.state;

        let headerHeight = params !== undefined && params.headerHeight !== undefined
            ? params.headerHeight: null;
        let headerZindex = params !== undefined && params.headerZindex !== undefined
            ? params.headerZindex: null;
        let backgroundColor = params !== undefined && params.backgroundColor !== undefined
            ? params.backgroundColor: null;
        // let { headerHeight, headerZindex, backgroundColor } = params;

        return (
            <Animated.View
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: headerHeight, 
                    width: '100%',
                    marginTop: Constants.statusBarHeight,
                    backgroundColor: 'lightskyblue',
                    alignItems: 'center',
                    zIndex: headerZindex,
                    overflow: 'hidden'
                }}
            >
                <Image
                    source={require('../assets/images/logo.png')}
                    style={{
                        height: 50,
                        width: 50,
                    }}
                />
            </Animated.View>
        )
    };
}
export default Head;