import React from 'react';
import AppSelector from './AppSelector';
import KeyboardLayoutSelector from './KeyboardLayoutSelector';
import KeyboardLayout from './KeyboardLayout';
import KeyDisplay from './KeyDisplay';
import { useKeyboardShortcuts } from '../hooks';
import { useAppContext } from '../context/AppContext';
import { getCodeDisplayName } from '../utils/keyMapping';

const NormalModeView = () => {
  const {
    selectedApp,
    setSelectedApp,
    keyboardLayout,
    setKeyboardLayout,
    shortcutDescriptions,
    keyboardLayouts,
    apps, // useAppContextからappsを取得
  } = useAppContext();

  const {
    pressedKeys,
    history, // これはまだ使われていないが、将来のために残す
    currentDescription,
    availableShortcuts,
    handleClear, // これも同様
  } = useKeyboardShortcuts(shortcutDescriptions, keyboardLayout, false);

  const getDisplayKeyByCode = (code, key, shiftPressed) => {
    return getCodeDisplayName(code, key, keyboardLayout, shiftPressed);
  };

  return (
    <>
      <div className="selectors-container">
        <AppSelector
          apps={apps} // Contextから取得したappsを使用
          selectedApp={selectedApp}
          onSelectApp={setSelectedApp}
        />
        <KeyboardLayoutSelector
          layouts={keyboardLayouts}
          selectedLayout={keyboardLayout}
          onSelectLayout={setKeyboardLayout}
        />
      </div>
      <KeyboardLayout
        pressedKeys={pressedKeys}
        getKeyDisplayName={getDisplayKeyByCode}
        shortcutDescriptions={shortcutDescriptions}
        keyboardLayout={keyboardLayout}
      />
      <KeyDisplay
        pressedKeys={pressedKeys}
        getKeyDisplayName={getDisplayKeyByCode}
        description={currentDescription}
        availableShortcuts={availableShortcuts}
        selectedApp={selectedApp}
        shortcutDescriptions={shortcutDescriptions}
        keyboardLayout={keyboardLayout}
      />
    </>
  );
};

export default NormalModeView;
