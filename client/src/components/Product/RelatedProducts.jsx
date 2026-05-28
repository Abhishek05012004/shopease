"use client"

import { useQuery } from "react-query"
import { productsAPI } from "../../services/api"
import ProductCard from "./ProductCard"
import LoadingSpinner from "../UI/LoadingSpinner"

const RelatedProducts = ({ category, currentProductId }) => {
  const { data, isLoading } = useQuery(
    ["relatedProducts", category],
    () => productsAPI.getProducts({ category, limit: 8 }),
    {
      enabled: !!category,
    },
  )

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner />
      </div>
    )
  }

  const relatedProducts = data?.data?.products?.filter((product) => product._id !== currentProductId) || []

  if (relatedProducts.length === 0) {
    return null
  }

  return (
    <div>
      <h2 className="text-lg sm:text-xl font-bold text-white mb-6">Related Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.slice(0, 4).map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  )
}

export default RelatedProducts
