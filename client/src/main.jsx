import { createRoot } from 'react-dom/client'; // Use createRoot from react-dom/client
import App from './App.jsx';
import  "./Styles/home.css"
import 'leaflet/dist/leaflet.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const rootElement = document.getElementById('root'); // Get the root element
const root = createRoot(rootElement); // Create a root for rendering

root.render(<App />); // Render the App component
