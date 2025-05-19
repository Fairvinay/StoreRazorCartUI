import { Card } from "react-bootstrap";
import Rating from "./Rating";
 
import   ProtectedLink   from "./ProtectedLink";
import '../styles/home-products.css';
const Product = ({ product , isAllowed}) => {
  // to={`/product/${product._id}`}
  return (
   
    <Card className="card my-3 shadow-sm rounded" >  {/* my-3 p-3 rounded pd-img-wrp*/}
      <ProtectedLink urlToProtect={`/product/${product._id}`} isAllowed={isAllowed}   >
        <Card.Img className="productImg" src={product.image} variant="top" />
      </ProtectedLink>
      <Card.Body className="card-body text-center">  {/* pd-img-wrp pd-dtl */}

         <ProtectedLink urlToProtect={`/product/${product._id}`} isAllowed={isAllowed}>
          <Card.Title as="div" className=" text-decoration-none text-dark"> {/* pditem-txt */}
            <h5><strong>{product.name}</strong>  </h5>
          </Card.Title>
        </ProtectedLink>
        <Card.Text as="div" className="text-warning"> {/*mb-2   splr-txt*/}
          <Rating value={product.rating} text={product.numReviews} />
        </Card.Text>
        <Card.Text as="h3" className="price-txt">
        <strong>  Rs {product.price}</strong>   </Card.Text>
      </Card.Body>
    </Card>
     
  );
};

export default Product;
