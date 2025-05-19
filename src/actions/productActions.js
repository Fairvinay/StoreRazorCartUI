import {
  PRODUCT_LIST_FAIL,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_REQUEST,
  PRODUCT_DETAIL_REQUEST,
  PRODUCT_DETAIL_SUCCESS,
  PRODUCT_DETAIL_FAIL,
  PRODUCT_DELETE_REQUEST,
  PRODUCT_DELETE_SUCCESS,
  PRODUCT_DELETE_FAIL,
  PRODUCT_CREATE_REQUEST,
  PRODUCT_CREATE_SUCCESS,
  PRODUCT_CREATE_FAIL,
  PRODUCT_UPDATE_REQUEST,
  PRODUCT_UPDATE_SUCCESS,
  PRODUCT_UPDATE_FAIL,
  PRODUCT_REVIEW_REQUEST,
  PRODUCT_REVIEW_SUCCESS,
  PRODUCT_REVIEW_FAIL,
  PRODUCT_TOP_RATED_REQUEST,
  PRODUCT_TOP_RATED_SUCCESS,
 
  PRODUCT_FILTER_REQUEST,
  PRODUCT_FILTER_SUCCESS,
} from "../constants/productConstants";
import axios from "axios";
//export const SELF_API_URL =   "https://storegoods-storenotify.netlify.app";
import { SELF_API_URL  } from '../config';   //
let default_keyword = "vivo";
 
function isJsonString(str) {
  try {
    const obj = JSON.parse(str);
    return obj && typeof obj === "object";
  } catch (e) {
    return false;
  }
}
function isJsonCompatible(obj) {
  try {
    JSON.stringify(obj);
    console.log(JSON.stringify(obj));
    return true;
  } catch (e) {
    return false;
  }
}
const getStaticProducts = async (brandIn) => {
  const brands = ['vivo', 'oppo', 'motorola', 'samsung'];
const pages = [1];//[1, 2, 3];

const promises = [];

for (const brand of brands) {
  for (const page of pages) {
    const url =SELF_API_URL+`/data/${brand}PageDetail${page}.json`; // relative path
    promises.push(
      axios.get(url).then(res => ({
        brand,
        data: res.data,
      })).catch(err => {
        console.error(`❌ Failed to load ${url}`, err.message);
        return { brand, data: [] };
      })
    );
  }
}

const results = await Promise.all(promises);

const allData = {};
brands.forEach(brand => {
  allData[brand] = results
    .filter(r => r.brand === brand)
    .flatMap(r => r.data);
   // allData[brand] = allData[brand].forEach(console.log);
   console.log(allData[brand][0]);
   // localStorage.setItem(brand, JSON.stringify(allData[brand] ));
});

return brands.find(brand => brand === brandIn);// allData[brandIn ] !== undefined


}


const listProducts =
  (keyword = "", pageNumber = 1) =>
  async (dispatch , getState) => {
    try {
      const { apiConfig } = getState();
      const apiUrl = apiConfig.apiUrl;

      dispatch({ type: PRODUCT_LIST_REQUEST });
      default_keyword = keyword;
      const { data } = await axios.get(
        apiUrl+`/api/products?keyword=${keyword}&pageNumber=${pageNumber}`
      );

      dispatch({ type: PRODUCT_LIST_SUCCESS, payload: data });
      const brands = ['vivo', 'oppo', 'motorola', 'samsung'];
      let resultbData = [];
      for(let i = 0; i < brands.length; i++){
        let brand = brands[i] ;
         let mb =  await  getStaticProducts(brand);//localStorage.getItem(brand);
         if(mb !== undefined && mb !== null){
            if( isJsonString(mb)) {
             console.log(mb); 
             let bData = JSON.parse(mb);
             resultbData.push(bData);
         }
            else if (isJsonCompatible(mb)){
              resultbData.push(mb);
            } 
             
             
         }
      }


      dispatch({ type: PRODUCT_LIST_SUCCESS, payload: resultbData[keyword] });
      
    } catch (error) {

      const brands = ['vivo', 'oppo', 'motorola', 'samsung'];
      let resultbData = [];
      for(let i = 0; i < brands.length; i++){
        let brand = brands[i] ;
         let mb = await getStaticProducts(brand);//localStorage.getItem(brand);
         if(mb !== undefined && mb !== null){
          let bData ="";
          if( isJsonString(mb)) {
              bData = JSON.parse(mb);
             if(Array.isArray(bData)){
               let firstEl = bData[0];;
                   console.log(firstEl); 
              
             }
          }
          else if (isJsonCompatible(mb)){
            bData =  mb;
            console.log("static cached products loaded "); 
          }
          if(Array.isArray(bData)){
             resultbData.push({ brand : brand , data : bData });
             console.log("resultbData set for brand " + brand); 
         }
      }
      }
      keyword = default_keyword;
      let keywordData =[];
      if(keyword !== ''){
        keywordData = resultbData.filter((item) =>  item.brand === keyword
      );
      console.log("keywordData set for brand " + keyword); 
      }
      else {
        keywordData = resultbData;
      }
      let pro = { products : sampleProductDataArray , pages :0 , page:1};
      if(keywordData.length > 0 && keywordData[0].data !==undefined ){
        console.log(keywordData[0].data); 
        pro = { products : keywordData[0].data };
       }
      //let pro = { products : keywordData[0].data  , pages :1 , page:1};
      console.log(pro.products); 
      //dispatch({ type: PRODUCT_LIST_SUCCESS, payload: pro });
      console.log(pro.products); 
      dispatch({ type: PRODUCT_LIST_SUCCESS, payload: pro });

      if( pro === undefined && pro === null){
        if (keywordData.length === 0) {
          
        }else {
          dispatch({
            type: PRODUCT_LIST_FAIL,
            payload:
              error.response && error.response.data.message
                ? error.response.data.message
                : error.message,
          });  
        }
      
      }

     
    }
  };

const topRatedProducts = () => async (dispatch, getState) => {
  let keyword =  '';
  try {
    const { apiConfig } = getState();
    const apiUrl = apiConfig.apiUrl;

    dispatch({ type: PRODUCT_TOP_RATED_REQUEST });

    const { data } = await axios.get(apiUrl+`/api/products/toprated`);

    dispatch({ type: PRODUCT_TOP_RATED_SUCCESS, payload: data });
  } catch (error) {
    const brands = ['vivo', 'oppo', 'motorola', 'samsung'];
    let resultbData = [];
    for(let i = 0; i < brands.length; i++){
      let brand = brands[i] ;
       let mb =  await  getStaticProducts(brand);//localStorage.getItem(brand);
       if(mb !== undefined && mb !== null){
        let bData ="";
        if( isJsonString(mb)) {
           let bData = JSON.parse(mb);
           if(Array.isArray(bData)){
             let firstEl = bData[0];;
                 console.log(firstEl); 
            
           }
          }
          else if (isJsonCompatible(mb)){
            bData =  mb;
            console.log("static cached products loaded "); 
          }
          if(Array.isArray(bData)){
           resultbData.push({ brand : brand , data : bData });
       }
    }
    }
      
    default_keyword = (default_keyword !== null && default_keyword !== undefined) ? default_keyword : 'oppo';
    keyword = default_keyword;
    let keywordData =[];
    if(keyword !== ''){
      keywordData = resultbData.filter((item) =>  item.brand === keyword
    );
    }
    else {
      keywordData = resultbData;
    }
    let pro = { products : sampleProductDataArray , pages :0 , page:1};
    if(keywordData.length > 0 && keywordData[0].data !==undefined ){
    console.log(keywordData[0].data); 
      pro = { products : keywordData[0].data };
     }
   


    
    console.log("TOP RATED   "+ pro.products); 
    dispatch({ type: PRODUCT_TOP_RATED_SUCCESS, payload: pro.products });

    if( pro === undefined && pro === null){
      if (keywordData.length === 0) {
        
      }else {
        dispatch({
          type: PRODUCT_LIST_FAIL,
          payload:
            error.response && error.response.data.message
              ? error.response.data.message
              : error.message,
        });  
      }
    
    }



   /* dispatch({
      type: PRODUCT_TOP_RATED_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });*/
  }
};

const filterProduct =
  (rating = "", price = "", brand = "", category = "") =>
  async (dispatch, getState) => {
    try {
      const { apiConfig } = getState();
      const apiUrl = apiConfig.apiUrl;


      dispatch({
        type: PRODUCT_FILTER_REQUEST,
      });

      const { data } = await axios.get(
        apiUrl+`/api/products/filter?rating=${rating}&price=${price}&brand=${brand}&category=${category}`
      );

      dispatch({
        type: PRODUCT_FILTER_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: PRODUCT_DETAIL_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

const listProductDetail = id => async (dispatch, getState) => {
  try {
    const { apiConfig } = getState();
    const apiUrl = apiConfig.apiUrl;
    dispatch({ type: PRODUCT_DETAIL_REQUEST });

    const { data } = await axios.get(apiUrl+`/api/products/${id}`);
    dispatch({ type: PRODUCT_DETAIL_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: PRODUCT_DETAIL_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// Admin Roles

const createProduct = () => async (dispatch, getState) => {
  try {
    const { apiConfig } = getState();
    const apiUrl = apiConfig.apiUrl;
    dispatch({
      type: PRODUCT_CREATE_REQUEST,
    });
    const { userInfo } = getState().userLogin;

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: userInfo.token,
      },
    };
    const { data } = await axios.post(apiUrl+`/api/products`, {}, config);

    dispatch({
      type: PRODUCT_CREATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_CREATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

const updateProduct = (product, id) => async (dispatch, getState) => {
  try {
    const { apiConfig } = getState();
    const apiUrl = apiConfig.apiUrl;
    dispatch({
      type: PRODUCT_UPDATE_REQUEST,
    });
    const { userInfo } = getState().userLogin;

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: userInfo.token,
      },
    };

    const { data } = await axios.put(apiUrl+`/api/products/${id}`, product, config);

    dispatch({
      type: PRODUCT_UPDATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_UPDATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

const deleteProduct = id => async (dispatch, getState) => {
  try {
    const { apiConfig } = getState();
    const apiUrl = apiConfig.apiUrl;
    dispatch({
      type: PRODUCT_DELETE_REQUEST,
    });
    const { userInfo } = getState().userLogin;

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: userInfo.token,
      },
    };
    await axios.delete(apiUrl+`/api/products/${id}`, config);

    dispatch({
      type: PRODUCT_DELETE_SUCCESS,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_DELETE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

const createReview = (review, id) => async (dispatch, getState) => {
  try {
    const { apiConfig } = getState();
    const apiUrl = apiConfig.apiUrl;
    dispatch({
      type: PRODUCT_REVIEW_REQUEST,
    });

    const userInfo = getState().userLogin.userInfo;
    const config = {
      headers: {
        "Content-Type": "Application/json",
        Authorization: userInfo.token,
      },
    };

    const { data } = await axios.post(
      apiUrl+`/api/products/${id}/review`,
      {
        rating: review.rating,
        comment: review.comment,
      },
      config
    );

    dispatch({
      type: PRODUCT_REVIEW_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_REVIEW_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
const sampleProductDataArray = [

  {
    "_id": "682964718522a610f4f63da1",
    "user": "6819f3bd808190ec8f62a953",
    "name": "Motorola Edge 60 Fusion",
    "image": "https://i.gadgets360cdn.com/products/small/edge-60-fusion-motorola-db-240x180-1743575993.jpg?downsize=*:90",
    "brand": "Motorola Edge 60 Fusion",
    "category": "mobile",
    "description": "Display\n                            6.70-inch\n                            (1220x2712)\nProcessor\n                            MediaTek Dimensity\n                            7400\nFront Camera\n                            32MP\nRear Camera\n                            50MP + 13MP\nRAM\n                            8GB, 12GB\nStorage\n                            256GB\nBattery\n                            Capacity 5500mAh\nOS\n                            Android 15",
    "numReviews": 0,
    "price": 1998,
    "countInStock": 0
  },
  {
    "_id": "682964718522a610f4f63d99",
    "user": "6819f3bd808190ec8f62a953",
    "name": "Motorola Edge 60 Stylus",
    "image": "https://i.gadgets360cdn.com/products/small/motorola-edge-60-stylus-motorola-db-240x180-1744700572.jpg?downsize=*:90",
    "brand": "Motorola Edge 60 Stylus",
    "category": "mobile",
    "description": "Display\n                            6.67-inch\n                            (1220x2712)\nProcessor\n                            Qualcomm\n                            Snapdragon 7s Gen 2\nFront Camera\n                            32MP\nRear Camera\n                            50MP + 13MP\nRAM\n                            8GB\nStorage\n                            256GB\nBattery\n                            Capacity 5000mAh\nOS\n                            Android 15",
    "numReviews": 0,
    "price": 7102,
    "countInStock": 0
  },
  {
    "_id": "682964718522a610f4f63d75",
    "user": "6819f3bd808190ec8f62a953",
    "name": "Motorola Moto X (Gen 2)",
    "image": "https://drop.ndtv.com/TECH/product_database/images/95201422249PM_120_motorola_moto_x_gen_2.jpeg?downsize=*:90",
    "brand": "Motorola Moto X (Gen 2)",
    "category": "mobile",
    "description": "Display\n                            5.20-inch\n                            (1080x1920)\nProcessor\n                            Qualcomm\n                            Snapdragon 801\nFront Camera\n                            2MP\nRear Camera\n                            13MP\nRAM\n                            2GB\nStorage\n                            16GB\nBattery\n                            Capacity 2300mAh\nOS\n                            Android\n                            4.4.4",
    "numReviews": 0,
    "price": 6709,
    "countInStock": 0
  },
  {
    "_id": "682964718522a610f4f63d93",
    "user": "6819f3bd808190ec8f62a953",
    "name": "Vivo T2 Pro 5G",
    "image": "https://i.gadgets360cdn.com/products/small/Vivo-T2-Pro-5G-DB-240x180-1695375480.jpg?downsize=*:90",
    "brand": "Vivo T2 Pro 5G",
    "category": "mobile",
    "description": "Display\n                            6.78-inch\n                            (1080x2400)\nProcessor\n                            MediaTek Dimensity\n                            7200\nFront Camera\n                            16MP\nRear Camera\n                            64MP + 2MP\nRAM\n                            8GB\nStorage\n                            128GB,\n                            256GB\nBattery\n                            Capacity 4600mAh\nOS\n                            Android 13",
    "numReviews": 0,
    "price": 2009,
    "countInStock": 0
  },
  {
    "_id": "store_6.187127687774543",
    "user": "aidfe7.466418311221174",
    "name": "Vivo Y29 5G",
    "image": "https://i.gadgets360cdn.com/products/small/vivo-y29-5g-vivo-db-1-240x180-1735032273.jpg?downsize=*:90",
    "brand": "Vivo Y29 5G",
    "category": "mobile",
    "description": "Display\n                            6.68-inch\n                            (720x1608)\nProcessor\n                            MediaTek Dimensity\n                            6300\nFront Camera\n                            8MP\nRear Camera\n                            50MP +\n                            0.08MP\nRAM\n                            4GB, 6GB,\n                            8GB\nStorage\n                            128GB,\n                            256GB\nBattery\n                            Capacity 5500mAh\nOS\n                            Android 14",
    "reviews": [],
    "rating": 1,
    "numReviews": 2,
    "price": "13,999",
    "countInStock": 3
  },
  {
    "_id": "682964718522a610f4f63dad",
    "user": "6819f3bd808190ec8f62a953",
    "name": "Vivo V25 5G",
    "image": "https://i.gadgets360cdn.com/products/small/vivo-V25-5g-DB-240x180-1663229783.jpg?downsize=*:90",
    "brand": "Vivo V25 5G",
    "category": "mobile",
    "description": "Display\n                            6.44-inch\n                            (1080x2404)\nProcessor\n                            MediaTek Dimensity\n                            900\nFront Camera\n                            50MP\nRear Camera\n                            64MP + 8MP +\n                            2MP\nRAM\n                            8GB, 12GB\nStorage\n                            128GB,\n                            256GB\nBattery\n                            Capacity 4,500mAh\nOS\n                            Android 12",
    "numReviews": 0,
    "price": 7267,
    "countInStock": 0
  },
  {
    "_id": "682964718522a610f4f63da3",
    "user": "6819f3bd808190ec8f62a953",
    "name": "Vivo T4x 5G",
    "image": "https://i.gadgets360cdn.com/products/small/vivo-t4x-5g-vivo-db-240x180-1741158304.jpg?downsize=*:90",
    "brand": "Vivo T4x 5G",
    "category": "mobile",
    "description": "Display\n                            6.72-inch\n                            (1080x2408)\nProcessor\n                            MediaTek Dimensity\n                            7300\nFront Camera\n                            8MP\nRear Camera\n                            50MP + 2MP\nRAM\n                            6GB, 8GB\nStorage\n                            128GB,\n                            256GB\nBattery\n                            Capacity 6500mAh\nOS\n                            Android 15",
    "numReviews": 0,
    "price": 6674,
    "countInStock": 0
  },{
    "_id": "682964718522a610f4f63db3",
    "user": "6819f3bd808190ec8f62a953",
    "name": "Samsung Galaxy Tab S10 FE+",
    "image": "https://i.gadgets360cdn.com/products/small/galaxy-tab-s10-fe-plus-samsung-db-240x180-1743659642.jpg?downsize=*:90",
    "brand": "Samsung Galaxy Tab S10 FE+",
    "category": "mobile",
    "description": "Display\n                            13.10-inch\n                            (1440x2304)\nFront Camera\n                            12MP\nRAM\n                            8GB\nOS\n                            Android 15\nStorage\n                            128GB\nRear Camera\n                            13MP\nBattery\n                            Capacity 10090mAh",
    "numReviews": 0,
    "price": 151,
    "countInStock": 0
  },
  {
    "_id": "682964718522a610f4f63d9d",
    "user": "6819f3bd808190ec8f62a953",
    "name": "Samsung Galaxy M53 5G",
    "image": "https://i.gadgets360cdn.com/products/small/samsung-galaxy-m53-240x180-1650604665.jpg?downsize=*:90",
    "brand": "Samsung Galaxy M53 5G",
    "category": "mobile",
    "description": "Display\n                            6.70-inch\n                            (1080x2400)\nProcessor\n                            MediaTek Dimensity\n                            900\nFront Camera\n                            32MP\nRear Camera\n                            108MP + 8MP + 2MP\n                            + 2MP\nRAM\n                            6GB, 8GB\nStorage\n                            128GB\nBattery\n                            Capacity 5000mAh\nOS\n                            Android 12",
    "numReviews": 0,
    "price": 8676,
    "countInStock": 0
  },
  {
    "_id": "682964718522a610f4f63daf",
    "user": "6819f3bd808190ec8f62a953",
    "name": "Samsung Galaxy A14 5G",
    "image": "https://i.gadgets360cdn.com/products/small/My-project-1-240x180-1672901842.png?downsize=*:90",
    "brand": "Samsung Galaxy A14 5G",
    "category": "mobile",
    "description": "Display\n                            6.60-inch\n                            (1080x2408)\nProcessor\n                            2.2Ghz MHz\n                            octa-core\nFront Camera\n                            13MP\nRear Camera\n                            50MP + 2MP +\n                            2MP\nRAM\n                            4GB, 6GB,\n                            8GB\nStorage\n                            64GB, 128GB\nBattery\n                            Capacity 5000mAh\nOS\n                            Android 13",
    "numReviews": 0,
    "price": 4956,
    "countInStock": 0
  },
  {
    "_id": "682964718522a610f4f63dab",
    "user": "6819f3bd808190ec8f62a953",
    "name": "Oppo A3X 5G",
    "image": "https://i.gadgets360cdn.com/products/small/oppo-a3x-5g-oppo-1-240x180-1722592715.jpg?downsize=*:90",
    "brand": "Oppo A3X 5G",
    "category": "mobile",
    "description": "Display\n                            6.67-inch\n                            (720x1604)\nProcessor\n                            MediaTek Dimensity\n                            6300\nFront Camera\n                            5MP\nRear Camera\n                            8MP\nRAM\n                            4GB\nStorage\n                            64GB, 128GB\nBattery\n                            Capacity 5100mAh\nOS\n                            Android 14",
    "numReviews": 0,
    "price": 6117,
    "countInStock": 0
  },
  {
    "_id": "682964718522a610f4f63db5",
    "user": "6819f3bd808190ec8f62a953",
    "name": "Oppo A5 Pro 5G (2025)",
    "image": "https://i.gadgets360cdn.com/products/small/oppo-a5-pro-5g-oppo-db-1-240x180-1745474477.jpg?downsize=*:90",
    "brand": "Oppo A5 Pro 5G (2025)",
    "category": "mobile",
    "description": "Display\n                            6.67-inch\n                            (720x1604)\nProcessor\n                            MediaTek Dimensity\n                            6300\nFront Camera\n                            8MP\nRear Camera\n                            50MP + 2MP\nRAM\n                            8GB\nStorage\n                            128GB,\n                            256GB\nBattery\n                            Capacity 5800mAh\nOS\n                            Android 15",
    "numReviews": 0,
    "price": 9021,
    "countInStock": 0
  },
  {
    "_id": "682964718522a610f4f63db1",
    "user": "6819f3bd808190ec8f62a953",
    "name": "Oppo A5 Pro 5G (2025)",
    "image": "https://i.gadgets360cdn.com/products/small/oppo-a5-pro-5g-oppo-db-1-240x180-1745474477.jpg?downsize=*:90",
    "brand": "Oppo A5 Pro 5G (2025)",
    "category": "mobile",
    "description": "Display\n                            6.67-inch\n                            (720x1604)\nProcessor\n                            MediaTek Dimensity\n                            6300\nFront Camera\n                            8MP\nRear Camera\n                            50MP + 2MP\nRAM\n                            8GB\nStorage\n                            128GB,\n                            256GB\nBattery\n                            Capacity 5800mAh\nOS\n                            Android 15",
    "numReviews": 0,
    "price": 9200,
    "countInStock": 0
  }
];
export {
  listProducts,
  listProductDetail,
  deleteProduct,
  createProduct,
  updateProduct,
  createReview,
  topRatedProducts,
  filterProduct,
};
