import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface BookingAddress {
  flatNo: string;
  street: string;
  city: string;
  pincode: string;
}

export interface BookingData {
  address: BookingAddress;
  date: string;
  timeSlot: string;
  professional: any | null;
  payment: string;
}

export interface BookingItem {
  id: string;
  items: any[];
  total: number;
  address: BookingAddress;
  date: string;
  timeSlot: string;
  professional: any;
  payment: string;
  status: "Upcoming" | "Completed" | "Cancelled";
  createdAt: string;
  review?: {
    rating: number;
    text: string;
    date: string;
  };
}

interface BookingState {
  bookingStep: number;
  bookingData: BookingData;
  bookings: BookingItem[];
  setBookingStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  resetSteps: () => void;
  setBookingField: (field: keyof BookingData, value: any) => void;
  confirmBooking: (cartItems: any[], totalAmount: number) => BookingItem;
  updateBookingStatus: (bookingId: string, status: BookingItem["status"]) => void;
  addBookingReview: (bookingId: string, rating: number, text: string) => void;
}

const INITIAL_BOOKING_DATA: BookingData = {
  address: { flatNo: "", street: "", city: "Mumbai", pincode: "" },
  date: "",
  timeSlot: "",
  professional: null,
  payment: "",
};

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      bookingStep: 1,
      bookingData: INITIAL_BOOKING_DATA,
      bookings: [],

      setBookingStep: (step) => set({ bookingStep: step }),

      nextStep: () => set((state) => ({ bookingStep: Math.min(state.bookingStep + 1, 5) })),

      prevStep: () => set((state) => ({ bookingStep: Math.max(state.bookingStep - 1, 1) })),

      resetSteps: () => set({ bookingStep: 1, bookingData: INITIAL_BOOKING_DATA }),

      setBookingField: (field, value) =>
        set((state) => ({
          bookingData: {
            ...state.bookingData,
            [field]: value,
          },
        })),

      confirmBooking: (cartItems, totalAmount) => {
        const bookingId = "US-" + Math.floor(100000 + Math.random() * 900000);
        const { bookingData, bookings } = get();
        const newBooking: BookingItem = {
          id: bookingId,
          items: cartItems,
          total: totalAmount,
          address: bookingData.address,
          date: bookingData.date,
          timeSlot: bookingData.timeSlot,
          professional: bookingData.professional,
          payment: bookingData.payment,
          status: "Upcoming",
          createdAt: new Date().toISOString(),
        };

        set({
          bookings: [newBooking, ...bookings],
        });

        return newBooking;
      },

      updateBookingStatus: (bookingId, status) =>
        set((state) => ({
          bookings: state.bookings.map((b) =>
            b.id === bookingId ? { ...b, status } : b
          ),
        })),

      addBookingReview: (bookingId, rating, text) =>
        set((state) => ({
          bookings: state.bookings.map((b) =>
            b.id === bookingId
              ? {
                  ...b,
                  review: {
                    rating,
                    text,
                    date: new Date().toISOString(),
                  },
                }
              : b
          ),
        })),
    }),
    {
      name: "heptome-booking-storage",
    }
  )
);
