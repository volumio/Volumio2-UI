class MatchmediaService {
  constructor(matchmedia) {
    'ngInject';
    this.isPhone = false;
    matchmedia.onPhone((mediaQueryList) => {
      this.isPhone = mediaQueryList.matches;
    });
  }
}

export default MatchmediaService;
