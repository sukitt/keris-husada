import React, { useState } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, TouchableOpacity  } from 'react-native';
import {
    Icon,
    OverflowMenu,
    TopNavigation,
    TopNavigationAction,
    Layout,
    Modal,
    Text,
    List
} from '@ui-kitten/components';


import { isOnline, userLogout, setAccount, setAvatar } from '../redux/actions';
import { SkypeLoad } from './indicator';
import Notice from './Notice';


const DrawerIcon = (style) => (
    <Icon {...style} name='menu-outline' width={25} height={25} />
);

const MenuIcon = (style) => (
    <Icon {...style} name='more-vertical' width={25} height={25} />
);

const InfoIcon = (style) => (
    <Icon {...style} name='info'/>
);

const LogoutIcon = (style) => (
    <Icon {...style} name='log-out'/>
);

const mapDispatchToProps = (dispatch) => {
    return {
        isOnline: (args) => (
            dispatch(isOnline(args))
        ),
        setAccount: (args) => (
            dispatch(setAccount(args))
        ),
        setAvatar: (args) => (
            dispatch(setAvatar(args))
        )
    };
};

const connectTopNavigationMenu = (props) => {

    const [menuVisible, setMenuVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false)
    const [isLoading, setLoading] = useState(false);

    /* Modal */

    const modalData = [
        { title: 'Keluar' },
        { title: 'Batal' }
    ];

    const toggleModal = () => (
        setModalVisible(!modalVisible)
    );

    const handleSelected = (action) => {
        switch (action) {
            case 'Keluar':
                return (
                    setLoading(!isLoading),
                    toggleModal(),
                    userLogout()
                    .then(() => {
                        setLoading(!isLoading);
                        props.navigation.navigate('AuthLoading');
                    })
                    .catch((err) => Notice(err, 'danger'))
                )
            
            case 'Batal':
                return toggleModal();

            default:
                return toggleModal();
        };
    };

    const itemSeparatorComponent = () => (
        <Layout level='4' style={{ height: 1 }} />
    );

    const renderItem = ({ item, index }) => (
        <TouchableOpacity onPress={() => handleSelected(item.title)}>
            <Layout key={index} style={styles.item}>
                <Text category='s1' style={!index? { color: '#6690FF', fontWeight: 'bold' } : { fontWeight: '600' }}> {item.title} </Text>
            </Layout>
        </TouchableOpacity>
    );

    const renderModalElement = () => (
        <Layout
            style={{ flex:1, borderRadius: 10, padding: 5 }}
            level='1'>
            <Layout style={styles.modalTitle}>
                <Text category='h6'>Keluar dari SIA Mobile</Text>
            </Layout>
            {itemSeparatorComponent()}
            <List
                ItemSeparatorComponent={itemSeparatorComponent}
                data={modalData}
                renderItem={renderItem}
            />
        </Layout>
    );

    /* Top Navigator */

    const menuData = [
        { title: 'Logout', icon: LogoutIcon },
    ];

    const toggleMenu = () => {
        setMenuVisible(!menuVisible);
    };

    const onMenuItemSelect = (index) => {
        /* handle selected items */
        switch (index) {
            case 0:
                return (
                    toggleModal(),
                    setMenuVisible(false)
                )
            default:
                return setMenuVisible(false);
        };
        
    };

    const renderMenuAction = () => (
        <OverflowMenu
            visible={menuVisible}
            data={menuData}
            onSelect={onMenuItemSelect}
            onBackdropPress={toggleMenu}>
            <TopNavigationAction
                icon={MenuIcon}
                onPress={toggleMenu}
            />
        </OverflowMenu>
    );

    const renderDrawerkAction = () => (
        <TopNavigationAction onPress={props.onPressLeft} icon={DrawerIcon}/>
    ); 
    
    return (
        <>
            <TopNavigation
                {...props}
                leftControl={renderDrawerkAction()}
                rightControls={renderMenuAction()}
            />
            <Modal
                style={styles.modalContainer}
                allowBackdrop={true}
                onBackdropPress={toggleModal}
                backdropStyle={styles.backdrop}
                visible={modalVisible}>
                {renderModalElement()}
            </Modal>
            {isLoading? <SkypeLoad message='loading...'/>: null} 
        </>
    );
};

const TopNavigationMenu = connect(null, mapDispatchToProps)(connectTopNavigationMenu);
export default TopNavigationMenu;

const styles = StyleSheet.create({
    modalContainer: {
      justifyContent: 'center',
      width: 270,
      height: 200,
    //   paddingTop: 10,
    },
    modalTitle: { 
        justifyContent: 'center', 
        alignItems: 'center',
        paddingTop: 16,
        paddingBottom: 16,
        height: 80,
    },
    backdrop: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    item: { 
        justifyContent: 'center',
        alignItems: 'center', 
        paddingTop: 16, 
        paddingBottom: 16,
    },
});