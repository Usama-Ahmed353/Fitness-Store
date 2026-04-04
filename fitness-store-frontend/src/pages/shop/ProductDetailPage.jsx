import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, Heart, Minus, Plus, ChevronLeft, Package, Truck, Shield, ArrowLeft } from 'lucide-react';
import { fetchProductBySlug, fetchRelated, clearSelectedProduct } from '../../app/slices/productSlice';
import { addToCart } from '../../app/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../../app/slices/wishlistSlice';
import toast from 'react-hot-toast';

const ProductDetailPage = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { selectedProduct: product, related, loading } = useSelector((s) => s.products);
  const { isAuthenticated } = useSelector((s) => s.auth);
  const { productIds: wishlistIds } = useSelector((s) => s.wishlist);

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    dispatch(fetchProductBySlug(slug));
    dispatch(fetchRelated(slug));
    return () => { dispatch(clearSelectedProduct()); };
  }, [dispatch, slug]);

  useEffect(() => {
    setQuantity(1);
    setSelectedImage(0);
  }, [slug]);

  const handleAddToCart = () => {
    if (!isAuthenticated) return navigate('/login');
    dispatch(addToCart({ productId: product._id, quantity })).then((res) => {
      if (!res.error) toast.success('Added to cart!');
      else toast.error(res.payload);
    });
  };

  const handleWishlist = () => {
    if (!isAuthenticated) return navigate('/login');
    if (wishlistIds.includes(product._id)) {
      dispatch(removeFromWishlist(product._id));
      toast.success('Removed from wishlist');
    } else {
      dispatch(addToWishlist(product._id));
      toast.success('Added to wishlist!');
    }
  };

  if (loading || !product) {
    return (
      <div className="min-h-screen bg-dark-navy text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-accent" />
      </div>
    );
  }

  const finalPrice = product.discount > 0
    ? Math.round(product.price * (1 - product.discount / 100) * 100) / 100
    : product.price;

  const seo = product.seo || {};
  const canonicalUrl = seo.canonicalUrl || `${window.location.origin}/product/${product.slug}`;

  // JSON-LD structured data for product
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: product.images?.map((img) => img.url) || [],
    sku: product.sku || product._id,
    brand: product.brand ? { '@type': 'Brand', name: product.brand } : undefined,
    offers: {
      '@type': 'Offer',
      url: canonicalUrl,
      priceCurrency: 'USD',
      price: finalPrice.toFixed(2),
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
    aggregateRating: product.ratings?.count > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: product.ratings.average,
      reviewCount: product.ratings.count,
    } : undefined,
  };

  return (
    <>
      <Helmet>
        <title>{seo.metaTitle || `${product.title} | FitStore`}</title>
        <meta name="description" content={seo.metaDescription || product.description?.substring(0, 160)} />
        {seo.metaKeywords?.length > 0 && <meta name="keywords" content={seo.metaKeywords.join(', ')} />}
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={seo.ogTitle || product.title} />
        <meta property="og:description" content={seo.ogDescription || product.description?.substring(0, 200)} />
        {(seo.ogImage || product.images?.[0]?.url) && <meta property="og:image" content={seo.ogImage || product.images[0].url} />}
        <meta property="og:type" content="product" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="product:price:amount" content={finalPrice.toFixed(2)} />
        <meta property="product:price:currency" content="USD" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div className="min-h-screen bg-dark-navy text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <button onClick={() => navigate('/shop')} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition">
            <ArrowLeft className="w-4 h-4" /> Back to Shop
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Images */}
            <div>
              <div className="aspect-square bg-white/5 rounded-xl overflow-hidden mb-4">
                {product.images?.[selectedImage]?.url ? (
                  <img src={product.images[selectedImage].url} alt={product.images[selectedImage].alt || product.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500 text-lg">No Image</div>
                )}
              </div>
              {product.images?.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition ${i === selectedImage ? 'border-accent' : 'border-transparent'}`}
                    >
                      <img src={img.url} alt={img.alt || ''} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div>
              {product.brand && <p className="text-sm text-accent uppercase tracking-wide mb-2">{product.brand}</p>}
              <h1 className="text-3xl font-bold mb-4">{product.title}</h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-5 h-5 ${i < Math.round(product.ratings?.average || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'}`} />
                  ))}
                </div>
                <span className="text-gray-400">({product.ratings?.count || 0} reviews)</span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl font-bold text-accent">${finalPrice.toFixed(2)}</span>
                {product.discount > 0 && (
                  <>
                    <span className="text-xl text-gray-500 line-through">${product.price.toFixed(2)}</span>
                    <span className="bg-accent/20 text-accent text-sm px-2 py-1 rounded">Save {product.discount}%</span>
                  </>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-300 mb-6 leading-relaxed">{product.description}</p>

              {/* Tags */}
              {product.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {product.tags.map((tag) => (
                    <span key={tag} className="bg-white/10 px-3 py-1 rounded-full text-xs text-gray-300">{tag}</span>
                  ))}
                </div>
              )}

              {/* Stock */}
              <div className="mb-6">
                {product.stock > 0 ? (
                  <span className="text-green-400 flex items-center gap-2"><Package className="w-4 h-4" /> In Stock ({product.stock} available)</span>
                ) : (
                  <span className="text-red-400">Out of Stock</span>
                )}
              </div>

              {/* Quantity & Actions */}
              {product.stock > 0 && (
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center bg-white/10 rounded-lg">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:bg-white/10 rounded-l-lg"><Minus className="w-4 h-4" /></button>
                    <span className="px-4 font-semibold">{quantity}</span>
                    <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="p-3 hover:bg-white/10 rounded-r-lg"><Plus className="w-4 h-4" /></button>
                  </div>
                  <button onClick={handleAddToCart} className="flex-1 flex items-center justify-center gap-2 bg-accent text-white py-3 rounded-lg hover:bg-accent/90 transition font-semibold">
                    <ShoppingCart className="w-5 h-5" /> Add to Cart
                  </button>
                  <button onClick={handleWishlist} className={`p-3 rounded-lg border transition ${wishlistIds.includes(product._id) ? 'border-accent bg-accent/20 text-accent' : 'border-white/20 hover:border-accent'}`}>
                    <Heart className={`w-5 h-5 ${wishlistIds.includes(product._id) ? 'fill-accent' : ''}`} />
                  </button>
                </div>
              )}

              {/* Benefits */}
              <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
                <div className="text-center">
                  <Truck className="w-6 h-6 mx-auto mb-2 text-accent" />
                  <p className="text-xs text-gray-400">Free Shipping $50+</p>
                </div>
                <div className="text-center">
                  <Shield className="w-6 h-6 mx-auto mb-2 text-accent" />
                  <p className="text-xs text-gray-400">30-Day Returns</p>
                </div>
                <div className="text-center">
                  <Package className="w-6 h-6 mx-auto mb-2 text-accent" />
                  <p className="text-xs text-gray-400">Secure Checkout</p>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {related.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold mb-6">Related Products</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {related.map((rp) => {
                  const rpFinal = rp.discount > 0 ? Math.round(rp.price * (1 - rp.discount / 100) * 100) / 100 : rp.price;
                  return (
                    <div key={rp._id} onClick={() => navigate(`/product/${rp.slug}`)} className="bg-white/5 rounded-lg overflow-hidden cursor-pointer hover:bg-white/10 transition">
                      <div className="aspect-square bg-white/5">
                        {rp.images?.[0]?.url ? <img src={rp.images[0].url} alt={rp.title} className="w-full h-full object-cover" /> : <div className="w-full h-full" />}
                      </div>
                      <div className="p-3">
                        <h4 className="text-xs font-medium line-clamp-2 mb-1">{rp.title}</h4>
                        <p className="text-sm font-bold text-accent">${rpFinal.toFixed(2)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductDetailPage;
