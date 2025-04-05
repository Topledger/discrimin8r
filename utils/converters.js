import bs58 from 'bs58';

export const base58ToByteArray = (base58String) => {
    try {
        // Remove any whitespace and ensure it's a clean base58 string
        const cleanString = base58String.trim();

        // Decode the base58 string to a Uint8Array
        const decoded = bs58.decode(cleanString);

        // Convert Uint8Array to regular array and ensure each byte is properly formatted
        const byteArray = Array.from(decoded).map(byte => {
            // Ensure the byte is displayed as a number between 0-255
            return byte & 0xFF;
        });

        return byteArray;
    } catch (error) {
        console.error('Error converting base58 to byte array:', error);
        return null;
    }
}; 