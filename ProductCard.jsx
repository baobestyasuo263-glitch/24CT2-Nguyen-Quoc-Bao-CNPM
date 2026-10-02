import { Link } from "react-router-dom";

function ProductCard({ product }) {

  return (
    <div className="product-card">

      <Link to={`/product/${product.id}`}>

        <div className="product-image">
          {product.image}
        </div>

        <div className="product-info">

          <h3>
            {product.name}
          </h3>

          <div className="price">
            {product.price}
          </div>

          <div className="rating">
            ⭐ {product.rating}
          </div>

          <div className="sold">
            Đã bán {product.sold}
          </div>

        </div>

      </Link>

      <button className="add-cart">
        🛒 Thêm vào giỏ
      </button>

    </div>
  );
}

export default ProductCard;