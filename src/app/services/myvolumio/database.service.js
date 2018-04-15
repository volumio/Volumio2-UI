class DatabaseService {
  constructor(angularFireService, $q) {
    'ngInject';
    this.angularFireService = angularFireService;
    this.$q = $q;
  }

  addObjectToList(pathRef, object) {
    return this.angularFireService.addObjectToList(object, pathRef);
  }

  push(ref, object) {
    var putting = this.$q.defer();
    this.angularFireService.push(ref, object).then((ref) => {
      const keyRef = ref.key;
      putting.resolve(keyRef);
    }).catch((error) => {
      putting.reject(error);
    });
    return putting.promise;
  }

  write(ref, object) {
    var writing = this.$q.defer();
    this.angularFireService.write(ref, object).then(() => {
      writing.resolve();
    }, (error) => {
      writing.reject(error);
    });
    return writing.promise;
  }

  updateFirebaseObject(object) {
    var updating = this.$q.defer();
    this.angularFireService.saveObject(object).then(() => {
      updating.resolve();
    }, (error) => {
      updating.reject(error);
    });
    return updating.promise;
  }

  get(ref) {
    return this.angularFireService.get(ref);
  }

  getInfByKey(ref, limit) {
    return this.angularFireService.getInfByKey(ref, limit);
  }

  getArray(ref) {
    return this.angularFireService.getArray(ref);
  }

  waitForValue(ref) {
    var waitingForValue = this.$q.defer();
    this.angularFireService.waitForValue(ref).then((result) => {
      waitingForValue.resolve(result);
    }, (error) => {
      waitingForValue.reject(error);
    });
    return waitingForValue.promise;
  }

  delete(path) {
    return this.angularFireService.deleteFromDb(path);
  }

}

export default DatabaseService;