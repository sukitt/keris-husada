import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { Text } from '@ui-kitten/components';
import { PacmanIndicator, SkypeIndicator } from 'react-native-indicators';

export const PacmanLoad = (props) => (
    <PacmanIndicator {...props} />
)

export const SkypeLoad = (props) => (
    <View style={styles.bgOverlay}>
        <SkypeIndicator color='white' style={styles.skypeIndicator} />
        <Text category='s1' style={styles.textIndicator}>{props.message}</Text>
    </View>
)

const { width, height } = Dimensions.get('window');
const BASE_HEIGHT = height
const BASE_WIDTH  = width;
console.log(BASE_HEIGHT)
const styles = StyleSheet.create({
    bgOverlay: {
        position: 'absolute',
        top: BASE_HEIGHT / 2.5,
        bottom: BASE_HEIGHT / 2.5,
        left: BASE_WIDTH / 3,
        right: BASE_WIDTH / 3,
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        borderRadius: 30,
        zIndex: 3,
    },
    skypeIndicator: {
        position: 'absolute',
        top: BASE_HEIGHT / 20
    },
    textIndicator: {
        color: 'white', 
        bottom: BASE_HEIGHT / 30, 
        position: 'absolute'
    }
})
