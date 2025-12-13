import { API_AUTH_URL } from '@/constants/env';

export default async function loginUser(email: any, password: any) {
    try {
        const res = await fetch(`${API_AUTH_URL}/api/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })

        return res;
    } catch(loginError) {
        console.log(`Error occured during login`, loginError)
        throw loginError;
    }
}

export async function signupUser(name: any, email: any, password: any, role: any) {
    try {
        const response = await fetch(`${API_AUTH_URL}/api/auth/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                email: email,
                password: password,
                role: role
            })
        })

        return response;
    } catch(signupError) {
        console.log("Signup error", signupError)
        throw signupError;
    }
}