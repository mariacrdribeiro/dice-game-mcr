function App() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-6">
      <div className="max-w-3xl text-center text-white">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          Welcome to Dice Game!
        </h1>
        <p className="text-lg md:text-xl mb-8">
          A thrilling multiplayer experience powered by Go and React. Roll the
          dice and beat your friends!
        </p>
        <button className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-full shadow-lg hover:bg-gray-100 transition">
          Play Now
        </button>
      </div>
    </div>
  );
}

export default App;
