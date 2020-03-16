import React from 'react';
import PropTypes from 'prop-types';
import { Layout, Text, Input, Icon } from '@ui-kitten/components';

import {
  Animated,
  View,
  Easing,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';

import BaseInput from './BaseInput';

export default class Kohana extends BaseInput {
  static defaultProps = {
    easing: Easing.bezier(0.2, 1, 0.3, 1),
    iconSize: 30,
    inputPadding: 16,
    useNativeDriver: false,
  };

  render() {
    const {
      iconColor,
      iconSize,
      iconName,
      labelText,
      style: containerStyle,
      inputPadding,
      inputStyle,
      labelStyle,
      iconContainerStyle,
      labelContainerStyle,
    } = this.props;
    const { focusedAnim, value } = this.state;

    return (
      <Layout
        style={[styles.container, containerStyle]}
        onLayout={this._onLayout}
      >
        <TouchableWithoutFeedback onPress={this.focus}>
          <Animated.View
            style={{
              justifyContent: 'center',
              padding: inputPadding,
              transform: [
                {
                  translateX: focusedAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-15 - iconSize, 0],
                  }),
                },
              ],
              ...iconContainerStyle,
            }}
          >
            <Icon name={iconName} fill={iconColor} width={iconSize} height={iconSize} />
          </Animated.View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={this.focus}>
          <Animated.View
            style={{
              position: 'absolute',
              // top: inputPadding,
              left: 0,
              transform: [
                {
                  translateX: focusedAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [inputPadding, 80],
                  }),
                },
              ],
              opacity: focusedAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0],
              }),
              ...labelContainerStyle,
            }}
          >
            <Text category='h6' appearance='hint'>
              {labelText}
            </Text>
          </Animated.View>
        </TouchableWithoutFeedback>
        <Input
          ref={this.input}
          {...this.props}
          style={[styles.textInput, inputStyle, {
          }]}
          value={value}
          onBlur={this._onBlur}
          onFocus={this._onFocus}
          onChange={this._onChange}
          underlineColorAndroid={'transparent'}
          // size='large'
        />
      </Layout>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  textInput: {
    flex: 1,
  },
});
