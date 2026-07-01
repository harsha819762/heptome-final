import { CreateUserData, CreateUserVariables, CreateBookingData, CreateBookingVariables, UpdateBookingStatusData, UpdateBookingStatusVariables, AssignProviderData, AssignProviderVariables, UpdateUserProfileData, UpdateUserProfileVariables, UpdateUserRoleData, UpdateUserRoleVariables, AddReviewData, AddReviewVariables, SeedDataData, ListServiceCategoriesData, GetUserProfileData, GetUserProfileVariables, ListCustomerBookingsData, ListCustomerBookingsVariables, ListPartnerAvailabilityData, ListPartnerAvailabilityVariables, ListPartnerReviewsData, ListPartnerReviewsVariables, ListAllUsersData, ListAllUsersVariables, ListAllBookingsData, GetBookingByIdData, GetBookingByIdVariables, ListProviderBookingsData, ListProviderBookingsVariables, ListPendingBookingsData, ListPendingBookingsVariables } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useCreateUser(options?: useDataConnectMutationOptions<CreateUserData, FirebaseError, CreateUserVariables>): UseDataConnectMutationResult<CreateUserData, CreateUserVariables>;
export function useCreateUser(dc: DataConnect, options?: useDataConnectMutationOptions<CreateUserData, FirebaseError, CreateUserVariables>): UseDataConnectMutationResult<CreateUserData, CreateUserVariables>;

export function useCreateBooking(options?: useDataConnectMutationOptions<CreateBookingData, FirebaseError, CreateBookingVariables>): UseDataConnectMutationResult<CreateBookingData, CreateBookingVariables>;
export function useCreateBooking(dc: DataConnect, options?: useDataConnectMutationOptions<CreateBookingData, FirebaseError, CreateBookingVariables>): UseDataConnectMutationResult<CreateBookingData, CreateBookingVariables>;

export function useUpdateBookingStatus(options?: useDataConnectMutationOptions<UpdateBookingStatusData, FirebaseError, UpdateBookingStatusVariables>): UseDataConnectMutationResult<UpdateBookingStatusData, UpdateBookingStatusVariables>;
export function useUpdateBookingStatus(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateBookingStatusData, FirebaseError, UpdateBookingStatusVariables>): UseDataConnectMutationResult<UpdateBookingStatusData, UpdateBookingStatusVariables>;

export function useAssignProvider(options?: useDataConnectMutationOptions<AssignProviderData, FirebaseError, AssignProviderVariables>): UseDataConnectMutationResult<AssignProviderData, AssignProviderVariables>;
export function useAssignProvider(dc: DataConnect, options?: useDataConnectMutationOptions<AssignProviderData, FirebaseError, AssignProviderVariables>): UseDataConnectMutationResult<AssignProviderData, AssignProviderVariables>;

export function useUpdateUserProfile(options?: useDataConnectMutationOptions<UpdateUserProfileData, FirebaseError, UpdateUserProfileVariables>): UseDataConnectMutationResult<UpdateUserProfileData, UpdateUserProfileVariables>;
export function useUpdateUserProfile(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateUserProfileData, FirebaseError, UpdateUserProfileVariables>): UseDataConnectMutationResult<UpdateUserProfileData, UpdateUserProfileVariables>;

export function useUpdateUserRole(options?: useDataConnectMutationOptions<UpdateUserRoleData, FirebaseError, UpdateUserRoleVariables>): UseDataConnectMutationResult<UpdateUserRoleData, UpdateUserRoleVariables>;
export function useUpdateUserRole(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateUserRoleData, FirebaseError, UpdateUserRoleVariables>): UseDataConnectMutationResult<UpdateUserRoleData, UpdateUserRoleVariables>;

export function useAddReview(options?: useDataConnectMutationOptions<AddReviewData, FirebaseError, AddReviewVariables>): UseDataConnectMutationResult<AddReviewData, AddReviewVariables>;
export function useAddReview(dc: DataConnect, options?: useDataConnectMutationOptions<AddReviewData, FirebaseError, AddReviewVariables>): UseDataConnectMutationResult<AddReviewData, AddReviewVariables>;

export function useSeedData(options?: useDataConnectMutationOptions<SeedDataData, FirebaseError, void>): UseDataConnectMutationResult<SeedDataData, undefined>;
export function useSeedData(dc: DataConnect, options?: useDataConnectMutationOptions<SeedDataData, FirebaseError, void>): UseDataConnectMutationResult<SeedDataData, undefined>;

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

export function useListAllUsers(vars?: ListAllUsersVariables, options?: useDataConnectQueryOptions<ListAllUsersData>): UseDataConnectQueryResult<ListAllUsersData, ListAllUsersVariables>;
export function useListAllUsers(dc: DataConnect, vars?: ListAllUsersVariables, options?: useDataConnectQueryOptions<ListAllUsersData>): UseDataConnectQueryResult<ListAllUsersData, ListAllUsersVariables>;

export function useListAllBookings(options?: useDataConnectQueryOptions<ListAllBookingsData>): UseDataConnectQueryResult<ListAllBookingsData, undefined>;
export function useListAllBookings(dc: DataConnect, options?: useDataConnectQueryOptions<ListAllBookingsData>): UseDataConnectQueryResult<ListAllBookingsData, undefined>;

export function useGetBookingById(vars: GetBookingByIdVariables, options?: useDataConnectQueryOptions<GetBookingByIdData>): UseDataConnectQueryResult<GetBookingByIdData, GetBookingByIdVariables>;
export function useGetBookingById(dc: DataConnect, vars: GetBookingByIdVariables, options?: useDataConnectQueryOptions<GetBookingByIdData>): UseDataConnectQueryResult<GetBookingByIdData, GetBookingByIdVariables>;

export function useListProviderBookings(vars: ListProviderBookingsVariables, options?: useDataConnectQueryOptions<ListProviderBookingsData>): UseDataConnectQueryResult<ListProviderBookingsData, ListProviderBookingsVariables>;
export function useListProviderBookings(dc: DataConnect, vars: ListProviderBookingsVariables, options?: useDataConnectQueryOptions<ListProviderBookingsData>): UseDataConnectQueryResult<ListProviderBookingsData, ListProviderBookingsVariables>;

export function useListPendingBookings(vars?: ListPendingBookingsVariables, options?: useDataConnectQueryOptions<ListPendingBookingsData>): UseDataConnectQueryResult<ListPendingBookingsData, ListPendingBookingsVariables>;
export function useListPendingBookings(dc: DataConnect, vars?: ListPendingBookingsVariables, options?: useDataConnectQueryOptions<ListPendingBookingsData>): UseDataConnectQueryResult<ListPendingBookingsData, ListPendingBookingsVariables>;
