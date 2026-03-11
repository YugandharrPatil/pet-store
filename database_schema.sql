-- Users table
CREATE TABLE public.pet_users (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  clerk_user_id text UNIQUE NOT NULL,
  name text,
  email text UNIQUE NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Disable Row Level Security temporarily
ALTER TABLE public.pet_users DISABLE ROW LEVEL SECURITY;

-- Products table
CREATE TABLE public.pet_products (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  price numeric(10, 2) NOT NULL,
  stock integer DEFAULT 0 NOT NULL,
  pet_type text CHECK (pet_type IN ('dog', 'cat', 'bird', 'fish', 'small_pet')) NOT NULL,
  age_group text CHECK (age_group IN ('puppy', 'kitten', 'adult', 'senior', 'all')) NOT NULL,
  ingredients text,
  feeding_guide text,
  image_urls text[],
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Disable RLS for pet_products
ALTER TABLE public.pet_products DISABLE ROW LEVEL SECURITY;
-- Anyone can read pet_products
CREATE POLICY "Products are viewable by everyone." ON public.pet_products FOR SELECT USING (true);

-- Addresses table
CREATE TABLE public.pet_addresses (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.pet_users(id) ON DELETE CASCADE NOT NULL,
  line_1 text NOT NULL,
  line_2 text,
  city text NOT NULL,
  state text NOT NULL,
  postal_code text NOT NULL,
  country text NOT NULL,
  is_default boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Disable RLS for addresses
ALTER TABLE public.pet_addresses DISABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own addresses." ON public.pet_addresses
  FOR ALL USING (auth.uid() IN (SELECT id FROM public.pet_users WHERE clerk_user_id = current_setting('request.jwt.claim.sub', true)));

-- Orders table
CREATE TABLE public.pet_orders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.pet_users(id) ON DELETE CASCADE NOT NULL,
  total_amount numeric(10, 2) NOT NULL,
  shipping_cost numeric(10, 2) DEFAULT 0 NOT NULL,
  status text CHECK (status IN ('pending', 'shipped', 'delivered')) DEFAULT 'pending' NOT NULL,
  shipping_address jsonb NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Disable RLS for orders
ALTER TABLE public.pet_orders DISABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own orders." ON public.pet_orders
  FOR SELECT USING (auth.uid() IN (SELECT id FROM public.pet_users WHERE clerk_user_id = current_setting('request.jwt.claim.sub', true)));

-- Order Items table
CREATE TABLE public.pet_order_items (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id uuid REFERENCES public.pet_orders(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES public.pet_products(id) ON DELETE RESTRICT NOT NULL,
  quantity integer NOT NULL,
  price_at_purchase numeric(10, 2) NOT NULL
);

-- Disable RLS for order_items
ALTER TABLE public.pet_order_items DISABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own order items." ON public.pet_order_items
  FOR SELECT USING (order_id IN (
    SELECT id FROM public.pet_orders WHERE user_id IN (
      SELECT id FROM public.pet_users WHERE clerk_user_id = current_setting('request.jwt.claim.sub', true)
    )
  ));

-- Carts table
CREATE TABLE public.pet_carts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.pet_users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  items jsonb DEFAULT '[]'::jsonb NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Disable RLS for pet_carts
ALTER TABLE public.pet_carts DISABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own carts." ON public.pet_carts
  FOR ALL USING (auth.uid() IN (SELECT id FROM public.pet_users WHERE clerk_user_id = current_setting('request.jwt.claim.sub', true)));
