import React, { Component } from 'react';
import { Layout, Avatar } from '@ui-kitten/components';

const size = 80
export default class SecondForm extends Component {
    render() {
        return (
            <Layout level='4' style={{ alignSelf: 'center', padding: 5, borderRadius: size/1.5 }}>
                <Avatar
                    source={this.props.source}
                    // size='giant'
                    style={{ width: size, height: size }}
                    bor
                />
            </Layout>
        );
    };
};
