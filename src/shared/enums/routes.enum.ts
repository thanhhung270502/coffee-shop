export enum RouteKey {
  // Admin pages
  AdminDashboard = "AdminDashboard",
  AdminCategories = "AdminCategories",
  AdminDrinks = "AdminDrinks",
  AdminPackagedProducts = "AdminPackagedProducts",
  AdminReports = "AdminReports",
  AdminStaff = "AdminStaff",
  AdminSettings = "AdminSettings",

  // Admin Order pages
  AdminOrders = "AdminOrders",
  AdminOrderDetail = "AdminOrderDetail",
}

export enum SearchParams {
  Query = "q",
  Type = "type",
  Status = "status",
  Channel = "channel",
  From = "from",
  To = "to",
  CategoryId = "categoryId",
  GroupBy = "groupBy",
}
