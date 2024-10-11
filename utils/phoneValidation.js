const phoneValidation = (phone) => {
    // Regular expression for validation
    const phoneRegex = /^(091|099|093|092)\d{8}$/;

    if (!phoneRegex.test(phone)) {
        return res.status(400).json({ message: 'Invalid phone number format' });
    }
}