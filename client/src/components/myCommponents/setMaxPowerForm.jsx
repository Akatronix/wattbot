import React, { useState } from 'react';

// Basic styling to make the form look clean
const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    maxWidth: '500px',
    margin: '40px auto',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  },
  formGroup: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    padding: '8px',
    boxSizing: 'border-box',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  button: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  buttonDisabled: {
    backgroundColor: '#a0c3ff',
    cursor: 'not-allowed',
  },
  message: {
    marginTop: '15px',
    padding: '10px',
    borderRadius: '4px',
    textAlign: 'center',
  },
  success: { backgroundColor: '#d4edda', color: '#155724' },
  error: { backgroundColor: '#f8d7da', color: '#721c24' },
  info: { backgroundColor: '#d1ecf1', color: '#0c5460' },
};

const SetMaxPowerForm = () => {
  // State for form inputs
  const [socketId, setSocketId] = useState('6936b1004cdfcc09e6933449');
  const [maxPower, setMaxPower] = useState('');
  const [authToken, setAuthToken] = useState(''); // User should paste their token here

  // State for UI feedback
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success', 'error', 'info'

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form reload
    setIsLoading(true);
    setMessage(''); // Clear previous messages

    // Basic validation
    if (!socketId || !maxPower || !authToken) {
      setMessage('Please fill in all fields.');
      setMessageType('error');
      setIsLoading(false);
      return;
    }

    const apiUrl = `https://wattbot-server.vercel.app/api/sockets/setPower/${socketId}`;

    try {
      const response = await fetch(apiUrl, {
        method: 'PATCH', // Or 'PUT' depending on your API design
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`, // Include the Bearer token
        },
        body: JSON.stringify({
          maxPower: Number(maxPower), // Ensure maxPower is a number
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // If the server response is not 2xx, it's an error
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      // On success
      setMessage(`Success! Max power for socket ${socketId} set to ${maxPower}W.`);
      setMessageType('success');
      console.log('API Response:', data);

    } catch (error) {
      // On failure
      setMessage(`Error: ${error.message}`);
      setMessageType('error');
      console.error('API Call Failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Set Socket Max Power</h2>
      <form onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label htmlFor="socketId" style={styles.label}>Socket ID:</label>
          <input
            type="text"
            id="socketId"
            value={socketId}
            onChange={(e) => setSocketId(e.target.value)}
            placeholder="e.g., 6936b1004cdfcc09e6933449"
            style={styles.input}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="maxPower" style={styles.label}>Max Power (Watts):</label>
          <input
            type="number"
            id="maxPower"
            value={maxPower}
            onChange={(e) => setMaxPower(e.target.value)}
            placeholder="e.g., 2500"
            style={styles.input}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="authToken" style={styles.label}>Authorization Token:</label>
          <input
            type="password" // Use password type to obscure the token
            id="authToken"
            value={authToken}
            onChange={(e) => setAuthToken(e.target.value)}
            placeholder="Paste your JWT token here"
            style={styles.input}
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          style={{ ...styles.button, ...(isLoading ? styles.buttonDisabled : {}) }}
        >
          {isLoading ? 'Setting Power...' : 'Set Max Power'}
        </button>
      </form>

      {/* Display feedback message */}
      {message && (
        <div style={{ ...styles.message, ...styles[messageType] }}>
          {message}
        </div>
      )}
    </div>
  );
};

export default SetMaxPowerForm;
