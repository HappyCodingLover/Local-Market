import React, { Component } from 'react';
import { View, TextInput } from 'react-native';
import { BaseStyle, BaseColor } from '@config';
import { Text } from '@components';

export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const {
      label = '',
      placeholder,
      keyboardType,
      errorMsg = '',
      onChangeText,
      description = '',
      value = '',
    } = this.props;
    return (
      <View>
        {description !== '' && <Text body2>{description}</Text>}
        <View style={BaseStyle.textInputWrapper}>
          {label !== '' && (
            <Text callout bold style={{ paddingLeft: 5, paddingTop: 5 }}>
              {label}
            </Text>
          )}
          <TextInput
            placeholder={placeholder}
            placeholderTextColor={BaseColor.textInputPlaceholderColor}
            style={BaseStyle.textInput}
            autoCapitalize="none"
            keyboardType={keyboardType}
            onChangeText={(v) => {
              onChangeText(v);
            }}
            value={value}
          />
        </View>
        {errorMsg !== '' && (
          <Text error style={{ marginTop: 5 }}>
            {errorMsg}
          </Text>
        )}
      </View>
    );
  }
}
