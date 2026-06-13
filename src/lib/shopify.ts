import { createStorefrontApiClient } from "@shopify/storefront-api-client";
import type { Cart, CartLine } from "@/types/cart";

export const shopifyClient = createStorefrontApiClient({
  storeDomain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!,
  publicAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN!,
  apiVersion: "2026-04",
});

// ─── Cart fragment (reused across all mutations) ──────────────────────────────

const CART_FIELDS = `
  id
  checkoutUrl
  totalQuantity
  cost { subtotalAmount { amount currencyCode } }
  lines(first: 100) {
    edges {
      node {
        id
        quantity
        merchandise {
          ... on ProductVariant {
            id
            title
            price { amount currencyCode }
            product {
              title
              handle
              images(first: 1) {
                edges { node { url altText } }
              }
            }
          }
        }
      }
    }
  }
`

// ─── Mutations ────────────────────────────────────────────────────────────────

const CART_CREATE = `
  mutation cartCreate($lines: [CartLineInput!]) {
    cartCreate(input: { lines: $lines }) {
      cart { ${CART_FIELDS} }
      userErrors { field message }
    }
  }
`

const CART_LINES_ADD = `
  mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart { ${CART_FIELDS} }
      userErrors { field message }
    }
  }
`

const CART_LINES_UPDATE = `
  mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart { ${CART_FIELDS} }
      userErrors { field message }
    }
  }
`

const CART_LINES_REMOVE = `
  mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart { ${CART_FIELDS} }
      userErrors { field message }
    }
  }
`

const CART_QUERY = `
  query getCart($cartId: ID!) {
    cart(id: $cartId) { ${CART_FIELDS} }
  }
`

// ─── Response parser ──────────────────────────────────────────────────────────

function parseCart(raw: Record<string, unknown>): Cart {
  const lines: CartLine[] = (
    (raw.lines as { edges: Array<{ node: Record<string, unknown> }> })?.edges ?? []
  ).map(({ node }) => {
    const merch = node.merchandise as Record<string, unknown>
    const product = merch?.product as Record<string, unknown>
    const imgEdges = (product?.images as { edges: Array<{ node: { url: string; altText: string } }> })?.edges ?? []
    return {
      id: node.id as string,
      quantity: node.quantity as number,
      merchandise: {
        id: merch?.id as string,
        title: merch?.title as string,
        price: merch?.price as { amount: string; currencyCode: string },
        product: {
          title: product?.title as string,
          handle: product?.handle as string,
          image: imgEdges[0]?.node,
        },
      },
    }
  })

  return {
    id: raw.id as string,
    checkoutUrl: raw.checkoutUrl as string,
    totalQuantity: raw.totalQuantity as number,
    cost: raw.cost as Cart['cost'],
    lines,
  }
}

// ─── Helper functions ─────────────────────────────────────────────────────────

export async function shopifyCartCreate(
  lines: Array<{ merchandiseId: string; quantity: number }>
): Promise<Cart> {
  const { data } = await shopifyClient.request(CART_CREATE, { variables: { lines } }) as {
    data: { cartCreate: { cart: Record<string, unknown>; userErrors: Array<{ message: string }> } }
  }
  if (data.cartCreate.userErrors?.length) {
    throw new Error(data.cartCreate.userErrors[0].message)
  }
  return parseCart(data.cartCreate.cart)
}

export async function shopifyCartLinesAdd(
  cartId: string,
  lines: Array<{ merchandiseId: string; quantity: number }>
): Promise<Cart> {
  const { data } = await shopifyClient.request(CART_LINES_ADD, { variables: { cartId, lines } }) as {
    data: { cartLinesAdd: { cart: Record<string, unknown>; userErrors: Array<{ message: string }> } }
  }
  if (data.cartLinesAdd.userErrors?.length) {
    throw new Error(data.cartLinesAdd.userErrors[0].message)
  }
  return parseCart(data.cartLinesAdd.cart)
}

export async function shopifyCartLinesUpdate(
  cartId: string,
  lines: Array<{ id: string; quantity: number }>
): Promise<Cart> {
  const { data } = await shopifyClient.request(CART_LINES_UPDATE, { variables: { cartId, lines } }) as {
    data: { cartLinesUpdate: { cart: Record<string, unknown>; userErrors: Array<{ message: string }> } }
  }
  if (data.cartLinesUpdate.userErrors?.length) {
    throw new Error(data.cartLinesUpdate.userErrors[0].message)
  }
  return parseCart(data.cartLinesUpdate.cart)
}

export async function shopifyCartLinesRemove(
  cartId: string,
  lineIds: string[]
): Promise<Cart> {
  const { data } = await shopifyClient.request(CART_LINES_REMOVE, { variables: { cartId, lineIds } }) as {
    data: { cartLinesRemove: { cart: Record<string, unknown>; userErrors: Array<{ message: string }> } }
  }
  if (data.cartLinesRemove.userErrors?.length) {
    throw new Error(data.cartLinesRemove.userErrors[0].message)
  }
  return parseCart(data.cartLinesRemove.cart)
}

export async function shopifyGetCart(cartId: string): Promise<Cart | null> {
  const { data } = await shopifyClient.request(CART_QUERY, { variables: { cartId } }) as {
    data: { cart: Record<string, unknown> | null }
  }
  if (!data.cart) return null
  return parseCart(data.cart)
}
