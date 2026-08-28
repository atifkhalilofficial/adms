export const navLinks = [
  { to: '/dashboard', label: 'Dashboard', roles: ['super_admin', 'sales_manager', 'warehouse_manager', 'sales_rep', 'dealer'] },
  { to: '/dealers', label: 'Dealers', roles: ['super_admin', 'sales_manager', 'sales_rep'] },
  { to: '/warehouses', label: 'Warehouses', roles: ['super_admin', 'sales_manager', 'warehouse_manager'] },
  { to: '/products', label: 'Products', roles: ['super_admin', 'sales_manager', 'warehouse_manager', 'sales_rep'] },
  { to: '/inventory', label: 'Inventory', roles: ['super_admin', 'warehouse_manager'] },
  { to: '/orders', label: 'Orders', roles: ['super_admin', 'sales_manager', 'sales_rep'] },
  { to: '/payments', label: 'Payments', roles: ['super_admin', 'sales_manager'] },
  { to: '/suppliers', label: 'Suppliers', roles: ['super_admin', 'warehouse_manager'] },
  { to: '/purchases', label: 'Purchases', roles: ['super_admin', 'warehouse_manager'] },
  { to: '/vehicles', label: 'Vehicles', roles: ['super_admin', 'warehouse_manager'] },
  { to: '/deliveries', label: 'Deliveries', roles: ['super_admin', 'warehouse_manager', 'sales_manager'] },
  { to: '/reports', label: 'Reports', roles: ['super_admin', 'sales_manager'] },
];