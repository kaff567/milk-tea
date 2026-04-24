import { useState, useMemo, useCallback } from "react";
import "./index.css";

const INGREDIENTS = [
  { id: "S01", name: "黑糖珍珠", category: "小料", calories: 135 },
  { id: "S02", name: "普通珍珠", category: "小料", calories: 115 },
  { id: "S03", name: "椰果", category: "小料", calories: 40 },
  { id: "S06", name: "芋泥", category: "小料", calories: 80 },
  { id: "S11", name: "脆波波", category: "小料", calories: 40 },
  { id: "M01", name: "鲜牛奶", category: "奶底", calories: 80 },
  { id: "M03", name: "椰奶", category: "奶底", calories: 65 },
  { id: "T01", name: "茉莉绿茶", category: "茶底", calories: 5 },
  { id: "T03", name: "乌龙茶", category: "茶底", calories: 5 },
  { id: "TP01", name: "芝士奶盖", category: "顶料", calories: 100 },
  { id: "TP03", name: "淡奶油顶", category: "顶料", calories: 75 },
];

const PRODUCTS = [
  { name: "烤黑糖波波牛乳", brand: "喜茶", ingredients: ["S01", "M01"], calories: 450 },
  { name: "芋泥波波牛乳", brand: "喜茶", ingredients: ["S06", "M01"], calories: 520 },
  { name: "多肉葡萄", brand: "喜茶", ingredients: ["T01", "S11"], calories: 350 },
  { name: "芝芝绿妍", brand: "喜茶", ingredients: ["T01", "TP01"], calories: 360 },
  { name: "杨枝甘露", brand: "茶百道", ingredients: ["M03", "S03", "S11"], calories: 450 },
  { name: "茉莉奶绿", brand: "茶百道", ingredients: ["T01", "M01"], calories: 380 },
  { name: "生打椰椰芒", brand: "喜茶", ingredients: ["M03", "S06"], calories: 400 },
  { name: "珍珠奶茶", brand: "一点点", ingredients: ["S02", "M01"], calories: 480 },
  { name: "红茶玛奇朵", brand: "一点点", ingredients: ["T01", "TP03"], calories: 420 },
  { name: "霸气橙子", brand: "奈雪", ingredients: ["T01"], calories: 280 },
  { name: "满杯百香果", brand: "蜜雪冰城", ingredients: ["T01", "S03"], calories: 280 },
  { name: "黑糖珍珠奶茶", brand: "蜜雪冰城", ingredients: ["S01", "M01"], calories: 480 },
];

const BRANDS = ["喜茶", "奈雪", "茶百道", "一点点", "蜜雪冰城"];

const CATEGORY_COLORS = {
  小料: { idle: "bg-amber-50 text-amber-700 border-amber-200", active: "bg-gradient-to-br from-amber-400 to-orange-400 text-white border-amber-500 shadow-lg shadow-amber-200" },
  奶底: { idle: "bg-blue-50 text-blue-700 border-blue-200", active: "bg-gradient-to-br from-blue-400 to-cyan-400 text-white border-blue-500 shadow-lg shadow-blue-200" },
  茶底: { idle: "bg-green-50 text-green-700 border-green-200", active: "bg-gradient-to-br from-green-400 to-emerald-500 text-white border-green-600 shadow-lg shadow-green-200" },
  顶料: { idle: "bg-rose-50 text-rose-700 border-rose-200", active: "bg-gradient-to-br from-rose-400 to-pink-500 text-white border-rose-600 shadow-lg shadow-rose-200" },
};

const CATEGORY_BADGE = {
  小料: "bg-amber-100 text-amber-700",
  奶底: "bg-blue-100 text-blue-700",
  茶底: "bg-green-100 text-green-700",
  顶料: "bg-rose-100 text-rose-700",
};

const BRAND_COLORS = {
  喜茶: "bg-teal-50 text-teal-700 border border-teal-100",
  奈雪: "bg-purple-50 text-purple-700 border border-purple-100",
  茶百道: "bg-orange-50 text-orange-600 border border-orange-100",
  一点点: "bg-yellow-50 text-yellow-700 border border-yellow-100",
  蜜雪冰城: "bg-red-50 text-red-600 border border-red-100",
};

const CATEGORY_ORDER = ["茶底", "奶底", "小料", "顶料"];

function CategorySection({ category, items, selected, onToggle, expanded, onToggleExpand }) {
  const colors = CATEGORY_COLORS[category];
  return (
    <div className="border-b border-gray-100 pb-4 last:border-b-0">
      <button
        onClick={() => onToggleExpand(category)}
        className="flex items-center justify-between w-full mb-3 group"
      >
        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${CATEGORY_BADGE[category]}`}>
          {category}
        </span>
        <span className={`text-gray-400 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}>
          ▼
        </span>
      </button>
      {expanded && (
        <div className="flex flex-wrap gap-2 animate-fadeIn">
          {items.map((ing) => {
            const isSelected = selected.has(ing.id);
            return (
              <button
                key={ing.id}
                onClick={() => onToggle(ing.id)}
                className={`
                  px-3 py-1.5 rounded-full text-xs font-medium border-2 transition-all duration-200 select-none
                  ${isSelected ? `${colors.active} scale-105` : `${colors.idle} hover:scale-105`}
                `}
                title={`热量: ${ing.calories} kcal`}
              >
                {isSelected && <span className="mr-0.5">✓</span>}
                {ing.name}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ProductCard({ product, selectedIngredients, allIngredients }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const matchCount = product.ingredients.filter((id) => selectedIngredients.has(id)).length;
  const matchPct = selectedIngredients.size === 0 ? 0 : Math.round((matchCount / selectedIngredients.size) * 100);

  const displayIngredients = product.ingredients.slice(0, 3).map((id) => {
    const ing = allIngredients.find((i) => i.id === id);
    return ing;
  }).filter(Boolean);

  return (
    <div className="bg-white/80 backdrop-blur rounded-2xl shadow-md border border-white/50 p-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group animate-fadeIn">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-2xl flex-shrink-0">🥤</span>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-bold text-gray-800 truncate">{product.name}</h3>
            <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium mt-1 ${BRAND_COLORS[product.brand]}`}>
              {product.brand}
            </span>
          </div>
        </div>
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="flex-shrink-0 text-lg transition-transform duration-200 hover:scale-125"
          title={isFavorite ? "取消收藏" : "加入收藏"}
        >
          {isFavorite ? "❤️" : "🤍"}
        </button>
      </div>

      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-gray-500">
          匹配 <span className="font-bold text-orange-500">{matchCount}</span> 种配料
        </span>
        <span className="text-xs text-gray-600 tabular-nums font-semibold">{product.calories} kcal</span>
      </div>

      <div className="flex items-center gap-1.5 mb-3">
        <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-orange-400 to-pink-400 rounded-full transition-all duration-500"
            style={{ width: `${matchPct}%` }}
          />
        </div>
        <span className="text-xs text-gray-400 w-7 text-right">{matchPct}%</span>
      </div>

      <div className="flex flex-wrap gap-1">
        {displayIngredients.map((ing) => {
          const isMatched = selectedIngredients.has(ing.id);
          return (
            <span
              key={ing.id}
              className={`text-xs px-2 py-0.5 rounded-full transition-colors duration-200 border ${
                isMatched
                  ? "bg-orange-100 text-orange-700 border-orange-200 font-semibold"
                  : "bg-gray-50 text-gray-400 border-gray-100"
              }`}
            >
              {ing.name}
            </span>
          );
        })}
        {product.ingredients.length > 3 && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-50 text-gray-400 border border-gray-100">
            +{product.ingredients.length - 3}
          </span>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [selectedIngredients, setSelectedIngredients] = useState(new Set());
  const [calorieLimit, setCalorieLimit] = useState(600);
  const [selectedBrands, setSelectedBrands] = useState(new Set(BRANDS));
  const [expandedCategories, setExpandedCategories] = useState(new Set(CATEGORY_ORDER));

  const toggle = useCallback((id) => {
    setSelectedIngredients((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const toggleBrand = useCallback((brand) => {
    setSelectedBrands((prev) => {
      const next = new Set(prev);
      next.has(brand) ? next.delete(brand) : next.add(brand);
      return next;
    });
  }, []);

  const toggleCategory = useCallback((category) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      next.has(category) ? next.delete(category) : next.add(category);
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    setSelectedIngredients(new Set());
  }, []);

  const groupedIngredients = useMemo(() => {
    const groups = {};
    for (const ing of INGREDIENTS) {
      if (!groups[ing.category]) groups[ing.category] = [];
      groups[ing.category].push(ing);
    }
    return CATEGORY_ORDER.filter((c) => groups[c]).map((c) => ({
      category: c,
      items: groups[c],
    }));
  }, []);

  const recommendations = useMemo(() => {
    let results = PRODUCTS.map((p) => ({
      ...p,
      matchCount: p.ingredients.filter((id) => selectedIngredients.has(id)).length,
    }));

    if (selectedIngredients.size > 0) {
      results = results.filter((p) => p.matchCount > 0);
    }

    results = results.filter((p) => p.calories <= calorieLimit && selectedBrands.has(p.brand));
    results.sort((a, b) => b.matchCount - a.matchCount);

    return results;
  }, [selectedIngredients, calorieLimit, selectedBrands]);

  const totalCalories = useMemo(() => {
    return Array.from(selectedIngredients).reduce((sum, id) => {
      const ing = INGREDIENTS.find((i) => i.id === id);
      return sum + (ing?.calories || 0);
    }, 0);
  }, [selectedIngredients]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        input[type="range"] {
          accent-color: rgb(249, 115, 22);
        }
      `}</style>

      {/* Header */}
      <header className="bg-white/40 backdrop-blur-md border-b border-white/60 sticky top-0 z-50 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-5 sm:py-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">🧋 配料奶茶灵感器</h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">选配料 · 筛热量 · 找你的那一杯</p>
            </div>
            {selectedIngredients.size > 0 && (
              <button
                onClick={clearAll}
                className="px-3 py-1.5 bg-gradient-to-r from-rose-400 to-orange-400 text-white text-xs font-semibold rounded-full hover:shadow-lg transition-all duration-200 flex-shrink-0"
              >
                清空 ({selectedIngredients.size})
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar: Ingredients & Filters */}
          <div className="lg:col-span-1 space-y-5">
            {/* Ingredients Section */}
            <section className="bg-white/70 backdrop-blur rounded-2xl shadow-md border border-white/60 p-5">
              <h2 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>🥢</span>
                <span>选择配料</span>
              </h2>
              <div className="space-y-4">
                {groupedIngredients.map(({ category, items }) => (
                  <CategorySection
                    key={category}
                    category={category}
                    items={items}
                    selected={selectedIngredients}
                    onToggle={toggle}
                    expanded={expandedCategories.has(category)}
                    onToggleExpand={toggleCategory}
                  />
                ))}
              </div>
              {selectedIngredients.size > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500 mb-2">配料热量合计：</p>
                  <span className="text-lg font-bold text-orange-500">{totalCalories}</span>
                  <span className="text-xs text-gray-400 ml-1">kcal</span>
                </div>
              )}
            </section>

            {/* Calorie Filter */}
            <section className="bg-white/70 backdrop-blur rounded-2xl shadow-md border border-white/60 p-5">
              <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>🔥</span>
                <span>热量范围</span>
              </h3>
              <div className="space-y-3">
                <input
                  type="range"
                  min="0"
                  max="600"
                  step="10"
                  value={calorieLimit}
                  onChange={(e) => setCalorieLimit(Number(e.target.value))}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gradient-to-r from-green-200 to-orange-200"
                />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">0</span>
                  <span className="text-lg font-bold text-orange-500">{calorieLimit}</span>
                  <span className="text-xs text-gray-500">600</span>
                </div>
              </div>
            </section>

            {/* Brand Filter */}
            <section className="bg-white/70 backdrop-blur rounded-2xl shadow-md border border-white/60 p-5">
              <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span>🏪</span>
                <span>品牌筛选</span>
              </h3>
              <div className="space-y-2">
                {BRANDS.map((brand) => (
                  <label key={brand} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedBrands.has(brand)}
                      onChange={() => toggleBrand(brand)}
                      className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500 cursor-pointer"
                    />
                    <span className="text-xs text-gray-700 group-hover:text-gray-900 transition-colors">{brand}</span>
                  </label>
                ))}
              </div>
            </section>
          </div>

          {/* Main Content: Recommendations */}
          <div className="lg:col-span-3">
            <section>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-gray-800">
                    {selectedIngredients.size === 0
                      ? "为你推荐"
                      : `找到 ${recommendations.length} 款匹配奶茶`}
                  </h2>
                  {recommendations.length > 0 && (
                    <p className="text-xs text-gray-400 mt-1">按匹配度排序</p>
                  )}
                </div>
              </div>

              {selectedIngredients.size === 0 ? (
                <div className="bg-white/60 backdrop-blur rounded-2xl border-2 border-dashed border-orange-200 p-12 text-center">
                  <div className="text-6xl mb-4">🧋</div>
                  <p className="text-gray-600 font-medium">先选择你喜欢的配料</p>
                  <p className="text-xs text-gray-400 mt-2">根据配料偏好为你智能匹配</p>
                </div>
              ) : recommendations.length === 0 ? (
                <div className="bg-white/60 backdrop-blur rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
                  <div className="text-6xl mb-4">🫗</div>
                  <p className="text-gray-600 font-medium">没有找到符合条件的奶茶</p>
                  <p className="text-xs text-gray-400 mt-2">试试调整热量范围或品牌筛选～</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {recommendations.map((product) => (
                    <ProductCard
                      key={product.name}
                      product={product}
                      selectedIngredients={selectedIngredients}
                      allIngredients={INGREDIENTS}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      <footer className="text-center py-6 text-xs text-gray-400 border-t border-white/40 mt-12">
        配料找奶茶灵感器 · 数据仅供参考
      </footer>
    </div>
  );
}
