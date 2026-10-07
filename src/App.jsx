import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";

import "./App.css";
import { useEffect, useState } from "react";
import { getRooms } from "./roomService";


/* =========================================================
   RENT CALCULATION
========================================================= */

const getRoomRent = (room) => {
  const roomNumber = String(room.room || "");
  const sharing = String(room.sharing || "").toLowerCase();

  if (roomNumber === "G-03" || roomNumber === "G3") {
    return 8000;
  }

  if (roomNumber === "F-07" || roomNumber === "F7") {
    return 7500;
  }

  if (sharing.includes("3")) {
    return 7500;
  }

  if (sharing.includes("4")) {
    return 6500;
  }

  return 7500;
};


/* =========================================================
   ROOM DATA CONVERSION
========================================================= */

const convertRoomData = (room) => {
  const availableBeds = room.beds.filter(
    (bed) => bed.status === "available"
  ).length;

  let label = "AVAILABLE";

  if (availableBeds === 0) {
    label = "FULL";
  } else if (availableBeds < room.capacity) {
    label = "POPULAR";
  }

  return {
    floor: room.floor,
    room: room.roomNumber,
    sharing: `${room.capacity} Sharing`,
    beds: room.capacity,
    available: availableBeds,

    rent: getRoomRent({
      room: room.roomNumber,
      sharing: `${room.capacity} Sharing`,
    }),

    bedDetails: room.beds.map((bed) => ({
      bedNumber: bed.bedNumber,
      status: bed.status,
    })),

    label,
  };
};


/* =========================================================
   NAVBAR
========================================================= */

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="nav-container">

        <Link
          to="/"
          className="logo"
          onClick={() => setMenuOpen(false)}
        >
          <span className="logo-mark">S</span>

          <span>
            SPACE
            <small>PG FOR LADIES</small>
          </span>
        </Link>

        <button
          className="mobile-menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        <div
          className={`nav-links ${
            menuOpen ? "nav-open" : ""
          }`}
        >
          <Link to="/" onClick={() => setMenuOpen(false)}>
            Home
          </Link>

          <Link to="/rooms" onClick={() => setMenuOpen(false)}>
            Rooms
          </Link>

          <Link
            to="/availability"
            onClick={() => setMenuOpen(false)}
          >
            Availability
          </Link>

          <Link
            to="/facilities"
            onClick={() => setMenuOpen(false)}
          >
            Facilities
          </Link>

          <Link
            to="/gallery"
            onClick={() => setMenuOpen(false)}
          >
            Gallery
          </Link>

          <Link
            to="/contact"
            onClick={() => setMenuOpen(false)}
          >
            Contact
          </Link>

          <Link
            to="/register"
            className="mobile-register-link"
            onClick={() => setMenuOpen(false)}
          >
            Register / Join PG
          </Link>
        </div>

        <Link to="/register" className="nav-button">
          Join PG
          <span>→</span>
        </Link>

      </div>
    </nav>
  );
}


/* =========================================================
   PAGE
========================================================= */

function Page({ children }) {
  return (
    <>
      <Navbar />

      <main>
        {children}
      </main>

      <Footer />
    </>
  );
}


/* =========================================================
   HERO
========================================================= */

function Hero() {
  return (
    <section className="hero-section">

      <div className="hero-background-shape shape-one"></div>
      <div className="hero-background-shape shape-two"></div>

      <div className="hero-container">

        <div className="hero-content">

          <div className="premium-badge">
            <span className="badge-dot"></span>
            PREMIUM LADIES PG
          </div>

          <h1>
            Your Comfort.
            <br />
            <span>Your Space.</span>
            <br />
            Your Home.
          </h1>

          <p className="hero-description">
            Experience safe, comfortable and
            peaceful PG living designed specially
            for women in Bengaluru.
          </p>

          <div className="hero-buttons">

            <Link
              to="/register"
              className="primary-button large"
            >
              Register / Join PG
              <span>→</span>
            </Link>

            <Link
              to="/rooms"
              className="secondary-button large"
            >
              Explore Rooms
            </Link>

          </div>

          <div className="hero-trust">

            <div className="trust-item">
              <strong>32+</strong>
              <span>Beds</span>
            </div>

            <div className="trust-divider"></div>

            <div className="trust-item">
              <strong>10</strong>
              <span>Rooms</span>
            </div>

            <div className="trust-divider"></div>

            <div className="trust-item">
              <strong>24/7</strong>
              <span>Safe Living</span>
            </div>

          </div>

        </div>


        <div className="hero-visual">

          <div className="hero-main-card">

            <div className="hero-image-placeholder">

              <div className="hero-image-overlay">

                <span>SPACE PG</span>

                <strong>
                  A place you can
                  <br />
                  call home.
                </strong>

              </div>

            </div>

            <div className="hero-card-bottom">

              <div>
                <small>LOCATION</small>

                <strong>
                  KR Puram, Bengaluru
                </strong>
              </div>

              <div className="hero-location-icon">
                ↗
              </div>

            </div>

          </div>


          <div className="floating-card floating-card-top">

            <div className="floating-icon">
              ✓
            </div>

            <div>
              <strong>Safe & Secure</strong>
              <span>Women friendly</span>
            </div>

          </div>


          <div className="floating-card floating-card-bottom">

            <span className="live-dot"></span>

            <div>
              <strong>Live Availability</strong>
              <span>Check your bed</span>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
}


/* =========================================================
   STATS
========================================================= */

function Stats({ rooms }) {

  const totalBeds =
    rooms.reduce(
      (total, room) => total + room.beds,
      0
    );

  const availableBeds =
    rooms.reduce(
      (total, room) => total + room.available,
      0
    );

  const occupiedBeds =
    totalBeds - availableBeds;

  return (
    <section className="stats-section">

      <div className="stats-container">

        <div className="stat-card">
          <div className="stat-icon">⌂</div>

          <div>
            <strong>{rooms.length}</strong>
            <span>Premium Rooms</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">♙</div>

          <div>
            <strong>{totalBeds}</strong>
            <span>Total Beds</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">✓</div>

          <div>
            <strong>{availableBeds}</strong>
            <span>Beds Available</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">◉</div>

          <div>
            <strong>{occupiedBeds}</strong>
            <span>Beds Occupied</span>
          </div>
        </div>

      </div>

    </section>
  );
}


/* =========================================================
   ROOM CARD
========================================================= */

function RoomCard({ room }) {

  const isFull =
    room.available === 0;

  return (
    <div className="premium-room-card">

      <div className="room-card-image">

        <div className="room-number">
          {room.room}
        </div>

        <div
          className={`room-status ${
            isFull
              ? "status-full"
              : room.label === "POPULAR"
              ? "status-popular"
              : "status-available"
          }`}
        >
          <span></span>
          {room.label}
        </div>

        <div className="room-floor">
          {room.floor}
        </div>

      </div>


      <div className="room-card-content">

        <div className="room-card-title-row">

          <div>
            <span className="room-small-label">
              ROOM
            </span>

            <h3>{room.room}</h3>
          </div>

          <div className="sharing-badge">
            {room.sharing}
          </div>

        </div>


        <div className="room-rent-card">

          <div>
            <span>MONTHLY RENT</span>

            <strong>
              ₹{room.rent.toLocaleString("en-IN")}
            </strong>
          </div>

          <div className="rent-label">
            / month
          </div>

        </div>


        <div className="room-divider"></div>


        <div className="room-availability">

          <div>
            <span>Availability</span>

            <strong>
              {room.available}{" "}
              <small>
                of {room.beds} beds
              </small>
            </strong>
          </div>

          <div className="availability-progress">

            <div
              className="progress-bar"
              style={{
                width: `${
                  room.beds > 0
                    ? (room.available / room.beds) * 100
                    : 0
                }%`,
              }}
            ></div>

          </div>

        </div>


        <div className="bed-list">

          {room.bedDetails.map(
            (bed) => (

              <div
                key={bed.bedNumber}
                className={`bed-chip ${
                  bed.status === "available"
                    ? "bed-free"
                    : "bed-taken"
                }`}
              >
                <span>
                  Bed {bed.bedNumber}
                </span>

                {bed.status === "available"
                  ? "Available"
                  : "Occupied"}
              </div>

            )
          )}

        </div>


        {!isFull && (
          <Link
            to="/register"
            className="room-card-button"
          >
            Choose this room
            <span>→</span>
          </Link>
        )}

      </div>

    </div>
  );
}


/* =========================================================
   HOME
========================================================= */

function Home({ rooms }) {

  return (
    <Page>

      <Hero />

      <Stats rooms={rooms} />

      <section className="premium-section">

        <div className="section-top">

          <div>

            <div className="eyebrow">
              OUR ROOMS
            </div>

            <h2>
              Find Your Perfect Space
            </h2>

            <p>
              Comfortable rooms designed
              for peaceful and convenient
              living.
            </p>

          </div>

          <Link
            to="/rooms"
            className="outline-button"
          >
            View All Rooms →
          </Link>

        </div>


        <div className="room-grid-premium">

          {rooms
            .slice(0, 6)
            .map(
              (room) => (
                <RoomCard
                  key={room.room}
                  room={room}
                />
              )
            )}

        </div>

      </section>


      <WhyChooseUs />


      <section className="cta-section">

        <div className="cta-content">

          <div className="eyebrow light">
            READY TO JOIN?
          </div>

          <h2>
            Your new home is
            waiting for you.
          </h2>

          <p>
            Check our live availability
            and choose your preferred
            room and bed.
          </p>

          <Link
            to="/register"
            className="cta-button"
          >
            Register / Join PG
            <span>→</span>
          </Link>

        </div>

      </section>

    </Page>
  );
}


/* =========================================================
   WHY CHOOSE US
========================================================= */

function WhyChooseUs() {

  const features = [
    {
      icon: "◈",
      title: "Safe Environment",
      text:
        "A secure and women-friendly environment where you can feel comfortable.",
    },
    {
      icon: "⌂",
      title: "Comfortable Rooms",
      text:
        "Clean, well-maintained rooms with comfortable beds and essential facilities.",
    },
    {
      icon: "◎",
      title: "Great Location",
      text:
        "Conveniently located near Garden City University, KR Puram, Bengaluru.",
    },
    {
      icon: "✦",
      title: "Peaceful Living",
      text:
        "A calm and comfortable space designed for students and working women.",
    },
  ];

  return (
    <section className="premium-section feature-section">

      <div className="center-heading">

        <div className="eyebrow">
          WHY SPACE PG
        </div>

        <h2>
          Everything You Need
        </h2>

        <p>
          Designed around your comfort,
          safety and everyday needs.
        </p>

      </div>


      <div className="feature-grid-premium">

        {features.map(
          (feature) => (

            <div
              className="feature-card-premium"
              key={feature.title}
            >

              <div className="feature-icon">
                {feature.icon}
              </div>

              <h3>
                {feature.title}
              </h3>

              <p>
                {feature.text}
              </p>

              <span className="feature-arrow">
                →
              </span>

            </div>

          )
        )}

      </div>

    </section>
  );
}


/* =========================================================
   ROOMS PAGE
========================================================= */

function Rooms({ rooms }) {

  return (
    <Page>

      <section className="page-hero">

        <div className="eyebrow">
          OUR ROOMS
        </div>

        <h1>
          Rooms & Sharing
        </h1>

        <p>
          Choose a comfortable room
          that suits your lifestyle.
        </p>

      </section>


      <section className="premium-section page-section">

        <div className="room-grid-premium">

          {rooms.map(
            (room) => (
              <RoomCard
                key={room.room}
                room={room}
              />
            )
          )}

        </div>

      </section>

    </Page>
  );
}


/* =========================================================
   AVAILABILITY
========================================================= */

function Availability({ rooms }) {

  return (
    <Page>

      <section className="page-hero availability-hero">

        <div className="eyebrow">
          LIVE AVAILABILITY
        </div>

        <h1>
          Find Your Available Bed
        </h1>

        <p>
          Live room and bed availability
          directly from Space PG.
        </p>

      </section>


      <section className="premium-section page-section">

        <div className="room-grid-premium">

          {rooms.map(
            (room) => (
              <RoomCard
                key={room.room}
                room={room}
              />
            )
          )}

        </div>


        <div className="availability-cta">

          <h2>
            Found your room?
          </h2>

          <p>
            Register now and select
            your available bed.
          </p>

          <Link
            to="/register"
            className="primary-button"
          >
            Register / Join PG →
          </Link>

        </div>

      </section>

    </Page>
  );
}


/* =========================================================
   FACILITIES
========================================================= */

function Facilities() {

  const facilities = [
    {
      icon: "⌁",
      title: "High-Speed Wi-Fi",
      text:
        "Reliable internet connectivity for study, work and entertainment.",
    },
    {
      icon: "◈",
      title: "Security",
      text:
        "A safe and secure living environment designed especially for women.",
    },
    {
      icon: "✧",
      title: "Clean Rooms",
      text:
        "Well-maintained and hygienic living spaces.",
    },
    {
      icon: "≈",
      title: "Water Supply",
      text:
        "Regular water supply for comfortable everyday living.",
    },
    {
      icon: "⚡",
      title: "Power Backup",
      text:
        "Backup support for essential electricity requirements.",
    },
    {
      icon: "✦",
      title: "Housekeeping",
      text:
        "Clean and hygienic common surroundings.",
    },
  ];

  return (
    <Page>

      <section className="page-hero">

        <div className="eyebrow">
          FACILITIES
        </div>

        <h1>
          Everything For Comfortable Living
        </h1>

        <p>
          Thoughtful facilities that make
          everyday PG life easier.
        </p>

      </section>


      <section className="premium-section page-section">

        <div className="facility-grid-premium">

          {facilities.map(
            (facility) => (

              <div
                className="facility-card"
                key={facility.title}
              >

                <div className="facility-icon">
                  {facility.icon}
                </div>

                <h3>
                  {facility.title}
                </h3>

                <p>
                  {facility.text}
                </p>

              </div>

            )
          )}

        </div>

      </section>

    </Page>
  );
}


/* =========================================================
   GALLERY
========================================================= */

function Gallery() {

  return (
    <Page>

      <section className="page-hero">

        <div className="eyebrow">
          GALLERY
        </div>

        <h1>
          Space PG Gallery
        </h1>

        <p>
          Take a look at our rooms,
          common spaces and facilities.
        </p>

      </section>


      <section className="premium-section page-section">

        <div className="gallery-grid-premium">

          <div className="gallery-card gallery-one">
            <div>
              <span>SPACE PG</span>
              <h3>Comfortable Rooms</h3>
            </div>
          </div>

          <div className="gallery-card gallery-two">
            <div>
              <span>SPACE PG</span>
              <h3>Common Areas</h3>
            </div>
          </div>

          <div className="gallery-card gallery-three">
            <div>
              <span>SPACE PG</span>
              <h3>Facilities</h3>
            </div>
          </div>

        </div>

      </section>

    </Page>
  );
}


/* =========================================================
   CONTACT
========================================================= */

function Contact() {

  return (
    <Page>

      <section className="page-hero">

        <div className="eyebrow">
          CONTACT US
        </div>

        <h1>
          Let's Talk
        </h1>

        <p>
          Have questions about rooms,
          availability or PG facilities?
        </p>

      </section>


      <section className="premium-section page-section">

        <div className="contact-grid">

          <div className="contact-main-card">

            <div className="contact-icon">
              ↗
            </div>

            <div className="eyebrow">
              SPACE PG FOR LADIES
            </div>

            <h2>
              Your next home
              could be here.
            </h2>

            <p>
              Visit or contact us to know
              more about available rooms,
              facilities and joining details.
            </p>

          </div>


          <div className="contact-details">

            <div className="contact-detail-card">

              <span>LOCATION</span>

              <strong>
                Near Garden City University
              </strong>

              <p>
                KR Puram, Bengaluru
              </p>

            </div>


            <div className="contact-detail-card">

              <span>OWNER</span>

              <strong>
                ANKIREDDY
              </strong>

              <a href="tel:9951127523">
                📞 9951127523
              </a>

            </div>


            <div className="contact-detail-card">

              <span>CONTACT</span>

              <strong>
                Srinivass Reddy
              </strong>

              <a href="tel:9492108555">
                📞 9492108555
              </a>

            </div>


            <div className="contact-detail-card">

              <span>AVAILABILITY</span>

              <strong>
                Check Live Beds
              </strong>

              <Link to="/availability">
                View Availability →
              </Link>

            </div>


            <div className="contact-detail-card">

              <span>JOIN US</span>

              <strong>
                Ready to move in?
              </strong>

              <Link to="/register">
                Register Now →
              </Link>

            </div>

          </div>

        </div>

      </section>

    </Page>
  );
}


/* =========================================================
   RESIDENT REGISTER
========================================================= */

function ResidentRegister({ rooms }) {

  const navigate = useNavigate();

  const [formData, setFormData] =
    useState({
      name: "",
      mobile: "",
      alternateNumber: "",
      roomNumber: "",
      bedNumber: "",
      joinedDate: "",
      monthlyRent: "",
    });

  const [aadhaarImage, setAadhaarImage] =
    useState(null);

  const [availableBeds, setAvailableBeds] =
    useState([]);

  const [selectedRent, setSelectedRent] =
    useState(0);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");


  const handleChange = (event) => {

    const {
      name,
      value,
    } = event.target;

    setFormData(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );
  };


  const handleRoomChange = (event) => {

    const roomNumber =
      event.target.value;

    const selectedRoom =
      rooms.find(
        (room) =>
          String(room.room) ===
          String(roomNumber)
      );

    const beds =
      selectedRoom
        ? selectedRoom.bedDetails.filter(
            (bed) =>
              bed.status === "available"
          )
        : [];

    const rent =
      selectedRoom
        ? selectedRoom.rent
        : 0;

    setFormData(
      (previous) => ({
        ...previous,
        roomNumber,
        bedNumber: "",
        monthlyRent: rent,
      })
    );

    setSelectedRent(rent);
    setAvailableBeds(beds);
  };


  const handleImageChange = (event) => {

    const file =
      event.target.files[0];

    if (!file) {
      setAadhaarImage(null);
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
    ];

    if (!allowedTypes.includes(file.type)) {

      alert(
        "Please upload JPG, JPEG or PNG image."
      );

      event.target.value = "";
      setAadhaarImage(null);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {

      alert(
        "Aadhaar image must be less than 5 MB."
      );

      event.target.value = "";
      setAadhaarImage(null);
      return;
    }

    setAadhaarImage(file);
  };


  const handleSubmit = async (event) => {

    event.preventDefault();

    setError("");

    if (!aadhaarImage) {
      setError(
        "Please upload your Aadhaar image."
      );
      return;
    }

    if (!formData.roomNumber) {
      setError("Please select a room.");
      return;
    }

    if (!formData.bedNumber) {
      setError("Please select a bed.");
      return;
    }

    setLoading(true);

    try {

      const formDataToSend =
        new FormData();

      Object.entries(formData)
        .forEach(
          ([key, value]) => {
            formDataToSend.append(
              key,
              value
            );
          }
        );

      formDataToSend.append(
        "monthlyRent",
        selectedRent
      );

      formDataToSend.append(
        "aadhaarImage",
        aadhaarImage
      );

      const response =
        await fetch(
          "http://localhost:5000/api/tenants/register",
          {
            method: "POST",
            body: formDataToSend,
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Registration failed"
        );
      }

      alert(
        "Registration successful! Welcome to Space PG for Ladies."
      );

      navigate("/");

    } catch (error) {

      console.error(
        "Registration error:",
        error
      );

      setError(
        error.message ||
        "Unable to register. Please try again."
      );

    } finally {

      setLoading(false);

    }
  };


  return (
    <Page>

      <section className="register-page">

        <div className="register-intro">

          <div className="eyebrow">
            SPACE PG FOR LADIES
          </div>

          <h1>
            Make Space
            <br />
            <span>Your Home.</span>
          </h1>

          <p>
            Complete your registration,
            choose your preferred room and
            available bed.
          </p>

          <div className="register-benefits">

            <div>
              <span>✓</span>
              Live bed availability
            </div>

            <div>
              <span>✓</span>
              Secure registration
            </div>

            <div>
              <span>✓</span>
              Women-friendly PG
            </div>

            <div>
              <span>✓</span>
              Automatic rent calculation
            </div>

          </div>

        </div>


        <div className="register-card">

          <div className="form-heading">

            <div>
              <span>STEP 01</span>

              <h2>
                Resident Registration
              </h2>
            </div>

            <div className="form-lock">
              🔒
            </div>

          </div>


          {error && (
            <div className="form-error">
              {error}
            </div>
          )}


          <form onSubmit={handleSubmit}>

            <div className="form-grid">

              <div className="form-group full">

                <label>
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />

              </div>


              <div className="form-group">

                <label>
                  Mobile Number
                </label>

                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="Mobile number"
                  required
                />

              </div>


              <div className="form-group">

                <label>
                  Alternate Number
                </label>

                <input
                  type="tel"
                  name="alternateNumber"
                  value={formData.alternateNumber}
                  onChange={handleChange}
                  placeholder="Alternate number"
                  required
                />

              </div>


              <div className="form-group">

                <label>
                  Select Room
                </label>

                <select
                  name="roomNumber"
                  value={formData.roomNumber}
                  onChange={handleRoomChange}
                  required
                >

                  <option value="">
                    Select available room
                  </option>

                  {rooms
                    .filter(
                      (room) =>
                        room.available > 0
                    )
                    .map(
                      (room) => (

                        <option
                          key={room.room}
                          value={room.room}
                        >
                          Room {room.room}
                          {" — "}
                          {room.sharing}
                          {" — ₹"}
                          {room.rent.toLocaleString("en-IN")}
                          {" / month"}
                        </option>

                      )
                    )}

                </select>

              </div>


              <div className="form-group">

                <label>
                  Select Bed
                </label>

                <select
                  name="bedNumber"
                  value={formData.bedNumber}
                  onChange={handleChange}
                  disabled={
                    !formData.roomNumber ||
                    availableBeds.length === 0
                  }
                  required
                >

                  <option value="">
                    Select available bed
                  </option>

                  {availableBeds.map(
                    (bed) => (
                      <option
                        key={bed.bedNumber}
                        value={bed.bedNumber}
                      >
                        Bed {bed.bedNumber}
                      </option>
                    )
                  )}

                </select>

              </div>


              <div className="form-group">

                <label>
                  Date You Came to PG
                </label>

                <input
                  type="date"
                  name="joinedDate"
                  value={formData.joinedDate}
                  onChange={handleChange}
                  required
                />

              </div>


              <div className="form-group">

                <label>
                  Monthly Rent
                </label>

                <div className="automatic-rent-box">

                  <span>₹</span>

                  <strong>
                    {selectedRent
                      ? selectedRent.toLocaleString("en-IN")
                      : "Select room"}
                  </strong>

                  {selectedRent && (
                    <small>
                      Auto assigned
                    </small>
                  )}

                </div>

              </div>


              <div className="form-group full">

                <label>
                  Aadhaar Card Image
                </label>

                <div className="upload-box">

                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                    onChange={handleImageChange}
                    required
                  />

                  <div className="upload-content">

                    <div className="upload-icon">
                      ↑
                    </div>

                    <strong>
                      {aadhaarImage
                        ? aadhaarImage.name
                        : "Upload Aadhaar image"}
                    </strong>

                    <span>
                      JPG, JPEG or PNG ·
                      Maximum 5 MB
                    </span>

                  </div>

                </div>

              </div>

            </div>


            <button
              type="submit"
              disabled={loading}
              className="submit-button"
            >
              {loading
                ? "Registering..."
                : "Complete Registration →"}
            </button>


            <button
              type="button"
              className="back-button"
              onClick={() => navigate("/")}
            >
              ← Back to Home
            </button>

          </form>

        </div>

      </section>

    </Page>
  );
}


/* =========================================================
   ADMIN LOGIN
========================================================= */

function AdminLogin() {

  const navigate = useNavigate();

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  const handleSubmit =
    async (event) => {

      event.preventDefault();

      setError("");
      setLoading(true);

      try {

        const response =
          await fetch(
            "http://localhost:5000/api/auth/login",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                username,
                password,
              }),
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
            "Login failed"
          );
        }

        localStorage.setItem(
          "space_pg_token",
          data.token
        );

        navigate(
          "/admin/dashboard"
        );

      } catch (error) {

        setError(
          error.message ||
          "Login failed"
        );

      } finally {

        setLoading(false);

      }
    };


  return (
    <Page>

      <section className="auth-page">

        <div className="auth-card">

          <div className="auth-logo">
            S
          </div>

          <div className="eyebrow">
            SPACE PG ADMIN
          </div>

          <h1>
            Welcome Back
          </h1>

          <p>
            Sign in to manage your
            PG residents and rooms.
          </p>


          {error && (
            <div className="form-error">
              {error}
            </div>
          )}


          <form onSubmit={handleSubmit}>

            <div className="form-group">

              <label>
                Username
              </label>

              <input
                type="text"
                value={username}
                onChange={(event) =>
                  setUsername(
                    event.target.value
                  )
                }
                placeholder="Enter username"
                required
              />

            </div>


            <div className="form-group">

              <label>
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(
                    event.target.value
                  )
                }
                placeholder="Enter password"
                required
              />

            </div>


            <button
              type="submit"
              disabled={loading}
              className="submit-button"
            >
              {loading
                ? "Logging in..."
                : "Login to Dashboard →"}
            </button>

          </form>

        </div>

      </section>

    </Page>
  );
}


/* =========================================================
   ADD TENANT
========================================================= */

function AddTenant({ rooms }) {

  const navigate = useNavigate();

  const [formData, setFormData] =
    useState({
      name: "",
      mobile: "",
      alternateNumber: "",
      roomNumber: "",
      bedNumber: "",
      joinedDate: "",
      monthlyRent: "",
      securityDeposit: "",
    });

  const [availableBeds, setAvailableBeds] =
    useState([]);

  const [selectedRent, setSelectedRent] =
    useState(0);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");


  const handleChange =
    (event) => {

      const {
        name,
        value,
      } = event.target;

      setFormData(
        (previous) => ({
          ...previous,
          [name]: value,
        })
      );
    };


  const handleRoomChange =
    (event) => {

      const roomNumber =
        event.target.value;

      const selectedRoom =
        rooms.find(
          (room) =>
            String(room.room) ===
            String(roomNumber)
        );

      const beds =
        selectedRoom
          ? selectedRoom.bedDetails.filter(
              (bed) =>
                bed.status ===
                "available"
            )
          : [];

      const rent =
        selectedRoom
          ? selectedRoom.rent
          : 0;

      setFormData(
        (previous) => ({
          ...previous,
          roomNumber,
          bedNumber: "",
          monthlyRent: rent,
        })
      );

      setSelectedRent(rent);
      setAvailableBeds(beds);
    };


  const handleSubmit =
    async (event) => {

      event.preventDefault();

      setError("");
      setLoading(true);

      try {

        const token =
          localStorage.getItem(
            "space_pg_token"
          );

        const response =
          await fetch(
            "http://localhost:5000/api/tenants",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`,
              },

              body: JSON.stringify({

                name:
                  formData.name,

                mobile:
                  formData.mobile,

                alternateNumber:
                  formData.alternateNumber,

                roomNumber:
                  formData.roomNumber,

                bedNumber:
                  formData.bedNumber,

                joinedDate:
                  formData.joinedDate,

                monthlyRent:
                  selectedRent,

                securityDeposit:
                  formData.securityDeposit || 0,

              }),
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
            "Failed to add tenant"
          );
        }

        alert(
          "Tenant added successfully!"
        );

        navigate(
          "/admin/dashboard"
        );

      } catch (error) {

        setError(
          error.message ||
          "Unable to add tenant"
        );

      } finally {

        setLoading(false);

      }
    };


  return (
    <Page>

      <section className="admin-form-page">

        <div className="admin-form-header">

          <div className="eyebrow">
            ADMIN PANEL
          </div>

          <h1>
            Add Tenant
          </h1>

          <p>
            Add a new resident and assign
            their room and bed.
          </p>

        </div>


        <div className="admin-form-card">

          {error && (
            <div className="form-error">
              {error}
            </div>
          )}


          <form onSubmit={handleSubmit}>

            <div className="form-grid">

              <div className="form-group">

                <label>Name</label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />

              </div>


              <div className="form-group">

                <label>Mobile</label>

                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  required
                />

              </div>


              <div className="form-group">

                <label>
                  Alternate Number
                </label>

                <input
                  type="tel"
                  name="alternateNumber"
                  value={formData.alternateNumber}
                  onChange={handleChange}
                  required
                />

              </div>


              <div className="form-group">

                <label>Room</label>

                <select
                  name="roomNumber"
                  value={formData.roomNumber}
                  onChange={handleRoomChange}
                  required
                >

                  <option value="">
                    Select Room
                  </option>

                  {rooms
                    .filter(
                      (room) =>
                        room.available > 0
                    )
                    .map(
                      (room) => (

                        <option
                          key={room.room}
                          value={room.room}
                        >
                          Room {room.room}
                          {" — ₹"}
                          {room.rent.toLocaleString("en-IN")}
                        </option>

                      )
                    )}

                </select>

              </div>


              <div className="form-group">

                <label>Bed</label>

                <select
                  name="bedNumber"
                  value={formData.bedNumber}
                  onChange={handleChange}
                  disabled={
                    availableBeds.length === 0
                  }
                  required
                >

                  <option value="">
                    Select Bed
                  </option>

                  {availableBeds.map(
                    (bed) => (

                      <option
                        key={bed.bedNumber}
                        value={bed.bedNumber}
                      >
                        Bed {bed.bedNumber}
                      </option>

                    )
                  )}

                </select>

              </div>


              <div className="form-group">

                <label>
                  Joined Date
                </label>

                <input
                  type="date"
                  name="joinedDate"
                  value={formData.joinedDate}
                  onChange={handleChange}
                  required
                />

              </div>


              <div className="form-group">

                <label>
                  Monthly Rent
                </label>

                <div className="automatic-rent-box">

                  <span>₹</span>

                  <strong>
                    {selectedRent
                      ? selectedRent.toLocaleString("en-IN")
                      : "Select room"}
                  </strong>

                  {selectedRent && (
                    <small>
                      Automatically assigned
                    </small>
                  )}

                </div>

              </div>


              <div className="form-group">

                <label>
                  Security Deposit
                </label>

                <input
                  type="number"
                  name="securityDeposit"
                  value={formData.securityDeposit}
                  onChange={handleChange}
                  placeholder="Enter deposit"
                />

              </div>

            </div>


            <div className="form-actions">

              <button
                type="button"
                className="back-button"
                onClick={() =>
                  navigate(
                    "/admin/dashboard"
                  )
                }
              >
                Cancel
              </button>


              <button
                type="submit"
                disabled={loading}
                className="submit-button"
              >
                {loading
                  ? "Adding..."
                  : "Add Tenant →"}
              </button>

            </div>

          </form>

        </div>

      </section>

    </Page>
  );
}


/* =========================================================
   DASHBOARD STAT
========================================================= */

function DashStat({
  title,
  value,
  icon,
}) {

  return (
    <div className="dashboard-stat-card">

      <div className="dashboard-stat-icon">
        {icon}
      </div>

      <div>

        <span>
          {title}
        </span>

        <strong>
          {value}
        </strong>

      </div>

    </div>
  );
}


/* =========================================================
   ADMIN DASHBOARD
========================================================= */

function AdminDashboard({ rooms }) {

  const navigate =
    useNavigate();

  const [tenants, setTenants] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [paymentLoading, setPaymentLoading] =
    useState(null);

  /*
     NEW:
     Loading state for WhatsApp / UPI
  */
  const [onlinePaymentLoading, setOnlinePaymentLoading] =
    useState(null);


  /* =========================================================
     LOAD TENANTS
  ========================================================= */

  const loadTenants =
    async () => {

      try {

        const token =
          localStorage.getItem(
            "space_pg_token"
          );

        if (!token) {

          navigate("/admin");

          return;
        }

        const response =
          await fetch(
            "http://localhost:5000/api/tenants",
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        const data =
          await response.json();

        if (!response.ok) {

          throw new Error(
            data.message ||
            "Unable to load tenants"
          );
        }

        setTenants(
          data.tenants || []
        );

      } catch (error) {

        setError(
          error.message ||
          "Unable to load tenants"
        );

      } finally {

        setLoading(false);
      }
    };


  useEffect(() => {
    loadTenants();
  }, []);


  /* =========================================================
     BED CALCULATIONS
  ========================================================= */

  const totalBeds =
    rooms.reduce(
      (total, room) =>
        total + room.beds,
      0
    );

  const availableBeds =
    rooms.reduce(
      (total, room) =>
        total + room.available,
      0
    );

  const occupiedBeds =
    totalBeds - availableBeds;

  const occupancy =
    totalBeds > 0
      ? Math.round(
          (occupiedBeds / totalBeds) *
          100
        )
      : 0;


  /* =========================================================
     RENT PAYMENT UPDATE
  ========================================================= */

  const handleRentPayment =
    async (
      tenantId,
      isPaid
    ) => {

      try {

        setPaymentLoading(
          tenantId
        );

        const token =
          localStorage.getItem(
            "space_pg_token"
          );

        const response =
          await fetch(
            `http://localhost:5000/api/tenants/${tenantId}`,
            {
              method: "PUT",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`,
              },

              body: JSON.stringify({

                rentStatus:
                  isPaid
                    ? "paid"
                    : "not_paid",

                rentPaidDate:
                  isPaid
                    ? new Date().toISOString()
                    : null,

              }),
            }
          );

        const data =
          await response.json();

        if (!response.ok) {

          throw new Error(
            data.message ||
            "Unable to update rent status"
          );
        }


        /* Update screen immediately */

        setTenants(
          (previousTenants) =>
            previousTenants.map(
              (tenant) =>
                tenant._id === tenantId
                  ? {
                      ...tenant,

                      rentStatus:
                        isPaid
                          ? "paid"
                          : "not_paid",

                      rentPaidDate:
                        isPaid
                          ? new Date().toISOString()
                          : null,
                    }
                  : tenant
            )
        );


      } catch (error) {

        alert(
          error.message ||
          "Unable to update rent status"
        );

      } finally {

        setPaymentLoading(
          null
        );
      }
    };


  /* =========================================================
     NEW: CREATE PAYMENT LINKS
========================================================= */

  const getPaymentLinks =
    async (tenantId) => {

      const response =
        await fetch(
          `http://localhost:5000/api/tenants/${tenantId}/payment-link`
        );

      const data =
        await response.json();

      if (!response.ok) {

        throw new Error(
          data.message ||
          "Unable to create payment link."
        );
      }

      return data;
    };


  /* =========================================================
     NEW: WHATSAPP PAY RENT
========================================================= */

  const handleWhatsAppPayment =
    async (tenant) => {

      try {

        setOnlinePaymentLoading(
          tenant._id
        );

        const data =
          await getPaymentLinks(
            tenant._id
          );


        const whatsappLink =
          data.payment?.whatsappLink;


        if (!whatsappLink) {

          throw new Error(
            "WhatsApp payment link was not created."
          );

        }


        /*
           Open WhatsApp in a new tab.
        */

        window.open(
          whatsappLink,
          "_blank",
          "noopener,noreferrer"
        );


      } catch (error) {

        console.error(
          "WhatsApp payment error:",
          error
        );

        alert(
          error.message ||
          "Unable to open WhatsApp."
        );

      } finally {

        setOnlinePaymentLoading(
          null
        );

      }
    };


  /* =========================================================
     NEW: UPI PAY RENT
========================================================= */

  const handleUPIPayment =
    async (tenant) => {

      try {

        setOnlinePaymentLoading(
          tenant._id
        );

        const data =
          await getPaymentLinks(
            tenant._id
          );


        const paymentLink =
          data.payment?.paymentLink;


        if (!paymentLink) {

          throw new Error(
            "UPI payment link was not created."
          );

        }


        /*
           Open UPI payment app.

           On mobile this normally opens
           a UPI-supported application.

           On desktop it may not open
           anything if no UPI application
           is registered.
        */

        window.location.href =
          paymentLink;


      } catch (error) {

        console.error(
          "UPI payment error:",
          error
        );

        alert(
          error.message ||
          "Unable to open UPI payment."
        );

        setOnlinePaymentLoading(
          null
        );

      }

    };


  /* =========================================================
     LOGOUT
  ========================================================= */

  const handleLogout =
    () => {

      localStorage.removeItem(
        "space_pg_token"
      );

      navigate("/admin");
    };


  /* =========================================================
     DATE FORMAT
  ========================================================= */

  const formatPaymentDate =
    (date) => {

      if (!date) {
        return "";
      }

      return new Date(
        date
      ).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      );
    };


  return (
    <Page>

      <section className="dashboard-page">


        {/* =================================================
            HEADER
        ================================================= */}

        <div className="dashboard-header">

          <div>

            <div className="eyebrow">
              ADMIN PANEL
            </div>

            <h1>
              Space PG Dashboard
            </h1>

            <p>
              Manage rooms, beds and
              registered residents.
            </p>

          </div>


          <div className="dashboard-actions">

            <button
              className="submit-button"
              onClick={() =>
                navigate(
                  "/admin/tenants/add"
                )
              }
            >
              + Add Tenant
            </button>


            <button
              className="dashboard-logout"
              onClick={handleLogout}
            >
              Logout
            </button>

          </div>

        </div>


        {/* =================================================
            DASHBOARD STATS
        ================================================= */}

        <div className="dashboard-stats-grid">

          <DashStat
            title="Total Beds"
            value={totalBeds}
            icon="⌂"
          />

          <DashStat
            title="Occupied"
            value={occupiedBeds}
            icon="◉"
          />

          <DashStat
            title="Available"
            value={availableBeds}
            icon="✓"
          />

          <DashStat
            title="Occupancy"
            value={`${occupancy}%`}
            icon="%"
          />

        </div>


        {error && (
          <div className="form-error">
            {error}
          </div>
        )}


        {/* =================================================
            ROOM MANAGEMENT
        ================================================= */}

        <div className="dashboard-section-header">

          <div>

            <div className="eyebrow">
              ROOM MANAGEMENT
            </div>

            <h2>
              Room Status
            </h2>

          </div>

        </div>


        <div className="room-grid-premium">

          {rooms.map(
            (room) => (
              <RoomCard
                key={room.room}
                room={room}
              />
            )
          )}

        </div>


        {/* =================================================
            TENANTS
        ================================================= */}

        <div className="dashboard-section-header tenant-header">

          <div>

            <div className="eyebrow">
              RESIDENTS
            </div>

            <h2>
              Registered Tenants
            </h2>

          </div>

          <span className="tenant-count">
            {tenants.length} residents
          </span>

        </div>


        {loading ? (

          <div className="dashboard-empty">
            Loading tenants...
          </div>

        ) : tenants.length === 0 ? (

          <div className="dashboard-empty">

            <div className="empty-icon">
              ♙
            </div>

            <h3>
              No tenants registered yet
            </h3>

            <p>
              Registered residents will
              appear here.
            </p>

          </div>

        ) : (

          <div className="tenant-table-wrapper">

            <table className="tenant-table">

              <thead>

                <tr>

                  <th>Resident</th>
                  <th>Mobile</th>
                  <th>Alternate</th>
                  <th>Room</th>
                  <th>Bed</th>
                  <th>Rent</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Aadhaar</th>

                </tr>

              </thead>


              <tbody>

                {tenants.map(
                  (tenant) => {

                    const isPaid =
                      tenant.rentStatus ===
                      "paid";

                    const isUpdating =
                      paymentLoading ===
                      tenant._id;

                    const isOnlinePaymentLoading =
                      onlinePaymentLoading ===
                      tenant._id;


                    return (

                      <tr
                        key={
                          tenant._id
                        }
                      >


                        {/* RESIDENT */}

                        <td>

                          <div className="tenant-name">

                            <div className="tenant-avatar">

                              {tenant.name
                                ?.charAt(0)
                                ?.toUpperCase()}

                            </div>

                            <strong>
                              {tenant.name}
                            </strong>

                          </div>

                        </td>


                        {/* MOBILE */}

                        <td>
                          {tenant.mobile}
                        </td>


                        {/* ALTERNATE */}

                        <td>
                          {tenant.alternateNumber ||
                            "-"}
                        </td>


                        {/* ROOM */}

                        <td>

                          <span className="table-badge">
                            {tenant.roomNumber}
                          </span>

                        </td>


                        {/* BED */}

                        <td>
                          Bed {tenant.bedNumber}
                        </td>


                        {/* RENT */}

                        <td>

                          <strong>
                            ₹
                            {Number(
                              tenant.monthlyRent || 0
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </strong>

                          <small>
                            / month
                          </small>

                        </td>


                        {/* PAYMENT */}

                        <td>

                          <div className="rent-status-cell">

                            {isPaid ? (

                              <span
                                className="rent-status-pill rent-status-paid"
                              >
                                Paid
                              </span>

                            ) : (

                              <span
                                className="rent-status-pill rent-status-not-paid"
                              >
                                Not Paid
                              </span>

                            )}


                            {tenant.rentPaidDate &&
                              isPaid && (

                                <span className="rent-paid-date">

                                  {formatPaymentDate(
                                    tenant.rentPaidDate
                                  )}

                                </span>

                              )}


                            {/* =================================
                                WHATSAPP + UPI
                            ================================= */}

                            {!isPaid && (

                              <div className="online-payment-buttons">

                                <button
                                  type="button"
                                  className="rent-payment-button whatsapp-payment"
                                  disabled={
                                    isOnlinePaymentLoading ||
                                    isUpdating
                                  }
                                  onClick={() =>
                                    handleWhatsAppPayment(
                                      tenant
                                    )
                                  }
                                >
                                  {isOnlinePaymentLoading
                                    ? "Opening..."
                                    : "📱 WhatsApp → Pay Rent"}
                                </button>


                                <button
                                  type="button"
                                  className="rent-payment-button upi-payment"
                                  disabled={
                                    isOnlinePaymentLoading ||
                                    isUpdating
                                  }
                                  onClick={() =>
                                    handleUPIPayment(
                                      tenant
                                    )
                                  }
                                >
                                  {isOnlinePaymentLoading
                                    ? "Opening..."
                                    : "💳 Pay via UPI"}
                                </button>

                              </div>

                            )}


                            {/* =================================
                                MANUAL PAYMENT CONFIRMATION
                            ================================= */}

                            {isPaid ? (

                              <button
                                type="button"
                                className="rent-payment-button paid"
                                disabled={
                                  isUpdating
                                }
                                onClick={() =>
                                  handleRentPayment(
                                    tenant._id,
                                    false
                                  )
                                }
                              >
                                {isUpdating
                                  ? "Updating..."
                                  : "Mark Not Paid"}
                              </button>

                            ) : (

                              <button
                                type="button"
                                className="rent-payment-button"
                                disabled={
                                  isUpdating ||
                                  isOnlinePaymentLoading
                                }
                                onClick={() =>
                                  handleRentPayment(
                                    tenant._id,
                                    true
                                  )
                                }
                              >
                                {isUpdating
                                  ? "Updating..."
                                  : "✓ Confirm Payment / Mark Paid"}
                              </button>

                            )}

                          </div>

                        </td>


                        {/* TENANT STATUS */}

                        <td>

                          <span
                            className={`status-pill ${
                              tenant.status ===
                              "active"
                                ? "active"
                                : "inactive"
                            }`}
                          >
                            {tenant.status}
                          </span>

                        </td>


                        {/* AADHAAR */}

                        <td>

                          <AadhaarButton
                            tenantId={
                              tenant._id
                            }
                          />

                        </td>

                      </tr>

                    );
                  }
                )}

              </tbody>

            </table>

          </div>

        )}

      </section>

    </Page>
  );
}


/* =========================================================
   AADHAAR BUTTON
========================================================= */

function AadhaarButton({
  tenantId,
}) {

  const [loading, setLoading] =
    useState(false);


  const handleView =
    async () => {

      try {

        setLoading(true);

        const token =
          localStorage.getItem(
            "space_pg_token"
          );

        const response =
          await fetch(
            `http://localhost:5000/api/tenants/${tenantId}/aadhaar`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        if (!response.ok) {

          const data =
            await response.json();

          throw new Error(
            data.message ||
            "Unable to view Aadhaar"
          );
        }

        const blob =
          await response.blob();

        const imageUrl =
          URL.createObjectURL(
            blob
          );

        window.open(
          imageUrl,
          "_blank"
        );

      } catch (error) {

        alert(
          error.message
        );

      } finally {

        setLoading(false);

      }
    };


  return (
    <button
      type="button"
      onClick={handleView}
      disabled={loading}
      className="aadhaar-button"
    >
      {loading
        ? "Loading..."
        : "View"}
    </button>
  );
}


/* =========================================================
   FOOTER
========================================================= */

function Footer() {

  return (
    <footer className="footer">

      <div className="footer-container">

        <div className="footer-brand">

          <Link
            to="/"
            className="footer-logo"
          >

            <span className="logo-mark">
              S
            </span>

            SPACE

          </Link>


          <p>
            Comfortable and safe
            PG accommodation
            designed for women.
          </p>


          <span className="footer-location">
            KR Puram, Bengaluru
          </span>

        </div>


        <div className="footer-column">

          <h4>
            Explore
          </h4>

          <Link to="/">
            Home
          </Link>

          <Link to="/rooms">
            Rooms
          </Link>

          <Link to="/availability">
            Availability
          </Link>

          <Link to="/facilities">
            Facilities
          </Link>

        </div>


        <div className="footer-column">

          <h4>
            Company
          </h4>

          <Link to="/gallery">
            Gallery
          </Link>

          <Link to="/contact">
            Contact
          </Link>

          <Link to="/register">
            Join PG
          </Link>

          <Link to="/admin">
            Admin Login
          </Link>

        </div>


        <div className="footer-cta">

          <span>
            CONTACT US
          </span>

          <h3>
            ANKIREDDY
          </h3>

          <a href="tel:9951127523">
            9951127523
          </a>

          <a href="tel:9492108555">
            9492108555
          </a>

          <Link to="/register">
            Register Now →
          </Link>

        </div>

      </div>


      <div className="footer-bottom">

        <span>
          © 2026 Space PG for Ladies.
        </span>

        <span>
          Made for comfortable living.
        </span>

      </div>

    </footer>
  );
}


/* =========================================================
   MAIN APP
========================================================= */

function App() {

  const [rooms, setRooms] =
    useState([]);

  const [loadingRooms, setLoadingRooms] =
    useState(true);

  const [roomError, setRoomError] =
    useState("");


  useEffect(() => {

    const loadRooms =
      async () => {

        try {

          setRoomError("");

          const data =
            await getRooms();

          const convertedRooms =
            data.map(
              convertRoomData
            );

          setRooms(
            convertedRooms
          );

        } catch (error) {

          console.error(
            "Failed to load rooms:",
            error
          );

          setRoomError(
            "Unable to load room availability. Please make sure the backend server is running."
          );

        } finally {

          setLoadingRooms(false);

        }
      };

    loadRooms();

  }, []);


  if (loadingRooms) {

    return (
      <div className="loading-screen">

        <div className="loading-logo">
          S
        </div>

        <h2>
          SPACE PG
        </h2>

        <p>
          Preparing your space...
        </p>

        <div className="loading-line"></div>

      </div>
    );
  }


  if (roomError) {

    return (
      <div className="error-screen">

        <div className="error-screen-card">

          <div className="error-icon">
            !
          </div>

          <h2>
            Space PG
          </h2>

          <p>
            {roomError}
          </p>

          <button
            onClick={() =>
              window.location.reload()
            }
            className="submit-button"
          >
            Try Again
          </button>

        </div>

      </div>
    );
  }


  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={
            <Home rooms={rooms} />
          }
        />

        <Route
          path="/rooms"
          element={
            <Rooms rooms={rooms} />
          }
        />

        <Route
          path="/availability"
          element={
            <Availability
              rooms={rooms}
            />
          }
        />

        <Route
          path="/facilities"
          element={
            <Facilities />
          }
        />

        <Route
          path="/gallery"
          element={
            <Gallery />
          }
        />

        <Route
          path="/contact"
          element={
            <Contact />
          }
        />

        <Route
          path="/register"
          element={
            <ResidentRegister
              rooms={rooms}
            />
          }
        />

        <Route
          path="/admin"
          element={
            <AdminLogin />
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <AdminDashboard
              rooms={rooms}
            />
          }
        />

        <Route
          path="/admin/tenants/add"
          element={
            <AddTenant
              rooms={rooms}
            />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}


export default App;