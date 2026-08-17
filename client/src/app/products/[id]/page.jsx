import { notFound } from "next/navigation";
import ProductDetailsClient from "../../../../components/Product/ProductDetailsClient"; 

export default async function ProductDetails({ params }) {
  const { id } = await params;

  try {
    const res = await fetch(
      `http://localhost:5000/api/products/${id}`,
      {
        cache: "no-store",
      }
    );

    const data = await res.json();

    if (!data.success) notFound();

    return (
      <ProductDetailsClient
        product={data.product}
      />
    );
  } catch {
    notFound();
  }
}