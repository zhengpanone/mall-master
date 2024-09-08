const eventNames = ['API:UN_AUTH','API:VALIDATE_ERROR'] as const;

type EventNames = (typeof eventNames)[number];

class EventEmitter{
    private listeners:Record<EventNames,Set<Function>>={
        'API:UN_AUTH':new Set(),
        "API:VALIDATE_ERROR":new Set(),
    }

    on(eventName:EventNames,listener:Function){
        this.listeners[eventName].add(listener);
    }

    emit(eventName:EventNames,...args:any[]){
        this.listeners[eventName].forEach((listener)=>listener(...args));
    }
}

export default new EventEmitter();