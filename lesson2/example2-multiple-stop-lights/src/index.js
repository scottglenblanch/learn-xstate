import {
  Machine,
  interpret,
} from 'xstate';

const northToSouthID = 'northToSouth';
const eastToWestID = 'eastToWest';

const intersectionMachine = Machine({
  id: 'intersection',
  initial: northToSouthID,
  states: {
    northToSouth: {
      id: northToSouthID,
      initial: 'green',
      states: {
        green: { on: { NORTH_TO_SOUTH_TIMER: 'yellow'}},
        yellow: { on: { NORTH_TO_SOUTH_TIMER: 'red' }},
        red: { on: { NORTH_TO_SOUTH_TIMER: `#${eastToWestID}.green` }},
      }
    },
    eastToWest: {
      id: eastToWestID,
      initial: 'red',
      states: {
        green: { on: { EAST_TO_WEST_TIMER: 'yellow' }},
        yellow: { on: { EAST_TO_WEST_TIMER: 'red' }},
        red: { on: { EAST_TO_WEST_TIMER: `#${northToSouthID}.green` }}
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


