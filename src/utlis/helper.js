import base64 from 'base-64';
import { clientId, secretKey } from "@env";

// Helper function to encode client ID and secret key
const encodeCredentials = () => base64.encode(`${clientId}:${secretKey}`);

// Helper function to create headers with authorization
const createHeaders = (token = '', contentType = 'application/json') => {
  const headers = {
    'Content-Type': contentType,
  };

  if (typeof token === 'string' && token.trim() !== '') {
    headers['Authorization'] = `Bearer ${token}`;
  } else {
    headers['Authorization'] = `Basic ${encodeCredentials()}`;
  }
  console.log("🚀 ~ file: helper.js:21 ~ createHeaders ~ headers:", headers)

  return headers;
};

export default createHeaders;