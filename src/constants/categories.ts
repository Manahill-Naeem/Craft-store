// constants/categories.ts

interface CategoryDefinition {
  name: string;
  subcategories: string[];
}

export const CATEGORIES_WITH_SUBCATEGORIES: CategoryDefinition[] = [
  {
    name: 'Jewelery',
    subcategories: ['All Jewelery', 'Pearl Collection', 'Gold Plated', 'Silver Plated'],
  },
  {
    name: 'Electronics',
    subcategories: ['All Electronics', 'Mobile Phones', 'Laptops', 'Accessories'],
  },
  {
    name: 'Men\'s Clothing',
    subcategories: ['All Men\'s Clothing', 'Shirts', 'Pants', 'Jackets'],
  },
  {
    name: 'Women\'s Clothing',
    subcategories: ['All Women\'s Clothing', 'Dresses', 'Skirts', 'Tops'],
  },
  {
    name: 'Gifts',
    subcategories: ['All Gifts', 'Bouquets', 'Gift Baskets', 'Personalized Gifts'],
  },
  {
    name: 'Event',
    subcategories: ['All Event', 'Wedding Decor', 'Birthday Supplies', 'Party Favors'],
  },
  {
    name: 'Pottery',
    subcategories: ['All Pottery', 'Vases', 'Mugs', 'Sculptures'],
  },
  {
    name: 'Home Decor',
    subcategories: ['All Home Decor', 'Wall Art', 'Lamps', 'Cushions'],
  },
  {
    name: 'Textiles',
    subcategories: ['All Textiles', 'Carpets', 'Bedding', 'Curtains'],
  },
];
