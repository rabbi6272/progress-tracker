export function FirebaseError(error: unknown): string {
    const msg = typeof error === "string" ? error : String(error ?? "");

    if (msg.includes("auth/invalid-credential")) {
        return "Invalid email or password.";
    } else if (msg.includes("auth/invalid-email")) {
        return "Invalid email address.";
    } else if (msg.includes("auth/user-not-found")) {
        return "User not found.";
    } else if (msg.includes("auth/wrong-password")) {
        return "Incorrect password.";
    } else if (msg.includes("auth/email-already-in-use")) {
        return "Email already in use.";
    } else if (msg.includes("auth/weak-password")) {
        return "Weak password. Please choose a stronger password.";
    } else {
        return "An unknown error occurred.";
    }
}