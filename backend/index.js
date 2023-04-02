const PRODUCTS_QUERY = `
{
  products(query: "created_at:>=2020-01-01 AND created_at:<2020-05-01") {
    edges {
      node {
        id
        createdAt
        updatedAt
        title
        handle
        descriptionHtml
        productType
        options {
          name
          position
          values
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
          maxVariantPrice {
            amount
            currencyCode
          }
        }
      }
    }
  }
}`


const performBulkQuery = async (gqlClient, query = PRODUCTS_QUERY, options = { delay: 1000}) => {
  const BULK_QUERY = `mutation {
    bulkOperationRunQuery(
      query:"""${query}"""
    ) {
      bulkOperation {
        id
        status
      }
      userErrors {
        field
        message
      }
    }
  }`

  const bulkQuery = await gqlClient.query({
    data: {
      query: BULK_QUERY
    },
  });

  const bulkQueryId = bulkQuery.body.data.id

  const QUERY_BULK_OPERATION_BY_ID = `{
    node(id: ${bulkQueryId}) {
      ... on BulkOperation {
        id
        status
        errorCode
        createdAt
        completedAt
        objectCount
        fileSize
        url
        partialDataUrl
      }
    }
  }`

  return new Promise(resolve => {
    const interval = setInterval(async () => {
      const bulkQuery = gqlClient.query({
        data: {
          query: QUERY_BULK_OPERATION_BY_ID
        },
      });

      console.log(bulkQuery)

      // if (condition) {
      //   resolve('foo');
      //   clearInterval(interval);
      // };
    }, options.delay);
  });

}

const performBulkMutation = (gqlClient, mutation) => {

}

export {
  performBulkQuery,
  performBulkMutation
}