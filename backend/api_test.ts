import axios from 'axios';

const test = async () => {
    try {
        const response = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'hanikumar064@gmail.com', // Assuming this is an admin email
            password: 'your_password' // I don't know the password
        });
        const token = response.data.token;

        const createResponse = await axios.post('http://localhost:5000/api/auth/create-user', {
            name: 'Aryan Test',
            email: 'aryanpandey35247@gmail.com',
            password: 'password123',
            role: 'teacher'
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('SUCCESS:', createResponse.data);
    } catch (err: any) {
        console.error('ERROR:', err.response?.status, err.response?.data);
    }
};
// I can't run this because I don't have the admin password.
