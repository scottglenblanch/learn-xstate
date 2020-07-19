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
});

const getNorthToSouthImageElement = () => document.body.querySelector(`#${northToSouthID}`);

const getEastToWestImageElement = () => document.body.querySelector(`#${eastToWestID}`);

const getButtonElement = () => document.querySelector('#button');

const updateNorthToSouthElement = state => {
  const { northToSouth: northToSouthValue } = state.value;

  console.log(northToSouthValue)

  getNorthToSouthImageElement().src = `${northToSouthValue}-light.jpg`;
};

const updateEastToWestElement = state => {
  const { eastToWest: eastToWestValue } = state.value;

  console.log(eastToWestValue)

  getEastToWestImageElement().src = `${eastToWestValue}-light.jpg`;
};

const updateDOM = (state) => {
  updateNorthToSouthElement(state);
  updateEastToWestElement(state);
}

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


