/*
  Central location data store.
  To pull from an API, replace the static `locations` array with a
  useState + useEffect fetch — the shape of each object matches what
  Aaron's backend will return; only the source changes.

  Fields used by Locations.jsx: slug, name, address, city, status
  Fields used by LocationDetail.jsx: all of the above plus everything below
*/

const defaultFeatures = [
  "10′ × 10′ insulated overhead door",
  'LED lighting throughout',
  '100A electrical service',
  'Polished concrete floors',
  'Drive-in lot — full truck and trailer access',
  '24/7 keypad entry',
  'Exterior security cameras',
  'Insulated walls and ceiling',
]

const defaultExtras = [
  { item: 'Additional Parking Space', included: false, notes: 'Available upon request' },
  { item: '200A Panel Upgrade', included: false, notes: 'Tenant expense — contact manager' },
  { item: 'Compressed Air Stub-Out', included: false, notes: 'Contact manager for availability' },
  { item: 'Mezzanine Storage', included: false, notes: 'Select units only' },
]

function buildAvailability(status) {
  const base = [
    { unit: '101', type: 'Standard Bay', sqft: 750 },
    { unit: '102', type: 'Standard Bay', sqft: 750 },
    { unit: '103', type: 'Large Bay', sqft: 1000 },
    { unit: '104', type: 'Large Bay', sqft: 1000 },
    { unit: '105', type: 'XL Bay', sqft: 1500 },
  ]
  if (status === 'Full') {
    return base.map(u => ({ ...u, rent: '—', status: 'Occupied' }))
  }
  if (status === 'Coming Soon') {
    return base.map(u => ({ ...u, rent: 'TBD', status: 'Coming Soon' }))
  }
  // Available — first two units open
  return base.map((u, i) => ({
    ...u,
    rent: i < 2 ? `$${Math.round(u.sqft * 0.85)}/mo` : '—',
    status: i < 2 ? 'Available' : 'Occupied',
  }))
}

export const locations = [
  {
    slug: 'garage-1',
    name: 'Garage 1',
    address: '636 E Dennis Ave',
    city: 'Olathe',
    state: 'KS',
    zip: '66061',
    status: 'Full',
    phone: '',
    email: 'info@contractorgarage.com',
    description:
      'Our original Olathe location and the property that proved the Contractor Garage model. Filled before construction was even complete using private pre-leasing, Garage 1 opened in 2008 and has remained fully occupied ever since. It serves as the blueprint — in both design and economics — for every project that followed.',
    features: defaultFeatures,
    units: [
      { type: 'Standard Bay', sqft: 750, count: 8 },
      { type: 'Large Bay', sqft: 1000, count: 4 },
    ],
    availability: buildAvailability('Full'),
    extras: defaultExtras,
    videos: [],
    mapQuery: '636 E Dennis Ave, Olathe, KS 66061',
  },
  {
    slug: 'garage-2',
    name: 'Garage 2',
    address: '15735 S US-169 Hwy',
    city: 'Olathe',
    state: 'KS',
    zip: '66062',
    status: 'Full',
    phone: '',
    email: 'info@contractorgarage.com',
    description:
      'Located along US-169, Garage 2 serves contractors and tradespeople across the southern Olathe corridor. High-visibility frontage on a major artery makes this a convenient base of operations for mobile service businesses.',
    features: defaultFeatures,
    units: [
      { type: 'Standard Bay', sqft: 750, count: 6 },
      { type: 'Large Bay', sqft: 1000, count: 6 },
    ],
    availability: buildAvailability('Full'),
    extras: defaultExtras,
    videos: [],
    mapQuery: '15735 S US-169 Hwy, Olathe, KS',
  },
  {
    slug: 'garage-3',
    name: 'Garage 3',
    address: '14100 Santa Fe Trail Dr',
    city: 'Lenexa',
    state: 'KS',
    zip: '66215',
    status: 'Full',
    phone: '',
    email: 'info@contractorgarage.com',
    description:
      'Our first expansion into Lenexa, serving the dense corridor of trade businesses operating between the I-35 and K-10 interchange. Easily accessible from major Lenexa industrial clusters.',
    features: defaultFeatures,
    units: [
      { type: 'Standard Bay', sqft: 750, count: 8 },
      { type: 'Large Bay', sqft: 1200, count: 4 },
    ],
    availability: buildAvailability('Full'),
    extras: defaultExtras,
    videos: [],
    mapQuery: '14100 Santa Fe Trail Dr, Lenexa, KS',
  },
  {
    slug: 'garage-4',
    name: 'Garage 4',
    address: '8400 W 127th St',
    city: 'Overland Park',
    state: 'KS',
    zip: '66213',
    status: 'Full',
    phone: '',
    email: 'info@contractorgarage.com',
    description:
      'Strategically located in Overland Park near 127th and Metcalf, Garage 4 draws tenants from across the southern Johnson County market — landscapers, electricians, HVAC contractors, and restoration specialists.',
    features: defaultFeatures,
    units: [
      { type: 'Standard Bay', sqft: 800, count: 6 },
      { type: 'Large Bay', sqft: 1100, count: 4 },
    ],
    availability: buildAvailability('Full'),
    extras: defaultExtras,
    videos: [],
    mapQuery: '8400 W 127th St, Overland Park, KS',
  },
  {
    slug: 'garage-5',
    name: 'Garage 5',
    address: '15811 S Mahaffie St',
    city: 'Olathe',
    state: 'KS',
    zip: '66062',
    status: 'Full',
    phone: '',
    email: 'info@contractorgarage.com',
    description:
      'Tucked into the industrial corridor along Mahaffie, Garage 5 provides excellent truck-and-trailer access for contractors who need to move equipment between jobs quickly. Multiple overhead doors and a spacious staging lot.',
    features: defaultFeatures,
    units: [
      { type: 'Standard Bay', sqft: 750, count: 8 },
      { type: 'Large Bay', sqft: 1000, count: 4 },
    ],
    availability: buildAvailability('Full'),
    extras: defaultExtras,
    videos: [],
    mapQuery: '15811 S Mahaffie St, Olathe, KS',
  },
  {
    slug: 'garage-6',
    name: 'Garage 6',
    address: '9501 NE 76th St',
    city: 'Kansas City',
    state: 'MO',
    zip: '64158',
    status: 'Full',
    phone: '',
    email: 'info@contractorgarage.com',
    description:
      'Our first Missouri location, bringing the Contractor Garage model across the state line to serve the north KC market. Positioned near the I-435 corridor for easy access to the metro.',
    features: defaultFeatures,
    units: [
      { type: 'Standard Bay', sqft: 750, count: 6 },
      { type: 'Large Bay', sqft: 1000, count: 6 },
    ],
    availability: buildAvailability('Full'),
    extras: defaultExtras,
    videos: [],
    mapQuery: '9501 NE 76th St, Kansas City, MO',
  },
  {
    slug: 'garage-7',
    name: 'Garage 7',
    address: '817 E Park St',
    city: 'Olathe',
    state: 'KS',
    zip: '66061',
    status: 'Full',
    phone: '',
    email: 'info@contractorgarage.com',
    description:
      'Centrally located in Olathe proper, Garage 7 serves the dense trade business population that calls downtown Olathe home. Walking distance to city hall and the county courthouse — ideal for licensed contractors.',
    features: defaultFeatures,
    units: [
      { type: 'Standard Bay', sqft: 750, count: 8 },
      { type: 'Large Bay', sqft: 1000, count: 4 },
    ],
    availability: buildAvailability('Full'),
    extras: defaultExtras,
    videos: [],
    mapQuery: '817 E Park St, Olathe, KS',
  },
  {
    slug: 'garage-8',
    name: 'Garage 8',
    address: '2107 E Kansas City Rd',
    city: 'Olathe',
    state: 'KS',
    zip: '66061',
    status: 'Full',
    phone: '',
    email: 'info@contractorgarage.com',
    description:
      'Located along Kansas City Road with strong regional connectivity, Garage 8 is a favorite among HVAC and plumbing contractors who service both Olathe and northern Johnson County.',
    features: defaultFeatures,
    units: [
      { type: 'Standard Bay', sqft: 750, count: 6 },
      { type: 'Large Bay', sqft: 1200, count: 4 },
    ],
    availability: buildAvailability('Full'),
    extras: defaultExtras,
    videos: [],
    mapQuery: '2107 E Kansas City Rd, Olathe, KS',
  },
  {
    slug: 'grandview',
    name: 'Grandview',
    address: '4310 E 142nd St',
    city: 'Grandview',
    state: 'MO',
    zip: '64030',
    status: 'Full',
    phone: '',
    email: 'info@contractorgarage.com',
    description:
      'The Grandview location opened to serve the south KC metro market, filling quickly with contractors serving the Belton-Raymore-Grandview triangle. Excellent freeway access and ample maneuvering room for large equipment trailers.',
    features: defaultFeatures,
    units: [
      { type: 'Standard Bay', sqft: 750, count: 8 },
      { type: 'Large Bay', sqft: 1000, count: 4 },
      { type: 'XL Bay', sqft: 1500, count: 2 },
    ],
    availability: buildAvailability('Full'),
    extras: defaultExtras,
    videos: [],
    mapQuery: '4310 E 142nd St, Grandview, MO',
  },
  {
    slug: 'topeka',
    name: 'Topeka',
    address: '660 NE Hwy 24',
    city: 'Topeka',
    state: 'KS',
    zip: '66608',
    status: 'Available',
    phone: '',
    email: 'info@contractorgarage.com',
    description:
      'The Topeka location marks Contractor Garage™\'s first move into the capital city market. Situated along the busy NE Highway 24 corridor, this facility offers excellent visibility and access for trade businesses serving the greater Topeka area. Several bays are currently available for immediate occupancy.',
    features: [
      ...defaultFeatures,
      'High-visibility NE Hwy 24 frontage',
      'Extra-large staging lot for heavy equipment',
    ],
    units: [
      { type: 'Standard Bay', sqft: 750, count: 8 },
      { type: 'Large Bay', sqft: 1000, count: 6 },
      { type: 'XL Bay', sqft: 1500, count: 2 },
    ],
    availability: buildAvailability('Available'),
    extras: defaultExtras,
    videos: [],
    mapQuery: '660 NE Hwy 24, Topeka, KS',
  },
  {
    slug: 'johnson-city',
    name: 'Johnson City',
    address: 'Collins Dr',
    city: 'Johnson City',
    state: 'TN',
    zip: '',
    status: 'Available',
    phone: '',
    email: 'info@contractorgarage.com',
    description:
      'Contractor Garage™\'s first Southeast expansion brings the model to the Tri-Cities market. Johnson City sits at the center of a fast-growing region with a strong trade workforce and a significant shortage of purpose-built contractor workspace. Units available now.',
    features: defaultFeatures,
    units: [
      { type: 'Standard Bay', sqft: 750, count: 10 },
      { type: 'Large Bay', sqft: 1000, count: 6 },
    ],
    availability: buildAvailability('Available'),
    extras: defaultExtras,
    videos: [],
    mapQuery: 'Collins Dr, Johnson City, TN',
  },
  {
    slug: 'spruce-st-industrial',
    name: 'Spruce St Industrial Suites',
    address: '1904 E Spruce St',
    city: 'Olathe',
    state: 'KS',
    zip: '66061',
    status: 'Available',
    phone: '',
    email: 'info@contractorgarage.com',
    description:
      'The Spruce St Industrial Suites bring a refined take on the Contractor Garage model to central Olathe. Wider bays and upgraded finishes make this an excellent fit for restoration, detailing, and car collection storage. Multiple units available now.',
    features: [
      ...defaultFeatures,
      'Wider 14′ overhead doors available in select units',
      'Upgraded LED showroom-quality lighting',
      'Epoxy floor finish option available',
    ],
    units: [
      { type: 'Standard Bay', sqft: 800, count: 6 },
      { type: 'Wide Bay', sqft: 1200, count: 6 },
      { type: 'XL Bay', sqft: 1500, count: 4 },
    ],
    availability: buildAvailability('Available'),
    extras: [
      ...defaultExtras,
      { item: 'Epoxy Floor Finish', included: false, notes: 'Tenant option — contact manager for pricing' },
    ],
    videos: [],
    mapQuery: '1904 E Spruce St, Olathe, KS',
  },
  {
    slug: 'glasgow-warehouse',
    name: 'Glasgow Warehouse',
    address: 'Pottstown',
    city: 'Pottstown',
    state: 'PA',
    zip: '',
    status: 'Available',
    phone: '',
    email: 'info@contractorgarage.com',
    description:
      'The Glasgow Warehouse in Pottstown, PA marks Contractor Garage™\'s first East Coast location. Serving the greater Philadelphia market and surrounding suburbs, this facility brings the proven Olathe model to one of the country\'s densest trade markets. Units available now.',
    features: defaultFeatures,
    units: [
      { type: 'Standard Bay', sqft: 750, count: 10 },
      { type: 'Large Bay', sqft: 1000, count: 6 },
      { type: 'XL Bay', sqft: 1500, count: 2 },
    ],
    availability: buildAvailability('Available'),
    extras: defaultExtras,
    videos: [],
    mapQuery: 'Pottstown, PA',
  },
  {
    slug: 'lawrence',
    name: 'Lawrence',
    address: 'Lawrence',
    city: 'Lawrence',
    state: 'KS',
    zip: '',
    status: 'Available',
    phone: '',
    email: 'info@contractorgarage.com',
    description:
      'The Lawrence location extends the Contractor Garage network west along the K-10 corridor, serving contractors in one of Kansas\'s fastest-growing communities. Site details are being finalized — contact us for early availability and pricing.',
    features: defaultFeatures,
    units: [
      { type: 'Standard Bay', sqft: 750, count: 8 },
      { type: 'Large Bay', sqft: 1000, count: 4 },
    ],
    availability: buildAvailability('Available'),
    extras: defaultExtras,
    videos: [],
    mapQuery: 'Lawrence, KS',
  },
  {
    slug: 'chesterfield',
    name: 'Chesterfield',
    address: 'Chesterfield',
    city: 'Chesterfield',
    state: 'MO',
    zip: '',
    status: 'Coming Soon',
    phone: '',
    email: 'info@contractorgarage.com',
    description:
      'The Chesterfield location will serve the west St. Louis market — an affluent, high-activity corridor with strong demand from landscaping, home services, and specialty contractors. Expected to open later this year. Add your name to the interest list.',
    features: defaultFeatures,
    units: [
      { type: 'Standard Bay', sqft: 750, count: 8 },
      { type: 'Large Bay', sqft: 1200, count: 6 },
    ],
    availability: buildAvailability('Coming Soon'),
    extras: defaultExtras,
    videos: [],
    mapQuery: 'Chesterfield, MO',
  },
  {
    slug: 'maryland-heights',
    name: 'Maryland Heights',
    address: 'Maryland Heights',
    city: 'Maryland Heights',
    state: 'MO',
    zip: '',
    status: 'Coming Soon',
    phone: '',
    email: 'info@contractorgarage.com',
    description:
      'Maryland Heights will be the second St. Louis metro location, positioned near the I-270/I-70 interchange to serve the densely populated north and west St. Louis trade market. Add your name to the interest list now.',
    features: defaultFeatures,
    units: [
      { type: 'Standard Bay', sqft: 750, count: 10 },
      { type: 'Large Bay', sqft: 1000, count: 6 },
    ],
    availability: buildAvailability('Coming Soon'),
    extras: defaultExtras,
    videos: [],
    mapQuery: 'Maryland Heights, MO',
  },
]

export function getLocationBySlug(slug) {
  return locations.find((l) => l.slug === slug) || null
}
