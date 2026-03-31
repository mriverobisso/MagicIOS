"use server";

import { fetchWooCommerce } from "@/lib/woocommerce";
import { revalidatePath } from "next/cache";

/**
 * Actualiza el estado de un pedido en WooCommerce de manera segura en el servidor
 */
export async function updateOrderStatus(orderId: number, status: string) {
  try {
    const result = await fetchWooCommerce(`orders/${orderId}`, {
      method: "PUT",
      body: JSON.stringify({ status })
    });
    
    // Forzar revalidación de la página de órdenes para refrescar los datos cacheados si los hubiera
    revalidatePath("/orders");
    
    return { success: true, data: result };
  } catch (error: any) {
    console.error("Error al actualizar la orden en WooCommerce:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Crea o edita un producto nuevo (base para ProductModal)
 */
export async function saveProduct(productData: any) {
  try {
    const endpoint = productData.id ? `products/${productData.id}` : `products`;
    const method = productData.id ? "PUT" : "POST";

    const result = await fetchWooCommerce(endpoint, {
      method,
      body: JSON.stringify(productData)
    });
    
    revalidatePath("/products");
    return { success: true, data: result };
  } catch (error: any) {
    console.error("Error al guardar producto:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Subida masiva de productos (para MassUploadModal)
 * WooCommerce soporta /wp-json/wc/v3/products/batch
 */
export async function bulkUploadProducts(create: any[], update: any[] = []) {
  try {
    const result = await fetchWooCommerce("products/batch", {
      method: "POST",
      body: JSON.stringify({ create, update })
    });
    
    revalidatePath("/products");
    return { success: true, data: result };
  } catch (error: any) {
    console.error("Error en subida masiva:", error);
    return { success: false, error: error.message };
  }
}
