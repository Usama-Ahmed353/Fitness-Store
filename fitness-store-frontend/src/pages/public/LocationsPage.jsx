import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import {
  MapPin,
  Star,
  Phone,
  Mail,
  Clock,
  Wifi,
  Droplet,
  Dumbbell,
  Heart,
  ArrowRight,
  Navigation,
  Search as SearchIcon,
  ChevronDown,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import Rating from '../../components/ui/Rating';
import Modal from '../../components/ui/Modal';

// Fix leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Mock gym data
const mockGyms = [
  {
    id: 1,
    name: 'Crunch Times Square',
    address: '1450 Broadway, New York, NY 10036',
    phone: '(212) 555-0100',
    email: 'timessquare@crunch.com',
    rating: 4.8,
    reviews: 256,
    image: '🏋️',
    amenities: ['Pool', 'Sauna', 'Childcare', 'WiFi', 'Cardio'],
    hours: '5AM - 11PM',
    distance: 0.2,
    lat: 40.7549,
    lng: -73.9842,
    classes: [
      { name: 'Morning Spin', time: '6:00 AM', instructor: 'Lisa' },
      { name: 'Yoga Vibe', time: '10:00 AM', instructor: 'Marcus' },
      { name: 'Evening HIIT', time: '6:00 PM', instructor: 'Sarah' },
    ],
  },
  {
    id: 2,
    name: 'Crunch East Village',
    address: '404 Lafayette St, New York, NY 10003',
    phone: '(212) 555-0101',
    email: 'eastvillage@crunch.com',
    rating: 4.7,
    reviews: 189,
    image: '💪',
    amenities: ['Sauna', 'WiFi', 'Weights', 'Cardio', 'Studio'],
    hours: '6AM - 10PM',
    distance: 1.5,
    lat: 40.7291,
    lng: -73.9896,
    classes: [
      { name: 'Strength Training', time: '7:00 AM', instructor: 'James' },
      { name: 'F45', time: '5:30 PM', instructor: 'Emma' },
    ],
  },
  {
    id: 3,
    name: 'Crunch Midtown',
    address: '875 3rd Ave, New York, NY 10022',
    phone: '(212) 555-0102',
    email: 'midtown@crunch.com',
    rating: 4.9,
    reviews: 412,
    image: '🏃',
    amenities: ['Pool', 'Childcare', 'WiFi', 'Lounge', 'Cafe'],
    hours: '24/7',
    distance: 2.8,
    lat: 40.7539,
    lng: -73.9677,
    classes: [
      { name: 'Dance Cardio', time: '8:00 AM', instructor: 'Rosa' },
      { name: 'Boxing Basics', time: '4:00 PM', instructor: 'Tony' },
      { name: 'Night Yoga', time: '9:00 PM', instructor: 'Zara' },
    ],
  },
];

const amenityIcons = {
  'Pool': <Droplet size={18} />,
  'Sauna': '🌡️',
  'Childcare': '👶',
  'WiFi': <Wifi size={18} />,
  'Weights': <Dumbbell size={18} />,
  'Cardio': '🚴',
  'Studio': '🎬',
  'Lounge': '🛋️',
  'Cafe': '☕',
};

const LocationsPage = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const mapRef = useRef(null);
  const [userLocation, setUserLocation] = useState(null);
  const [gyms, setGyms] = useState(mockGyms);
  const [filteredGyms, setFilteredGyms] = useState(mockGyms);
  const [selectedGym, setSelectedGym] = useState(null);
  const [detailModal, setDetailModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [filters, setFilters] = useState({
    state: '',
    openNow: false,
    amenities: [],
    sort: 'distance',
  });

  // Geolocation
  const handleGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          
          // Update distances
          const updatedGyms = gyms.map((gym) => {
            const distance = Math.sqrt(
              Math.pow(gym.lat - latitude, 2) + Math.pow(gym.lng - longitude, 2)
            ) * 69; // Convert to miles
            return { ...gym, distance: distance.toFixed(1) };
          });
          setGyms(updatedGyms);
        },
        () => alert('Unable to get your location')
      );
    }
  };

  // Filter gyms
  useEffect(() => {
    let filtered = gyms;

    if (searchQuery) {
      filtered = filtered.filter((gym) =>
        gym.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        gym.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filters.openNow) {
      filtered = filtered.filter((gym) => gym.hours === '24/7');
    }

    if (filters.amenities.length > 0) {
      filtered = filtered.filter((gym) =>
        filters.amenities.every((amenity) => gym.amenities.includes(amenity))
      );
    }

    // Sort
    if (filters.sort === 'distance') {
      filtered.sort((a, b) => a.distance - b.distance);
    } else if (filters.sort === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    }

    setFilteredGyms(filtered);
  }, [searchQuery, filters, gyms]);

  const handleSelectGym = (gym) => {
    setSelectedGym(gym);
    setDetailModal(true);
  };

  const GymDetailModal = () => {
    if (!selectedGym) return null;

    return (
      <Modal
        isOpen={detailModal}
        onClose={() => setDetailModal(false)}
        title={selectedGym.name}
        size="lg"
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="relative h-48 bg-gradient-to-br from-accent/30 to-secondary/30 rounded-lg flex items-center justify-center">
            <span className="text-8xl">{selectedGym.image}</span>
          </div>

          {/* Rating */}
          <div className="flex items-center justify-between">
            <div>
              <Rating value={selectedGym.rating} readonly size="md" />
              <p className="text-light-bg/60 text-sm mt-1">{selectedGym.reviews} reviews</p>
            </div>
            <Badge variant="success">{selectedGym.distance} miles away</Badge>
          </div>

          {/* Contact Info */}
          <div className="space-y-3 border-t border-light-bg/10 pt-6">
            <div className="flex items-center gap-3">
              <MapPin size={18} className="text-accent" />
              <span className="text-light-bg/80">{selectedGym.address}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone size={18} className="text-accent" />
              <span className="text-light-bg/80">{selectedGym.phone}</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail size={18} className="text-accent" />
              <span className="text-light-bg/80">{selectedGym.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock size={18} className="text-accent" />
              <span className="text-light-bg/80">{selectedGym.hours}</span>
            </div>
          </div>

          {/* Amenities */}
          <div className="border-t border-light-bg/10 pt-6">
            <h4 className="font-bold text-white mb-4">Amenities</h4>
            <div className="grid grid-cols-2 gap-3">
              {selectedGym.amenities.map((amenity, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  {amenityIcons[amenity]}
                  <span className="text-light-bg/80">{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Classes */}
          <div className="border-t border-light-bg/10 pt-6">
            <h4 className="font-bold text-white mb-4">Sample Classes</h4>
            <div className="space-y-2">
              {selectedGym.classes.map((cls, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-dark-navy/50 rounded-lg">
                  <div>
                    <p className="text-white font-semibold">{cls.name}</p>
                    <p className="text-light-bg/60 text-sm">with {cls.instructor}</p>
                  </div>
                  <span className="text-accent">{cls.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTAs */}
          <div className="flex gap-3 pt-6 border-t border-light-bg/10">
            <Button variant="primary" size="md" className="flex-1">
              Join This Club
            </Button>
            <Button variant="outline" size="md" className="flex-1">
              View Club Page
            </Button>
          </div>
        </div>
      </Modal>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-dark-navy"
    >
      {/* Header */}
      <section className="bg-gradient-to-b from-dark-navy via-dark-navy/95 to-dark-navy py-12 border-b border-accent/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              Find a Gym Near You
            </h1>
            <p className="text-light-bg/70">Over 400 locations across the US</p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="flex-1">
              <Input
                placeholder="Search by gym name or city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<SearchIcon size={18} />}
              />
            </div>
            <Button
              onClick={handleGeolocation}
              variant="secondary"
              size="md"
              className="min-w-max"
            >
              <Navigation size={18} />
              Use My Location
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row">
        {/* Left Panel - Filters & List */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full lg:w-96 bg-dark-navy/80 border-r border-accent/20 overflow-y-auto max-h-[calc(100vh-200px)] sticky top-0"
        >
          <div className="p-6 space-y-6">
            {/* Filters */}
            <div className="space-y-4">
              <h3 className="font-bold text-white text-lg">Filters</h3>

              {/* Open Now Toggle */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.openNow}
                  onChange={(e) => setFilters({ ...filters, openNow: e.target.checked })}
                  className="w-4 h-4 rounded bg-dark-navy/50 border border-accent/30 cursor-pointer"
                />
                <span className="text-light-bg/80">Open Now</span>
              </label>

              {/* Amenities */}
              <div>
                <label className="block text-light-bg/70 text-sm font-semibold mb-2">
                  Amenities
                </label>
                <div className="space-y-2">
                  {['Pool', 'Sauna', 'Childcare', 'WiFi', 'Weights'].map((amenity) => (
                    <label key={amenity} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.amenities.includes(amenity)}
                        onChange={(e) => {
                          const updated = e.target.checked
                            ? [...filters.amenities, amenity]
                            : filters.amenities.filter((a) => a !== amenity);
                          setFilters({ ...filters, amenities: updated });
                        }}
                        className="w-4 h-4 rounded bg-dark-navy/50 border border-accent/30"
                      />
                      <span className="text-light-bg/70 text-sm">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-light-bg/70 text-sm font-semibold mb-2">
                  Sort By
                </label>
                <select
                  value={filters.sort}
                  onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
                  className="w-full px-3 py-2 bg-dark-navy/50 border border-accent/30 text-light-bg rounded-lg focus:outline-none focus:border-accent"
                >
                  <option value="distance">Distance</option>
                  <option value="rating">Highest Rating</option>
                </select>
              </div>
            </div>

            {/* Gym List */}
            <div className="border-t border-accent/20 pt-6">
              <h3 className="font-bold text-white text-lg mb-4">
                {filteredGyms.length} Gyms Found
              </h3>
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                <AnimatePresence>
                  {filteredGyms.map((gym, idx) => (
                    <motion.button
                      key={gym.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => handleSelectGym(gym)}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                        selectedGym?.id === gym.id
                          ? 'border-accent bg-accent/10'
                          : 'border-accent/20 bg-dark-navy/50 hover:border-accent/50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{gym.image}</span>
                        <div className="flex-1">
                          <h4 className="font-bold text-white">{gym.name}</h4>
                          <div className="flex items-center gap-1 mt-1">
                            <Rating value={gym.rating} readonly size="sm" />
                            <span className="text-light-bg/60 text-xs">({gym.reviews})</span>
                          </div>
                          <p className="text-accent text-sm font-semibold">{gym.distance} miles away</p>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Panel - Map */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1 h-screen lg:h-auto"
        >
          <MapContainer
            center={userLocation || [40.7128, -74.006]}
            zoom={13}
            className="w-full h-full"
            ref={mapRef}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />
            {filteredGyms.map((gym) => (
              <Marker
                key={gym.id}
                position={[gym.lat, gym.lng]}
                eventHandlers={{
                  click: () => handleSelectGym(gym),
                }}
              >
                <Popup>
                  <div className="text-center">
                    <p className="font-bold">{gym.name}</p>
                    <Rating value={gym.rating} readonly size="sm" className="justify-center" />
                    <button
                      onClick={() => handleSelectGym(gym)}
                      className="mt-2 px-3 py-1 bg-accent text-white rounded text-sm"
                    >
                      View Details
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
            {userLocation && (
              <Marker
                position={[userLocation.lat, userLocation.lng]}
                icon={L.icon({
                  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-blue.png',
                  shadowUrl:
                    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
                  iconSize: [25, 41],
                  iconAnchor: [12, 41],
                  popupAnchor: [1, -34],
                  shadowSize: [41, 41],
                })}
              >
                <Popup>Your Location</Popup>
              </Marker>
            )}
          </MapContainer>
        </motion.div>
      </div>

      {/* Gym Detail Modal */}
      <GymDetailModal />
    </motion.div>
  );
};

export default LocationsPage;
