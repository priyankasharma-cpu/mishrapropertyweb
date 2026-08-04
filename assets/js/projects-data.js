// ============================================================================
// PROJECTS DATA
// ============================================================================
// SAMPLE DATA — replace every field below with your real projects.
// area     : the neighborhood/locality name (e.g. "Vijay Nagar", "Sector 3")
// city     : the city name EXACTLY as users would search it
//            (e.g. "Indore", "Pithampur", "Ujjain", "Dewas")
// location : auto-built from area + city below, don't set manually
// type     : must exactly match a <select> option -> "Luxury Villa" | "Apartment" | "Plot"
// priceCategory : must exactly match a <select> option text, OR
//                 the widest option ("₹50L - ₹5Cr+") which always matches
// bhk      : number used for the "2+ BHK / 3+ BHK" filter
// status   : "available" | "limited" | "soldout"
// detailLink : the real URL of that project's own detail page
//
// HOW CITY-LEVEL SEARCH WORKS:
// Searching "Indore" matches EVERY project whose city is Indore,
// no matter which area/locality it's in — they all show together
// in one popup. Same for "Pithampur", "Ujjain", "Dewas", etc.
// Searching an area name (e.g. "Vijay Nagar") narrows it down to
// just that locality. So just keep "city" accurate for every
// project and city-wide search works automatically.
const RAW_PROJECTS = [
    {
        id: 'greenfield-estate',
        name: 'Greenfield Estate',
        area: 'Vijay Nagar',
        city: 'Indore',
        image: 'assets/image/bgimage4.png',
        type: 'Luxury Villa',
        priceCategory: '₹50L - ₹1Cr',
        bhk: 3,
        rating: 4.6,
        status: 'available',
        visitTime: '10:00 AM – 6:00 PM',
        contactName: 'Rahul Sharma',
        contactPhone: '+919876543210',
        detailLink: 'project-details.html?id=greenfield-estate'
    },
    {
        id: 'sunrise-residency',
        name: 'Sunrise Residency',
        area: 'Rajendra Nagar',
        city: 'Indore',
        image: 'assets/image/bgimage2.png',
        type: 'Apartment',
        priceCategory: '₹20L - ₹50L',
        bhk: 2,
        rating: 4.3,
        status: 'limited',
        visitTime: '9:00 AM – 5:00 PM',
        contactName: 'Priya Verma',
        contactPhone: '+919876500001',
        detailLink: 'project-details.html?id=sunrise-residency'
    },
    {
        id: 'royal-orchid-plots',
        name: 'Royal Orchid Plots',
        area: 'Bypass Road',
        city: 'Indore',
        image: 'assets/image/unnamed.webp',
        type: 'Plot',
        priceCategory: '₹20L - ₹50L',
        bhk: 0,
        rating: 4.1,
        status: 'available',
        visitTime: '10:00 AM – 7:00 PM',
        contactName: 'Amit Joshi',
        contactPhone: '+919876500002',
        detailLink: 'project-details.html?id=royal-orchid-plots'
    },
    {
        id: 'industrial-heights',
        name: 'Industrial Heights',
        area: 'Sector 3',
        city: 'Pithampur',
        image: 'assets/image/Gemini_Generated_Image_aq3bzyaq3bzyaq3b.png',
        type: 'Plot',
        priceCategory: '₹50L - ₹1Cr',
        bhk: 0,
        rating: 4.4,
        status: 'available',
        visitTime: '9:30 AM – 6:00 PM',
        contactName: 'Vikas Patel',
        contactPhone: '+919876500003',
        detailLink: 'project-details.html?id=industrial-heights'
    },
    {
        id: 'pithampur-green-villas',
        name: 'Pithampur Green Villas',
        area: 'Sector 1',
        city: 'Pithampur',
        image: 'assets/image/bgimage4.png',
        type: 'Luxury Villa',
        priceCategory: '₹50L - ₹1Cr',
        bhk: 3,
        rating: 4.5,
        status: 'soldout',
        visitTime: '10:00 AM – 6:00 PM',
        contactName: 'Neha Rathore',
        contactPhone: '+919876500004',
        detailLink: 'project-details.html?id=pithampur-green-villas'
    },
    {
        id: 'blue-lagoon-apartments',
        name: 'Blue Lagoon Apartments',
        area: 'Rau',
        city: 'Indore',
        image: 'assets/image/bgimage2.png',
        type: 'Apartment',
        priceCategory: '₹50L - ₹1Cr',
        bhk: 3,
        rating: 4.2,
        status: 'available',
        visitTime: '9:00 AM – 6:00 PM',
        contactName: 'Sanjay Malviya',
        contactPhone: '+919876500005',
        detailLink: 'project-details.html?id=blue-lagoon-apartments'
    },
    {
        id: 'mahakal-vihar',
        name: 'Mahakal Vihar',
        area: 'Nanakheda',
        city: 'Ujjain',
        image: 'assets/image/bgimage4.png',
        type: 'Apartment',
        priceCategory: '₹20L - ₹50L',
        bhk: 2,
        rating: 4.0,
        status: 'available',
        visitTime: '9:00 AM – 5:30 PM',
        contactName: 'Deepak Trivedi',
        contactPhone: '+919876500006',
        detailLink: 'project-details.html?id=mahakal-vihar'
    },
    {
        id: 'dewas-industrial-plots',
        name: 'Dewas Industrial Plots',
        area: 'AB Road',
        city: 'Dewas',
        image: 'assets/image/unnamed.webp',
        type: 'Plot',
        priceCategory: '₹20L - ₹50L',
        bhk: 0,
        rating: 4.2,
        status: 'limited',
        visitTime: '10:00 AM – 6:00 PM',
        contactName: 'Ramesh Choudhary',
        contactPhone: '+919876500007',
        detailLink: 'project-details.html?id=dewas-industrial-plots'
    }
];

// location is always built as "Area, City" so both area-level search
// ("Vijay Nagar") and city-level search ("Indore") work correctly.
const PROJECTS = RAW_PROJECTS.map(p => ({
    ...p,
    location: `${p.area}, ${p.city}`
}));