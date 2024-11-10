import { assign, createMachine } from "xstate";

export const fillCountries = {
  id: "fill countries",
  initial: "loading",
  states: {
    loading: {
        on: {
          DONE: [
            {
              target: "success",
              actions: [],
            },
          ],
          ERROR: [
            {
              target: "failure",
              actions: [],
            },
          ],
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
    },
    states: {
      initial: {
        on: {
          START: [
            {
              target: "search",
              actions: ['imprimirInicio'],
            },
          ],
        },
      },
      search: {
        entry: {
          type: "imprimirEntrada",
        },
        exit: {
          type: "imprimirSalida",
        },
        on: {
          CONTINUE: [
            {
              target: "passengers",
              actions: [assign({
                selectedCountry: ({context, event}) => event.selectedCountry
              })],
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
              actions: [],
            },
          ],
          CANCEL: [
            {
              target: "initial",
              actions: [assign({
                selectedCountry: ({context, event}) => '',
                passengers: ({context, event}) => [],
              })],
            },
          ],
          ADD: [
            {
              target: "passengers",
              actions: [assign(
                ({context, event}) => context.passengers.push(event.newPassenger)
              )],
            },
          ],
        },
      },
      tickets: {
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
      imprimirInicio: () => console.log('Imprimir inicio'),
      imprimirEntrada: () => console.log('Imprimir entrada a Search'),
      imprimirSalida: () => console.log('Imprimir salida del search'),
    },
    services: {},
    guards: {},
    delays: {},
  },
);