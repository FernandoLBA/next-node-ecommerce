import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import dotenv from "dotenv";

import sampleData from "@/db/sample-data";
import { getAppSettings } from "@/lib/actions/app-setting.actions";
import { APP_SERVER_URL } from "@/lib/constants";
import { cn, formatCurrency } from "@/lib/utils";
import { Order } from "@/types";

dotenv.config();

//#region(//TODO DEBO BORRA ESTO LUEGO, esto solo es para el preview del email)
const urlImages = [
  "https://48pf58o6wh.ufs.sh/f/sIwwUI4xAQ0XxmmSaMvnPJfv5G2kX7ptSU1yVnwDOoHEus8b",
  "https://48pf58o6wh.ufs.sh/f/sIwwUI4xAQ0XvwghV7LBySXVa4HJNQz92OCUhnwvDgr86GAR",
  "https://48pf58o6wh.ufs.sh/f/sIwwUI4xAQ0XJiKSXUmG8yuoXiKYcOBz7t0ZM3UxGhkdgTnq",
  "https://48pf58o6wh.ufs.sh/f/sIwwUI4xAQ0XGUHoAy7jIoLS9gBEFcqmewtWbRaCQv3ksOKY",
  "https://48pf58o6wh.ufs.sh/f/sIwwUI4xAQ0XXVS9UtKo0ZxYGvrnWBEI1d7zLshuJ4P6caN3",
  "https://48pf58o6wh.ufs.sh/f/sIwwUI4xAQ0X9bkv65gqOUnGv5yjeNztcpDQrFR9s8ZfbMhu",
];

PurchaseReceiptEmail.PreviewProps = {
  order: {
    id: "12345678-1234-1234-1234-123456789012",
    userId: "123",
    user: {
      name: "John Doe",
      email: "test@test.com",
    },
    paymentMethod: "Stripe",
    shippingAddress: {
      fullName: "John Doe",
      streetAddress: "123 Main St",
      city: "New York",
      postalCode: "10001",
      country: "US",
    },
    createdAt: new Date(),
    totalPrice: "100",
    taxPrice: "10",
    shippingPrice: "10",
    itemsPrice: "80",
    orderItems: sampleData.products.map((x, index) => ({
      orderId: "123",
      productId: "123",
      name: x.name,
      slug: x.slug,
      qty: x.stock,
      image: urlImages[index],
      price: x.price.toString(),
    })),
    isDelivered: true,
    deliveredAt: new Date(),
    isPaid: true,
    paidAt: new Date(),
    paymentResult: {
      id: "123",
      status: "succeeded",
      pricePaid: "100",
      email_address: "tes@test.com",
    },
  },
} satisfies OrderInformationProps;
//#endregion //TODO DEBO BORRA ESTO LUEGO, esto solo es para el preview del email

type OrderInformationProps = {
  order: Order;
};

export default async function PurchaseReceiptEmail({
  order,
}: OrderInformationProps) {
  const settings = await getAppSettings();
  const titleClasses = "font-semibold text-yellow-400";
  const fontContentSizeClasses = "text-xs font-light";
  const mainColorTitleClasses =
    "mr-4 font-semibold text-yellow-400 whitespace-nowrap capitalize";

  const dateFormatter = new Intl.DateTimeFormat("es", {
    dateStyle: "medium",
  }); //?

  const createdAtDate =
    order.createdAt instanceof Date ? order.createdAt : new Date();

  const pricesArray = [
    { name: "Items", price: order.itemsPrice },
    { name: "Tax", price: order.taxPrice },
    { name: "Shipping", price: order.shippingPrice },
    { name: "Total", price: order.totalPrice },
  ];

  return (
    <Html>
      <Preview>View order receipt</Preview>

      <Tailwind>
        <Head />

        <Body className="font-sans bg-gray-50 py-6">
          <Container className="max-w-xl">
            <Heading className={cn(titleClasses, "text-accent-foreground")}>
              Purchase Receipt
            </Heading>

            {/* TOP SECTION */}
            <Section>
              <Row>
                <Column>
                  <Text className={cn("mb-0", mainColorTitleClasses)}>
                    Order ID
                  </Text>

                  <Text className={cn(fontContentSizeClasses, "mt-0 mr-4")}>
                    {order.id}
                  </Text>
                </Column>

                <Column>
                  <Text className={cn("mb-0", mainColorTitleClasses)}>
                    Purchase Date
                  </Text>

                  <Text className={cn(fontContentSizeClasses, "mt-0 mr-4")}>
                    {dateFormatter.format(createdAtDate)}
                  </Text>
                </Column>

                <Column>
                  <Text className={cn("mb-0", mainColorTitleClasses)}>
                    Price Paid
                  </Text>

                  <Text className={cn(fontContentSizeClasses, "mt-0 mr-4")}>
                    {formatCurrency(order.totalPrice)}
                  </Text>
                </Column>
              </Row>
            </Section>

            {/* PURCHASE DETAILS SECTION */}
            <Section className="border border-solid bg-yellow-400 border-yellow-400 rounded-lg p-4 md:p-6 my-4">
              {/* LOGO */}
              <Row align="center" className="mb-6">
                <Column className="flex flex-col items-center justify-center">
                  <Img
                    width={40}
                    alt="logo"
                    className=""
                    src={
                      "https://48pf58o6wh.ufs.sh/f/sIwwUI4xAQ0X741EzMi6wGmUyrLPSQXf3RHxoB1Jut24ijIe"
                    }
                  />

                  <Text
                    className={cn(mainColorTitleClasses, "m-0 text-white mt-2")}
                  >
                    {settings.appName}
                  </Text>
                </Column>
              </Row>

              {/* PRODUCTS SECTION */}
              <Section className="bg-white border border-solid border-white rounded-xl p-4 md:px-6">
                {order.orderItems.map((item) => (
                  <Row
                    key={item.productId}
                    className="mt-6 border-b border-b-gray-400 pb-2"
                  >
                    <Column className="w-20 h-auto">
                      <Img
                        width={40}
                        alt="product image"
                        className="rounded"
                        src={
                          item.image.startsWith("/")
                            ? `${APP_SERVER_URL}${item.image}`
                            : item.image
                        }
                      />
                    </Column>

                    <Column
                      className={cn(fontContentSizeClasses, "align-bottom")}
                    >
                      {item.name} x {item.qty}
                    </Column>

                    <Column
                      align="right"
                      className={cn(fontContentSizeClasses, "align-bottom")}
                    >
                      {formatCurrency(item.price)}
                    </Column>
                  </Row>
                ))}
              </Section>

              {/* PRICE DEATILS SECTION */}
              <div className="flex p-4 md:p-6 rounded-xl bg-white mt-6 w-120 border border-solid border-white">
                <div className="w-1/2">
                  <Row align="left">
                    <Column width={50} align="left">
                      <Text
                        className={cn(
                          fontContentSizeClasses,
                          "text-wrap align-top",
                        )}
                      >
                        Lorem ipsum, dolor sit amet consectetur adipisicing
                        elit. Distinctio facilis esse quasi placeat eius optio
                        officia at reprehenderit.
                      </Text>
                    </Column>
                  </Row>
                </div>

                <div className="w-1/2">
                  {pricesArray.map(({ name, price }) => (
                    <Row key={name}>
                      <Column
                        align="right"
                        className={cn("pr-2", mainColorTitleClasses)}
                      >
                        {name}
                      </Column>

                      <Column align="right" width={50}>
                        <Text className={cn(fontContentSizeClasses, "m-0")}>
                          {formatCurrency(price)}
                        </Text>
                      </Column>
                    </Row>
                  ))}
                </div>
              </div>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
