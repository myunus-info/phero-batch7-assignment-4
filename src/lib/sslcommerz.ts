import axios from 'axios';
import httpStatus from 'http-status';
import config from '../config';
import ApiError from '../app/errors/ApiError';
import { RentalOrder } from '../../generated/prisma/client';

export type TUser = {
  id: string | null;
  name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
};

export const initPayment = async (user: TUser, order: RentalOrder) => {
  const transId = `TRNX_ID-${crypto.randomUUID()}`;
  try {
    const data = {
      store_id: config.ssl.storeId,
      store_passwd: config.ssl.storePass,
      total_amount: order.totalAmount,
      currency: 'BDT',
      tran_id: transId,
      success_url: `${config.app_url}/api/v1/payments/?orderId=${order.id}&tranId=${transId}&status=success`,
      fail_url: `${config.app_url}/api/v1/payments/?orderId=${order.id}&tranId=${transId}&status=fail`,
      cancel_url: `${config.app_url}/api/v1/payments/?orderId=${order.id}&tranId=${transId}&status=cancel`,
      ipn_url: `${config.app_url}/ipn`,
      shipping_method: 'N/A',
      product_name: 'Appointment',
      product_category: 'Service',
      product_profile: 'general',
      cus_name: user.name,
      cus_email: user.email,
      cus_add1: user.address,
      cus_add2: 'N/A',
      cus_city: 'Dhaka',
      cus_state: 'Dhaka',
      cus_postcode: '1000',
      cus_country: 'Bangladesh',
      cus_phone: user.phone,
      cus_fax: '01711111111',
      ship_name: 'N/A',
      ship_add1: 'N/A',
      ship_add2: 'N/A',
      ship_city: 'N/A',
      ship_state: 'N/A',
      ship_postcode: 1000,
      ship_country: 'N/A',
    };

    const response = await axios({
      method: 'POST',
      url: `${config.ssl.sslPaymentApi}`,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data,
    });

    const transData = response.data;
    return transData?.GatewayPageURL;
  } catch (err) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Payment error occured!');
  }
};

export const verifyPayment = async (val_id: string) => {
  try {
    const res = await axios({
      method: 'GET',
      url: `${config.ssl.sslValidationApi}?val_id=${val_id}&store_id=${config.ssl.storeId}&store_passwd=${config.ssl.storePass}&format=json`,
    });

    const confirmationData = res.data;

    return confirmationData;
  } catch (err) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Payment validation failed!');
  }
};
