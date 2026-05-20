export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api/v1";

export type BackendCategory = {
  id: number;
  name: string;
  slug: string;
};

export type BackendProduct = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  stock_quantity: number;
  image_url: string | null;
  images?: string[];
  is_available: boolean;
  category_id: number | null;
  category?: BackendCategory | null;
};

export type BackendRecipe = {
  id: number;
  title: string;
  slug: string;
  description: string;
  content: string;
  image_url: string | null;
  prep_time: string | null;
  cook_time: string | null;
  difficulty: string;
  servings: number | null;
};

export type BackendUser = {
  id: string;
  email: string;
  username: string;
  role: string;
  is_active: boolean;
  is_verified: boolean;
  two_factor_enabled: boolean;
  points: number;
  full_name: string | null;
  address: string | null;
  city: string | null;
  zip: string | null;
  created_at: string;
};

export type LoginResponse = {
  message: string;
  two_factor_required: boolean;
  email?: string;
  user?: BackendUser | null;
};

export type Verify2FAResponse = {
  message: string;
  user?: BackendUser | null;
};

type ProductListResponse = {
  items: BackendProduct[];
  total: number;
};

type MessageResponse = {
  message: string;
};

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    let detail = "";
    try {
      const errorBody = await response.json();
      detail = errorBody?.detail 
        ? (typeof errorBody.detail === 'string' ? ` - ${errorBody.detail}` : ` - ${JSON.stringify(errorBody.detail)}`)
        : "";
    } catch {
      // Ignore non-JSON error bodies.
    }
    throw new Error(`API request failed (${response.status})${detail}`);
  }

  return (await response.json()) as T;
}

export type BackendOrderItem = {
  id: number;
  product_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
};

export type BackendOrder = {
  id: string;
  total_amount: number;
  subtotal: number;
  tax_amount: number;
  shipping_amount: number;
  status: string;
  shipping_address: Record<string, string>;
  notes: string | null;
  created_at: string;
  items: BackendOrderItem[];
};

export type BackendReminder = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  remind_at: string;
  is_completed: boolean;
  created_at: string;
};

export interface Review {
  id: number;
  product_id: number;
  user_id: string;
  username?: string;
  rating: number;
  title?: string;
  content: string;
  created_at: string;
}

export const api = {
  getProducts: (params?: { categoryId?: number; q?: string; limit?: number; skip?: number }) => {
    const search = new URLSearchParams();
    if (params?.categoryId != null) search.set("category_id", String(params.categoryId));
    if (params?.q != null) search.set("q", params.q);
    if (params?.limit != null) search.set("limit", String(params.limit));
    if (params?.skip != null) search.set("skip", String(params.skip));
    const query = search.toString() ? `?${search.toString()}` : "";
    return requestJson<ProductListResponse>(`/products/${query}`);
  },

  getProductBySlug: (slug: string) =>
    requestJson<BackendProduct>(`/products/${encodeURIComponent(slug)}`),

  createProduct: (payload: any) =>
    requestJson<BackendProduct>("/products/", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  updateProduct: (id: number, payload: any) =>
    requestJson<BackendProduct>(`/products/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),

  deleteProduct: (id: number) =>
    requestJson<void>(`/products/${id}`, {
      method: "DELETE",
    }),

  getCategories: () => requestJson<BackendCategory[]>("/categories/"),

  signup: (payload: { email: string; username: string; password: string }) =>
    requestJson<{ user: BackendUser; message: string }>("/auth/signup", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  login: (payload: { email: string; password: string; remember_me?: boolean }) =>
    requestJson<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  verify2fa: (payload: { email: string; code: string; remember_me?: boolean }) =>
    requestJson<Verify2FAResponse>("/auth/verify-2fa", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  forgotPassword: (payload: { email: string }) =>
    requestJson<MessageResponse>("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  resetPassword: (payload: { email: string; code: string; new_password: string }) =>
    requestJson<MessageResponse>("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  logout: () =>
    requestJson<MessageResponse>("/auth/logout", {
      method: "POST",
    }),

  getMe: () => requestJson<BackendUser>("/auth/me"),

  getUsers: () => requestJson<BackendUser[]>("/auth/users"),

  updateMe: (payload: { email?: string; username?: string; password?: string; two_factor_enabled?: boolean }) =>
    requestJson<{ user: BackendUser; message: string; verification_required: boolean }>("/auth/me", {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),

  deleteMe: () =>
    requestJson<MessageResponse>("/auth/me", {
      method: "DELETE",
    }),

  verifyOtp: (payload: { email: string; code: string }) =>
    requestJson<{ message: string }>("/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ ...payload, purpose: "email_verify" }),
    }),

  resendOtp: (email: string) =>
    requestJson<{ message: string }>("/auth/resend-otp", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),

  checkout: (payload: {
    items: { product_id: number; quantity: number }[];
    shipping_address: Record<string, string>;
    notes?: string;
    captcha_token: string;
    payment_intent_id: string;
  }) =>
    requestJson<BackendOrder>("/orders/checkout", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getOrders: () => requestJson<BackendOrder[]>("/orders/"),
  getOrder: (id: string) => requestJson<BackendOrder>(`/orders/${id}`),
  updateOrderStatus: (id: string, status: string) =>
    requestJson<BackendOrder>(`/orders/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),

  deleteOrder: (id: string) =>
    requestJson<void>(`/orders/${id}`, {
      method: "DELETE",
    }),

  getRecipes: () => requestJson<BackendRecipe[]>("/recipes/"),
  getRecipeBySlug: (slug: string) => requestJson<BackendRecipe>(`/recipes/${slug}`),

  createRecipe: (recipe: Partial<BackendRecipe>) =>
    requestJson<BackendRecipe>("/recipes/", {
      method: "POST",
      body: JSON.stringify(recipe),
    }),

  updateRecipe: (id: number, recipe: Partial<BackendRecipe>) =>
    requestJson<BackendRecipe>(`/recipes/${id}`, {
      method: "PATCH",
      body: JSON.stringify(recipe),
    }),

  deleteRecipe: (id: number) =>
    requestJson<void>(`/recipes/${id}`, {
      method: "DELETE",
    }),

  subscribeNewsletter: (email: string) =>
    requestJson<{ message: string }>("/newsletter/subscribe", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),

  createPaymentIntent: (amount: number) =>
    requestJson<{ client_secret: string }>("/orders/create-payment-intent", {
      method: "POST",
      body: JSON.stringify({ amount }),
    }),

  getReminders: () => requestJson<BackendReminder[]>("/reminders/"),
  createReminder: (payload: { title: string; description?: string; remind_at: string }) =>
    requestJson<BackendReminder>("/reminders/", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  updateReminder: (id: string, payload: { is_completed?: boolean; title?: string; description?: string }) =>
    requestJson<BackendReminder>(`/reminders/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
  deleteReminder: (id: string) =>
    requestJson<void>(`/reminders/${id}`, {
      method: "DELETE",
    }),
  sendContact: (payload: { name: string; email: string; subject: string; message: string }) =>
    requestJson<{ message: string }>("/contact/", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  getWishlist: () => requestJson<BackendProduct[]>("/wishlists/"),
  addToWishlist: (productId: number) =>
    requestJson<{ message: string }>(`/wishlists/${productId}`, {
      method: "POST",
    }),
  removeFromWishlist: (productId: number) =>
    requestJson<{ message: string }>(`/wishlists/${productId}`, {
      method: "DELETE",
    }),
  getReviews: (productId: number) =>
    requestJson<Review[]>(`/reviews/${productId}`),
  submitReview: (payload: { product_id: number; rating: number; title?: string; content: string }) =>
    requestJson<Review>("/reviews/", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};
