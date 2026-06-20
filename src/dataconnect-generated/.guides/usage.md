# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.




### React
For each operation, there is a wrapper hook that can be used to call the operation.

Here are all of the hooks that get generated:
```ts
import { useCreateUser, useCreateBooking, useAddReview, useSeedData, useListServiceCategories, useGetUserProfile, useListCustomerBookings, useListPartnerAvailability, useListPartnerReviews } from '@dataconnect/example/react';
// The types of these hooks are available in react/index.d.ts

const { data, isPending, isSuccess, isError, error } = useCreateUser(createUserVars);

const { data, isPending, isSuccess, isError, error } = useCreateBooking(createBookingVars);

const { data, isPending, isSuccess, isError, error } = useAddReview(addReviewVars);

const { data, isPending, isSuccess, isError, error } = useSeedData();

const { data, isPending, isSuccess, isError, error } = useListServiceCategories();

const { data, isPending, isSuccess, isError, error } = useGetUserProfile(getUserProfileVars);

const { data, isPending, isSuccess, isError, error } = useListCustomerBookings(listCustomerBookingsVars);

const { data, isPending, isSuccess, isError, error } = useListPartnerAvailability(listPartnerAvailabilityVars);

const { data, isPending, isSuccess, isError, error } = useListPartnerReviews(listPartnerReviewsVars);

```

Here's an example from a different generated SDK:

```ts
import { useListAllMovies } from '@dataconnect/generated/react';

function MyComponent() {
  const { isLoading, data, error } = useListAllMovies();
  if(isLoading) {
    return <div>Loading...</div>
  }
  if(error) {
    return <div> An Error Occurred: {error} </div>
  }
}

// App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MyComponent from './my-component';

function App() {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient}>
    <MyComponent />
  </QueryClientProvider>
}
```



## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { createUser, createBooking, addReview, seedData, listServiceCategories, getUserProfile, listCustomerBookings, listPartnerAvailability, listPartnerReviews } from '@dataconnect/example';


// Operation CreateUser:  For variables, look at type CreateUserVars in ../index.d.ts
const { data } = await CreateUser(dataConnect, createUserVars);

// Operation CreateBooking:  For variables, look at type CreateBookingVars in ../index.d.ts
const { data } = await CreateBooking(dataConnect, createBookingVars);

// Operation AddReview:  For variables, look at type AddReviewVars in ../index.d.ts
const { data } = await AddReview(dataConnect, addReviewVars);

// Operation SeedData: 
const { data } = await SeedData(dataConnect);

// Operation ListServiceCategories: 
const { data } = await ListServiceCategories(dataConnect);

// Operation GetUserProfile:  For variables, look at type GetUserProfileVars in ../index.d.ts
const { data } = await GetUserProfile(dataConnect, getUserProfileVars);

// Operation ListCustomerBookings:  For variables, look at type ListCustomerBookingsVars in ../index.d.ts
const { data } = await ListCustomerBookings(dataConnect, listCustomerBookingsVars);

// Operation ListPartnerAvailability:  For variables, look at type ListPartnerAvailabilityVars in ../index.d.ts
const { data } = await ListPartnerAvailability(dataConnect, listPartnerAvailabilityVars);

// Operation ListPartnerReviews:  For variables, look at type ListPartnerReviewsVars in ../index.d.ts
const { data } = await ListPartnerReviews(dataConnect, listPartnerReviewsVars);


```