export interface MedicineResponse {
    id: string;
    product_name: string;
    product_code: string;
    sale_price: number;
    mrp: number;
    type_of_medicine: string;
    in_stock: boolean;
    images: string[];
}
