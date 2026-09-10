import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import { MdEmail, MdAccessTime, MdLocationOn } from "react-icons/md";
import { FaPhoneAlt, FaPaperPlane } from "react-icons/fa";
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import toast from 'react-hot-toast';

const defaultIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const ContactAndLocation = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    website: ''
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.website) {
      return;
    }

    setLoading(true);

    const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    const { website, ...payload } = formData;

    toast.promise(
      emailjs.send(SERVICE_ID, TEMPLATE_ID, payload, PUBLIC_KEY),
      {
        loading: 'Sending your message...',
        success: 'Your message has been sent successfully!',
        error: 'Failed to send message. Please try again.',
      }
    )
    .then(() => {
      setFormData({ 
        name: '', 
        email: '', 
        phone: '', 
        subject: '', 
        message: '',
        website: ''
      });
    })
    .catch((error) => {
    })
    .finally(() => {
      setLoading(false);
    });
  };

  return (
    <section className="w-full bg-gradient-to-b from-[#fff3ef] via-white to-white py-12 md:py-16 px-4 md:px-8 font-sans antialiased text-stone-800">
      <div className="max-w-6xl mx-auto space-y-12 md:space-y-16">
        
        <div className="text-center space-y-3">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-stone-900">
            Contact Us
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          <div className="lg:col-span-4 bg-white border border-stone-100 rounded-3xl p-6 md:p-8 shadow-xl shadow-stone-200/40 flex flex-col justify-between space-y-8">
            <div className="space-y-3 md:space-y-4">
              <h3 className="text-lg md:text-xl font-bold text-stone-900">Contact Information</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Have questions or need help with your project? Our team is always ready to assist you.
              </p>
            </div>

            <div className="space-y-6 my-auto">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fff1ed] text-[#ff6b4a]">
                  <FaPhoneAlt className="h-4 w-4" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-stone-400 uppercase tracking-wider">Phone Number</span>
                  <p className="text-sm font-semibold text-stone-800 mt-0.5">+880 1306001646</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fff1ed] text-[#ff6b4a]">
                  <MdEmail className="h-5 w-5" />
                </div>
                <div className="overflow-hidden">
                  <span className="block text-xs font-bold text-stone-400 uppercase tracking-wider">Email Address</span>
                  <a href="mailto:support@edcare.com" className="text-sm font-semibold text-stone-800 hover:text-[#ff6b4a] transition-colors block truncate mt-0.5">
                    support@edcare.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fff1ed] text-[#ff6b4a]">
                  <MdAccessTime className="h-5 w-5" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-stone-400 uppercase tracking-wider">Opening Hour</span>
                  <p className="text-sm font-semibold text-stone-800 mt-0.5">Mon - Sat: 9:00 AM - 6:00 PM</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fff1ed] text-[#ff6b4a]">
                  <MdLocationOn className="h-5 w-5" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-stone-400 uppercase tracking-wider">Our Location</span>
                  <p className="text-sm font-semibold text-stone-800 mt-0.5">Road-13, Sector-7, Uttara, Dhaka</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 bg-[#fffaf7] border border-[#ffeedd]/60 rounded-3xl p-6 md:p-10 shadow-sm relative overflow-hidden">
            <div className="space-y-6 max-w-2xl">
              <div className="space-y-2">
                <span className="inline-block text-[10px] font-bold uppercase tracking-wider bg-white text-[#ff6b4a] px-3 py-1 rounded-full border border-[#ff6b4a]/10">
                  🔸 Get in Touch
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-stone-900">Get In Touch</h2>
                <p className="text-xs text-stone-500 leading-relaxed">
                  We would love to hear about your project. Fill out the form and our team will get back to you shortly.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }} aria-hidden="true">
                  <label htmlFor="contact-website">Website</label>
                  <input
                    type="text"
                    id="contact-website"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    tabIndex="-1"
                    autoComplete="off"
                  />
                </div>

                <div>
                  <label htmlFor="contact-name" className="sr-only">Name</label>
                  <input 
                    type="text" 
                    id="contact-name"
                    name="name"
                    placeholder="Name" 
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full h-12 px-4 rounded-xl border border-stone-200/80 bg-white focus:outline-none focus:border-[#ff6b4a] focus:ring-1 focus:ring-[#ff6b4a] text-sm transition-all"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="contact-email" className="sr-only">Email Address</label>
                  <input 
                    type="email" 
                    id="contact-email"
                    name="email"
                    placeholder="Email Address" 
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full h-12 px-4 rounded-xl border border-stone-200/80 bg-white focus:outline-none focus:border-[#ff6b4a] focus:ring-1 focus:ring-[#ff6b4a] text-sm transition-all"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="contact-phone" className="sr-only">Phone Number</label>
                  <input 
                    type="text" 
                    id="contact-phone"
                    name="phone"
                    placeholder="Phone Number" 
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full h-12 px-4 rounded-xl border border-stone-200/80 bg-white focus:outline-none focus:border-[#ff6b4a] focus:ring-1 focus:ring-[#ff6b4a] text-sm transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="contact-subject" className="sr-only">Service/Business Inquiry Type</label>
                  <select 
                    id="contact-subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full h-12 px-4 rounded-xl border border-stone-200/80 bg-white focus:outline-none focus:border-[#ff6b4a] text-sm text-stone-700 transition-all"
                  >
                    <option value="" disabled >Service/Business Inquiries</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Digital Marketing">Digital Marketing</option>
                    <option value="General Support">General Support</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="contact-message" className="sr-only">Message</label>
                  <textarea 
                    id="contact-message"
                    name="message"
                    placeholder="Message" 
                    rows="4" 
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full p-4 rounded-xl border border-stone-200/80 bg-white focus:outline-none focus:border-[#ff6b4a] focus:ring-1 focus:ring-[#ff6b4a] text-sm transition-all resize-none"
                    required
                  />
                </div>

                <div className="md:col-span-2 pt-2">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-[#ff6b4a] hover:bg-[#e05333] text-white font-semibold text-xs uppercase tracking-wider px-6 h-12 rounded-xl md:rounded-full transition-all duration-300 shadow-md cursor-pointer shadow-[#ff6b4a]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>{loading ? 'Sending...' : 'Send Message'}</span>
                    <FaPaperPlane className="text-[10px]" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="space-y-6 md:space-y-8 pt-6 relative z-0">
          <div className="text-center space-y-3">
            <span className="inline-flex items-center gap-1.5 bg-[#fff1ed] text-[#ff6b4a] px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider">
              📍 Our Location
            </span>
            <h2 className="text-xl md:text-3xl font-extrabold tracking-tight text-stone-900 max-w-xl mx-auto">
              Visit Our Office For In-person Meetings And Consultations
            </h2>
          </div>

          <div className="w-full h-[300px] md:h-[400px] rounded-3xl overflow-hidden border border-stone-200/60 shadow-lg relative bg-stone-50 z-0">
            <MapContainer 
              center={[23.8713, 90.3972]} 
              zoom={16} 
              scrollWheelZoom={false} 
              className="h-full w-full z-0"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[23.8713, 90.3972]} icon={defaultIcon}>
                <Popup minWidth={160}>
                  <div className="p-1 text-center font-sans">
                    <h4 className="text-stone-900 font-bold text-sm m-0">EdCare</h4>
                    <p className="text-xs text-stone-600 m-0 mt-1">Sector-7, Uttara, Dhaka</p>
                  </div>
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>

      </div>
    </section>
  );
};

export default ContactAndLocation;