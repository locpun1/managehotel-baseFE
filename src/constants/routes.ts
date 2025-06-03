export const ROUTE_PATH = {
  HOME: '/',
  PRODUCTS: '/products',
  TO_PROFILE: '/profile',

  MANAGE:"manage",
  MANAGE_HOME:'home',
  MANAGE_WORK:'work',
  MANAGE_DISPLAY:'display-remote',
  MANAGE_PROFILE:'profile',

  STAFF:"staff",
  STAFF_HOME:'home',
  STAFF_WORK:'work',
  STAFF_REPORT:'report',
  STAFF_PROFILE:'profile',


  PRODUCT_CATEGORY: '/products/categories',
  PRODUCT_CATEGORY_CREATE: '/products/categories/create',
  PRODUCT_CATEGORY_UPDATE: '/products/categories/:id/update',
  PRODUCT_CATEGORY_DELETE: '/products/categories/delete',

  // Product
  PRODUCT_LISTS: '/products/lists',
  PRODUCT_LISTS_CREATE: '/products/lists/create',
  PRODUCT_LISTS_UPDATE: '/products/lists/:id/update',

  PRODUCT_ITEMS: '/inventory/products/items',
  PRODUCT_ITEMS_CREATE: '/inventory/products/items/create',
  PRODUCT_ITEMS_UPDATE: '/inventory/products/items/update',
  PRODUCT_ITEMS_DELETE: '/inventory/products/items/delete',
  PRODUCT_ITEMS_DETAIL: '/inventory/products/items/detail',

  PRODUCT_PRICE_RULE: '/products/price-rules',
  PRODUCT_PRICE_RULE_CREATE: '/products/price-rules/create',
  PRODUCT_PRICE_RULE_UPDATE: '/products/price-rules/:id/update',

  //customer
  CUSTOMERS: '/customers',
  CUSTOMERS_LIST: '/customers/list',
  CUSTOMERS_CREATE: '/customers/list/create',
  CUSTOMERS_UPDATE: '/customers/list/update',
  CUSTOMERS_ADDRESS: '/customers/list/address',
  CUSTOMER_GROUPS: '/customers/customer-groups',
  CUSTOMER_GROUPS_CREATE: '/customers/customer-groups/create',
  CUSTOMER_GROUPS_UPDATE: '/customers/customer-groups/update',

  //customer service
  CUSTOMER_SERVICE: '/customer-service',
  CUSTOMER_SERVICE_CREATE: '/customer-service/create',
  CUSTOMER_SERVICE_UPDATE: '/customer-service/:id/update',

  //inventory
  INVENTORY: 'inventory',
  INVENTORY_LIST: '/inventory/inventory-list',

  //inventory-receipt
  INVENTORY_RECEIPT_LIST: '/inventory/inventory-receipt',
  INVENTORY_RECEIPT_CREATE: '/inventory/inventory-receipt/create',
  INVENTORY_RECEIPT_DETAIL: '/inventory/inventory-receipt/:id/detail',

  //inventory-issue
  INVENTORY_ISSUE_LIST: '/inventory/inventory-issue',
  INVENTORY_ISSUE_CREATE: '/inventory/inventory-issue/create',
  INVENTORY_ISSUE_DETAIL: '/inventory/inventory-issue/:id/detail',
  INVENTORY_ISSUE_UPDATE: '/inventory/inventory-issue/:id/update',

  INVENTORY_ISSUE: 'issue',

  WAREHOUSE: '/inventory/warehouses',
  WAREHOUSE_CREATE: '/inventory/warehouses/create',
  WAREHOUSE_EDIT: '/inventory/warehouses/:id/edit',

  HISTORY: 'history',
  HISTORY_BILLION: 'history-billion',
  SERVICE: 'service',
  SETTING: 'setting',
  EXPERIMENT: 'experiment',

  AUTH: 'auth',
  LOGIN: 'login',
  TO_LOGIN: '/auth/login',
  REGISTRATION: 'registration',
  FORGOT_PASSWORD: 'forgot-password',
  CHANGE_PASSWORD: 'change-password',

  CREATE: 'create',
  UPDATE: 'update',
  LIST: 'list',

  ACCOUNTING: 'accounting',
  CATEGORY: 'category',
  // transaction
  TRANSACTION: '/transaction',
  TRANSACTION_LIST: '/transaction/list',
  TRANSACTION_DETAIL: '/transaction/list/:id/detail',
  TRANSACTION_CREATE: '/transaction/list/create',

  // sale
  SALE: '/sale',

  // order
  ORDER_LIST: '/sale/order',
  ORDER_CREATE: '/sale/order/create',
  ORDER_DETAIL: '/sale/order/:id/detail',

  EXCHANGE: '/sale/return-and-exchange',
  EXCHANGE_CREATE: '/sale/return-and-exchange/create',
  EXCHANGE_DETAIL: '/sale/return-and-exchange/:id/detail',

  // report
  REPORT: '/report',
  REVENUE_MANAGEMENT: '/report/revenue-management',
  SALES_MANAGEMENT: '/report/sales-management',
  PRODUCT_STATUS_MANAGEMENT: '/report/product-status-management',
  PACKAGE_MANAGEMENT: '/report/package-management',
  RETURN_DEVICE_MANAGEMENT: '/report/return-device-management',
  DATA_AGGREGATION: '/report/data-aggregation',
  SERVICE_ORDER: '/report/service-order',

  // 403
  PERMISSION_DENIED: '/403',
  // refund
  RETURN: '/sale/return',
  TO_RETURN_CREATE: '/sale/return/create',
  TO_RETURN_DETAIL: '/sale/return/:id/detail',
};
