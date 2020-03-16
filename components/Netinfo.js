import React from 'react';
import {useNetInfo} from '@react-native-community/netinfo';
import { Layout, Text } from '@ui-kitten/components';

const Netinfo = (props) => {
    const netInfo = useNetInfo();
    return (
        <Layout>
            <Text>Type: {netInfo.type}</Text>
            <Text>Is Connected? {netInfo.isConnected.toString()}</Text>
        </Layout>
    )
}

export default Netinfo;
