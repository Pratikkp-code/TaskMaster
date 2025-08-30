import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
const port = process.env.PORT || 4004;

app.use(cors());
app.use(express.json());

app.post('/api/geocode', async (req, res) => {
  const { address } = req.body;
  if (!address) {
    return res.status(400).json({ msg: 'Address is required' });
  }

  const GEOCODING_API_URL = `https://maps.googleapis.com/maps/api/geocode/json`;

  try {
    const response = await axios.get(GEOCODING_API_URL, {
      params: {
        address: address,
        key : process.env.GOOGLE_GEOCODING_API_KEY,
      },
    });

    const data = response.data;

    if (data.status !== 'OK') {
      console.error('Google API returned an error status:', data.status);
      console.error('Google API error message:', data.error_message);

      return res.status(400).json({ 
        msg: `Geocoding failed: ${data.status}`, 
        googleError: data.error_message 
      });
    }


    if (!data.results[0]) {
      return res.status(404).json({ msg: 'Could not find coordinates for that address.' });
    }

    const location = data.results[0].geometry.location;
    res.json(location);

  } catch (err) {

    console.error('--- AXIOS CRASHED ---');
    if (err.response) {

      console.error('Error Data:', err.response.data);
      console.error('Error Status:', err.response.status);
      console.error('Error Headers:', err.response.headers);
    } else if (err.request) {

      console.error('Error Request:', err.request);
    } else {

      console.error('Error Message:', err.message);
    }

    res.status(500).send('Server Error');
  }
});

app.listen(port, () => {
  console.log(`Geo Service listening on port ${port}`);
});