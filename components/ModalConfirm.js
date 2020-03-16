import React, { Component } from 'react';
import { 
    StyleSheet, 
    TouchableOpacity, 
} from 'react-native';
import {
    Layout,
    Modal,
    Text,
    List
} from '@ui-kitten/components';

const DATA = [
    { title: 'A' },
    { title: 'B' }
];

class ModalConfirm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            width: null,
        }
    }

    /* Modal */

    _onLayout = (e) => {
        this.setState({ width: e.nativeEvent.layout.width })
    }

    toggleModal = () => (
        this.setState(prevState => ({ visible: !prevState.visible }))
    );

    ItemSeparatorComponent = () => (
        <Layout level='4' style={{ height: 1 }} />
    );

    renderItem = ({ item, index }) => (
        <TouchableOpacity onPress={() => this.props.handleSelected(index)}>
            <Layout key={index} 
                style={[
                    styles.item, 
                    { 
                        paddingTop: this.props.paddingItemTop || 16, 
                        paddingBottom: this.props.paddingItemBottom || 16, 
                    }
                ]}>
                <Text category='s1' style={!index? { color: '#6690FF', fontWeight: 'bold' } : { fontWeight: '600' }}> {item.title} </Text>
            </Layout>
        </TouchableOpacity>
    );

    renderModalElement = () => (
        <Layout
            style={[styles.modalContainer, this.props.modalContainerStyle]}
            level='1'>
            <Layout style={[styles.modalTitle, this.props.modalContainerTitleStyle]}>
                <Text category='h6' style={this.props.modalTitleStyle}>{this.props.titleModal}</Text>
                <Text category='s1' appearance='hint' style={{ flexWrap: 'wrap', textAlign: 'center' }}>
                    {this.props.subTitleModal}
                </Text>
            </Layout>
            {this.ItemSeparatorComponent()}
            <List
                contentContainerStyle={styles.flatlist}
                ItemSeparatorComponent={this.ItemSeparatorComponent}
                data={this.props.modalData}
                renderItem={this.renderItem}
            />
        </Layout>
    );

    render () {
        return (
            <Layout
                onLayout={this._onLayout}
                style={styles.modalLayout}>
                        <TouchableOpacity
                            onPress={this.toggleModal}>
                            <Text status='primary' style={{ fontWeight: '700' }} >{this.props.title}</Text>
                        </TouchableOpacity>
                <Modal
                    {...this.props}
                    allowBackdrop={true}
                    onBackdropPress={this.toggleModal}
                    backdropStyle={styles.backdrop}
                    visible={this.state.visible}>
                    {this.renderModalElement()}
                </Modal>
            </Layout>
        );
    }
};

export default ModalConfirm;

ModalConfirm.defaultProps = {
    modalData: DATA,
    handleSelected: (index) => {
        DATA.forEach((element, i) => {
            switch (index) {
                case i:
                return (
                    alert(i)
                );
            
                default:
                    break;
            }
        });
    },
    title: 'Title Press',
    titleModal: 'Modal Title',
    subTitleModal: 'Subtitle Modal',
}

const styles = StyleSheet.create({
    flatlist: {
        flex: 1,
        flexGrow: 1,
        backgroundColor: 'transparent'
    },
    modalLayout: {
        flex: 1,
        alignItems: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        width: 270,
        borderRadius: 5
    },
    modalTitle: { 
        justifyContent: 'center', 
        alignItems: 'center',
        paddingTop: 16,
        paddingBottom: 16
    },
    backdrop: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    item: { 
        justifyContent: 'center',
        alignItems: 'center', 
    },
});