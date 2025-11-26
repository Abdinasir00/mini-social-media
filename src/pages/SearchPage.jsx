
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import SearchCard from "../components/searchCard";
import { fetchUsers } from "../store/slices/searchSlice";

const SearchPage = () => {
  const dispatch = useDispatch();
  const { searchResults, loading } = useSelector((state) => state.users);
  const [query, setQuery] = useState("");

  useEffect(() => {
    dispatch(fetchUsers(query));
  }, [dispatch, query]);

  return (
    <div className="flex-1 p-6 md:p-8 min-h-[calc(100vh-5rem)] bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-8 m-2 text-gray-900 dark:text-gray-100">
          Discover People
        </h1>
      </div>

      {/* Search input */}
      <div className="max-w-4xl mx-auto">
        <div className="relative mb-8">
          <input
            type="text"
            placeholder="Search Users..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="rounded-xl shadow-md border border-gray-200 dark:border-gray-700 w-full pl-10 pr-4 py-3 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>

        {/* Users grid */}
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {searchResults.map((user) => (
              <SearchCard key={user.id} user={user} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchPage;