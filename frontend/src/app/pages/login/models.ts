
export interface User {
    id: number
    email: string
}

export interface LoginPayload {
    username: string
    password: string
}

export interface Token {
    access_token: string,
    token_type: string
}

export interface SignUpPayload {
    email: string
    full_name: string
    password: string
    confirmPassword: string
    org_name: string
}