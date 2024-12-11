interface Brand {
  id: number;
  logo: string;
  name: string;
}

interface Category {
  id: number;
  name: string;
}


export interface ProductData {
  brand: Brand;
  category: Category;
  desc: string;
  desc_images: string[] | null;
  front_image: string;
  goods_brief: string;
  id: number;
  images: string[] | null;
  is_hot: boolean;
  is_new: boolean;
  name: string;
  on_sale: boolean;
  ship_free: boolean;
  shop_price: number;

}