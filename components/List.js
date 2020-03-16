
import React from 'react';
import { StyleSheet } from 'react-native';
import {
  Button,
  Icon,
  List,
  ListItem,
} from '@ui-kitten/components';

const data = new Array(8).fill({
  title: 'Title for Item',
  description: 'Description for Item',
});

const List = (props) => {

  const renderItemAccessory = (style) => (
    <Button style={style}>FOLLOW</Button>
  );

  const renderItemIcon = (style) => (
    <Icon {...style} name='person' />
  );

  const renderItem = ({ item, index }) => (
    <ListItem
        {...props}
        title={`${item.title} ${index + 1}`}
        description={`${item.description} ${index + 1}`}
        icon={renderItemIcon}
        accessory={renderItemAccessory}
    />
  );

  return (
    <List
        {...props}
        data={data}
        renderItem={renderItem}
    />
  );
};

export default List;