// eslint-disable-next-line @typescript-eslint/no-require-imports
const SSLCommerzPayment = require("sslcommerz-lts");

const store_id = process.env.SSLCOMMERZ_STORE_ID;
const store_passwd = process.env.SSLCOMMERZ_STORE_PASSWORD;
const is_live = process.env.SSLCOMMERZ_IS_LIVE === "true";

export async function initSSLCommerz(data: any) {
  const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
  
  try {
    const apiResponse = await sslcz.init(data);
    return apiResponse;
  } catch (error) {
    console.error("SSLCommerz Init Error:", error);
    return null;
  }
}

export async function validateSSLCommerz(val_id: string) {
  const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
  try {
    const validation = await sslcz.validate({ val_id });
    return validation;
  } catch (error) {
    console.error("SSLCommerz Validation Error:", error);
    return null;
  }
}
