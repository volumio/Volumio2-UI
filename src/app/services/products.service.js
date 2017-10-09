class ProductService {
  constructor() {
  }
  
  getProducts(){
    return {
      'virtuoso': {
        name: "VIRTUOSO",
        description: "Virtuoso Plan Description",
        amount: 299,
        plan: 'virtuoso',
        planCode: 'virtuoso',
        textualPrice: '€ 2.99',
        trialDays: 2,
        ribbon: true
      },
      'superstar': {
        name: "SUPERSTAR",
        description: "Superstar Plan Description",
        amount: 699,
        plan: 'superstar',
        planCode: 'superstar',
        textualPrice: '€ 6.99'
      }
    };
  }
  
  getProductByCode(code){
    return this.getProducts()[code];
  }


}

export default ProductService;