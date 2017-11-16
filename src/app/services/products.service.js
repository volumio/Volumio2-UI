class ProductService {
  constructor() {
  }

  getProducts() {
    return {
      'free': {
        name: "FREE",
        description: "Free Plan Description",
        amount: 0,
        plan: 'free',
        planCode: '',
        textualPrice: 'FREE',
        ribbon: false,
        features: [
          'AUTH.FREE_FEATURE1',
          'AUTH.FREE_FEATURE2',
          'AUTH.FREE_FEATURE3',
          'AUTH.FREE_FEATURE4',
          'AUTH.FREE_FEATURE5',
          'AUTH.FREE_FEATURE6'
        ],
        maxDevices: 1
      },
      'virtuoso': {
        name: "VIRTUOSO",
        description: "Virtuoso Plan Description",
        amount: 299,
        plan: 'virtuoso',
        planCode: 'virtuoso',
        textualPrice: '€ 2.99/mo',
        trialDays: 2,
        ribbon: true,
        features: [
          'AUTH.VIRTUOSO_FEATURE1',
          'AUTH.VIRTUOSO_FEATURE2',
          'AUTH.VIRTUOSO_FEATURE3',
          'AUTH.VIRTUOSO_FEATURE4',
          'AUTH.VIRTUOSO_FEATURE5',
          'AUTH.VIRTUOSO_FEATURE6'
        ],
        maxDevices: 1
      },
      'superstar': {
        name: "SUPERSTAR",
        description: "Superstar Plan Description",
        amount: 699,
        plan: 'superstar',
        planCode: 'superstar',
        textualPrice: '€ 6.99/mo',
        features: [
          'AUTH.SUPERSTAR_FEATURE1',
          'AUTH.SUPERSTAR_FEATURE2',
          'AUTH.SUPERSTAR_FEATURE3',
          'AUTH.SUPERSTAR_FEATURE4',
          'AUTH.SUPERSTAR_FEATURE5',
          'AUTH.SUPERSTAR_FEATURE6'
        ],
        maxDevices: 6
      }
    };
  }

  getProductByCode(code) {
    return this.getProducts()[code];
  }

  getProductForUser(user){
    return this.getProductByCode(user.plan || 'free');
  }

}

export default ProductService;
