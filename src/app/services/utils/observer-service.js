import { uniqueId } from 'lodash';


// Abstracts away the observer pattern and encorages one source of truth (not quite, but almost)
// TODO: maybe create an "ObserverComponent" wrapper to abstract this away from the compnents
class ObserverService {
  constructor() {
    this.observers = new Map();
    this.state = {};
  }

  registerObserverCallback(callback) {
    const id = uniqueId('callback_');

    this.observers.set(id, callback);
    return id;
  }

  deregisterObserverCallback(id) {
    this.observers.delete(id);
    return null;
  }

  updateState(update = this.state) {
    this.state = Object.assign({}, this.state, update);

    this.observers.forEach((callback, id) => {
      callback(this.state);
    });
  }
}

export default ObserverService;
