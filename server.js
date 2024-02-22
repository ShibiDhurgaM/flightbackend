const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const stripeRoute = require("./routes/stripe");
const app = express();
const PORT = process.env.PORT || 5000;
const mongoURI = 'mongodb+srv://ShibiDhurga:20June2003@cluster0.gv5fqam.mongodb.net/Flights?retryWrites=true&w=majority';

app.use(express.json());
app.use(cors());

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'Flights',
});
const flightsSchema = new mongoose.Schema({
  flightNumber: String,
  departureAirport: {
    code: String,
    name: String,
    location: {
      city: String,
      country: String,
    },
  },
  arrivalAirport: {
    code: String,
    name: String,
    location: {
      city: String,
      country: String,
    },
  },
  departureDateTime: String,
  arrivalDateTime: String,
  economyFare: Number,
  businessFare: Number,
  premiumEconomyFare: Number,
  firstClassFare: Number,
});

const Flights = mongoose.model('Flights', flightsSchema, 'details');

app.get('/api/flights', async (req, res) => {
  try {
    const { departureCity, arrivalCity } = req.query;
    const filter = {};
    if (departureCity) {
      filter['departureAirport.location.city'] = departureCity;
    }
    if (arrivalCity) {
      filter['arrivalAirport.location.city'] = arrivalCity;
    }
    const flights = await Flights.find(filter);
    res.status(200).json({ success: true, flights });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/stripe", stripeRoute);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

