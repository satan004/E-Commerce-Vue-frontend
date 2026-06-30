import { api } from './apiClient';
import type { ApiProduct } from './catalog';

export interface AdminProductPayload {
  category_id: number | string;
  name: string;
  description?: string | null;
  price: number | string;
  stock: number | string;
  image?: File | null;
  image_url?: string | null;
  is_active?: boolean;
}

function productFormData(payload: AdminProductPayload): FormData {
  const formData = new FormData();

  formData.append('category_id', String(payload.category_id));
  formData.append('name', payload.name);
  formData.append('description', payload.description ?? '');
  formData.append('price', String(payload.price));
  formData.append('stock', String(payload.stock));
  formData.append('image_url', payload.image_url ?? '');
  formData.append('is_active', payload.is_active ? '1' : '0');

  if (payload.image instanceof File) {
    console.log('Selected product image file:', payload.image);
    formData.append('image', payload.image);
  } else {
    console.log('Selected product image file:', payload.image ?? null);
  }

  return formData;
}

export function createAdminProduct(payload: AdminProductPayload): Promise<ApiProduct> {
  return api<ApiProduct>({
    method: 'POST',
    url: '/admin/products',
    data: productFormData(payload),
  });
}

export function updateAdminProduct(id: number | string, payload: AdminProductPayload): Promise<ApiProduct> {
  const formData = productFormData(payload);
  formData.append('_method', 'PUT');

  return api<ApiProduct>({
    method: 'POST',
    url: `/admin/products/${id}`,
    data: formData,
  });
}
