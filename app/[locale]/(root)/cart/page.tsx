import { getMyCart } from "@/lib/actions/cart.actions";
import { Cart } from "@/types";
import CartTable from "./cart-table";

export const metadata = {
  title: "Shopping Cart",
};

const CartPage = async () => {
  const cart = await getMyCart();

  return (
    <>
      <CartTable cart={cart as Cart} />
    </>
  );
};

export default CartPage;
