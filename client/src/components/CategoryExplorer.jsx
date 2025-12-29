import { FaMusic, FaLaptopCode, FaBasketballBall, FaPalette, FaGlassCheers, FaEllipsisH } from 'react-icons/fa';

const categories = [
    { name: 'Music', icon: <FaMusic />, color: 'from-pink-500 to-rose-500' },
    { name: 'Technology', icon: <FaLaptopCode />, color: 'from-blue-500 to-cyan-500' },
    { name: 'Sports', icon: <FaBasketballBall />, color: 'from-orange-500 to-red-500' },
    { name: 'Arts', icon: <FaPalette />, color: 'from-purple-500 to-violet-500' },
    { name: 'Social', icon: <FaGlassCheers />, color: 'from-green-500 to-emerald-500' },
    { name: 'Other', icon: <FaEllipsisH />, color: 'from-slate-500 to-gray-500' },
];

const CategoryExplorer = ({ selectedCategory, onSelectCategory }) => {
    return (
        <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Explore Categories</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {categories.map((category) => (
                    <button
                        key={category.name}
                        onClick={() => onSelectCategory(category.name === selectedCategory ? 'All' : category.name)}
                        className={`relative overflow-hidden rounded-2xl p-6 flex flex-col items-center justify-center gap-3 transition-all duration-300 group ${selectedCategory === category.name
                                ? 'ring-2 ring-white scale-105'
                                : 'hover:scale-105 hover:shadow-xl'
                            }`}
                    >
                        <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-20 group-hover:opacity-30 transition-opacity`}></div>
                        <div className={`absolute inset-0 border border-white/10 rounded-2xl`}></div>

                        <div className={`text-3xl ${selectedCategory === category.name ? 'text-white' : 'text-slate-200'} group-hover:text-white transition-colors`}>
                            {category.icon}
                        </div>
                        <span className="font-bold text-sm tracking-wide text-white">{category.name}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CategoryExplorer;
