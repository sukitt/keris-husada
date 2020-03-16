import React from 'react';
import { View, Thumbnail } from 'native-base';
export default function(props) {
    const { style } = props;
    return (
        <View>
            <Thumbnail 
                square 
                source={require('../assets/images/logo.png')} 
                style={style}
                />
        </View>
    );
}