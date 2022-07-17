import React, { useEffect, useRef } from 'react';

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
