import { Unsubscribe } from "react-better-core";

export function generateEventEmitter<EventEmitter extends Record<string, any>>(): {
   emit: <EventName extends keyof EventEmitter>(
      name: EventName,
      data: EventEmitter[EventName] extends never ? undefined : EventEmitter[EventName],
   ) => void;
   listen: <EventName extends keyof EventEmitter>(
      name: EventName,
      callback?: (data: EventEmitter[EventName]) => void,
   ) => Unsubscribe;
} {
   const eventEmitter = new EventTarget();

   return {
      emit: (name, data) => {
         const event = new CustomEvent(name.toString(), {
            detail: data,
         });
         eventEmitter.dispatchEvent(event);
      },
      listen: (name, callback) => {
         const listener = (event: Event) => {
            callback?.((event as CustomEvent).detail);
         };

         eventEmitter.addEventListener(name.toString(), listener);

         return () => {
            eventEmitter.removeEventListener(name.toString(), listener);
         };
      },
   };
}
