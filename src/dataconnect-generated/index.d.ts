import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions, MutationRef, MutationPromise, DataConnectSettings } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;
export const dataConnectSettings: DataConnectSettings;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface AddReviewData {
  review_insert: Review_Key;
}

export interface AddReviewVariables {
  rating: number;
  comment: string;
  createdAt: TimestampString;
  partnerId: UUIDString;
}

export interface Booking_Key {
  id: UUIDString;
  __typename?: 'Booking_Key';
}

export interface CreateBookingData {
  booking_insert: Booking_Key;
}

export interface CreateBookingVariables {
  status: string;
  bookingDate: TimestampString;
  totalAmount: number;
  customerId: UUIDString;
  partnerId?: UUIDString | null;
  serviceCategoryId: UUIDString;
}

export interface CreateUserData {
  user_insert: User_Key;
}

export interface CreateUserVariables {
  name: string;
  email: string;
  role: string;
  phoneNumber: string;
  avatarUrl?: string | null;
  address?: string | null;
}

export interface GetUserProfileData {
  user?: {
    id: UUIDString;
    name: string;
    email: string;
    role: string;
    phoneNumber: string;
    avatarUrl?: string | null;
    address?: string | null;
    rating?: number | null;
  } & User_Key;
}

export interface GetUserProfileVariables {
  id: UUIDString;
}

export interface ListCustomerBookingsData {
  bookings: ({
    id: UUIDString;
    status: string;
    bookingDate: TimestampString;
    totalAmount: number;
    partnerNotes?: string | null;
    serviceCategory: {
      name: string;
    };
    partner?: {
      name: string;
      phoneNumber: string;
    };
  } & Booking_Key)[];
}

export interface ListCustomerBookingsVariables {
  customerId: UUIDString;
}

export interface ListPartnerAvailabilityData {
  partnerAvailabilities: ({
    id: UUIDString;
    startTime: TimestampString;
    endTime: TimestampString;
    isBooked: boolean;
  } & PartnerAvailability_Key)[];
}

export interface ListPartnerAvailabilityVariables {
  partnerId: UUIDString;
}

export interface ListPartnerReviewsData {
  reviews: ({
    id: UUIDString;
    rating: number;
    comment: string;
    createdAt: TimestampString;
    customer: {
      name: string;
      avatarUrl?: string | null;
    };
  } & Review_Key)[];
}

export interface ListPartnerReviewsVariables {
  partnerId: UUIDString;
}

export interface ListServiceCategoriesData {
  serviceCategories: ({
    id: UUIDString;
    name: string;
    basePrice: number;
    iconUrl?: string | null;
    description?: string | null;
  } & ServiceCategory_Key)[];
}

export interface PartnerAvailability_Key {
  id: UUIDString;
  __typename?: 'PartnerAvailability_Key';
}

export interface Review_Key {
  id: UUIDString;
  __typename?: 'Review_Key';
}

export interface SeedDataData {
  user_insertMany: User_Key[];
  serviceCategory_insertMany: ServiceCategory_Key[];
}

export interface ServiceCategory_Key {
  id: UUIDString;
  __typename?: 'ServiceCategory_Key';
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

interface CreateUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
  operationName: string;
}
export const createUserRef: CreateUserRef;

export function createUser(vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;
export function createUser(dc: DataConnect, vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;

interface CreateBookingRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateBookingVariables): MutationRef<CreateBookingData, CreateBookingVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateBookingVariables): MutationRef<CreateBookingData, CreateBookingVariables>;
  operationName: string;
}
export const createBookingRef: CreateBookingRef;

export function createBooking(vars: CreateBookingVariables): MutationPromise<CreateBookingData, CreateBookingVariables>;
export function createBooking(dc: DataConnect, vars: CreateBookingVariables): MutationPromise<CreateBookingData, CreateBookingVariables>;

interface AddReviewRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddReviewVariables): MutationRef<AddReviewData, AddReviewVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AddReviewVariables): MutationRef<AddReviewData, AddReviewVariables>;
  operationName: string;
}
export const addReviewRef: AddReviewRef;

export function addReview(vars: AddReviewVariables): MutationPromise<AddReviewData, AddReviewVariables>;
export function addReview(dc: DataConnect, vars: AddReviewVariables): MutationPromise<AddReviewData, AddReviewVariables>;

interface SeedDataRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<SeedDataData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<SeedDataData, undefined>;
  operationName: string;
}
export const seedDataRef: SeedDataRef;

export function seedData(): MutationPromise<SeedDataData, undefined>;
export function seedData(dc: DataConnect): MutationPromise<SeedDataData, undefined>;

interface ListServiceCategoriesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListServiceCategoriesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListServiceCategoriesData, undefined>;
  operationName: string;
}
export const listServiceCategoriesRef: ListServiceCategoriesRef;

export function listServiceCategories(options?: ExecuteQueryOptions): QueryPromise<ListServiceCategoriesData, undefined>;
export function listServiceCategories(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListServiceCategoriesData, undefined>;

interface GetUserProfileRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserProfileVariables): QueryRef<GetUserProfileData, GetUserProfileVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetUserProfileVariables): QueryRef<GetUserProfileData, GetUserProfileVariables>;
  operationName: string;
}
export const getUserProfileRef: GetUserProfileRef;

export function getUserProfile(vars: GetUserProfileVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserProfileData, GetUserProfileVariables>;
export function getUserProfile(dc: DataConnect, vars: GetUserProfileVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserProfileData, GetUserProfileVariables>;

interface ListCustomerBookingsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListCustomerBookingsVariables): QueryRef<ListCustomerBookingsData, ListCustomerBookingsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListCustomerBookingsVariables): QueryRef<ListCustomerBookingsData, ListCustomerBookingsVariables>;
  operationName: string;
}
export const listCustomerBookingsRef: ListCustomerBookingsRef;

export function listCustomerBookings(vars: ListCustomerBookingsVariables, options?: ExecuteQueryOptions): QueryPromise<ListCustomerBookingsData, ListCustomerBookingsVariables>;
export function listCustomerBookings(dc: DataConnect, vars: ListCustomerBookingsVariables, options?: ExecuteQueryOptions): QueryPromise<ListCustomerBookingsData, ListCustomerBookingsVariables>;

interface ListPartnerAvailabilityRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListPartnerAvailabilityVariables): QueryRef<ListPartnerAvailabilityData, ListPartnerAvailabilityVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListPartnerAvailabilityVariables): QueryRef<ListPartnerAvailabilityData, ListPartnerAvailabilityVariables>;
  operationName: string;
}
export const listPartnerAvailabilityRef: ListPartnerAvailabilityRef;

export function listPartnerAvailability(vars: ListPartnerAvailabilityVariables, options?: ExecuteQueryOptions): QueryPromise<ListPartnerAvailabilityData, ListPartnerAvailabilityVariables>;
export function listPartnerAvailability(dc: DataConnect, vars: ListPartnerAvailabilityVariables, options?: ExecuteQueryOptions): QueryPromise<ListPartnerAvailabilityData, ListPartnerAvailabilityVariables>;

interface ListPartnerReviewsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListPartnerReviewsVariables): QueryRef<ListPartnerReviewsData, ListPartnerReviewsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListPartnerReviewsVariables): QueryRef<ListPartnerReviewsData, ListPartnerReviewsVariables>;
  operationName: string;
}
export const listPartnerReviewsRef: ListPartnerReviewsRef;

export function listPartnerReviews(vars: ListPartnerReviewsVariables, options?: ExecuteQueryOptions): QueryPromise<ListPartnerReviewsData, ListPartnerReviewsVariables>;
export function listPartnerReviews(dc: DataConnect, vars: ListPartnerReviewsVariables, options?: ExecuteQueryOptions): QueryPromise<ListPartnerReviewsData, ListPartnerReviewsVariables>;

