export type Language = "en"

export interface Translations {
  // Navigation
  home: string
  products: string
  cart: string
  checkout: string
  admin: string
  signIn: string
  signUp: string
  signOut: string

  // Common
  search: string
  filter: string
  sort: string
  add: string
  edit: string
  delete: string
  save: string
  cancel: string
  loading: string
  error: string
  success: string

  // Product
  addToCart: string
  outOfStock: string
  inStock: string
  price: string
  category: string
  description: string
  features: string
  specifications: string
  reviews: string
  relatedProducts: string
  quantity: string
  priceRange: string

  // Cart
  shoppingCart: string
  cartEmpty: string
  proceedToCheckout: string
  continueShopping: string
  total: string
  subtotal: string

  // Checkout
  deliveryInformation: string
  fullName: string
  phoneNumber: string
  deliveryAddress: string
  orderNotes: string
  submitOrder: string
  orderSubmitted: string
  paymentInformation: string

  // Admin
  adminDashboard: string
  orderManagement: string
  productManagement: string
  totalOrders: string
  totalProducts: string
  totalCustomers: string
  revenue: string

  // Order Status
  newOrders: string
  negotiating: string
  shipping: string
  completed: string

  // Categories
  all: string
  led: string
  oil: string
  solar: string
  decorative: string
  emergency: string

  // Sort Options
  newest: string
  priceLowToHigh: string
  priceHighToLow: string
  nameAZ: string

  // Messages
  addedToCart: string
  orderCreated: string
  productNotFound: string
  cartIsEmpty: string

  // Additional translations
  viewAll: string
  writeReview: string
  writeFirstReview: string
  noReviewsYet: string
  available: string
  unavailable: string
  checkBackSoon: string
  whatHappensNext: string
  contactUsOnZalo: string
  openZaloChat: string
  printOrderDetails: string
  backToCart: string
  orderSummary: string
  delivery: string
  free: string
  noPaymentRequired: string
  discussPaymentOptions: string
  specialInstructions: string
  enterYour: string
  enterComplete: string
  anySpecialInstructions: string
  submittingOrder: string
  addSomeProducts: string
  beforeCheckingOut: string
  receivedSuccessfully: string
  confirmYourOrder: string
  arrangeDelivery: string
  toYourAddress: string

  // Admin specific translations
  welcomeBack: string
  fromLastMonth: string
  customerInformation: string
  orderInformation: string
  orderItems: string
  updateStatus: string
  viewDetails: string
  editOrder: string
  noOrdersInStatus: string
  selectStatus: string
  saveChanges: string
  productUpdated: string
  productAdded: string
  productDeleted: string
  fillRequiredFields: string
  addAtLeastOneImage: string
  noProductsFound: string
  productImages: string
  uploadImages: string
  noImagesUploaded: string
  uploadImagesToPreview: string
  setMain: string
  firstImageMain: string
  dragDropReorder: string
  clickSetMain: string
  totalImages: string
  selectCategory: string
  stockQuantity: string
  enterProductName: string
  enterProductDescription: string
  units: string

  // Category Management
  categories: string
  categoryManagement: string
  categoryName: string
  categoryIcon: string
  categoryColor: string
  newCategory: string
  totalCategories: string
  activeCategories: string
  avgProductsPerCategory: string
  sortOrder: string
  lastUpdated: string
  actions: string
  active: string
  inactive: string
  status: string
  preview: string
  changes: string
  categoryUpdated: string
  categoryAdded: string
  categoryDeleted: string
  categoryActivated: string
  categoryDeactivated: string
  cannotDeleteCategoryWithProducts: string
  noCategoriesFound: string
}

export const translations: Record<Language, Translations> = {
  // en: {
  //   // Navigation
  //   home: "Home",
  //   products: "Products",
  //   cart: "Cart",
  //   checkout: "Checkout",
  //   admin: "Admin",
  //   signIn: "Sign In",
  //   signUp: "Sign Up",
  //   signOut: "Sign Out",

  //   // Common
  //   search: "Search",
  //   filter: "Filter",
  //   sort: "Sort",
  //   add: "Add",
  //   edit: "Edit",
  //   delete: "Delete",
  //   save: "Save",
  //   cancel: "Cancel",
  //   loading: "Loading",
  //   error: "Error",
  //   success: "Success",

  //   // Product
  //   addToCart: "Add to Cart",
  //   outOfStock: "Out of Stock",
  //   inStock: "In Stock",
  //   price: "Price",
  //   category: "Category",
  //   description: "Description",
  //   features: "Features",
  //   specifications: "Specifications",
  //   reviews: "Reviews",
  //   relatedProducts: "Related Products",
  //   quantity: "Quantity",

  //   // Cart
  //   shoppingCart: "Shopping Cart",
  //   cartEmpty: "Your cart is empty",
  //   proceedToCheckout: "Proceed to Checkout",
  //   continueShopping: "Continue Shopping",
  //   total: "Total",
  //   subtotal: "Subtotal",

  //   // Checkout
  //   deliveryInformation: "Delivery Information",
  //   fullName: "Full Name",
  //   phoneNumber: "Phone Number",
  //   deliveryAddress: "Delivery Address",
  //   orderNotes: "Order Notes",
  //   submitOrder: "Submit Order",
  //   orderSubmitted: "Order Submitted!",
  //   paymentInformation: "Payment Information",

  //   // Admin
  //   adminDashboard: "Admin Dashboard",
  //   orderManagement: "Order Management",
  //   productManagement: "Product Management",
  //   totalOrders: "Tổng Đơn Hàng",
  //   totalProducts: "Total Products",
  //   totalCustomers: "Total Customers",
  //   revenue: "Revenue",

  //   // Order Status
  //   newOrders: "New Orders",
  //   negotiating: "Negotiating",
  //   shipping: "Shipping",
  //   completed: "Completed",

  //   // Categories
  //   all: "All",
  //   led: "LED",
  //   oil: "Oil",
  //   solar: "Solar",
  //   decorative: "Decorative",
  //   emergency: "Emergency",

  //   // Sort Options
  //   newest: "Newest",
  //   priceLowToHigh: "Price: Low to High",
  //   priceHighToLow: "Price: High to Low",
  //   nameAZ: "Name A-Z",

  //   // Messages
  //   addedToCart: "Added to cart",
  //   orderCreated: "Order created successfully",
  //   productNotFound: "Product not found",
  //   cartIsEmpty: "Your cart is empty",

  //   // Additional translations
  //   viewAll: "View All",
  //   writeReview: "Write a Review",
  //   writeFirstReview: "Write the First Review",
  //   noReviewsYet: "No reviews yet. Be the first to review this product!",
  //   available: "available",
  //   unavailable: "unavailable",
  //   checkBackSoon: "This item is currently unavailable. Check back soon!",
  //   whatHappensNext: "What happens next?",
  //   contactUsOnZalo: "Contact us on Zalo:",
  //   openZaloChat: "Open Zalo Chat",
  //   printOrderDetails: "Print Order Details",
  //   backToCart: "Back to Cart",
  //   orderSummary: "Order Summary",
  //   delivery: "Delivery",
  //   free: "Free",
  //   noPaymentRequired:
  //     "No payment is required now. We'll contact you on Zalo to discuss payment options and confirm your order details.",
  //   discussPaymentOptions: "discuss payment and delivery options",
  //   specialInstructions: "Any special instructions or notes",
  //   enterYour: "Enter your",
  //   enterComplete: "Enter your complete",
  //   anySpecialInstructions: "Any special instructions or notes",
  //   submittingOrder: "Submitting Order",
  //   addSomeProducts: "Add some products to your cart before checking out.",
  //   beforeCheckingOut: "before checking out",
  //   receivedSuccessfully: "has been received successfully",
  //   confirmYourOrder: "We'll contact you on Zalo to confirm your order",
  //   arrangeDelivery: "Arrange delivery",
  //   toYourAddress: "to your address",
  //   save: "Save",

  //   // Admin specific translations
  //   welcomeBack: "Welcome back",
  //   fromLastMonth: "from last month",
  //   customerInformation: "Customer Information",
  //   orderInformation: "Order Information",
  //   orderItems: "Order Items",
  //   updateStatus: "Update Status",
  //   viewDetails: "View Details",
  //   editOrder: "Edit Order",
  //   noOrdersInStatus: "No orders in this status",
  //   selectStatus: "Select status",
  //   saveChanges: "Save Changes",
  //   productUpdated: "Product updated successfully",
  //   productAdded: "Product added successfully",
  //   productDeleted: "Product deleted successfully",
  //   fillRequiredFields: "Please fill in all required fields",
  //   addAtLeastOneImage: "Please add at least one product image",
  //   noProductsFound: "No products found",
  //   productImages: "Product Images",
  //   uploadImages: "Upload Images",
  //   noImagesUploaded: "No images uploaded",
  //   uploadImagesToPreview: "Upload images to see preview",
  //   setMain: "Set Main",
  //   firstImageMain: "The first image will be used as the main product image",
  //   dragDropReorder: "Drag and drop to reorder images",
  //   clickSetMain: 'Click "Set Main" to make an image the primary one',
  //   totalImages: "Total images",
  //   selectCategory: "Select category",
  //   stockQuantity: "Stock Quantity",
  //   enterProductName: "Enter product name",
  //   enterProductDescription: "Enter product description",
  //   units: "units",

  //   // Category Management
  //   categories: "Categories",
  //   categoryManagement: "Category Management",
  //   categoryName: "Category Name",
  //   categoryIcon: "Category Icon",
  //   categoryColor: "Category Color",
  //   newCategory: "New Category",
  //   totalCategories: "Total Categories",
  //   activeCategories: "Active Categories",
  //   avgProductsPerCategory: "Avg Products/Category",
  //   sortOrder: "Sort Order",
  //   lastUpdated: "Last Updated",
  //   actions: "Actions",
  //   active: "Active",
  //   inactive: "Inactive",
  //   status: "Status",
  //   preview: "Preview",
  //   changes: "Changes",
  //   categoryUpdated: "Category updated successfully",
  //   categoryAdded: "Category added successfully",
  //   categoryDeleted: "Category deleted successfully",
  //   categoryActivated: "Category activated successfully",
  //   categoryDeactivated: "Category deactivated successfully",
  //   cannotDeleteCategoryWithProducts: "Cannot delete category that contains products",
  //   noCategoriesFound: "No categories found",
  // },
  en: {
    // Navigation
    home: "Trang chủ",
    products: "Sản phẩm",
    cart: "Giỏ hàng",
    checkout: "Thanh toán",
    admin: "Quản trị",
    signIn: "Đăng nhập",
    signUp: "Đăng ký",
    signOut: "Đăng xuất",

    // Common
    search: "Tìm kiếm",
    filter: "Lọc",
    sort: "Sắp xếp",
    add: "Thêm",
    edit: "Sửa",
    delete: "Xóa",
    save: "Lưu",
    cancel: "Hủy",
    loading: "Đang tải",
    error: "Lỗi",
    success: "Thành công",

    // Product
    addToCart: "Thêm vào giỏ",
    outOfStock: "Hết hàng",
    inStock: "Còn hàng",
    price: "Giá",
    category: "Danh mục",
    description: "Mô tả",
    features: "Tính năng",
    specifications: "Thông số kỹ thuật",
    reviews: "Đánh giá",
    relatedProducts: "Sản phẩm liên quan",
    quantity: "Số lượng",
    priceRange: "Khoảng giá",

    // Cart
    shoppingCart: "Giỏ hàng",
    cartEmpty: "Giỏ hàng trống",
    proceedToCheckout: "Tiến hành thanh toán",
    continueShopping: "Tiếp tục mua sắm",
    total: "Tổng cộng",
    subtotal: "Tạm tính",

    // Checkout
    deliveryInformation: "Thông tin giao hàng",
    fullName: "Họ và tên",
    phoneNumber: "Số điện thoại",
    deliveryAddress: "Địa chỉ giao hàng",
    orderNotes: "Ghi chú đơn hàng",
    submitOrder: "Đặt hàng",
    orderSubmitted: "Đã đặt hàng!",
    paymentInformation: "Thông tin thanh toán",

    // Admin
    adminDashboard: "Bảng điều khiển",
    orderManagement: "Quản lý đơn hàng",
    productManagement: "Quản lý sản phẩm",
    totalOrders: "Tổng đơn hàng",
    totalProducts: "Tổng sản phẩm",
    totalCustomers: "Tổng khách hàng",
    revenue: "Doanh thu",

    // Order Status
    newOrders: "Đơn hàng mới",
    negotiating: "Đang thương lượng",
    shipping: "Đang giao hàng",
    completed: "Hoàn thành",

    // Categories
    all: "Tất cả",
    led: "LED",
    oil: "Dầu",
    solar: "Năng lượng mặt trời",
    decorative: "Trang trí",
    emergency: "Khẩn cấp",

    // Sort Options
    newest: "Mới nhất",
    priceLowToHigh: "Giá: Thấp đến cao",
    priceHighToLow: "Giá: Cao đến thấp",
    nameAZ: "Tên A-Z",

    // Messages
    addedToCart: "Đã thêm vào giỏ hàng",
    orderCreated: "Đặt hàng thành công",
    productNotFound: "Không tìm thấy sản phẩm",
    cartIsEmpty: "Giỏ hàng của bạn đang trống",

    // Additional translations
    viewAll: "Xem tất cả",
    writeReview: "Viết đánh giá",
    writeFirstReview: "Viết đánh giá đầu tiên",
    noReviewsYet: "Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá sản phẩm này!",
    available: "có sẵn",
    unavailable: "không có sẵn",
    checkBackSoon: "Sản phẩm này hiện không có sẵn. Vui lòng quay lại sau!",
    whatHappensNext: "Điều gì sẽ xảy ra tiếp theo?",
    contactUsOnZalo: "Liên hệ với chúng tôi qua Zalo:",
    openZaloChat: "Mở chat Zalo",
    printOrderDetails: "In chi tiết đơn hàng",
    backToCart: "Quay lại giỏ hàng",
    orderSummary: "Tóm tắt đơn hàng",
    delivery: "Giao hàng",
    free: "Miễn phí",
    noPaymentRequired:
      "Không cần thanh toán ngay bây giờ. Chúng tôi sẽ liên hệ với bạn qua Zalo để thảo luận về các tùy chọn thanh toán và xác nhận chi tiết đơn hàng.",
    discussPaymentOptions: "thảo luận về thanh toán và giao hàng",
    specialInstructions: "Bất kỳ hướng dẫn đặc biệt hoặc ghi chú nào",
    enterYour: "Nhập",
    enterComplete: "Nhập đầy đủ",
    anySpecialInstructions: "Bất kỳ hướng dẫn đặc biệt hoặc ghi chú nào",
    submittingOrder: "Đang đặt hàng",
    addSomeProducts: "Thêm một số sản phẩm vào giỏ hàng trước khi thanh toán.",
    beforeCheckingOut: "trước khi thanh toán",
    receivedSuccessfully: "đã được nhận thành công",
    confirmYourOrder: "Chúng tôi sẽ liên hệ với bạn qua Zalo để xác nhận đơn hàng",
    arrangeDelivery: "Sắp xếp giao hàng",
    toYourAddress: "đến địa chỉ của bạn",

    // Admin specific translations
    welcomeBack: "Chào mừng trở lại",
    fromLastMonth: "từ tháng trước",
    customerInformation: "Thông tin khách hàng",
    orderInformation: "Thông tin đơn hàng",
    orderItems: "Sản phẩm trong đơn",
    updateStatus: "Cập nhật trạng thái",
    viewDetails: "Xem chi tiết",
    editOrder: "Sửa đơn hàng",
    noOrdersInStatus: "Không có đơn hàng nào ở trạng thái này",
    selectStatus: "Chọn trạng thái",
    saveChanges: "Lưu thay đổi",
    productUpdated: "Cập nhật sản phẩm thành công",
    productAdded: "Thêm sản phẩm thành công",
    productDeleted: "Xóa sản phẩm thành công",
    fillRequiredFields: "Vui lòng điền tất cả các trường bắt buộc",
    addAtLeastOneImage: "Vui lòng thêm ít nhất một hình ảnh sản phẩm",
    noProductsFound: "Không tìm thấy sản phẩm nào",
    productImages: "Hình ảnh sản phẩm",
    uploadImages: "Tải lên hình ảnh",
    noImagesUploaded: "Chưa tải lên hình ảnh nào",
    uploadImagesToPreview: "Tải lên hình ảnh để xem trước",
    setMain: "Đặt làm chính",
    firstImageMain: "Hình ảnh đầu tiên sẽ được sử dụng làm hình ảnh chính của sản phẩm",
    dragDropReorder: "Kéo và thả để sắp xếp lại hình ảnh",
    clickSetMain: 'Nhấp "Đặt làm chính" để đặt hình ảnh làm hình chính',
    totalImages: "Tổng số hình ảnh",
    selectCategory: "Chọn danh mục",
    stockQuantity: "Số lượng tồn kho",
    enterProductName: "Nhập tên sản phẩm",
    enterProductDescription: "Nhập mô tả sản phẩm",
    units: "đơn vị",

    // Category Management
    categories: "Danh mục",
    categoryManagement: "Quản lý danh mục",
    categoryName: "Tên danh mục",
    categoryIcon: "Biểu tượng danh mục",
    categoryColor: "Màu danh mục",
    newCategory: "Danh mục mới",
    totalCategories: "Tổng danh mục",
    activeCategories: "Danh mục hoạt động",
    avgProductsPerCategory: "TB sản phẩm/danh mục",
    sortOrder: "Thứ tự sắp xếp",
    lastUpdated: "Cập nhật lần cuối",
    actions: "Hành động",
    active: "Hoạt động",
    inactive: "Không hoạt động",
    status: "Trạng thái",
    preview: "Xem trước",
    changes: "Thay đổi",
    categoryUpdated: "Cập nhật danh mục thành công",
    categoryAdded: "Thêm danh mục thành công",
    categoryDeleted: "Xóa danh mục thành công",
    categoryActivated: "Kích hoạt danh mục thành công",
    categoryDeactivated: "Vô hiệu hóa danh mục thành công",
    cannotDeleteCategoryWithProducts: "Không thể xóa danh mục có chứa sản phẩm",
    noCategoriesFound: "Không tìm thấy danh mục nào",
  },
}

export const getTranslation = (language: Language, key: keyof Translations): string => {
  return translations[language][key] || translations.en[key]
}
