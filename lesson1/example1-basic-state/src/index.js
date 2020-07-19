import {
  Machine,
  interpret,
} from 'xstate';

const initialState = 'green';
const lightMachine = Machine({
  key: 'light',
  initial: initialState,
  states: {
    green: {
      on: {
        TIMER: 'yellow'
      }
    },
    yellow: {
      on: {
        TIMER: 'red'
      }
    },
    red: {
      on: {
        TIMER: 'green'
      },
    }
  },
});

const service = interpret(lightMachine).onTransition(current => {
  const { value } = current;

  updateDOM(value);
})

const addEventToButton = () => {
  document.querySelector('#button').addEventListener('click',function(e) {
    service.send('TIMER');
  });
}

const updateDOM = (value) => {
  updateDOMLightElement(value);
  updateDOMImageElement(value);
}

const updateDOMLightElement = (value) => {
  document.body.querySelector('#light-container').innerHTML = value;
}

const updateDOMImageElement = (value) => {
  document.body.querySelector('#light-image').src = `${value}-light.jpg`;
}

const initApp = () => {
  addEventToButton();
  service.start();
  updateDOM(initialState);
}

window.onload = function() {
  initApp();
}


