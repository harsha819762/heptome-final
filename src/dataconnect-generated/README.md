# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*ListServiceCategories*](#listservicecategories)
  - [*GetUserProfile*](#getuserprofile)
  - [*ListCustomerBookings*](#listcustomerbookings)
  - [*ListPartnerAvailability*](#listpartneravailability)
  - [*ListPartnerReviews*](#listpartnerreviews)
  - [*ListAllUsers*](#listallusers)
  - [*ListAllBookings*](#listallbookings)
  - [*GetBookingById*](#getbookingbyid)
  - [*ListProviderBookings*](#listproviderbookings)
  - [*ListPendingBookings*](#listpendingbookings)
- [**Mutations**](#mutations)
  - [*CreateUser*](#createuser)
  - [*CreateBooking*](#createbooking)
  - [*UpdateBookingStatus*](#updatebookingstatus)
  - [*AssignProvider*](#assignprovider)
  - [*UpdateUserProfile*](#updateuserprofile)
  - [*UpdateUserRole*](#updateuserrole)
  - [*AddReview*](#addreview)
  - [*SeedData*](#seeddata)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## ListServiceCategories
You can execute the `ListServiceCategories` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listServiceCategories(options?: ExecuteQueryOptions): QueryPromise<ListServiceCategoriesData, undefined>;

interface ListServiceCategoriesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListServiceCategoriesData, undefined>;
}
export const listServiceCategoriesRef: ListServiceCategoriesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listServiceCategories(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListServiceCategoriesData, undefined>;

interface ListServiceCategoriesRef {
  ...
  (dc: DataConnect): QueryRef<ListServiceCategoriesData, undefined>;
}
export const listServiceCategoriesRef: ListServiceCategoriesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listServiceCategoriesRef:
```typescript
const name = listServiceCategoriesRef.operationName;
console.log(name);
```

### Variables
The `ListServiceCategories` query has no variables.
### Return Type
Recall that executing the `ListServiceCategories` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListServiceCategoriesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListServiceCategoriesData {
  serviceCategories: ({
    id: UUIDString;
    name: string;
    basePrice: number;
    iconUrl?: string | null;
    description?: string | null;
  } & ServiceCategory_Key)[];
}
```
### Using `ListServiceCategories`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listServiceCategories } from '@dataconnect/generated';


// Call the `listServiceCategories()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listServiceCategories();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listServiceCategories(dataConnect);

console.log(data.serviceCategories);

// Or, you can use the `Promise` API.
listServiceCategories().then((response) => {
  const data = response.data;
  console.log(data.serviceCategories);
});
```

### Using `ListServiceCategories`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listServiceCategoriesRef } from '@dataconnect/generated';


// Call the `listServiceCategoriesRef()` function to get a reference to the query.
const ref = listServiceCategoriesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listServiceCategoriesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.serviceCategories);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.serviceCategories);
});
```

## GetUserProfile
You can execute the `GetUserProfile` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getUserProfile(vars: GetUserProfileVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserProfileData, GetUserProfileVariables>;

interface GetUserProfileRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserProfileVariables): QueryRef<GetUserProfileData, GetUserProfileVariables>;
}
export const getUserProfileRef: GetUserProfileRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getUserProfile(dc: DataConnect, vars: GetUserProfileVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserProfileData, GetUserProfileVariables>;

interface GetUserProfileRef {
  ...
  (dc: DataConnect, vars: GetUserProfileVariables): QueryRef<GetUserProfileData, GetUserProfileVariables>;
}
export const getUserProfileRef: GetUserProfileRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getUserProfileRef:
```typescript
const name = getUserProfileRef.operationName;
console.log(name);
```

### Variables
The `GetUserProfile` query requires an argument of type `GetUserProfileVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetUserProfileVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetUserProfile` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetUserProfileData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetUserProfile`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getUserProfile, GetUserProfileVariables } from '@dataconnect/generated';

// The `GetUserProfile` query requires an argument of type `GetUserProfileVariables`:
const getUserProfileVars: GetUserProfileVariables = {
  id: ..., 
};

// Call the `getUserProfile()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getUserProfile(getUserProfileVars);
// Variables can be defined inline as well.
const { data } = await getUserProfile({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getUserProfile(dataConnect, getUserProfileVars);

console.log(data.user);

// Or, you can use the `Promise` API.
getUserProfile(getUserProfileVars).then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

### Using `GetUserProfile`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getUserProfileRef, GetUserProfileVariables } from '@dataconnect/generated';

// The `GetUserProfile` query requires an argument of type `GetUserProfileVariables`:
const getUserProfileVars: GetUserProfileVariables = {
  id: ..., 
};

// Call the `getUserProfileRef()` function to get a reference to the query.
const ref = getUserProfileRef(getUserProfileVars);
// Variables can be defined inline as well.
const ref = getUserProfileRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getUserProfileRef(dataConnect, getUserProfileVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.user);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

## ListCustomerBookings
You can execute the `ListCustomerBookings` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listCustomerBookings(vars: ListCustomerBookingsVariables, options?: ExecuteQueryOptions): QueryPromise<ListCustomerBookingsData, ListCustomerBookingsVariables>;

interface ListCustomerBookingsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListCustomerBookingsVariables): QueryRef<ListCustomerBookingsData, ListCustomerBookingsVariables>;
}
export const listCustomerBookingsRef: ListCustomerBookingsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listCustomerBookings(dc: DataConnect, vars: ListCustomerBookingsVariables, options?: ExecuteQueryOptions): QueryPromise<ListCustomerBookingsData, ListCustomerBookingsVariables>;

interface ListCustomerBookingsRef {
  ...
  (dc: DataConnect, vars: ListCustomerBookingsVariables): QueryRef<ListCustomerBookingsData, ListCustomerBookingsVariables>;
}
export const listCustomerBookingsRef: ListCustomerBookingsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listCustomerBookingsRef:
```typescript
const name = listCustomerBookingsRef.operationName;
console.log(name);
```

### Variables
The `ListCustomerBookings` query requires an argument of type `ListCustomerBookingsVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListCustomerBookingsVariables {
  customerId: UUIDString;
}
```
### Return Type
Recall that executing the `ListCustomerBookings` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListCustomerBookingsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListCustomerBookings`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listCustomerBookings, ListCustomerBookingsVariables } from '@dataconnect/generated';

// The `ListCustomerBookings` query requires an argument of type `ListCustomerBookingsVariables`:
const listCustomerBookingsVars: ListCustomerBookingsVariables = {
  customerId: ..., 
};

// Call the `listCustomerBookings()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listCustomerBookings(listCustomerBookingsVars);
// Variables can be defined inline as well.
const { data } = await listCustomerBookings({ customerId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listCustomerBookings(dataConnect, listCustomerBookingsVars);

console.log(data.bookings);

// Or, you can use the `Promise` API.
listCustomerBookings(listCustomerBookingsVars).then((response) => {
  const data = response.data;
  console.log(data.bookings);
});
```

### Using `ListCustomerBookings`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listCustomerBookingsRef, ListCustomerBookingsVariables } from '@dataconnect/generated';

// The `ListCustomerBookings` query requires an argument of type `ListCustomerBookingsVariables`:
const listCustomerBookingsVars: ListCustomerBookingsVariables = {
  customerId: ..., 
};

// Call the `listCustomerBookingsRef()` function to get a reference to the query.
const ref = listCustomerBookingsRef(listCustomerBookingsVars);
// Variables can be defined inline as well.
const ref = listCustomerBookingsRef({ customerId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listCustomerBookingsRef(dataConnect, listCustomerBookingsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.bookings);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.bookings);
});
```

## ListPartnerAvailability
You can execute the `ListPartnerAvailability` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listPartnerAvailability(vars: ListPartnerAvailabilityVariables, options?: ExecuteQueryOptions): QueryPromise<ListPartnerAvailabilityData, ListPartnerAvailabilityVariables>;

interface ListPartnerAvailabilityRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListPartnerAvailabilityVariables): QueryRef<ListPartnerAvailabilityData, ListPartnerAvailabilityVariables>;
}
export const listPartnerAvailabilityRef: ListPartnerAvailabilityRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listPartnerAvailability(dc: DataConnect, vars: ListPartnerAvailabilityVariables, options?: ExecuteQueryOptions): QueryPromise<ListPartnerAvailabilityData, ListPartnerAvailabilityVariables>;

interface ListPartnerAvailabilityRef {
  ...
  (dc: DataConnect, vars: ListPartnerAvailabilityVariables): QueryRef<ListPartnerAvailabilityData, ListPartnerAvailabilityVariables>;
}
export const listPartnerAvailabilityRef: ListPartnerAvailabilityRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listPartnerAvailabilityRef:
```typescript
const name = listPartnerAvailabilityRef.operationName;
console.log(name);
```

### Variables
The `ListPartnerAvailability` query requires an argument of type `ListPartnerAvailabilityVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListPartnerAvailabilityVariables {
  partnerId: UUIDString;
}
```
### Return Type
Recall that executing the `ListPartnerAvailability` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListPartnerAvailabilityData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListPartnerAvailabilityData {
  partnerAvailabilities: ({
    id: UUIDString;
    startTime: TimestampString;
    endTime: TimestampString;
    isBooked: boolean;
  } & PartnerAvailability_Key)[];
}
```
### Using `ListPartnerAvailability`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listPartnerAvailability, ListPartnerAvailabilityVariables } from '@dataconnect/generated';

// The `ListPartnerAvailability` query requires an argument of type `ListPartnerAvailabilityVariables`:
const listPartnerAvailabilityVars: ListPartnerAvailabilityVariables = {
  partnerId: ..., 
};

// Call the `listPartnerAvailability()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listPartnerAvailability(listPartnerAvailabilityVars);
// Variables can be defined inline as well.
const { data } = await listPartnerAvailability({ partnerId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listPartnerAvailability(dataConnect, listPartnerAvailabilityVars);

console.log(data.partnerAvailabilities);

// Or, you can use the `Promise` API.
listPartnerAvailability(listPartnerAvailabilityVars).then((response) => {
  const data = response.data;
  console.log(data.partnerAvailabilities);
});
```

### Using `ListPartnerAvailability`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listPartnerAvailabilityRef, ListPartnerAvailabilityVariables } from '@dataconnect/generated';

// The `ListPartnerAvailability` query requires an argument of type `ListPartnerAvailabilityVariables`:
const listPartnerAvailabilityVars: ListPartnerAvailabilityVariables = {
  partnerId: ..., 
};

// Call the `listPartnerAvailabilityRef()` function to get a reference to the query.
const ref = listPartnerAvailabilityRef(listPartnerAvailabilityVars);
// Variables can be defined inline as well.
const ref = listPartnerAvailabilityRef({ partnerId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listPartnerAvailabilityRef(dataConnect, listPartnerAvailabilityVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.partnerAvailabilities);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.partnerAvailabilities);
});
```

## ListPartnerReviews
You can execute the `ListPartnerReviews` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listPartnerReviews(vars: ListPartnerReviewsVariables, options?: ExecuteQueryOptions): QueryPromise<ListPartnerReviewsData, ListPartnerReviewsVariables>;

interface ListPartnerReviewsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListPartnerReviewsVariables): QueryRef<ListPartnerReviewsData, ListPartnerReviewsVariables>;
}
export const listPartnerReviewsRef: ListPartnerReviewsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listPartnerReviews(dc: DataConnect, vars: ListPartnerReviewsVariables, options?: ExecuteQueryOptions): QueryPromise<ListPartnerReviewsData, ListPartnerReviewsVariables>;

interface ListPartnerReviewsRef {
  ...
  (dc: DataConnect, vars: ListPartnerReviewsVariables): QueryRef<ListPartnerReviewsData, ListPartnerReviewsVariables>;
}
export const listPartnerReviewsRef: ListPartnerReviewsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listPartnerReviewsRef:
```typescript
const name = listPartnerReviewsRef.operationName;
console.log(name);
```

### Variables
The `ListPartnerReviews` query requires an argument of type `ListPartnerReviewsVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListPartnerReviewsVariables {
  partnerId: UUIDString;
}
```
### Return Type
Recall that executing the `ListPartnerReviews` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListPartnerReviewsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListPartnerReviews`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listPartnerReviews, ListPartnerReviewsVariables } from '@dataconnect/generated';

// The `ListPartnerReviews` query requires an argument of type `ListPartnerReviewsVariables`:
const listPartnerReviewsVars: ListPartnerReviewsVariables = {
  partnerId: ..., 
};

// Call the `listPartnerReviews()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listPartnerReviews(listPartnerReviewsVars);
// Variables can be defined inline as well.
const { data } = await listPartnerReviews({ partnerId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listPartnerReviews(dataConnect, listPartnerReviewsVars);

console.log(data.reviews);

// Or, you can use the `Promise` API.
listPartnerReviews(listPartnerReviewsVars).then((response) => {
  const data = response.data;
  console.log(data.reviews);
});
```

### Using `ListPartnerReviews`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listPartnerReviewsRef, ListPartnerReviewsVariables } from '@dataconnect/generated';

// The `ListPartnerReviews` query requires an argument of type `ListPartnerReviewsVariables`:
const listPartnerReviewsVars: ListPartnerReviewsVariables = {
  partnerId: ..., 
};

// Call the `listPartnerReviewsRef()` function to get a reference to the query.
const ref = listPartnerReviewsRef(listPartnerReviewsVars);
// Variables can be defined inline as well.
const ref = listPartnerReviewsRef({ partnerId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listPartnerReviewsRef(dataConnect, listPartnerReviewsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.reviews);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.reviews);
});
```

## ListAllUsers
You can execute the `ListAllUsers` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listAllUsers(vars?: ListAllUsersVariables, options?: ExecuteQueryOptions): QueryPromise<ListAllUsersData, ListAllUsersVariables>;

interface ListAllUsersRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars?: ListAllUsersVariables): QueryRef<ListAllUsersData, ListAllUsersVariables>;
}
export const listAllUsersRef: ListAllUsersRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listAllUsers(dc: DataConnect, vars?: ListAllUsersVariables, options?: ExecuteQueryOptions): QueryPromise<ListAllUsersData, ListAllUsersVariables>;

interface ListAllUsersRef {
  ...
  (dc: DataConnect, vars?: ListAllUsersVariables): QueryRef<ListAllUsersData, ListAllUsersVariables>;
}
export const listAllUsersRef: ListAllUsersRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listAllUsersRef:
```typescript
const name = listAllUsersRef.operationName;
console.log(name);
```

### Variables
The `ListAllUsers` query has an optional argument of type `ListAllUsersVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListAllUsersVariables {
  role?: string | null;
}
```
### Return Type
Recall that executing the `ListAllUsers` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListAllUsersData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListAllUsersData {
  users: ({
    id: UUIDString;
    name: string;
    email: string;
    role: string;
    phoneNumber: string;
    avatarUrl?: string | null;
    address?: string | null;
    rating?: number | null;
  } & User_Key)[];
}
```
### Using `ListAllUsers`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listAllUsers, ListAllUsersVariables } from '@dataconnect/generated';

// The `ListAllUsers` query has an optional argument of type `ListAllUsersVariables`:
const listAllUsersVars: ListAllUsersVariables = {
  role: ..., // optional
};

// Call the `listAllUsers()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listAllUsers(listAllUsersVars);
// Variables can be defined inline as well.
const { data } = await listAllUsers({ role: ..., });
// Since all variables are optional for this query, you can omit the `ListAllUsersVariables` argument.
const { data } = await listAllUsers();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listAllUsers(dataConnect, listAllUsersVars);

console.log(data.users);

// Or, you can use the `Promise` API.
listAllUsers(listAllUsersVars).then((response) => {
  const data = response.data;
  console.log(data.users);
});
```

### Using `ListAllUsers`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listAllUsersRef, ListAllUsersVariables } from '@dataconnect/generated';

// The `ListAllUsers` query has an optional argument of type `ListAllUsersVariables`:
const listAllUsersVars: ListAllUsersVariables = {
  role: ..., // optional
};

// Call the `listAllUsersRef()` function to get a reference to the query.
const ref = listAllUsersRef(listAllUsersVars);
// Variables can be defined inline as well.
const ref = listAllUsersRef({ role: ..., });
// Since all variables are optional for this query, you can omit the `ListAllUsersVariables` argument.
const ref = listAllUsersRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listAllUsersRef(dataConnect, listAllUsersVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.users);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.users);
});
```

## ListAllBookings
You can execute the `ListAllBookings` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listAllBookings(options?: ExecuteQueryOptions): QueryPromise<ListAllBookingsData, undefined>;

interface ListAllBookingsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllBookingsData, undefined>;
}
export const listAllBookingsRef: ListAllBookingsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listAllBookings(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListAllBookingsData, undefined>;

interface ListAllBookingsRef {
  ...
  (dc: DataConnect): QueryRef<ListAllBookingsData, undefined>;
}
export const listAllBookingsRef: ListAllBookingsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listAllBookingsRef:
```typescript
const name = listAllBookingsRef.operationName;
console.log(name);
```

### Variables
The `ListAllBookings` query has no variables.
### Return Type
Recall that executing the `ListAllBookings` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListAllBookingsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListAllBookingsData {
  bookings: ({
    id: UUIDString;
    status: string;
    bookingDate: TimestampString;
    totalAmount: number;
    partnerNotes?: string | null;
    customer: {
      id: UUIDString;
      name: string;
      email: string;
    } & User_Key;
      partner?: {
        id: UUIDString;
        name: string;
      } & User_Key;
        serviceCategory: {
          id: UUIDString;
          name: string;
        } & ServiceCategory_Key;
  } & Booking_Key)[];
}
```
### Using `ListAllBookings`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listAllBookings } from '@dataconnect/generated';


// Call the `listAllBookings()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listAllBookings();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listAllBookings(dataConnect);

console.log(data.bookings);

// Or, you can use the `Promise` API.
listAllBookings().then((response) => {
  const data = response.data;
  console.log(data.bookings);
});
```

### Using `ListAllBookings`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listAllBookingsRef } from '@dataconnect/generated';


// Call the `listAllBookingsRef()` function to get a reference to the query.
const ref = listAllBookingsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listAllBookingsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.bookings);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.bookings);
});
```

## GetBookingById
You can execute the `GetBookingById` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getBookingById(vars: GetBookingByIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetBookingByIdData, GetBookingByIdVariables>;

interface GetBookingByIdRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetBookingByIdVariables): QueryRef<GetBookingByIdData, GetBookingByIdVariables>;
}
export const getBookingByIdRef: GetBookingByIdRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getBookingById(dc: DataConnect, vars: GetBookingByIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetBookingByIdData, GetBookingByIdVariables>;

interface GetBookingByIdRef {
  ...
  (dc: DataConnect, vars: GetBookingByIdVariables): QueryRef<GetBookingByIdData, GetBookingByIdVariables>;
}
export const getBookingByIdRef: GetBookingByIdRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getBookingByIdRef:
```typescript
const name = getBookingByIdRef.operationName;
console.log(name);
```

### Variables
The `GetBookingById` query requires an argument of type `GetBookingByIdVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetBookingByIdVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetBookingById` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetBookingByIdData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetBookingByIdData {
  booking?: {
    id: UUIDString;
    status: string;
    bookingDate: TimestampString;
    totalAmount: number;
    partnerNotes?: string | null;
    customerReview?: string | null;
    customer: {
      id: UUIDString;
      name: string;
      email: string;
      phoneNumber: string;
      address?: string | null;
    } & User_Key;
      partner?: {
        id: UUIDString;
        name: string;
        email: string;
        phoneNumber: string;
      } & User_Key;
        serviceCategory: {
          id: UUIDString;
          name: string;
          basePrice: number;
        } & ServiceCategory_Key;
  } & Booking_Key;
}
```
### Using `GetBookingById`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getBookingById, GetBookingByIdVariables } from '@dataconnect/generated';

// The `GetBookingById` query requires an argument of type `GetBookingByIdVariables`:
const getBookingByIdVars: GetBookingByIdVariables = {
  id: ..., 
};

// Call the `getBookingById()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getBookingById(getBookingByIdVars);
// Variables can be defined inline as well.
const { data } = await getBookingById({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getBookingById(dataConnect, getBookingByIdVars);

console.log(data.booking);

// Or, you can use the `Promise` API.
getBookingById(getBookingByIdVars).then((response) => {
  const data = response.data;
  console.log(data.booking);
});
```

### Using `GetBookingById`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getBookingByIdRef, GetBookingByIdVariables } from '@dataconnect/generated';

// The `GetBookingById` query requires an argument of type `GetBookingByIdVariables`:
const getBookingByIdVars: GetBookingByIdVariables = {
  id: ..., 
};

// Call the `getBookingByIdRef()` function to get a reference to the query.
const ref = getBookingByIdRef(getBookingByIdVars);
// Variables can be defined inline as well.
const ref = getBookingByIdRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getBookingByIdRef(dataConnect, getBookingByIdVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.booking);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.booking);
});
```

## ListProviderBookings
You can execute the `ListProviderBookings` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listProviderBookings(vars: ListProviderBookingsVariables, options?: ExecuteQueryOptions): QueryPromise<ListProviderBookingsData, ListProviderBookingsVariables>;

interface ListProviderBookingsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListProviderBookingsVariables): QueryRef<ListProviderBookingsData, ListProviderBookingsVariables>;
}
export const listProviderBookingsRef: ListProviderBookingsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listProviderBookings(dc: DataConnect, vars: ListProviderBookingsVariables, options?: ExecuteQueryOptions): QueryPromise<ListProviderBookingsData, ListProviderBookingsVariables>;

interface ListProviderBookingsRef {
  ...
  (dc: DataConnect, vars: ListProviderBookingsVariables): QueryRef<ListProviderBookingsData, ListProviderBookingsVariables>;
}
export const listProviderBookingsRef: ListProviderBookingsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listProviderBookingsRef:
```typescript
const name = listProviderBookingsRef.operationName;
console.log(name);
```

### Variables
The `ListProviderBookings` query requires an argument of type `ListProviderBookingsVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListProviderBookingsVariables {
  partnerId: UUIDString;
}
```
### Return Type
Recall that executing the `ListProviderBookings` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListProviderBookingsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListProviderBookingsData {
  bookings: ({
    id: UUIDString;
    status: string;
    bookingDate: TimestampString;
    totalAmount: number;
    partnerNotes?: string | null;
    customer: {
      id: UUIDString;
      name: string;
      email: string;
      phoneNumber: string;
      address?: string | null;
    } & User_Key;
      serviceCategory: {
        id: UUIDString;
        name: string;
      } & ServiceCategory_Key;
  } & Booking_Key)[];
}
```
### Using `ListProviderBookings`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listProviderBookings, ListProviderBookingsVariables } from '@dataconnect/generated';

// The `ListProviderBookings` query requires an argument of type `ListProviderBookingsVariables`:
const listProviderBookingsVars: ListProviderBookingsVariables = {
  partnerId: ..., 
};

// Call the `listProviderBookings()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listProviderBookings(listProviderBookingsVars);
// Variables can be defined inline as well.
const { data } = await listProviderBookings({ partnerId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listProviderBookings(dataConnect, listProviderBookingsVars);

console.log(data.bookings);

// Or, you can use the `Promise` API.
listProviderBookings(listProviderBookingsVars).then((response) => {
  const data = response.data;
  console.log(data.bookings);
});
```

### Using `ListProviderBookings`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listProviderBookingsRef, ListProviderBookingsVariables } from '@dataconnect/generated';

// The `ListProviderBookings` query requires an argument of type `ListProviderBookingsVariables`:
const listProviderBookingsVars: ListProviderBookingsVariables = {
  partnerId: ..., 
};

// Call the `listProviderBookingsRef()` function to get a reference to the query.
const ref = listProviderBookingsRef(listProviderBookingsVars);
// Variables can be defined inline as well.
const ref = listProviderBookingsRef({ partnerId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listProviderBookingsRef(dataConnect, listProviderBookingsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.bookings);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.bookings);
});
```

## ListPendingBookings
You can execute the `ListPendingBookings` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listPendingBookings(vars?: ListPendingBookingsVariables, options?: ExecuteQueryOptions): QueryPromise<ListPendingBookingsData, ListPendingBookingsVariables>;

interface ListPendingBookingsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars?: ListPendingBookingsVariables): QueryRef<ListPendingBookingsData, ListPendingBookingsVariables>;
}
export const listPendingBookingsRef: ListPendingBookingsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listPendingBookings(dc: DataConnect, vars?: ListPendingBookingsVariables, options?: ExecuteQueryOptions): QueryPromise<ListPendingBookingsData, ListPendingBookingsVariables>;

interface ListPendingBookingsRef {
  ...
  (dc: DataConnect, vars?: ListPendingBookingsVariables): QueryRef<ListPendingBookingsData, ListPendingBookingsVariables>;
}
export const listPendingBookingsRef: ListPendingBookingsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listPendingBookingsRef:
```typescript
const name = listPendingBookingsRef.operationName;
console.log(name);
```

### Variables
The `ListPendingBookings` query has an optional argument of type `ListPendingBookingsVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListPendingBookingsVariables {
  serviceCategoryIds?: UUIDString[] | null;
}
```
### Return Type
Recall that executing the `ListPendingBookings` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListPendingBookingsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListPendingBookingsData {
  bookings: ({
    id: UUIDString;
    status: string;
    bookingDate: TimestampString;
    totalAmount: number;
    partnerNotes?: string | null;
    customer: {
      id: UUIDString;
      name: string;
      address?: string | null;
    } & User_Key;
      serviceCategory: {
        id: UUIDString;
        name: string;
      } & ServiceCategory_Key;
  } & Booking_Key)[];
}
```
### Using `ListPendingBookings`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listPendingBookings, ListPendingBookingsVariables } from '@dataconnect/generated';

// The `ListPendingBookings` query has an optional argument of type `ListPendingBookingsVariables`:
const listPendingBookingsVars: ListPendingBookingsVariables = {
  serviceCategoryIds: ..., // optional
};

// Call the `listPendingBookings()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listPendingBookings(listPendingBookingsVars);
// Variables can be defined inline as well.
const { data } = await listPendingBookings({ serviceCategoryIds: ..., });
// Since all variables are optional for this query, you can omit the `ListPendingBookingsVariables` argument.
const { data } = await listPendingBookings();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listPendingBookings(dataConnect, listPendingBookingsVars);

console.log(data.bookings);

// Or, you can use the `Promise` API.
listPendingBookings(listPendingBookingsVars).then((response) => {
  const data = response.data;
  console.log(data.bookings);
});
```

### Using `ListPendingBookings`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listPendingBookingsRef, ListPendingBookingsVariables } from '@dataconnect/generated';

// The `ListPendingBookings` query has an optional argument of type `ListPendingBookingsVariables`:
const listPendingBookingsVars: ListPendingBookingsVariables = {
  serviceCategoryIds: ..., // optional
};

// Call the `listPendingBookingsRef()` function to get a reference to the query.
const ref = listPendingBookingsRef(listPendingBookingsVars);
// Variables can be defined inline as well.
const ref = listPendingBookingsRef({ serviceCategoryIds: ..., });
// Since all variables are optional for this query, you can omit the `ListPendingBookingsVariables` argument.
const ref = listPendingBookingsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listPendingBookingsRef(dataConnect, listPendingBookingsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.bookings);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.bookings);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateUser
You can execute the `CreateUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createUser(vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;

interface CreateUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
}
export const createUserRef: CreateUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createUser(dc: DataConnect, vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;

interface CreateUserRef {
  ...
  (dc: DataConnect, vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
}
export const createUserRef: CreateUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createUserRef:
```typescript
const name = createUserRef.operationName;
console.log(name);
```

### Variables
The `CreateUser` mutation requires an argument of type `CreateUserVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateUserVariables {
  name: string;
  email: string;
  role: string;
  phoneNumber: string;
  avatarUrl?: string | null;
  address?: string | null;
}
```
### Return Type
Recall that executing the `CreateUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateUserData {
  user_insert: User_Key;
}
```
### Using `CreateUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createUser, CreateUserVariables } from '@dataconnect/generated';

// The `CreateUser` mutation requires an argument of type `CreateUserVariables`:
const createUserVars: CreateUserVariables = {
  name: ..., 
  email: ..., 
  role: ..., 
  phoneNumber: ..., 
  avatarUrl: ..., // optional
  address: ..., // optional
};

// Call the `createUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createUser(createUserVars);
// Variables can be defined inline as well.
const { data } = await createUser({ name: ..., email: ..., role: ..., phoneNumber: ..., avatarUrl: ..., address: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createUser(dataConnect, createUserVars);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
createUser(createUserVars).then((response) => {
  const data = response.data;
  console.log(data.user_insert);
});
```

### Using `CreateUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createUserRef, CreateUserVariables } from '@dataconnect/generated';

// The `CreateUser` mutation requires an argument of type `CreateUserVariables`:
const createUserVars: CreateUserVariables = {
  name: ..., 
  email: ..., 
  role: ..., 
  phoneNumber: ..., 
  avatarUrl: ..., // optional
  address: ..., // optional
};

// Call the `createUserRef()` function to get a reference to the mutation.
const ref = createUserRef(createUserVars);
// Variables can be defined inline as well.
const ref = createUserRef({ name: ..., email: ..., role: ..., phoneNumber: ..., avatarUrl: ..., address: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createUserRef(dataConnect, createUserVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_insert);
});
```

## CreateBooking
You can execute the `CreateBooking` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createBooking(vars: CreateBookingVariables): MutationPromise<CreateBookingData, CreateBookingVariables>;

interface CreateBookingRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateBookingVariables): MutationRef<CreateBookingData, CreateBookingVariables>;
}
export const createBookingRef: CreateBookingRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createBooking(dc: DataConnect, vars: CreateBookingVariables): MutationPromise<CreateBookingData, CreateBookingVariables>;

interface CreateBookingRef {
  ...
  (dc: DataConnect, vars: CreateBookingVariables): MutationRef<CreateBookingData, CreateBookingVariables>;
}
export const createBookingRef: CreateBookingRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createBookingRef:
```typescript
const name = createBookingRef.operationName;
console.log(name);
```

### Variables
The `CreateBooking` mutation requires an argument of type `CreateBookingVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateBookingVariables {
  status: string;
  bookingDate: TimestampString;
  totalAmount: number;
  customerId: UUIDString;
  partnerId?: UUIDString | null;
  serviceCategoryId: UUIDString;
}
```
### Return Type
Recall that executing the `CreateBooking` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateBookingData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateBookingData {
  booking_insert: Booking_Key;
}
```
### Using `CreateBooking`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createBooking, CreateBookingVariables } from '@dataconnect/generated';

// The `CreateBooking` mutation requires an argument of type `CreateBookingVariables`:
const createBookingVars: CreateBookingVariables = {
  status: ..., 
  bookingDate: ..., 
  totalAmount: ..., 
  customerId: ..., 
  partnerId: ..., // optional
  serviceCategoryId: ..., 
};

// Call the `createBooking()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createBooking(createBookingVars);
// Variables can be defined inline as well.
const { data } = await createBooking({ status: ..., bookingDate: ..., totalAmount: ..., customerId: ..., partnerId: ..., serviceCategoryId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createBooking(dataConnect, createBookingVars);

console.log(data.booking_insert);

// Or, you can use the `Promise` API.
createBooking(createBookingVars).then((response) => {
  const data = response.data;
  console.log(data.booking_insert);
});
```

### Using `CreateBooking`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createBookingRef, CreateBookingVariables } from '@dataconnect/generated';

// The `CreateBooking` mutation requires an argument of type `CreateBookingVariables`:
const createBookingVars: CreateBookingVariables = {
  status: ..., 
  bookingDate: ..., 
  totalAmount: ..., 
  customerId: ..., 
  partnerId: ..., // optional
  serviceCategoryId: ..., 
};

// Call the `createBookingRef()` function to get a reference to the mutation.
const ref = createBookingRef(createBookingVars);
// Variables can be defined inline as well.
const ref = createBookingRef({ status: ..., bookingDate: ..., totalAmount: ..., customerId: ..., partnerId: ..., serviceCategoryId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createBookingRef(dataConnect, createBookingVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.booking_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.booking_insert);
});
```

## UpdateBookingStatus
You can execute the `UpdateBookingStatus` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateBookingStatus(vars: UpdateBookingStatusVariables): MutationPromise<UpdateBookingStatusData, UpdateBookingStatusVariables>;

interface UpdateBookingStatusRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateBookingStatusVariables): MutationRef<UpdateBookingStatusData, UpdateBookingStatusVariables>;
}
export const updateBookingStatusRef: UpdateBookingStatusRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateBookingStatus(dc: DataConnect, vars: UpdateBookingStatusVariables): MutationPromise<UpdateBookingStatusData, UpdateBookingStatusVariables>;

interface UpdateBookingStatusRef {
  ...
  (dc: DataConnect, vars: UpdateBookingStatusVariables): MutationRef<UpdateBookingStatusData, UpdateBookingStatusVariables>;
}
export const updateBookingStatusRef: UpdateBookingStatusRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateBookingStatusRef:
```typescript
const name = updateBookingStatusRef.operationName;
console.log(name);
```

### Variables
The `UpdateBookingStatus` mutation requires an argument of type `UpdateBookingStatusVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateBookingStatusVariables {
  id: UUIDString;
  status: string;
}
```
### Return Type
Recall that executing the `UpdateBookingStatus` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateBookingStatusData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateBookingStatusData {
  booking_update?: Booking_Key | null;
}
```
### Using `UpdateBookingStatus`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateBookingStatus, UpdateBookingStatusVariables } from '@dataconnect/generated';

// The `UpdateBookingStatus` mutation requires an argument of type `UpdateBookingStatusVariables`:
const updateBookingStatusVars: UpdateBookingStatusVariables = {
  id: ..., 
  status: ..., 
};

// Call the `updateBookingStatus()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateBookingStatus(updateBookingStatusVars);
// Variables can be defined inline as well.
const { data } = await updateBookingStatus({ id: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateBookingStatus(dataConnect, updateBookingStatusVars);

console.log(data.booking_update);

// Or, you can use the `Promise` API.
updateBookingStatus(updateBookingStatusVars).then((response) => {
  const data = response.data;
  console.log(data.booking_update);
});
```

### Using `UpdateBookingStatus`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateBookingStatusRef, UpdateBookingStatusVariables } from '@dataconnect/generated';

// The `UpdateBookingStatus` mutation requires an argument of type `UpdateBookingStatusVariables`:
const updateBookingStatusVars: UpdateBookingStatusVariables = {
  id: ..., 
  status: ..., 
};

// Call the `updateBookingStatusRef()` function to get a reference to the mutation.
const ref = updateBookingStatusRef(updateBookingStatusVars);
// Variables can be defined inline as well.
const ref = updateBookingStatusRef({ id: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateBookingStatusRef(dataConnect, updateBookingStatusVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.booking_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.booking_update);
});
```

## AssignProvider
You can execute the `AssignProvider` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
assignProvider(vars: AssignProviderVariables): MutationPromise<AssignProviderData, AssignProviderVariables>;

interface AssignProviderRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AssignProviderVariables): MutationRef<AssignProviderData, AssignProviderVariables>;
}
export const assignProviderRef: AssignProviderRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
assignProvider(dc: DataConnect, vars: AssignProviderVariables): MutationPromise<AssignProviderData, AssignProviderVariables>;

interface AssignProviderRef {
  ...
  (dc: DataConnect, vars: AssignProviderVariables): MutationRef<AssignProviderData, AssignProviderVariables>;
}
export const assignProviderRef: AssignProviderRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the assignProviderRef:
```typescript
const name = assignProviderRef.operationName;
console.log(name);
```

### Variables
The `AssignProvider` mutation requires an argument of type `AssignProviderVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AssignProviderVariables {
  bookingId: UUIDString;
  providerId: UUIDString;
}
```
### Return Type
Recall that executing the `AssignProvider` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AssignProviderData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AssignProviderData {
  booking_update?: Booking_Key | null;
}
```
### Using `AssignProvider`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, assignProvider, AssignProviderVariables } from '@dataconnect/generated';

// The `AssignProvider` mutation requires an argument of type `AssignProviderVariables`:
const assignProviderVars: AssignProviderVariables = {
  bookingId: ..., 
  providerId: ..., 
};

// Call the `assignProvider()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await assignProvider(assignProviderVars);
// Variables can be defined inline as well.
const { data } = await assignProvider({ bookingId: ..., providerId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await assignProvider(dataConnect, assignProviderVars);

console.log(data.booking_update);

// Or, you can use the `Promise` API.
assignProvider(assignProviderVars).then((response) => {
  const data = response.data;
  console.log(data.booking_update);
});
```

### Using `AssignProvider`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, assignProviderRef, AssignProviderVariables } from '@dataconnect/generated';

// The `AssignProvider` mutation requires an argument of type `AssignProviderVariables`:
const assignProviderVars: AssignProviderVariables = {
  bookingId: ..., 
  providerId: ..., 
};

// Call the `assignProviderRef()` function to get a reference to the mutation.
const ref = assignProviderRef(assignProviderVars);
// Variables can be defined inline as well.
const ref = assignProviderRef({ bookingId: ..., providerId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = assignProviderRef(dataConnect, assignProviderVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.booking_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.booking_update);
});
```

## UpdateUserProfile
You can execute the `UpdateUserProfile` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateUserProfile(vars: UpdateUserProfileVariables): MutationPromise<UpdateUserProfileData, UpdateUserProfileVariables>;

interface UpdateUserProfileRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateUserProfileVariables): MutationRef<UpdateUserProfileData, UpdateUserProfileVariables>;
}
export const updateUserProfileRef: UpdateUserProfileRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateUserProfile(dc: DataConnect, vars: UpdateUserProfileVariables): MutationPromise<UpdateUserProfileData, UpdateUserProfileVariables>;

interface UpdateUserProfileRef {
  ...
  (dc: DataConnect, vars: UpdateUserProfileVariables): MutationRef<UpdateUserProfileData, UpdateUserProfileVariables>;
}
export const updateUserProfileRef: UpdateUserProfileRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateUserProfileRef:
```typescript
const name = updateUserProfileRef.operationName;
console.log(name);
```

### Variables
The `UpdateUserProfile` mutation requires an argument of type `UpdateUserProfileVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateUserProfileVariables {
  id: UUIDString;
  name?: string | null;
  phoneNumber?: string | null;
  avatarUrl?: string | null;
  address?: string | null;
}
```
### Return Type
Recall that executing the `UpdateUserProfile` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateUserProfileData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateUserProfileData {
  user_update?: User_Key | null;
}
```
### Using `UpdateUserProfile`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateUserProfile, UpdateUserProfileVariables } from '@dataconnect/generated';

// The `UpdateUserProfile` mutation requires an argument of type `UpdateUserProfileVariables`:
const updateUserProfileVars: UpdateUserProfileVariables = {
  id: ..., 
  name: ..., // optional
  phoneNumber: ..., // optional
  avatarUrl: ..., // optional
  address: ..., // optional
};

// Call the `updateUserProfile()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateUserProfile(updateUserProfileVars);
// Variables can be defined inline as well.
const { data } = await updateUserProfile({ id: ..., name: ..., phoneNumber: ..., avatarUrl: ..., address: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateUserProfile(dataConnect, updateUserProfileVars);

console.log(data.user_update);

// Or, you can use the `Promise` API.
updateUserProfile(updateUserProfileVars).then((response) => {
  const data = response.data;
  console.log(data.user_update);
});
```

### Using `UpdateUserProfile`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateUserProfileRef, UpdateUserProfileVariables } from '@dataconnect/generated';

// The `UpdateUserProfile` mutation requires an argument of type `UpdateUserProfileVariables`:
const updateUserProfileVars: UpdateUserProfileVariables = {
  id: ..., 
  name: ..., // optional
  phoneNumber: ..., // optional
  avatarUrl: ..., // optional
  address: ..., // optional
};

// Call the `updateUserProfileRef()` function to get a reference to the mutation.
const ref = updateUserProfileRef(updateUserProfileVars);
// Variables can be defined inline as well.
const ref = updateUserProfileRef({ id: ..., name: ..., phoneNumber: ..., avatarUrl: ..., address: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateUserProfileRef(dataConnect, updateUserProfileVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_update);
});
```

## UpdateUserRole
You can execute the `UpdateUserRole` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateUserRole(vars: UpdateUserRoleVariables): MutationPromise<UpdateUserRoleData, UpdateUserRoleVariables>;

interface UpdateUserRoleRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateUserRoleVariables): MutationRef<UpdateUserRoleData, UpdateUserRoleVariables>;
}
export const updateUserRoleRef: UpdateUserRoleRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateUserRole(dc: DataConnect, vars: UpdateUserRoleVariables): MutationPromise<UpdateUserRoleData, UpdateUserRoleVariables>;

interface UpdateUserRoleRef {
  ...
  (dc: DataConnect, vars: UpdateUserRoleVariables): MutationRef<UpdateUserRoleData, UpdateUserRoleVariables>;
}
export const updateUserRoleRef: UpdateUserRoleRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateUserRoleRef:
```typescript
const name = updateUserRoleRef.operationName;
console.log(name);
```

### Variables
The `UpdateUserRole` mutation requires an argument of type `UpdateUserRoleVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateUserRoleVariables {
  id: UUIDString;
  role: string;
}
```
### Return Type
Recall that executing the `UpdateUserRole` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateUserRoleData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateUserRoleData {
  user_update?: User_Key | null;
}
```
### Using `UpdateUserRole`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateUserRole, UpdateUserRoleVariables } from '@dataconnect/generated';

// The `UpdateUserRole` mutation requires an argument of type `UpdateUserRoleVariables`:
const updateUserRoleVars: UpdateUserRoleVariables = {
  id: ..., 
  role: ..., 
};

// Call the `updateUserRole()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateUserRole(updateUserRoleVars);
// Variables can be defined inline as well.
const { data } = await updateUserRole({ id: ..., role: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateUserRole(dataConnect, updateUserRoleVars);

console.log(data.user_update);

// Or, you can use the `Promise` API.
updateUserRole(updateUserRoleVars).then((response) => {
  const data = response.data;
  console.log(data.user_update);
});
```

### Using `UpdateUserRole`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateUserRoleRef, UpdateUserRoleVariables } from '@dataconnect/generated';

// The `UpdateUserRole` mutation requires an argument of type `UpdateUserRoleVariables`:
const updateUserRoleVars: UpdateUserRoleVariables = {
  id: ..., 
  role: ..., 
};

// Call the `updateUserRoleRef()` function to get a reference to the mutation.
const ref = updateUserRoleRef(updateUserRoleVars);
// Variables can be defined inline as well.
const ref = updateUserRoleRef({ id: ..., role: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateUserRoleRef(dataConnect, updateUserRoleVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_update);
});
```

## AddReview
You can execute the `AddReview` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
addReview(vars: AddReviewVariables): MutationPromise<AddReviewData, AddReviewVariables>;

interface AddReviewRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddReviewVariables): MutationRef<AddReviewData, AddReviewVariables>;
}
export const addReviewRef: AddReviewRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
addReview(dc: DataConnect, vars: AddReviewVariables): MutationPromise<AddReviewData, AddReviewVariables>;

interface AddReviewRef {
  ...
  (dc: DataConnect, vars: AddReviewVariables): MutationRef<AddReviewData, AddReviewVariables>;
}
export const addReviewRef: AddReviewRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the addReviewRef:
```typescript
const name = addReviewRef.operationName;
console.log(name);
```

### Variables
The `AddReview` mutation requires an argument of type `AddReviewVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AddReviewVariables {
  rating: number;
  comment: string;
  createdAt: TimestampString;
  partnerId: UUIDString;
}
```
### Return Type
Recall that executing the `AddReview` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AddReviewData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AddReviewData {
  review_insert: Review_Key;
}
```
### Using `AddReview`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, addReview, AddReviewVariables } from '@dataconnect/generated';

// The `AddReview` mutation requires an argument of type `AddReviewVariables`:
const addReviewVars: AddReviewVariables = {
  rating: ..., 
  comment: ..., 
  createdAt: ..., 
  partnerId: ..., 
};

// Call the `addReview()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await addReview(addReviewVars);
// Variables can be defined inline as well.
const { data } = await addReview({ rating: ..., comment: ..., createdAt: ..., partnerId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await addReview(dataConnect, addReviewVars);

console.log(data.review_insert);

// Or, you can use the `Promise` API.
addReview(addReviewVars).then((response) => {
  const data = response.data;
  console.log(data.review_insert);
});
```

### Using `AddReview`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, addReviewRef, AddReviewVariables } from '@dataconnect/generated';

// The `AddReview` mutation requires an argument of type `AddReviewVariables`:
const addReviewVars: AddReviewVariables = {
  rating: ..., 
  comment: ..., 
  createdAt: ..., 
  partnerId: ..., 
};

// Call the `addReviewRef()` function to get a reference to the mutation.
const ref = addReviewRef(addReviewVars);
// Variables can be defined inline as well.
const ref = addReviewRef({ rating: ..., comment: ..., createdAt: ..., partnerId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = addReviewRef(dataConnect, addReviewVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.review_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.review_insert);
});
```

## SeedData
You can execute the `SeedData` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
seedData(): MutationPromise<SeedDataData, undefined>;

interface SeedDataRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<SeedDataData, undefined>;
}
export const seedDataRef: SeedDataRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
seedData(dc: DataConnect): MutationPromise<SeedDataData, undefined>;

interface SeedDataRef {
  ...
  (dc: DataConnect): MutationRef<SeedDataData, undefined>;
}
export const seedDataRef: SeedDataRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the seedDataRef:
```typescript
const name = seedDataRef.operationName;
console.log(name);
```

### Variables
The `SeedData` mutation has no variables.
### Return Type
Recall that executing the `SeedData` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `SeedDataData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface SeedDataData {
  user_insertMany: User_Key[];
  serviceCategory_insertMany: ServiceCategory_Key[];
}
```
### Using `SeedData`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, seedData } from '@dataconnect/generated';


// Call the `seedData()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await seedData();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await seedData(dataConnect);

console.log(data.user_insertMany);
console.log(data.serviceCategory_insertMany);

// Or, you can use the `Promise` API.
seedData().then((response) => {
  const data = response.data;
  console.log(data.user_insertMany);
  console.log(data.serviceCategory_insertMany);
});
```

### Using `SeedData`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, seedDataRef } from '@dataconnect/generated';


// Call the `seedDataRef()` function to get a reference to the mutation.
const ref = seedDataRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = seedDataRef(dataConnect);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_insertMany);
console.log(data.serviceCategory_insertMany);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_insertMany);
  console.log(data.serviceCategory_insertMany);
});
```

