import { createMachine } from "xstate";

export const bookingMachine = createMachine(
  {
    id: "buy plane tickets",
    initial: "initial",
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
              actions: [],
            },
          ],
          CANCEL: [
            {
              target: "initial",
              actions: [],
            },
          ],
        },
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
              actions: [],
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
    actions: {},
    services: {},
    guards: {},
    delays: {},
  },
);