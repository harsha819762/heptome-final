const servicesData = [
  {
    id: 1,
    category: "Women's Salon & Spa",
    icon: "💆‍♀️",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400",
    rating: 4.8,
    totalBookings: "4M+",
    services: [
      { id: 101, name: "Full Body Waxing", price: 299, 
        duration: "45 min", rating: 4.8, reviews: 12000,
        image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400",
        description: "Professional waxing service at your doorstep" },
      { id: 102, name: "Facial Cleanup", price: 599, 
        duration: "60 min", rating: 4.7, reviews: 9500,
        image: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=400",
        description: "Deep cleansing facial for glowing skin" },
      { id: 103, name: "Full Body Massage", price: 999, 
        duration: "90 min", rating: 4.9, reviews: 15000,
        image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400",
        description: "Relaxing full body massage by experts" }
    ]
  },
  {
    id: 2, category: "Men's Salon & Massage", icon: "💈",
    image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400",
    rating: 4.7, totalBookings: "3M+",
    services: [
      { id: 201, name: "Haircut & Styling", price: 199, duration: "30 min", rating: 4.7, reviews: 20000, image: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=400", description: "Trendy haircut by professional stylists" },
      { id: 202, name: "Head Massage", price: 399, duration: "45 min", rating: 4.8, reviews: 8000, image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400", description: "Relaxing head massage to relieve stress" }
    ]
  },
  {
    id: 3, category: "AC Repair & Service", icon: "❄️",
    image: "https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?w=400",
    rating: 4.6, totalBookings: "2M+",
    services: [
      { id: 301, name: "AC Service & Cleaning", price: 399, duration: "60 min", rating: 4.6, reviews: 25000, image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400", description: "Complete AC cleaning and servicing" },
      { id: 302, name: "AC Repair", price: 599, duration: "90 min", rating: 4.5, reviews: 18000, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400", description: "Expert AC repair and gas refilling" }
    ]
  },
  {
    id: 4, category: "Cleaning & Pest Control", icon: "🧹",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400",
    rating: 4.7, totalBookings: "1.5M+",
    services: [
      { id: 401, name: "Home Deep Cleaning", price: 1499, duration: "4 hrs", rating: 4.7, reviews: 30000, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400", description: "Complete home deep cleaning service" },
      { id: 402, name: "Cockroach Control", price: 699, duration: "2 hrs", rating: 4.6, reviews: 12000, image: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=400", description: "Professional cockroach pest control" }
    ]
  },
  {
    id: 5, category: "Electrician", icon: "⚡",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400",
    rating: 4.8, totalBookings: "2M+",
    services: [
      { id: 501, name: "Fan Installation", price: 149, duration: "30 min", rating: 4.8, reviews: 40000, image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400", description: "Quick and safe fan installation" },
      { id: 502, name: "Switchboard Repair", price: 199, duration: "30 min", rating: 4.7, reviews: 22000, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400", description: "Expert switchboard repair and replacement" }
    ]
  },
  {
    id: 6, category: "Plumber", icon: "🔧",
    image: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400",
    rating: 4.6, totalBookings: "1.8M+",
    services: [
      { id: 601, name: "Tap/Faucet Repair", price: 149, duration: "30 min", rating: 4.6, reviews: 18000, image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400", description: "Quick tap and faucet repair" },
      { id: 602, name: "Pipe Leakage Fix", price: 299, duration: "45 min", rating: 4.5, reviews: 15000, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400", description: "Permanent fix for pipe leakages" }
    ]
  }
]

const professionalsData = [
  { id: 1, name: "Rahul Sharma", photo: "https://randomuser.me/api/portraits/men/1.jpg", rating: 4.9, experience: "5 years", completedJobs: 1200, specialty: "Women's Salon", price: 350, availability: true, city: "Mumbai" },
  { id: 2, name: "Priya Singh", photo: "https://randomuser.me/api/portraits/women/2.jpg", rating: 4.8, experience: "3 years", completedJobs: 850, specialty: "Spa & Massage", price: 400, availability: true, city: "Delhi" },
  { id: 3, name: "Arjun Verma", photo: "https://randomuser.me/api/portraits/men/3.jpg", rating: 4.7, experience: "7 years", completedJobs: 2100, specialty: "AC Repair", price: 500, availability: false, city: "Bangalore" },
  { id: 4, name: "Neha Gupta", photo: "https://randomuser.me/api/portraits/women/4.jpg", rating: 4.9, experience: "4 years", completedJobs: 980, specialty: "Cleaning", price: 300, availability: true, city: "Mumbai" },
  { id: 5, name: "Amit Kumar", photo: "https://randomuser.me/api/portraits/men/5.jpg", rating: 4.6, experience: "6 years", completedJobs: 1500, specialty: "Electrician", price: 450, availability: true, city: "Hyderabad" }
]

export { servicesData, professionalsData }
