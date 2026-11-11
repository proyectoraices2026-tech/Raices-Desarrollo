const PASSWORD_REGEX = /^(?=.*[!@#$%^&*(),.?":{}|<>_\-+=~`[\]\\/;']).{8,}$/;

/* Comprueba las condiciones mínimas que debe cumplir una contraseña */
export function validatePassword(password: string): { valid: boolean; message?: string } {
    /* Primero valida la cantidad mínima de caracteres */
    if (password.length < 8) {
        return { valid: false, message: "La contraseña debe tener al menos 8 caracteres." };
    }

    /* Después valida que la contraseña tenga al menos un carácter especial */
    if (!PASSWORD_REGEX.test(password)) {
        return { valid: false, message: "La contraseña debe incluir al menos un carácter especial." };
    }

    /* Si supera las dos comprobaciones, la contraseña es válida */
    return { valid: true };
}
