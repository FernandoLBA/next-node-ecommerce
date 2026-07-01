import { generateAccessToken, paypal } from "../lib/paypal";

//* Test to generate acess token from paypal
test("Generates token from paypal", async () => {
  const tokenResponse = await generateAccessToken();

  expect(typeof tokenResponse).toBe("string");
  expect(tokenResponse.length).toBeGreaterThan(0);
});

//* Test to create a paypal order
test("Creates a paypal order", async () => {
  const price = 10.0;

  const orderResponse = await paypal.createOrder(price);

  expect(orderResponse).toHaveProperty("id");
  expect(orderResponse).toHaveProperty("status");
  expect(orderResponse.status).toBe("CREATED");
});

//* Test to capture payment with mock order
test("Simulate capturing a payment from an order", async () => {
  const orderId = "100";

  const mockCaturePayment = jest
    .spyOn(paypal, "capturePayment")
    .mockResolvedValue({
      status: "COMPLETED",
    });

  const captureResponse = await paypal.capturePayment(orderId);

  expect(captureResponse).toHaveProperty("status", "COMPLETED");

  mockCaturePayment.mockRestore();
});
