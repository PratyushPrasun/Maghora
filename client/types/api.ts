// ==========================================
// MAGHORA API & DOMAIN TYPES
// Single source of truth mirroring backend contracts
// ==========================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data: T;
  errors?: Array<{ field?: string; message: string }>;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ------------------------------------------
// Auth & Users
// ------------------------------------------
export type UserRole = "customer" | "admin" | "super_admin";

export interface IUser {
  id: string;
  _id?: string;
  name: string;
  phone: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthState {
  user: IUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

// ------------------------------------------
// Categories
// ------------------------------------------
export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// ------------------------------------------
// Products & Variants
// ------------------------------------------
export interface IProductImage {
  publicId?: string;
  url: string;
  alt: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface IProductVariant {
  _id: string;
  sku?: string;
  weightGrams: number;
  pricePaise: number;
  mrpPaise: number;
  stockOnHand?: number;
  reservedStock?: number;
  isActive?: boolean;
  isAvailable?: boolean;
}

export interface IProduct {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  category: ICategory | string;
  images: IProductImage[];
  variants: IProductVariant[];
  isActive: boolean;
  isFeatured: boolean;
  isBestseller: boolean;
  isDeleted?: boolean;
  seo?: {
    title: string;
    description: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductListResponse {
  products: IProduct[];
  pagination: Pagination;
}

export interface ProductQueryOptions {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: "newest" | "oldest" | "name_asc" | "name_desc";
  isFeatured?: boolean;
  isBestseller?: boolean;
}

// ------------------------------------------
// Cart
// ------------------------------------------
export interface ICartItem {
  cartItemId: string;
  productId: string;
  variantId: string;
  productName: string;
  productSlug: string | null;
  weightGrams: number | null;
  pricePaise: number;
  mrpPaise: number;
  quantity: number;
  available: boolean;
  currentStock: number;
  lineTotalPaise: number;
}

export interface ICart {
  items: ICartItem[];
  itemCount: number;
  subtotalPaise: number;
  hasUnavailableItems: boolean;
}

// ------------------------------------------
// Addresses
// ------------------------------------------
export type AddressLabel = "home" | "office" | "other";

export interface IAddress {
  _id: string;
  userId?: string;
  label: AddressLabel;
  customLabel?: string;
  recipientName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  postalCode: string;
  country: "India";
  isDefault: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// ------------------------------------------
// Orders
// ------------------------------------------
export type OrderStatus =
  | "pending_payment"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentStatus =
  | "pending"
  | "paid"
  | "failed"
  | "expired"
  | "refund_pending"
  | "refunded";

export type InventoryStatus = "reserved" | "committed" | "released";

export interface IOrderItem {
  productId: string;
  variantId: string;
  productName: string;
  sku: string;
  weightGrams: number;
  imageUrl: string | null;
  pricePaise: number;
  mrpPaise: number;
  quantity: number;
  lineTotalPaise: number;
}

export interface IOrder {
  _id: string;
  orderNumber: string;
  idempotencyKey?: string;
  userId: string | { _id: string; name: string; email: string; phone: string };
  items: IOrderItem[];
  shippingAddress: {
    recipientName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    landmark?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  customerNotes?: string;
  subtotalPaise: number;
  shippingPaise: number;
  totalPaise: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  inventoryStatus: InventoryStatus;
  reservationExpiresAt: string;
  paymentProvider?: string;
  paymentOrderId?: string | null;
  paymentId?: string | null;
  trackingNumber?: string | null;
  createdAt: string;
  updatedAt?: string;
}

// ------------------------------------------
// Payments
// ------------------------------------------
export interface RazorpayOrderData {
  keyId: string;
  razorpayOrderId: string;
  amount: number;
  currency: string;
  orderId: string;
  orderNumber: string;
  expiresAt: string;
}

export interface VerifyPaymentPayload {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

// ------------------------------------------
// Invoices & Business Settings
// ------------------------------------------
export type InvoiceDocumentType = "invoice" | "credit_note" | "debit_note";
export type InvoiceType =
  | "Tax Invoice"
  | "Bill of Supply"
  | "Credit Note"
  | "Debit Note";
export type InvoicePaymentStatus =
  | "Paid"
  | "Pending"
  | "Partially Paid"
  | "COD"
  | "Refunded"
  | "Partially Refunded";

export interface IInvoiceItem {
  sNo: number;
  productId: string;
  variantId: string;
  productName: string;
  flavour: string;
  sku: string;
  hsnCode: string;
  weightGrams: number;
  quantity: number;
  unit: string;
  mrpPaise: number;
  unitPricePaise: number;
  discountPaise: number;
  taxableValuePaise: number;
  gstRate: number;
  cgstPaise: number;
  sgstPaise: number;
  igstPaise: number;
  gstAmountPaise: number;
  totalPaise: number;
}

export interface IInvoiceAddress {
  recipientName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  stateCode?: string;
  postalCode: string;
  country: string;
}

export interface IInvoice {
  _id: string;
  invoiceNumber: string;
  documentType: InvoiceDocumentType;
  parentInvoiceId: string | null;
  adjustmentReason?: string;
  financialYear: string;
  orderId: string;
  orderNumber: string;
  orderDate: string;
  customerId: string;
  sellerDetailsSnapshot: {
    brandName: string;
    tagline: string;
    legalName: string;
    gstin: string;
    isGstRegistered: boolean;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    stateCode: string;
    postalCode: string;
    country: string;
    contactNumber: string;
    supportEmail: string;
    website: string;
    returnPolicyUrl: string;
  };
  customerSnapshot: {
    fullName: string;
    email: string;
    mobile: string;
    customerGstin?: string;
  };
  billingAddress: IInvoiceAddress;
  shippingAddress: IInvoiceAddress;
  sameBillingAndShipping: boolean;
  placeOfSupply: {
    state: string;
    stateCode: string;
    isInterstate: boolean;
  };
  items: IInvoiceItem[];
  subtotalPaise: number;
  productDiscountPaise: number;
  couponCode: string | null;
  couponDiscountPaise: number;
  discountsPaise: number;
  shippingChargesPaise: number;
  shippingTaxablePaise: number;
  shippingGstRate: number;
  shippingGstPaise: number;
  otherChargesPaise: number;
  taxableAmountPaise: number;
  taxBreakdown: {
    cgstPaise: number;
    sgstPaise: number;
    igstPaise: number;
    totalGstPaise: number;
  };
  grandTotalPaise: number;
  amountPaidPaise: number;
  balanceDuePaise: number;
  refundedAmountPaise: number;
  amountInWords: string;
  paymentMethod: string;
  paymentReference: string | null;
  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;
  paymentStatus: InvoicePaymentStatus;
  invoiceType: InvoiceType;
  footerNote: string;
  footerTagline: string;
  termsAndConditions: string;
  issuedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface IInvoiceStats {
  totalInvoices: number;
  totalInvoicedPaise: number;
  paidAmountPaise: number;
  pendingAmountPaise: number;
  currentFinancialYear: string;
  currentFinancialYearCount: number;
}

export interface IInvoiceSettings {
  _id?: string;
  brandName: string;
  tagline: string;
  legalName: string;
  gstin: string;
  isGstRegistered: boolean;
  businessAddress: {
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    stateCode: string;
    postalCode: string;
    country: string;
  };
  contactNumber: string;
  supportEmail: string;
  website: string;
  returnPolicyUrl: string;
  invoicePrefix: string;
  defaultHsnCode: string;
  defaultGstRate: number;
  shippingGstRate: number;
  pricesIncludeGst: boolean;
  footerNote: string;
  footerTagline: string;
  termsAndConditions: string;
}

// ------------------------------------------
// Admins & Audit
// ------------------------------------------
export interface IAdminAuditLog {
  _id: string;
  actorId: string;
  actorEmail: string;
  targetUserId: string;
  targetEmail: string;
  action: "ADMIN_CREATED" | "ADMIN_UPDATED" | "ADMIN_ACTIVATED" | "ADMIN_DEACTIVATED";
  changes: Record<string, unknown>;
  createdAt: string;
}

