class MatchmediaService {
  constructor(matchmedia) {
    'ngInject';
    this.isPhone = false;
    this.matchmedia = matchmedia;

    matchmedia.onPhone((mediaQueryList) => {
      this.isPhone = mediaQueryList.matches;
    });

    matchmedia.onPortrait(() => {
      this.isPortrait = true;
      this.isLandscape = false;
    });

    matchmedia.onLandscape(() => {
      this.isLandscape = true;
      this.isPortrait = false;
    });
  }

  onPortrait(cb) {
    this.matchmedia.onPortrait(cb);
  }

  onLandscape(cb){
    this.matchmedia.onLandscape(cb);
  }
}

export default MatchmediaService;
