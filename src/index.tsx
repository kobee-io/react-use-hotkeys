import { useEffect, useMemo } from 'react';
import arraysEqual from './helpers/arraysEqual';
import arraysEqualByIndex from './helpers/arraysEqualByIndex';
import getActiveModifierKeys from './helpers/getActiveModifierKeys';
import getHotkeysArray from './helpers/getHotkeysArray';
import mapModifierKeys from './helpers/mapModifierKeys';
import modifierKeyPressed from './helpers/modifierKeyPressed';
import tail from './helpers/tail';
import takeUntilLast from './helpers/takeUntilLast';

import 'shim-keyboard-event-key';

/**
 * TODO:
 * 1. Allow multiple hotkey combinations (['Meta+Shift+z', 'Control+Shift+z'])
 * 2. Look into https://github.com/mpeyper/react-hooks-testing-library
 */

const KEY_SEQUENCE_TIMEOUT = 1000;

const useHotkeys = (
  hotkeys: string,
  callback: (event: KeyboardEvent) => void
) => {
  const hotkeysArray = useMemo(() => getHotkeysArray(hotkeys), [hotkeys]);

  useEffect(() => {
    let keySequence: string[] = [];
    let sequenceTimer: number | undefined;

    const clearSequenceTimer = () =>
      sequenceTimer && clearTimeout(sequenceTimer);

    const resetKeySequence = () => {
      clearSequenceTimer();
      keySequence = [];
    };

    const handleKeySequence = (event: KeyboardEvent, keys: string[]) => {
      clearSequenceTimer();

      sequenceTimer = window.setTimeout(() => {
        resetKeySequence();
      }, KEY_SEQUENCE_TIMEOUT);

      keySequence.push(event.key.toLowerCase());

      if (arraysEqualByIndex(keySequence, keys)) {
        resetKeySequence();
        callback(event);
      }
    };

    const handleModifierCombo = (event: KeyboardEvent, keys: string[]) => {
      const actionKey: string = tail(keys);
      const modKeys = mapModifierKeys(takeUntilLast(keys));
      const activeModKeys = getActiveModifierKeys(event);
      const allModKeysPressed = arraysEqual(modKeys, activeModKeys);

      if (allModKeysPressed && event.key.toLowerCase() === actionKey) {
        callback(event);
      }
    };

    const onKeydown = (event: KeyboardEvent) => {
      // Handle modifier key combos
      if (modifierKeyPressed(event)) {
        handleModifierCombo(event, hotkeysArray);
        return;
      }

      // Handle key sequences
      if (hotkeysArray.length > 1 && !modifierKeyPressed(event)) {
        handleKeySequence(event, hotkeysArray);
        return;
      }

      // Handle the basic case: a single hotkey
      if (event.key.toLowerCase() === hotkeysArray[0]) {
        callback(event);
      }
    };

    window.addEventListener('keydown', onKeydown);

    return () => {
      window.removeEventListener('keydown', onKeydown);
    };
  }, [hotkeysArray, callback]);
};

export default useHotkeys;
