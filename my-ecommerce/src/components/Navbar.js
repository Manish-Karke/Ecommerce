import { useState } from 'react';
import { Search } from 'lucide-react';

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality here
    console.log('Searching for:', searchQuery);
  };

  return (
    (<nav className="bg-blue-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white text-2xl font-bold">manishBaba</h1>
        <form onSubmit={handleSearch} className="flex items-center">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 rounded-l-md focus:outline-none" />
          <button type="submit" className="bg-white p-2 rounded-r-md">
            <Search className="h-6 w-6 text-blue-600" />
          </button>
        </form>
      </div>
    </nav>)
  );
}

