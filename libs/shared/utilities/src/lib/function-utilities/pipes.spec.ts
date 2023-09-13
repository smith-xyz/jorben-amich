import { pipe, pipePromises } from './pipes';

const fn1 = (val: number) => val + 1;
const fnPromise1 = async (val: number) => await Promise.resolve(val + 1);

describe('pipes', () => {
  describe('pipe', () => {
    it('executes pipe functions', () => {
      const fns = [fn1, fn1, fn1, fn1, fn1];
      expect(pipe(...fns)(0)).toEqual(fns.length);
    });
  });
  describe('pipePromises', () => {
    it('executes pipe functions as promises', async () => {
      const fnPromises = [
        fnPromise1,
        fnPromise1,
        fnPromise1,
        fnPromise1,
        fnPromise1,
      ];
      expect(await pipePromises(...fnPromises)(0)).toEqual(fnPromises.length);
    });
  });
});
