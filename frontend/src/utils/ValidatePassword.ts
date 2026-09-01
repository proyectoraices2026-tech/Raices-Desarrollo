const PASSWORD_REGEX = /^(?=.*[!@#$%^&*(),.?":{}|<>_\-+=~`[\]\\/;']).{8,}$/;

export function validatePassword(password: string): { valid: boolean; message?: string } {
    if (password.length < 8) {
        return { valid: false, message: "La contraseña debe tener al menos 8 caracteres." };
    }

    if (!PASSWORD_REGEX.test(password)) {
        return { valid: false, message: "La contraseña debe incluir al menos un carácter especial." };
    }

    return { valid: true };
}
