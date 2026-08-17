export default function Banner() {
  return (
    <section className="max-w-7xl mx-auto mt-6">
      <div className="rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-600 h-[350px] flex flex-col justify-center px-12 text-white">
        <h1 className="text-5xl font-bold">
          Welcome to Alpha Tech
        </h1>

        <p className="mt-4 text-xl">
          India's Trusted Electronics Store
        </p>

        <button className="mt-8 bg-yellow-400 text-black px-6 py-3 rounded-lg w-44 font-semibold hover:bg-yellow-300">
          Shop Now
        </button>
      </div>
    </section>
  );
}