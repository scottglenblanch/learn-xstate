import {
  Machine,
  interpret,
} from 'xstate';

const intersectionMachine = Machine({
  id: 'intersection',
  initial: 'northToSouth',
  states: {
    northToSouth: {
      id: 'northToSouth',
      initial: 'green',
      states: {
        green: { on: { TIMER: 'yellow'} },
        yellow: { on: { TIMER: 'red' } },
        red: {
          on: { TIMER: '.eastToWest'},
          states: {
            eastToWest: {
              initial: 'green',
              states: {
                green: { on: { TIMER: 'yellow' } },
                yellow: { on: { TIMER: 'red' } },
                red: { on: { TIMER: '#northToSouth.green'}}
              }
            }
          }
        },
      }
    }
  },
});

const service = interpret(intersectionMachine).onTransition(current => {
  const { value } = current;

  console.log(current)
})

const addEventToButton = () => {
  document.querySelector('#button').addEventListener('click',function(e) {
    service.send('TIMER');
  });
}


const initApp = () => {
  addEventToButton();
  service.start();
}

window.onload = function() {
  initApp();
}


