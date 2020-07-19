import {
  Machine,
  interpret,
  send,
} from 'xstate';

const northToSouthID = 'northToSouth';
const eastToWestID = 'eastToWest';

const intersectionMachine = Machine({
  id: 'intersection',
  initial: northToSouthID,
  type: 'parallel',
  states: {
    [northToSouthID]: {
      id: northToSouthID,
      initial: 'green',
      on: {
        RESET_NORTH_TO_SOUTH: {
          target: '.green',
        }
      },
      states: {
        green: { on: { TIMER: 'yellow' }},
        yellow: { on: { TIMER: 'red' }},
        red: {
          entry: send('RESET_EAST_TO_WEST')
        }
      }
    },
    [eastToWestID]: {
      id: eastToWestID,
      initial: 'red',
      on: {
        RESET_EAST_TO_WEST: {
          target: '.green'
        }
      },
      states: {
        green: { on: { TIMER: 'yellow' }},
        yellow: { on: { TIMER: 'red' }},
        red: {
          entry: send('RESET_NORTH_TO_SOUTH'),
        }
      }
    }
  },
});

const service = interpret(intersectionMachine).onTransition(current => {
  console.log(current);
})

const isNorthToSouth = (state) => state.matches(northToSouthID);

const isEastToWest = (state) => state.matches(eastToWestID);

const getID = (state) => {
  if (isNorthToSouth(state)) return 'northToSouth';
  else if (isEastToWest(state)) return 'eastToWest';
}

const getStopLightColor = (state) => state.value[getID(state)];

const getImageElementToUpdate = (state) => document.body.querySelector(`#${getID(state)}`);

const getButtonElement = () => document.querySelector('#button');

const getImageSrc = (state) => getStopLightColor(state) + '-light.jpg';

const updateDOM = state => getImageElementToUpdate(state).src = getImageSrc(state);

const fireWhenButtonClicked = e => {
  const newState = service.send('TIMER');

  updateDOM(newState);
}

const addEventToButton = () => getButtonElement().addEventListener('click', fireWhenButtonClicked);

const initApp = () => {
  addEventToButton();
  service.start();
}

window.onload = function() {
  initApp();
}


