let pushedKeys = {};
const OPEN_SIDE_PANEL_EVENT = 'OpenSidePanel';
const OPEN_SIDE_PANEL_EVENT_TRIGGER_KEYS = 'free_sidebar_open_side_panel_event_trigger_keys';

addOpenSidePanelEvent();
addKeydownEvent();
addKeyupEvent();

/**
 * When {@link OPEN_SIDE_PANEL_EVENT} is dispatched, open chrome side panel.
 */
function addOpenSidePanelEvent() {
  document.addEventListener(
    OPEN_SIDE_PANEL_EVENT,
    function (_) {
      chrome?.runtime?.sendMessage({
        type: 'open_side_panel',
      });
    },
    false
  );
}

/**
 * Add keydown event to document.
 * When Shift + Control + Custom Key Map is pushed, dispatch {@link OPEN_SIDE_PANEL_EVENT}.
 */
function addKeydownEvent() {
  document.addEventListener('keydown', async (event) => {
    const name = event.key;
    const code = event.code;
    pushedKeys[code] = name;

    const pushedKeyValues = Object.values(pushedKeys).map((key) => key.toLowerCase());

    // short-circuiting
    if (!pushedKeyValues.includes('control') || !pushedKeyValues.includes('shift')) {
      return;
    }

    if ((await getCustomKeyMap()).every((key) => pushedKeyValues.includes(key.toLowerCase()))) {
      pushedKeys = {};
      document.dispatchEvent(new Event(OPEN_SIDE_PANEL_EVENT));
    }
  });
}

/**
 * Add keyup event to document.
 */
function addKeyupEvent() {
  document.addEventListener('keyup', (event) => {
    const code = event.code;
    delete pushedKeys[code];
  });
}

/**
 * Get custom key map from chrome storage.
 */
async function getCustomKeyMap() {
  const openSidePanelEventTriggerKeysStr = await chrome?.storage?.local?.get(
    OPEN_SIDE_PANEL_EVENT_TRIGGER_KEYS
  );
  let openSidePanelEventTriggerKeyNames = ['Control', 'Shift', 'O'];
  if (
    !!openSidePanelEventTriggerKeysStr &&
    openSidePanelEventTriggerKeysStr[OPEN_SIDE_PANEL_EVENT_TRIGGER_KEYS]
  ) {
    openSidePanelEventTriggerKeyNames = JSON.parse(
      openSidePanelEventTriggerKeysStr[OPEN_SIDE_PANEL_EVENT_TRIGGER_KEYS]
    );
  }
  return openSidePanelEventTriggerKeyNames;
}
