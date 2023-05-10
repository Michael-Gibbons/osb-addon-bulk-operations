# OSB Addon Bulk Operations

The bulk operations api can be a pain to work with, this addon is an attempt to streamline the process.

All this addon does is implement the instructions found [here](https://shopify.dev/docs/api/usage/bulk-operations/imports)

The end product of this addon is these two functions.

`performBulkQuery`

`performBulkMutation`

How you choose to implement these functions is up to you, in `requestData.js` you can see an example of a cron schedule being used as that is the most common usage but you can use them when the application starts, in response to a route or webhook, etc. Just import the functions from index.js.

# Installation

```
  npm run osb addon add https://github.com/Michael-Gibbons/osb-addon-bulk-operations
```

## performBulkQuery

This function accepts an object with the properties `gqlClient`, `query`, and `key`.

- gqlClient is a graphql client from the shopify-api-js package
- query is a graphql query
- key is a string used to namespace your request

```js
  performBulkQuery({
    gqlClient,
    query: PRODUCTS_QUERY,
    key: 'products'
  })
```
## performBulkMutation

This function accepts an object with the properties `gqlClient`, `mutation`, `variables`, and `key`

- gqlClient is a graphql client from the shopify-api-js package
- query is an allowed graphql bulk mutation, not all mutations are allowed, see the bulk operation docs to see which mutations are/are not allowed.
- variables is an array of javascript objects representing the input to your mutation.
- key is a string used to namespace your request

```js
  performBulkMutation({
    gqlClient,
    mutation: CREATE_PRODUCTS_MUTATION,
    variables: createProductsInput,
    key: 'products',
  })
```

## Handling data
This addon works by registering a webhook at the following url

`/api/addons/bulk-operations/:shop/:key`

`shop` is the store url which is stored in the database by default in OSB

Once the webhook is received, the results are downloaded for postprocessing and returned to you in `handleData.js`

## Example usage

```js
  const PRODUCTS_QUERY = `
    {
      products {
        edges {
          node {
            id
          }
        }
      }
    }
  `
  performBulkQuery({
    gqlClient,
    query: PRODUCTS_QUERY,
    key: 'products'
  })

  // Webhook will be sent to /api/addons/bulk-operations/:shop/products

```

```js
  const CREATE_PRODUCTS_MUTATION = `
    mutation productCreate($input: ProductInput!) {
      productCreate(input: $input) {
        product {
          id
        }
        userErrors {
          field
          message
        }
      }
    }
  `

const createProductsInput = [
  { "input": { "title": "Sweet new snowboard 1", "productType": "Snowboard", "vendor": "JadedPixel" } },
  { "input": { "title": "Sweet new snowboard 2", "productType": "Snowboard", "vendor": "JadedPixel" } },
  { "input": { "title": "Sweet new snowboard 3", "productType": "Snowboard", "vendor": "JadedPixel" } },
  { "input": { "title": "Sweet new snowboard 4", "productType": "Snowboard", "vendor": "JadedPixel" } },
  { "input": { "title": "Sweet new snowboard 5", "productType": "Snowboard", "vendor": "JadedPixel" } },
  { "input": { "title": "Sweet new snowboard 6", "productType": "Snowboard", "vendor": "JadedPixel" } },
  { "input": { "title": "Sweet new snowboard 7", "productType": "Snowboard", "vendor": "JadedPixel" } },
  { "input": { "title": "Sweet new snowboard 8", "productType": "Snowboard", "vendor": "JadedPixel" } },
  { "input": { "title": "Sweet new snowboard 9", "productType": "Snowboard", "vendor": "JadedPixel" } },
  { "input": { "title": "Sweet new snowboard 10", "productType": "Snowboard", "vendor": "JadedPixel" } },
]

  performBulkMutation({
    gqlClient,
    mutation: CREATE_PRODUCTS_MUTATION,
    variables: createProductsInput,
    key: 'products',
  })

  // Webhook will be sent to /api/addons/bulk-operations/:shop/products
```