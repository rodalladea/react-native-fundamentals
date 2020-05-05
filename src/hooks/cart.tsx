import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Product): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      const allProducts = await AsyncStorage.getItem('@GoMarketplace:products');

      if (allProducts) {
        setProducts(JSON.parse(allProducts as string));
      }
    }

    loadProducts();
  }, []);

  const increment = useCallback(
    async id => {
      const allProducts = [...products];

      allProducts.forEach(product => {
        if (id === product.id) {
          product.quantity++;
        }
      });

      setProducts(allProducts);

      await AsyncStorage.setItem(
        '@GoBarber:products',
        JSON.stringify(allProducts),
      );
    },
    [products],
  );

  const addToCart = useCallback(
    async (product: Product) => {
      const allProducts = [...products];

      if (allProducts.some(allProduct => allProduct.id === product.id)) {
        increment(product.id);
      } else {
        product.quantity = 1;
        allProducts.push(product);
      }

      setProducts(allProducts);

      await AsyncStorage.setItem(
        '@GoBarber:products',
        JSON.stringify(allProducts),
      );
    },
    [products, increment],
  );

  const decrement = useCallback(
    async id => {
      const allProducts = [...products];

      allProducts.forEach((product, index) => {
        if (id === product.id) {
          if (product.quantity > 1) {
            product.quantity--;
          } else {
            allProducts.splice(index, 1);
          }
        }
      });

      setProducts(allProducts);

      await AsyncStorage.setItem(
        '@GoBarber:products',
        JSON.stringify(allProducts),
      );
    },
    [products],
  );

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
