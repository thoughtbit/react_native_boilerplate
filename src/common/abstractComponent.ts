import * as React from 'react';
import { isNodeEnv } from './utils';

export abstract class AbstractComponent<P, S> extends React.Component<P, S> {
  protected displayName: never;
  private timeoutIds: number[] = [];

  constructor(props?: P, context?: any) {
    super(props, context);
    if (!isNodeEnv('production')) {
      this.validateProps(this.props);
    }
  }

  public componentWillReceiveProps(nextProps: P & { children?: React.ReactNode }) {
    if (!isNodeEnv('production')) {
      this.validateProps(nextProps);
    }
  }

  public componentWillUnmount() {
    this.clearTimeouts();
  }

  public setTimeout(callback: () => void, timeout?: number) {
    const handle = setTimeout(callback, timeout);
    this.timeoutIds.push(handle);
    return () => clearTimeout(handle);
  }

  public clearTimeouts = () => {
    if (this.timeoutIds.length > 0) {
      for (const timeoutId of this.timeoutIds) {
        clearTimeout(timeoutId);
      }
      this.timeoutIds = [];
    }
  };


  protected validateProps(_: P & { children?: React.ReactNode }) {
    // implement in subclass
  }
}
