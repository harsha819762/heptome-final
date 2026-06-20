import { CreateUserData, CreateUserVariables, CreateBookingData, CreateBookingVariables, AddReviewData, AddReviewVariables, ListServiceCategoriesData, GetUserProfileData, GetUserProfileVariables, ListCustomerBookingsData, ListCustomerBookingsVariables, ListPartnerAvailabilityData, ListPartnerAvailabilityVariables, ListPartnerReviewsData, ListPartnerReviewsVariables } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useCreateUser(options?: useDataConnectMutationOptions<CreateUserData, FirebaseError, CreateUserVariables>): UseDataConnectMutationResult<CreateUserData, CreateUserVariables>;
export function useCreateUser(dc: DataConnect, options?: useDataConnectMutationOptions<CreateUserData, FirebaseError, CreateUserVariables>): UseDataConnectMutationResult<CreateUserData, CreateUserVariables>;

export function useCreateBooking(options?: useDataConnectMutationOptions<CreateBookingData, FirebaseError, CreateBookingVariables>): UseDataConnectMutationResult<CreateBookingData, CreateBookingVariables>;
export function useCreateBooking(dc: DataConnect, options?: useDataConnectMutationOptions<CreateBookingData, FirebaseError, CreateBookingVariables>): UseDataConnectMutationResult<CreateBookingData, CreateBookingVariables>;

export function useAddReview(options?: useDataConnectMutationOptions<AddReviewData, FirebaseError, AddReviewVariables>): UseDataConnectMutationResult<AddReviewData, AddReviewVariables>;
export function useAddReview(dc: DataConnect, options?: useDataConnectMutationOptions<AddReviewData, FirebaseError, AddReviewVariables>): UseDataConnectMutationResult<AddReviewData, AddReviewVariables>;

export function useListServiceCategories(options?: useDataConnectQueryOptions<ListServiceCategoriesData>): UseDataConnectQueryResult<ListServiceCategoriesData, undefined>;
export function useListServiceCategories(dc: DataConnect, options?: useDataConnectQueryOptions<ListServiceCategoriesData>): UseDataConnectQueryResult<ListServiceCategoriesData, undefined>;

export function useGetUserProfile(vars: GetUserProfileVariables, options?: useDataConnectQueryOptions<GetUserProfileData>): UseDataConnectQueryResult<GetUserProfileData, GetUserProfileVariables>;
export function useGetUserProfile(dc: DataConnect, vars: GetUserProfileVariables, options?: useDataConnectQueryOptions<GetUserProfileData>): UseDataConnectQueryResult<GetUserProfileData, GetUserProfileVariables>;

export function useListCustomerBookings(vars: ListCustomerBookingsVariables, options?: useDataConnectQueryOptions<ListCustomerBookingsData>): UseDataConnectQueryResult<ListCustomerBookingsData, ListCustomerBookingsVariables>;
export function useListCustomerBookings(dc: DataConnect, vars: ListCustomerBookingsVariables, options?: useDataConnectQueryOptions<ListCustomerBookingsData>): UseDataConnectQueryResult<ListCustomerBookingsData, ListCustomerBookingsVariables>;

export function useListPartnerAvailability(vars: ListPartnerAvailabilityVariables, options?: useDataConnectQueryOptions<ListPartnerAvailabilityData>): UseDataConnectQueryResult<ListPartnerAvailabilityData, ListPartnerAvailabilityVariables>;
export function useListPartnerAvailability(dc: DataConnect, vars: ListPartnerAvailabilityVariables, options?: useDataConnectQueryOptions<ListPartnerAvailabilityData>): UseDataConnectQueryResult<ListPartnerAvailabilityData, ListPartnerAvailabilityVariables>;

export function useListPartnerReviews(vars: ListPartnerReviewsVariables, options?: useDataConnectQueryOptions<ListPartnerReviewsData>): UseDataConnectQueryResult<ListPartnerReviewsData, ListPartnerReviewsVariables>;
export function useListPartnerReviews(dc: DataConnect, vars: ListPartnerReviewsVariables, options?: useDataConnectQueryOptions<ListPartnerReviewsData>): UseDataConnectQueryResult<ListPartnerReviewsData, ListPartnerReviewsVariables>;
