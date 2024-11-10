import { assign, createMachine, fromPromise } from "xstate";
import { fetchCountries } from "../Utils/api";

export const fillCountries = {
  id: "fill countries",
  initial: "loading",
  states: {
    loading: {
      invoke: {
        id: 'getCountries',
        src: fromPromise(() => fetchCountries()),
        onDone: {
          target: 'success',
          actions: assign({ countries: ({ context, event }) => event.output }),
        },
        onError: {
          target: 'failure',
          actions: assign({ error: 'Falló el request' }),
        },
      },
    },
    success: {},
    failure: {
      on: {
        RETRY: [
          {
            target: "loading",
            actions: [],
          },
        ],
      },
    }
  }
}

export const bookingMachine = createMachine(
  {
    id: "buy plane tickets",
    initial: "initial",
    context: {
      passengers: [],
      selectedCountry: '',
      countries: [],
      error: '',
    },
    states: {
      initial: {
        on: {
          START: [
            {
              target: "search",
              actions: [],
            },
          ],
        },
      },
      search: {
        on: {
          CONTINUE: [
            {
              target: "passengers",
              actions: assign({selectedCountry: ({context, event}) => event.selectedCountry}),
            },
          ],
          CANCEL: [
            {
              target: "initial",
              actions: [],
            },
          ],
        },
        ...fillCountries,
      },
      passengers: {
        on: {
          DONE: [
            {
              target: "tickets",
              guard: "moreThanOnePassenger",
              actions: [],
            },
          ],
          CANCEL: [
            {
              target: "initial",
              actions: ['cleanContext'],
            },
          ],
          ADD: [
            {
              target: "passengers",
              actions: assign(({context, event}) => context.passengers.push(event.newPassenger)),
            },
          ],
        },
      },
      tickets: {
        after: {
          8000: {
            target: "initial",
            actions: ['cleanContext'],
          }
        },
        on: {
          FINISH: [
            {
              target: "initial",
              actions: [],
            },
          ],
        },
      },
    },
    predictableActionArguments: true,
    preserveActionOrder: true,
  },
  {
    actions: {
      cleanContext: assign({
                selectedCountry: ({context, event}) => '',
                passengers: ({context, event}) => [],
              }),
    },
    services: {},
    guards: {
      moreThanOnePassenger: ({context}) => {
        return context.passengers.length > 0;
      }
    },
    delays: {},
  },
);