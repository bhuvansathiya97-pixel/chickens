// import { useState } from 'react'
// import heroImg from './assets/hero.png'
// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <section id="center">
//         <div className="hero">
//           <img src={heroImg} className="base" width="170" height="179" alt="" />
//           <img src={reactLogo} className="framework" alt="React logo" />
//           <img src={viteLogo} className="vite" alt="Vite logo" />
//         </div>
//         <div>
//           <h1>Get started</h1>
//           <p>
//             Edit <code>src/App.jsx</code> and save to test <code>HMR</code>
//           </p>
//         </div>
//         <button
//           type="button"
//           className="counter"
//           onClick={() => setCount((count) => count + 1)}
//         >
//           Count is {count}
//         </button>
//       </section>

//       <div className="ticks"></div>

//       <section id="next-steps">
//         <div id="docs">
//           <svg className="icon" role="presentation" aria-hidden="true">
//             <use href="/icons.svg#documentation-icon"></use>
//           </svg>
//           <h2>Documentation</h2>
//           <p>Your questions, answered</p>
//           <ul>
//             <li>
//               <a href="https://vite.dev/" target="_blank">
//                 <img className="logo" src={viteLogo} alt="" />
//                 Explore Vite
//               </a>
//             </li>
//             <li>
//               <a href="https://react.dev/" target="_blank">
//                 <img className="button-icon" src={reactLogo} alt="" />
//                 Learn more
//               </a>
//             </li>
//           </ul>
//         </div>
//         <div id="social">
//           <svg className="icon" role="presentation" aria-hidden="true">
//             <use href="/icons.svg#social-icon"></use>
//           </svg>
//           <h2>Connect with us</h2>
//           <p>Join the Vite community</p>
//           <ul>
//             <li>
//               <a href="https://github.com/vitejs/vite" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#github-icon"></use>
//                 </svg>
//                 GitHub
//               </a>
//             </li>
//             <li>
//               <a href="https://chat.vite.dev/" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#discord-icon"></use>
//                 </svg>
//                 Discord
//               </a>
//             </li>
//             <li>
//               <a href="https://x.com/vite_js" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#x-icon"></use>
//                 </svg>
//                 X.com
//               </a>
//             </li>
//             <li>
//               <a href="https://bsky.app/profile/vite.dev" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#bluesky-icon"></use>
//                 </svg>
//                 Bluesky
//               </a>
//             </li>
//           </ul>
//         </div>
//       </section>

//       <div className="ticks"></div>
//       <section id="spacer"></section>
//     </>
//   )
// }

// export default App

import React, { useEffect, useState } from "react";
import "./index.css";

const API = "https://www.themealdb.com/api/json/v1/1";

function App() {
    const [recipes, setRecipes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [recipe, setRecipe] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const [page, setPage] = useState("home");
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("Chicken");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const fetchRecipes = (selectedCategory) => {
        setLoading(true);
        setError(false);

        fetch(
            `${API}/filter.php?c=${encodeURIComponent(selectedCategory)}`
        )
            .then((res) => {
                if (!res.ok) throw new Error("API Error");
                return res.json();
            })
            .then((result) => {
                setRecipes(result.meals || []);
                setLoading(false);
            })
            .catch(() => {
                setError(true);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetch(`${API}/list.php?c=list`)
            .then((res) => res.json())
            .then((result) => {
                setCategories(result.meals || []);
            })
            .catch(() => setCategories([]));

        fetchRecipes("Chicken");
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();

        if (!search.trim()) {
            fetchRecipes(category);
            return;
        }

        setLoading(true);
        setError(false);
        setRecipe(null);

        fetch(
            `${API}/search.php?s=${encodeURIComponent(search.trim())}`
        )
            .then((res) => {
                if (!res.ok) throw new Error("API Error");
                return res.json();
            })
            .then((result) => {
                setRecipes(result.meals || []);
                setPage("recipes");
                setLoading(false);
            })
            .catch(() => {
                setError(true);
                setLoading(false);
            });
    };

    const changeCategory = (value) => {
        setCategory(value);
        setSearch("");
        setRecipe(null);
        setPage("recipes");
        fetchRecipes(value);
    };

    const showRecipe = (id) => {
        setLoading(true);
        setError(false);

        fetch(`${API}/lookup.php?i=${id}`)
            .then((res) => {
                if (!res.ok) throw new Error("API Error");
                return res.json();
            })
            .then((result) => {
                if (!result.meals) throw new Error("Not found");
                setRecipe(result.meals[0]);
                setPage("details");
                setLoading(false);
            })
            .catch(() => {
                setError(true);
                setLoading(false);
            });
    };

    
    const toggleFavorite = (item) => {
        setFavorites((prev) =>
            prev.some((fav) => fav.idMeal === item.idMeal)
                ? prev.filter((fav) => fav.idMeal !== item.idMeal)
                : [...prev, item]
        );
    };

    const isFavorite = (id) =>
        favorites.some((item) => item.idMeal === id);

    const recipeCards = (items) => (
        <div className="recipe-grid">
            {items.length === 0 ? (
                <p className="message">No recipes found!</p>
            ) : (
                items.map((item) => (
                    <div className="recipe-card" key={item.idMeal}>
                        <img
                            src={item.strMealThumb}
                            alt={item.strMeal}
                        />

                        <div className="card-content">
                            <h3>{item.strMeal}</h3>

                            <p>
                                {item.strCategory || "Delicious Recipe"}
                            </p>

                            <button
                                className="primary-btn"
                                onClick={() => showRecipe(item.idMeal)}
                            >
                                View Recipe
                            </button>

                            <button
                                className="favorite-btn"
                                onClick={() => toggleFavorite(item)}
                            >
                                {isFavorite(item.idMeal)
                                    ? "♥ Saved"
                                    : "♡ Favorite"}
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );

    if (loading) {
        return <h2 className="message">Loading recipes...</h2>;
    }

    if (error) {
        return (
            <div className="message">
                <h2>Something went wrong!</h2>
                <button
                    className="primary-btn"
                    onClick={() => fetchRecipes(category)}
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="app">
            {/* Navigation */}
            <nav className="navbar">
                <h2 className="logo" onClick={() => {
                    setRecipe(null);
                    setPage("home");
                }}>
                    Taste<span>Book</span>
                </h2>

                <div className="nav-links">
                    <button onClick={() => {
                        setRecipe(null);
                        setPage("home");
                    }}>
                        Home
                    </button>

                    <button onClick={() => {
                        setRecipe(null);
                        setPage("recipes");
                        fetchRecipes(category);
                    }}>
                        Recipes
                    </button>

                    <button onClick={() => {
                        setRecipe(null);
                        setPage("favorites");
                    }}>
                        Favorites ♥ ({favorites.length})
                    </button>
                </div>
            </nav>

            {/* Search */}
            <form className="search-bar" onSubmit={handleSearch}>
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search your favourite food..."
                />
                <button className="primary-btn" type="submit">
                    Search
                </button>
            </form>

            {/* Home Page */}
            {page === "home" && (
                <>
                    <section className="hero">
                        <div>
                            <p className="eyebrow">WELCOME TO TASTEBOOK</p>
                            <h1>Discover recipes.<br />Create memories.</h1>
                            <p>
                                Find delicious meals and learn how
                                to prepare them step by step.
                            </p>
                            <button
                                className="primary-btn"
                                onClick={() => setPage("recipes")}
                            >
                                Explore Recipes →
                            </button>
                        </div>
                    </section>

                    <section className="section">
                        <h2>Explore Categories</h2>

                        <div className="category-list">
                            {categories.slice(0, 8).map((item) => (
                                <button
                                    key={item.strCategory}
                                    onClick={() =>
                                        changeCategory(item.strCategory)
                                    }
                                >
                                    {item.strCategory}
                                </button>
                            ))}
                        </div>
                    </section>

                    <section className="section">
                        <h2>Popular Recipes</h2>
                        {recipeCards(recipes.slice(0, 6))}
                        <button
                            className="primary-btn"
                            onClick={() => setPage("recipes")}
                        >
                            View All Recipes
                        </button>
                    </section>
                </>
            )}

            {/* All Recipes Page */}
            {page === "recipes" && (
                <section className="section">
                    <h1>Explore Recipes</h1>
                    <p>Find a dish for your next meal.</p>

                    <select
                        value={category}
                        onChange={(e) => changeCategory(e.target.value)}
                    >
                        {categories.map((item) => (
                            <option
                                key={item.strCategory}
                                value={item.strCategory}
                            >
                                {item.strCategory}
                            </option>
                        ))}
                    </select>

                    {recipeCards(recipes)}
                </section>
            )}

            {/* Recipe Details Page */}
            {page === "details" && recipe && (
                <section className="section details">
                    <button
                        className="back-btn"
                        onClick={() => setPage("recipes")}
                    >
                        ← Back to Recipes
                    </button>

                    <img
                        className="detail-image"
                        src={recipe.strMealThumb}
                        alt={recipe.strMeal}
                    />

                    <h1>{recipe.strMeal}</h1>
                    <p>
                        Category: {recipe.strCategory} |
                        Cuisine: {recipe.strArea}
                    </p>

                    <button
                        className="favorite-btn"
                        onClick={() => toggleFavorite(recipe)}
                    >
                        {isFavorite(recipe.idMeal)
                            ? "♥ Remove Favorite"
                            : "♡ Add to Favorites"}
                    </button>

                    <h2>Ingredients</h2>

                    <ul className="ingredients">
                        {Array.from({ length: 20 }, (_, i) => {
                            const ingredient =
                                recipe[`strIngredient${i + 1}`];
                            const measure =
                                recipe[`strMeasure${i + 1}`];

                            if (!ingredient || !ingredient.trim()) {
                                return null;
                            }

                            return (
                                <li key={i}>
                                    {ingredient} — {measure}
                                </li>
                            );
                        })}
                    </ul>

                    <h2>Cooking Instructions</h2>
                    <p className="instructions">
                        {recipe.strInstructions}
                    </p>

                    {recipe.strYoutube && (
                        <a
                            className="primary-btn video-link"
                            href={recipe.strYoutube}
                            target="_blank"
                            rel="noreferrer"
                        >
                            Watch Cooking Video ▶
                        </a>
                    )}
                </section>
            )}

            {/* Favorites Page */}
            {page === "favorites" && (
                <section className="section">
                    <h1>My Favourite Recipes ♥</h1>

                    {recipeCards(favorites)}
                </section>
            )}

            {/* Footer */}
            <footer>
                <h2>TasteBook</h2>
                <p>Discover • Cook • Enjoy</p>
                <p>Made with ♥ using React and TheMealDB API</p>
            </footer>
        </div>
    );
}

export default App;
