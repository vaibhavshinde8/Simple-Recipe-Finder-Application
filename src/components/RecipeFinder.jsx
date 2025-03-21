import { useState, useEffect } from 'react';

export default function RecipeFinder() {
    const [ingredients, setIngredients] = useState('');
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchRecipes = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await fetch(`https://recipe-3-mpe5.onrender.com/api/v1/recipes`);
            const data = await response.json();

            const enteredIngredients = ingredients
                .toLowerCase()
                .split(',')
                .map((ingredient) => ingredient.trim());

            const filteredRecipes = data.data.filter((recipe) =>
                enteredIngredients.every((ingredient) =>
                    recipe.ingredients.some((item) => item.toLowerCase().includes(ingredient))
                )
            );

            setRecipes(filteredRecipes);
        } catch (error) {
            console.error('Error fetching recipes:', error);
            setError('Failed to fetch recipes. Please try again later.');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen w-screen bg-gradient-to-r from-purple-200 to-teal-200 flex flex-col items-center md:p-10 p-4">
            <h1 className="text-5xl font-extrabold text-purple-700 mb-8 animate-bounce">Recipe Finder</h1>
    
            <div className="w-full max-w-lg">
                <input
                    type="text"
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)}
                    placeholder="Enter ingredients (comma separated) like tomato, salt, pepper, water"
                    className="w-full p-4 border border-gray-400 rounded-lg mb-4 focus:outline-none focus:ring-4 focus:ring-purple-500 focus:animate-pulse"
                />
    
                <button
                    onClick={fetchRecipes}
                    className="w-full bg-purple-500 cursor-pointer text-white py-3 rounded-lg hover:bg-purple-600 hover:scale-105 transition-all duration-300 ease-in-out"
                >
                    {loading ? 'Loading...' : 'Find Recipes'}
                </button>
    
                
                {loading && !error && (
                    <p className="text-yellow-500 mt-4 text-center font-semibold">
                        Backend is taking time to fetch the recipes. Please wait...
                    </p>
                )}
            </div>
    
            {error && <p className="text-red-500 mt-4 animate-shake">{error}</p>}
    
            {loading && (
                <div className="w-full mt-8">
                    <h2 className="text-3xl text-center font-semibold mb-4 text-teal-700">Loading Recipes...</h2>
                    <ul className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <ShimmerCard key={index} />
                        ))}
                    </ul>
                </div>
            )}
    
            {!loading && recipes.length > 0 && (
                <div className="w-full mt-8">
                    <h2 className="text-3xl text-center font-semibold mb-4 text-teal-700">Recipe Suggestions:</h2>
                    <ul className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {recipes.map((recipe) => (
                            <li
                                key={recipe._id}
                                className="bg-white p-4 rounded-lg shadow-md border border-gray-300 transform transition-all hover:scale-105 hover:shadow-2xl hover:bg-purple-100"
                            >
                                <img
                                    src={recipe.image}
                                    alt={recipe.name}
                                    className="w-full h-40 object-cover rounded-md mb-3 transition-transform duration-300"
                                />
                                <a target="_blank" rel="noopener noreferrer" className="text-teal-500 font-bold text-lg hover:underline">
                                    {recipe.name}
                                </a>
                                <p className="text-gray-600 mt-1">{recipe.description}</p>
                                <p className="text-sm text-gray-400">
                                    Ingredients: {recipe.ingredients.join(', ')}
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
    
            {!loading && recipes.length === 0 && !error && (
                <p className="text-gray-500 mt-4 animate-fade-in">No recipes found for the given ingredients.</p>
            )}
        </div>
    );
    
}


const ShimmerCard = () => {
    return (
        <div className="bg-gray-300 animate-pulse p-4 rounded-lg shadow-md border border-gray-400">
            <div className="w-full h-40 bg-gray-400 rounded-md mb-3"></div>
            <div className="h-6 w-3/4 bg-gray-400 rounded-md mb-2"></div>
            <div className="h-4 w-2/3 bg-gray-400 rounded-md"></div>
        </div>
    );
};
