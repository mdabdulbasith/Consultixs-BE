import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

let accessToken = process.env.ZOHO_ACCESS_TOKEN;

export const getAccessToken = async () => {
  try {
    await axios.get('https://www.zohoapis.in/crm/v2/settings/modules', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return accessToken;
  } catch (err) {
    console.warn('🔁 Access token expired. Refreshing...');

    const response = await axios.post('https://accounts.zoho.in/oauth/v2/token', null, {
      params: {
        refresh_token: process.env.ZOHO_REFRESH_TOKEN,
        client_id: process.env.ZOHO_CLIENT_ID,
        client_secret: process.env.ZOHO_CLIENT_SECRET,
        grant_type: 'refresh_token',
      },
    });

    accessToken = response.data.access_token;
    console.log('✅ New Zoho Access Token:', accessToken);

    return accessToken;
  }
};
