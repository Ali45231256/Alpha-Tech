export default async function CategoryPage({ params }) {
  const { slug } = await params;

  return (
    <main className="max-w-7xl mx-auto p-10">
      <h1 className="text-4xl font-bold capitalize">
        {slug.replace(/-/g, " ")}
      </h1>

      <p className="mt-4 text-gray-600">
        Products of {slug.replace(/-/g, " ")} category will appear here.
      </p>
    </main>
  );
}