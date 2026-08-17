import Link from "next/link";

const categories = [
  "Mobiles",
  "Laptops",
  "Headphones",
  "Smart Watches",
  "Gaming",
  "Accessories",
];

export default function CategorySection() {
  return (
    <section className="max-w-7xl mx-auto mt-10 px-6">

      <h2 className="text-3xl font-bold mb-6">
        Shop By Category
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">

        {categories.map((item) => (
  <Link
    key={item}
    href={`/category/${item.toLowerCase().replace(/\s+/g, "-")}`}
    className="bg-white shadow rounded-xl p-6 text-center hover:shadow-xl hover:bg-blue-50 transition block"
  >
    <h3 className="font-semibold">{item}</h3>
  </Link>
))}
      </div>

    </section>
  );
}