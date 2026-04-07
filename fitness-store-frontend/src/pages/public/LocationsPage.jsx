import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Users,
  Star,
  Phone,
  Mail,
  Clock,
  Wifi,
  Droplet,
  Dumbbell,
  Activity,
  Flame,
  Heart,
  Navigation,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Rating from '../../components/ui/Rating';
import Modal from '../../components/ui/Modal';
import SEO from '../../components/seo/SEO';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const DEFAULT_CENTER = { lat: 40.7413, lng: -73.9892 };
const DEFAULT_ZOOM = 12;

let googleMapsScriptPromise;

const loadGoogleMapsScript = (apiKey) => {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Google Maps requires a browser environment.'));
  }

  if (window.google?.maps) {
    return Promise.resolve(window.google.maps);
  }

  if (googleMapsScriptPromise) {
    return googleMapsScriptPromise;
  }

  googleMapsScriptPromise = new Promise((resolve, reject) => {
    const existing = document.getElementById('google-maps-script');

    if (existing) {
      existing.addEventListener('load', () => resolve(window.google.maps));
      existing.addEventListener('error', () => reject(new Error('Google Maps script failed to load.')));
      return;
    }

    const script = document.createElement('script');
    script.id = 'google-maps-script';
    script.async = true;
    script.defer = true;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.onload = () => {
      if (window.google?.maps) {
        resolve(window.google.maps);
      } else {
        reject(new Error('Google Maps API loaded but maps object is unavailable.'));
      }
    };
    script.onerror = () => reject(new Error('Unable to load Google Maps API.'));
    document.head.appendChild(script);
  });

  return googleMapsScriptPromise;
};

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
    image: 'TS',
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
    image: 'EV',
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
    image: 'MT',
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
  'Sauna': <Flame size={18} />,
  'Childcare': <Users size={18} />,
  'WiFi': <Wifi size={18} />,
  'Weights': <Dumbbell size={18} />,
  'Cardio': <Activity size={18} />,
  'Studio': <Star size={18} />,
  'Lounge': <Heart size={18} />,
  'Cafe': <Star size={18} />,
};

const LocationsPage = () => {
  const navigate = useNavigate();
  const appUrl = import.meta.env.VITE_APP_URL || 'http://localhost:5173';
  const mapContainerRef = useRef(null);
  const googleMapRef = useRef(null);
  const googleMarkersRef = useRef([]);
  const infoWindowRef = useRef(null);
  const [userLocation, setUserLocation] = useState(null);
  const [gyms, setGyms] = useState(mockGyms);
  const [filteredGyms, setFilteredGyms] = useState(mockGyms);
  const [selectedGym, setSelectedGym] = useState(null);
  const [detailModal, setDetailModal] = useState(false);
  const [geoError, setGeoError] = useState('');
  const [mapError, setMapError] = useState('');
  const [mapReady, setMapReady] = useState(false);
  const [filters, setFilters] = useState({
    state: '',
    openNow: false,
    amenities: [],
    sort: 'distance',
  });

  const openDirections = (address) => {
    const query = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank', 'noopener,noreferrer');
  };

  // Geolocation
  const handleGeolocation = () => {
    setGeoError('');
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
            return { ...gym, distance: Number(distance.toFixed(1)) };
          });
          setGyms(updatedGyms);
        },
        () => setGeoError('Unable to access your location. Please allow location access and try again.')
      );
    } else {
      setGeoError('Geolocation is not supported by your browser.');
    }
  };

  // Filter gyms
  useEffect(() => {
    let filtered = [...gyms];

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
      filtered.sort((a, b) => Number(a.distance) - Number(b.distance));
    } else if (filters.sort === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    }

    setFilteredGyms(filtered);
  }, [filters, gyms]);

  const clearGoogleMapMarkers = useCallback(() => {
    googleMarkersRef.current.forEach((marker) => marker.setMap(null));
    googleMarkersRef.current = [];
  }, []);

  const renderGoogleMapMarkers = useCallback(() => {
    if (!mapReady || !googleMapRef.current || !window.google?.maps) return;

    clearGoogleMapMarkers();
    const bounds = new window.google.maps.LatLngBounds();

    filteredGyms.forEach((gym) => {
      const marker = new window.google.maps.Marker({
        position: { lat: gym.lat, lng: gym.lng },
        map: googleMapRef.current,
        title: gym.name,
        animation: window.google.maps.Animation.DROP,
      });

      marker.addListener('click', () => {
        setSelectedGym(gym);
        setDetailModal(true);

        if (!infoWindowRef.current) {
          infoWindowRef.current = new window.google.maps.InfoWindow();
        }

        infoWindowRef.current.setContent(
          `<div style="font-family:Segoe UI, Arial,sans-serif;max-width:190px;">
             <div style="font-weight:700;margin-bottom:4px;">${gym.name}</div>
             <div style="font-size:12px;color:#4b5563;margin-bottom:6px;">${gym.address}</div>
             <div style="font-size:12px;color:#0ea5e9;">${gym.distance} miles away</div>
           </div>`
        );
        infoWindowRef.current.open(googleMapRef.current, marker);
      });

      googleMarkersRef.current.push(marker);
      bounds.extend(marker.getPosition());
    });

    if (userLocation) {
      const userMarker = new window.google.maps.Marker({
        position: { lat: userLocation.lat, lng: userLocation.lng },
        map: googleMapRef.current,
        title: 'Your Location',
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          fillColor: '#0ea5e9',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
          scale: 8,
        },
      });

      googleMarkersRef.current.push(userMarker);
      bounds.extend(userMarker.getPosition());
    }

    if (!bounds.isEmpty()) {
      googleMapRef.current.fitBounds(bounds, 80);
      const listener = window.google.maps.event.addListenerOnce(
        googleMapRef.current,
        'bounds_changed',
        () => {
          if (googleMapRef.current.getZoom() > 14) {
            googleMapRef.current.setZoom(14);
          }
        }
      );
      return () => window.google.maps.event.removeListener(listener);
    }

    googleMapRef.current.setCenter(DEFAULT_CENTER);
    googleMapRef.current.setZoom(DEFAULT_ZOOM);
  }, [clearGoogleMapMarkers, filteredGyms, mapReady, userLocation]);

  useEffect(() => {
    let cancelled = false;

    const initializeMap = async () => {
      try {
        setMapError('');
        const maps = await loadGoogleMapsScript(GOOGLE_MAPS_API_KEY);
        if (cancelled || !mapContainerRef.current) return;

        googleMapRef.current = new maps.Map(mapContainerRef.current, {
          center: DEFAULT_CENTER,
          zoom: DEFAULT_ZOOM,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          zoomControl: true,
          styles: [
            { elementType: 'geometry', stylers: [{ color: '#0f172a' }] },
            { elementType: 'labels.text.stroke', stylers: [{ color: '#0f172a' }] },
            { elementType: 'labels.text.fill', stylers: [{ color: '#94a3b8' }] },
            { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1e293b' }] },
            { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0b3b54' }] },
            { featureType: 'poi', stylers: [{ visibility: 'off' }] },
          ],
        });

        setMapReady(true);
      } catch (err) {
        if (!cancelled) {
          setMapError('Google Maps failed to load. Please verify your API key and billing settings.');
        }
      }
    };

    initializeMap();

    return () => {
      cancelled = true;
      clearGoogleMapMarkers();
    };
  }, [clearGoogleMapMarkers]);

  useEffect(() => {
    renderGoogleMapMarkers();
  }, [renderGoogleMapMarkers]);

  useEffect(() => {
    if (!selectedGym || !googleMapRef.current || !window.google?.maps) return;

    const target = { lat: selectedGym.lat, lng: selectedGym.lng };
    googleMapRef.current.panTo(target);
    googleMapRef.current.setZoom(14);
  }, [selectedGym]);

  useEffect(() => {
    if (!mapReady || !window.google?.maps || !googleMapRef.current || !mapContainerRef.current) return;

    const observer = new ResizeObserver(() => {
      window.google.maps.event.trigger(googleMapRef.current, 'resize');
      renderGoogleMapMarkers();
    });

    observer.observe(mapContainerRef.current);
    return () => observer.disconnect();
  }, [mapReady, renderGoogleMapMarkers]);

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
            <span className="text-4xl font-bold tracking-[0.15em] text-white">{selectedGym.image}</span>
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
            <Button
              variant="primary"
              size="md"
              className="flex-1"
              onClick={() => {
                navigate('/join');
                setDetailModal(false);
              }}
            >
              Join This Club
            </Button>
            <Button
              variant="outline"
              size="md"
              className="flex-1"
              onClick={() => openDirections(selectedGym.address)}
            >
              View Club Page
            </Button>
          </div>
        </div>
      </Modal>
    );
  };

  return (
    <>
      <SEO
        title="Find a Gym Near You"
        description="Locate CrunchFit Pro gyms, view amenities, class highlights, and get directions on an interactive map."
        canonical={`${appUrl}/locations`}
      />
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

          {/* Header Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center justify-center"
          >
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
          {geoError && (
            <p className="mt-3 text-sm text-red-300">{geoError}</p>
          )}
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
                  <option value="distance" className="bg-white text-gray-900">Distance</option>
                  <option value="rating" className="bg-white text-gray-900">Highest Rating</option>
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
                    <motion.div
                      key={gym.id}
                      role="button"
                      tabIndex={0}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => handleSelectGym(gym)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          handleSelectGym(gym);
                        }
                      }}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent/50 ${
                        selectedGym?.id === gym.id
                          ? 'border-accent bg-accent/10'
                          : 'border-accent/20 bg-dark-navy/50 hover:border-accent/50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-accent to-secondary text-xs font-bold tracking-[0.12em] text-white cursor-none pointer-events-none">{gym.image}</span>
                        <div className="flex-1 pointer-events-none">
                          <h4 className="font-bold text-white mb-1">{gym.name}</h4>
                          <div className="flex items-center gap-1 mt-1 pointer-events-auto">
                            <Rating value={gym.rating} readonly size="sm" />
                            <span className="text-light-bg/60 text-xs">({gym.reviews})</span>
                          </div>
                          <p className="text-accent text-sm font-semibold mt-1">{gym.distance} miles away</p>
                        </div>
                      </div>
                    </motion.div>
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
          className="flex-1 h-[500px] lg:min-h-[calc(100vh-180px)]"
        >
          {mapError ? (
            <div className="w-full h-full flex items-center justify-center bg-dark-navy/70 border-l border-accent/20 px-6">
              <div className="text-center max-w-lg">
                <p className="text-red-300 font-semibold mb-2">Map could not be loaded</p>
                <p className="text-light-bg/70 text-sm mb-4">{mapError}</p>
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => window.location.reload()}
                >
                  Retry Map
                </Button>
              </div>
            </div>
          ) : (
            <div
              ref={mapContainerRef}
              className="w-full h-full border-l border-accent/20"
            />
          )}
        </motion.div>
      </div>

      {/* Gym Detail Modal */}
      <GymDetailModal />
      </motion.div>
    </>
  );
};

export default LocationsPage;
