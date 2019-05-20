import * as React from 'react';
import { View, ViewStyle } from 'react-native';
import { AbstractPureComponent } from '../../common';

export type Props = {
  children?: React.ReactNode;
  style?: ViewStyle | ViewStyle[]
};

export default class RootView extends AbstractPureComponent<Props> {
  public render() {
    const { children, style } = this.props;
    return (
      <View style={[{ flex: 1, backgroundColor: '#f2f4f5' }, style]}>
        { children }
      </View>
    );
  }

  protected validateProps() {
    if (this.props.children === null) {
      console.warn('<RootView> 需要添加子元素.</RootView>');
    }
  }
}
