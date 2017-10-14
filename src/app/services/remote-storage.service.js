class RemoteStorageService {
  constructor(angularFireService, $q) {
    this.angularFireService = angularFireService;
    this.$q = $q;
  }

  uploadFile(file,userId){
    const path = `userAvatars/${userId}`;
    return this.angularFireService.uploadFile(path,file);
  }
  
  downloadAvatar(){
    return this.angularFireService.downloadImage(path);
  }

}

export default RemoteStorageService;