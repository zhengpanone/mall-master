export interface ICategoryParam {

}

export interface CategoryData {
  id: string
  name: string
  parentCategory: number
  level: number
  isTab: boolean
  sub_category?: CategoryData[]
}

export interface BrandData {
  id: string
  name: string
  logo: string
}


export interface GoodsParams {
  pageNum: number;
  pageSize: number;
  brandId: string | null;      // 品牌ID
  categoryId: string | null;     // 分类ID（选中最后一级，父级也兼容）
  productName: string | null;  // 商品名称
}