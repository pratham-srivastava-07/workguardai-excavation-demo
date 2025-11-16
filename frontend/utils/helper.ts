export default async function loginUser(email: any, password: any) {
    try {
        console.log("Indide try");
        
        const res = await fetch("http://localhost:3001/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })

        console.log("Responnse done", res);
        

        return res;
    } catch(loginError) {
        console.log(`Error occured during login`, loginError)
    }
}

export async function signupUser(name: any, email: any, password: any, role: any) {
    try {
        const response = await fetch("http://localhost:3001/api/auth/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: name,
            email: email,
            password: password,
            role: role.toUpperCase()
        })
    })

    console.log("WHATS THE RESPONSE", response);
    

    return response;
    } catch(signupError) {
        console.log("Signup error", signupError)
    }
}