import axios from 'axios';

const testLogin = async () => {
    try {
        const response = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'admin@coachverse.com',
            password: 'password123'
        });
        console.log('Login Success:', response.data);
    } catch (error: any) {
        console.error('Login Failed:', error.response?.status, error.response?.data);
    }
};

testLogin();
