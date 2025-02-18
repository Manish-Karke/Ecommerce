export default function ProductItem({ product, onAddToCart }) {
  return (
    (<div className="border p-4 rounded-md shadow-md">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover mb-4" />
      <h2 className="text-lg font-semibold">{product.name}</h2>
      <p className="text-gray-600">${product.price.toFixed(2)}</p>
      <button
        onClick={() => onAddToCart(product)}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
        Add to Cart
      </button>
    </div>)
  );
}

