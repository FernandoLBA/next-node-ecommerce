import { hashSync } from "bcrypt-ts-edge";
import dotenv from "dotenv";

dotenv.config();

const settings = await getAppSettings();

import { getAppSettings } from "@/lib/actions/app-setting.actions";
import { userRoles } from "@/lib/constants";

const sampleData = {
  appSettings: [
    {
      key: "appName",
      value: settings.appName,
      description: "name of the ecommerce or brand",
    },
    {
      key: "appDescription",
      value: settings.appDescription,
      description: "name of the ecommerce or brand",
    },
    {
      key: "defaultLanguage",
      value: settings.defaultLanguage,
      description: "Default language of ecommerce",
    },
    {
      key: "defaultCurrency",
      value: settings.defaultCurrency,
      description: "Default currency of the app",
    },
    {
      key: "taxPercentage",
      value: settings.taxPercentage,
      description: "Default tax percentage of the app",
    },
    {
      key: "shippingPrice",
      value: settings.shippingPrice,
      description: "Default shipping price of the app",
    },
    {
      key: "shippingFreeAmount",
      value: settings.shippingFreeAmount,
      description: "Default shipping free amount of the app",
    },
  ],
  users: [
    {
      name: "Admin",
      email: "fer@admin.com",
      password: hashSync("Admin123", 10),
      role: userRoles.ADMIN,
    },
    {
      name: "Jane",
      email: "user@example.com",
      password: hashSync("123123", 10),
      role: userRoles.USER,
    },
    {
      name: "Shopper",
      email: "fer@example.com",
      password: hashSync("123123", 10),
      role: userRoles.USER,
    },
  ],
  categories: [
    {
      name: "Men's Dress Shirts",
      image:
        "https://images.unsplash.com/photo-1602810320073-1230c46d89d4?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      name: "Men's Sweatshirts",
      image:
        "https://images.unsplash.com/photo-1505632958218-4f23394784a6?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      name: "Women's Sunglasses",
      image:
        "https://images.unsplash.com/photo-1556560957-ac5a1b5bfcb9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHdvbWVuJ3MlMjBzdW5nbGFzc2VzfGVufDB8fDB8fHww",
    },
    {
      name: "Women's Purses",
      image:
        "https://images.unsplash.com/photo-1751522937993-46b83342398b?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ],
  products: [
    {
      name: "Polo Sporting Stretch Shirt",
      slug: "polo-sporting-stretch-shirt",
      category: "Men's Dress Shirts",
      description: "Classic Polo style with modern comfort",
      images: [
        "/images/sample-products/p1-1.jpg",
        "/images/sample-products/p1-2.jpg",
      ],
      price: 59.99,
      brand: "Polo",
      rating: 4.5,
      numReviews: 10,
      stock: 5,
      isFeatured: true,
      banner: "/images/banner-1.jpg",
    },
    {
      name: "Brooks Brothers Long Sleeved Shirt",
      slug: "brooks-brothers-long-sleeved-shirt",
      category: "Men's Dress Shirts",
      description: "Timeless style and premium comfort",
      images: [
        "/images/sample-products/p2-1.jpg",
        "/images/sample-products/p2-2.jpg",
      ],
      price: 85.9,
      brand: "Brooks Brothers",
      rating: 4.2,
      numReviews: 8,
      stock: 10,
      isFeatured: true,
      banner: "/images/banner-2.jpg",
    },
    {
      name: "Tommy Hilfiger Classic Fit Dress Shirt",
      slug: "tommy-hilfiger-classic-fit-dress-shirt",
      category: "Men's Dress Shirts",
      description: "A perfect blend of sophistication and comfort",
      images: [
        "/images/sample-products/p3-1.jpg",
        "/images/sample-products/p3-2.jpg",
      ],
      price: 99.95,
      brand: "Tommy Hilfiger",
      rating: 4.9,
      numReviews: 3,
      stock: 0,
      isFeatured: false,
      banner: null,
    },
    {
      name: "Calvin Klein Slim Fit Stretch Shirt",
      slug: "calvin-klein-slim-fit-stretch-shirt",
      category: "Men's Dress Shirts",
      description: "Streamlined design with flexible stretch fabric",
      images: [
        "/images/sample-products/p4-1.jpg",
        "/images/sample-products/p4-2.jpg",
      ],
      price: 39.95,
      brand: "Calvin Klein",
      rating: 3.6,
      numReviews: 5,
      stock: 10,
      isFeatured: false,
      banner: null,
    },
    {
      name: "Polo Ralph Lauren Oxford Shirt",
      slug: "polo-ralph-lauren-oxford-shirt",
      category: "Men's Dress Shirts",
      description: "Iconic Polo design with refined oxford fabric",
      images: [
        "/images/sample-products/p5-1.jpg",
        "/images/sample-products/p5-2.jpg",
      ],
      price: 79.99,
      brand: "Polo",
      rating: 4.7,
      numReviews: 18,
      stock: 6,
      isFeatured: false,
      banner: null,
    },
    {
      name: "Polo Classic Pink Hoodie",
      slug: "polo-classic-pink-hoodie",
      category: "Men's Sweatshirts",
      description: "Soft, stylish, and perfect for laid-back days",
      images: [
        "/images/sample-products/p6-1.jpg",
        "/images/sample-products/p6-2.jpg",
      ],
      price: 99.99,
      brand: "Polo",
      rating: 4.6,
      numReviews: 12,
      stock: 8,
      isFeatured: true,
      banner: null,
    },
  ],
};

export default sampleData;
