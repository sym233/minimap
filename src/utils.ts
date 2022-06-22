import React, { useEffect, useRef, useState } from 'react';

/**
 * run effect() with custom predicate function
 * @param effect the same as useEffect parameter
 * @param dep the dependency that decides running effect()
 * @param comp compare previous and current dep's. run effect() if it returns true.
 */
// eslint-disable-next-line import/prefer-default-export
export function useCompareEffect<T>(
  effect: React.EffectCallback,
  dep: T,
  comp: (oldValue: T, newValue: T) => boolean,
): void {
  const firstRender = useRef(true);
  const prevValue = useRef(dep);
  useEffect(() => {
    if (firstRender.current || comp(prevValue.current, dep)) {
      firstRender.current = false;
      prevValue.current = dep;
      return effect();
    }
  }, [effect, dep, comp]);
}

// /**
//  * The hook will be called every timeout.
//  * @param timeout number in milisecond.
//  * @returns number in milisecond, current timestamp
//  */
// export function useTimer(timeout: number): number {
//   const [time, setTime] = useState(Date.now());
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setTime(Date.now());
//     }, timeout);
//     return () => {
//       clearTimeout(timer);
//     };
//   }, [time, timeout]);
//   return time;
// }

// export function useEffectInterval(
//   effect: (time: number) => ReturnType<React.EffectCallback>,
//   interval: number,
//   deps?: React.DependencyList,
// ) {
//   const time = useTimer(interval);
//   useEffect(() => effect(time), [effect, time, ...deps ?? []]);
// }
