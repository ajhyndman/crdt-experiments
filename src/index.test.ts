import { hello } from './index';

describe('test case', () => {
  it('passes', () => {
    expect('hello').toBe('hello');
  });
});

describe('hello', () => {
  it('returns world', () => {
    expect(hello()).toBe('world');
  });
});
