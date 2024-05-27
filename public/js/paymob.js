const API =
  "ZXlKaGJHY2lPaUpJVXpVeE1pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmpiR0Z6Y3lJNklrMWxjbU5vWVc1MElpd2ljSEp2Wm1sc1pWOXdheUk2T1RjNE16RTRMQ0p1WVcxbElqb2lNVGN4TmpZME1EZ3lOQzQxTURVMk9EWWlmUS51NU5DdTZ3Ujd6OF9NU0hOOFBncXY2U3Fua3daS3FXU2lWY2RXNzhoSFFSWjB5eE5MRy1ON1FNQ2JLb0doRE1YcmZfcGhLVmFpSlpLMkFDa0Zpemx2QQ==";

const Authenticate = async (products, user) => {
  console.log(user);
  //console.log("hello");
  //console.log(products);
  const data = {
    api_key: API,
  };

  const request = await fetch("https://accept.paymob.com/api/auth/tokens", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  let response = await request.json();
  //console.log(response);
  let token = response.token;
  OrderRegistrationAPI(token, products, user);
};

const OrderRegistrationAPI = async (token, products, user) => {
  // console.log(products);
  let totalPrice = 0;
  let orderItems = products.map((product) => {
    totalPrice += product.productId.price * product.quantity;
    return {
      name: product.productId.title,
      amount_cents: product.productId.price * 100,
      quantity: product.quantity,
      description: product.productId.description,
    };
  });
  // console.log(orderItems);
  const data = {
    auth_token: token,
    delivery_needed: "false",
    amount_cents: totalPrice * 100,
    currency: "EGP",
    items: orderItems,
  };

  const request = await fetch(
    "https://accept.paymob.com/api/ecommerce/orders",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }
  );
  let response = await request.json();
  // console.log(response.id);
  PaymentKeyRequest(response.id, token, totalPrice, user);
};

const PaymentKeyRequest = async (id, token, totalPrice, user) => {
  // console.log(id);
  const data = {
    auth_token: token,
    amount_cents: totalPrice * 100,
    expiration: 3600,
    order_id: id,
    billing_data: {
      apartment: "803",
      email: user.email,
      floor: "42",
      first_name: user.email,
      street: "Ethan Land",
      building: "8028",
      phone_number: "+86(8)9135210487",
      shipping_method: "PKG",
      postal_code: "01898",
      city: "Jaskolskiburgh",
      country: "CR",
      last_name: "Nicolas",
      state: "Utah",
    },
    currency: "EGP",
    integration_id: 4583090,
  };
  const request = await fetch(
    "https://accept.paymob.com/api/acceptance/payment_keys",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }
  );
  let response = await request.json();
  console.log(response);
  const paymentKey = response.token;
  cardPayment(paymentKey);
};

const cardPayment = async (paymentKey) => {
  const iframeUrl = `https://accept.paymob.com/api/acceptance/iframes/848539?payment_token=${paymentKey}`;
  location.href = iframeUrl;
};
