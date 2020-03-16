import React from 'react'
import { Footer, FooterTab, Button, Text } from 'native-base';
import { StyleSheet } from 'react-native';

const Foot = (props) => (
    <Footer style={styles.footer}>
        <Text style={{ color: '#62b1f5' }}>Keris Husada @2019</Text>
    </Footer>
)

export default Foot;

const styles = StyleSheet.create({
    footer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#ffffff' , 
        justifyContent: 'center', 
        alignItems: 'center',
    }
})
// '#62b1f5'