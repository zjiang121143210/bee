/* eslint-disable no-console */
/**
 * 日志打印模块
 */
import config from './config';

export default function ({
  level = 'log',
  content = [],
}) {
  if (!config.log) {
    return;
  }
  if (typeof console === 'object' && console[level]) {
    try {
      console[level](...content);
    } catch (e) {
      console.log(...content);
    }
  }
}