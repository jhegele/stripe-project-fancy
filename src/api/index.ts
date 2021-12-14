export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  amount: number;
  image: string;
}

export interface Cart {
  [key: string]: {
    quantity: number;
  };
}

export const getBooks = async (): Promise<Book[]> => {
  const res = await fetch('/api/books');
  return await res.json();
};

export const getCart = async (): Promise<Cart> => {
  const res = await fetch(`/api/cart`);
  return await res.json();
};

export const addBookToCart = async (vars: {
  id: string;
  quantity: number;
}): Promise<Cart> => {
  const res = await fetch(`/api/cart/${vars.id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ quantity: vars.quantity }),
  });
  return await res.json();
};

export const updateBookInCart = async (vars: {
  id: string;
  quantity: number;
}): Promise<Cart> => {
  const res = await fetch(`/api/cart/${vars.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ quantity: vars.quantity }),
  });
  return await res.json();
};

export const removeBookFromCart = async (id: string): Promise<Cart> => {
  const res = await fetch(`/api/cart/${id}`, {
    method: 'DELETE',
  });
  return await res.json();
};
