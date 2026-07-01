const base = process.env.PAYPAL_API_URL || "https://api-m.sandbox.paypal.com";

const api = {
  POST: async ({
    url,
    token,
    body,
    isBasicAuthorization = false,
    contentType,
  }: {
    url: string;
    token: string;
    body?: BodyInit;
    isBasicAuthorization?: boolean;
    contentType?: string;
  }) => {
    const config = {
      method: "POST",
      headers: {
        "Content-Type": contentType ?? "application/json",
        Authorization: `${isBasicAuthorization ? "Basic" : "Bearer"} ${token}`,
      },
      body,
    };

    return await fetch(url, body ? { ...config, body } : config);
  },
};

export const paypal = {
  createOrder: async function (price: number) {
    const token = await generateAccessToken();
    const url = `${base}/v2/checkout/orders`;

    const response = await api.POST({
      url,
      token,
      body: JSON.stringify({
        intent: "CAPTURE", // ? Set the intent to "CAPTURE" for immediate payment capture
        purchase_units: [ // ? Specify the purchase units for the order
          {
            amount: {
              currency_code: "USD",
              value: price,
            },
          },
        ],
      }),
    });

    return handleResponse(response);
  },
  capturePayment: async function (orderId: string) {
    const token = await generateAccessToken();
    const url = `${base}/v2/checkout/orders/${orderId}/capture`;

    const response = await api.POST({ url, token });

    return handleResponse(response);
  },
};

//* Generate paypal access token
async function generateAccessToken() {
  const { PAYPAL_CLIENT_ID, PAYPAL_APP_SECRET } = process.env;
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_APP_SECRET}`).toString(
    "base64",
  );

  const response = await api.POST({
    url: `${base}/v1/oauth2/token`,
    body: "grant_type=client_credentials",
    token: auth,
    isBasicAuthorization: true,
    contentType: "application/x-www-form-urlencoded",
  });

  const jsonData = await handleResponse(response);

  return jsonData.access_token;
}

async function handleResponse(response: Response) {
  if (response.ok) {
    return response.json();
  } else {
    const errorMessage = await response.text();

    throw new Error(errorMessage);
  }
}

export { generateAccessToken };
