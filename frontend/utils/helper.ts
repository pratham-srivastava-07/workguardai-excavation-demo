export default async function loginUser(email: any, password: any) {
    try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
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
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
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